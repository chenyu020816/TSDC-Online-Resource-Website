# import resource


from numpy import array, float32, mean
from pandas import DataFrame

import utils.database_class as db_cls
from utils.db_keyword_api import *


def create_resource(
    db,
    resource_name: str,
    introduction: str,
    url: str,
    image_url: str,
    source_platform: str,
    resource_type: str,
    public_score: float = 0.0,
    num_of_purchases: int = 0,
    price: float = 0.0,
    status: str = "under_review",
    keywords: list[str] = [None, None, None],
) -> int:
    """
    Create a resource
    :param db:
    :param resource_name: name of resource
    :param introduction: introduction
    :param url: url of resource
    :param image_url: url of image
    :param source_platform: platform of resource, ["YouTube", "Udemy", ...]
    :param resource_type: type of resource, ["video", "open course", "pay course", "book", ...]
    :param public_score: public score of resource
    :param num_of_purchases: number of purchases
    :param price: price of resource
    :param status: status of resource, ["under_review", "publish", "delete""]
    :param keywords: keywords of resource
    :return: id of created resource or -1 if resource exist or -2 if fail
    """
    existing_resource = db_cls.Resource.query.filter_by(url=url).first()
    if existing_resource:
        print(f"Resource '{resource_name}' already exists.")
        return -1

    resource = db_cls.Resource(
        resource_name=resource_name,
        introduction=introduction,
        url=url,
        image_url=image_url,
        source_platform=source_platform,
        resource_type=resource_type,
        public_score=public_score,
        num_of_purchases=num_of_purchases,
        price=price,
        status=status,
    )

    db.session.add(resource)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create resource '{resource}': {e}")
        return -2

    add_resource_keywords(db, resource.id, keywords)
    return resource.id


def user_upload_resource(
    db,
    user_id: int,
    keywords: list[str],
    resource_name: str,
    url: str,
    image_url: str,
    source_platform: str,
    resource_type: str,
    public_score: float = 0.0,
    num_of_purchases: int = 0,
    price: float = 0.0,
    status: str = "under_review",
) -> int:
    """
    Upload resource from user
    :param db:
    :param user_id: id of uploader
    :param keywords:
    :param resource_name: name of resource
    :param url: url of resource
    :param image_url: url of image
    :param source_platform: platform of resource, ["YouTube", "Udemy", ...]
    :param resource_type: type of resource, ["video", "open course", "pay course", "book", ...]
    :param public_score: public score of resource
    :param num_of_purchases: number of purchases
    :param price: price of resource
    :param status: status of resource, ["under_review", "publish", "delete""]
    :return: user_upload_resource id or -1 if resource exist or -2 if fail
    """

    user = db_cls.User.query.filter_by(id=user_id).first()
    if not user:
        return -3
    if user.role in ["admin", "teacher"]:
        status = "publish"

    resource_upload_id = create_resource(
        db,
        resource_name,
        "",
        url,
        image_url,
        source_platform,
        resource_type,
        public_score,
        num_of_purchases,
        price,
        status,
        keywords=keywords,
    )

    if resource_upload_id >= 0:  # if successfully create new resource
        user_resource_upload = db_cls.UserResourceUploadHistory(
            user_id=user_id, resource_id=resource_upload_id
        )

        db.session.add(user_resource_upload)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to upload resource '{resource_name}': {e}")
            return -2

        return user_resource_upload.id
    else:
        print(f"Failed to upload resource '{resource_name}'")
        return -1


def user_update_resource(
    db,
    user_id: int,
    resource_id: int,
    new_url: str = None,
    new_image_url: str = None,
    new_source_platform: str = None,
    new_resource_type: str = None,
    new_public_score: float = None,
    new_num_of_purchases: int = None,
    new_price: float = None,
) -> int:  # Fix user id
    """
    Update resource data
    :param db:
    :param user_id: id of user who update the resource
    :param resource_id: id of resource which to update
    :param new_url: new url or None if stay the same
    :param new_image_url: new_image_url or None if stay the same
    :param new_source_platform: new_source_platform or None if stay the same
    :param new_resource_type: new_resource_type or None if stay the same
    :param new_public_score: new_public_score or None if stay the same
    :param new_num_of_purchases: new_num_of_purchases or None if stay the same
    :param new_price: new_price or None if stay the same
    :return: resource's id or -1 if user not exist or -2 if resource not exist or -3 if not admin or -4 if fail
    """
    user = db_cls.User.query.filter_by(id=user_id).first()
    resource = db_cls.Resource.query.filter_by(id=resource_id).first()

    if not user:
        return -1
    if not resource:
        return -2
    if user.role != "admin":
        return -3
    else:
        if new_url:
            old_value = resource.url
            resource.url = new_url
            res = add_resource_update_history(
                db, user_id, resource_id, "url", old_value, new_url
            )
            if res < 0:
                return -4
        if new_image_url:
            old_value = resource.image_url
            resource.image_url = new_image_url
            res = add_resource_update_history(
                db, user_id, resource_id, "image_url", old_value, new_image_url
            )
            if res < 0:
                return -4
        if new_source_platform:
            old_value = resource.source_platform
            resource.source_platform = new_source_platform
            res = add_resource_update_history(
                db,
                user_id,
                resource_id,
                "source_platform",
                old_value,
                new_source_platform,
            )
            if res < 0:
                return -4
        if new_resource_type:
            old_value = resource.resource_type
            resource.resource_type = new_resource_type
            res = add_resource_update_history(
                db, user_id, resource_id, "resource_type", old_value, new_resource_type
            )
            if res < 0:
                return -4
        if new_public_score:
            old_value = resource.public_score
            resource.public_score = new_public_score
            res = add_resource_update_history(
                db,
                user_id,
                resource_id,
                "public_score",
                str(old_value),
                str(new_public_score),
            )
            if res < 0:
                return -4
        if new_num_of_purchases:
            old_value = resource.num_of_purchases
            resource.num_of_purchases = new_num_of_purchases
            res = add_resource_update_history(
                db,
                user_id,
                resource_id,
                "num_of_purchases",
                str(old_value),
                str(new_num_of_purchases),
            )
            if res < 0:
                return -4
        if new_price:
            old_value = resource.price
            resource.price = new_price
            res = add_resource_update_history(
                db, user_id, resource_id, "price", str(old_value), str(new_price)
            )
            if res < 0:
                return -4

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to update resource '{resource} status ': {e}")
            return -4
        return resource.id


def add_resource_update_history(
    db,
    user_id: int,
    resource_id: int,
    property_name: str,
    old_value: str,
    new_value: str,
) -> int:
    """
    Add resource update history
    :param db:
    :param user_id: id of user who update resource
    :param resource_id: resource's id
    :param property_name: name of property
    :param old_value: old value of property
    :param new_value: new value of property
    :return: resource_update_history id or -1 if fail
    """
    resource_update_history = db_cls.ResourceUpdateHistory(
        user_id=user_id,
        resource_id=resource_id,
        property_name=property_name,
        old_value=old_value,
        new_value=new_value,
    )

    db.session.add(resource_update_history)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(
            f"Failed to add resource update history '{resource_update_history}' status : {e}"
        )
        return -1
    return resource_update_history.id


def search_resource_by_id(resource_id: int) -> dict:
    """
    Search resource by id
    :param resource_id: resource's id
    :return: {
        resource_id, resource_name, introduction, url, image_url, source_platform,
        resource_type, score, num_of_purchases, price, status
    } or {"error": -1} if resource_id not exist
    """
    resource = db_cls.Resource.query.filter_by(id=resource_id).first()

    if not resource:
        return {"error": -1}
    return {
        "resource_id": resource.id,
        "resource_name": resource.resource_name,
        "introduction": resource.introduction,
        "url": resource.url,
        "image_url": resource.image_url,
        "source_platform": resource.source_platform,
        "resource_type": resource.resource_type,
        "score": resource.public_score,
        "num_of_purchases": resource.num_of_purchases,
        "price": resource.price,
        "status": resource.status,
        "view_count": resource.view_count,
    }


def search_resource_by_name(resource_name: int) -> dict:
    """
    Search resource by name
    :param resource_name: resource's name
    :return: {
        resource_id, resource_name, introduction, url, image_url, source_platform,
        resource_type, score, num_of_purchases, price, status
    } or {"error": -1} if resource not exist
    """
    resource = db_cls.Resource.query.filter_by(resource_name=resource_name).first()

    if not resource:
        return {"error": -1}
    return {
        "resource_id": resource.id,
        "resource_name": resource.resource_name,
        "introduction": resource.introduction,
        "url": resource.url,
        "image_url": resource.image_url,
        "source_platform": resource.source_platform,
        "resource_type": resource.resource_type,
        "score": resource.public_score,
        "num_of_purchases": resource.num_of_purchases,
        "price": resource.price,
        "status": resource.status,
        "view_count": resource.view_count,
    }


def search_resources_scores(resource_ids: list[int]) -> dict:
    resources = db_cls.Resource.query.filter(db_cls.Resource.id.in_(resource_ids)).all()

    resources_scores = {
        "user_score": [],
        "public_score": [],
        "num_of_purchases": [],
        "view_count": [],
    }

    for resource in resources:
        resources_scores["user_score"].append(resource.user_score)
        resources_scores["public_score"].append(resource.public_score)
        resources_scores["num_of_purchases"].append(resource.num_of_purchases)
        resources_scores["view_count"].append(resource.view_count)

    resources_scores["user_score"] = array(
        resources_scores["user_score"], dtype=float32
    )
    resources_scores["public_score"] = array(
        resources_scores["public_score"], dtype=float32
    )
    resources_scores["num_of_purchases"] = array(
        resources_scores["num_of_purchases"], dtype=float32
    )
    resources_scores["view_count"] = array(
        resources_scores["view_count"], dtype=float32
    )

    return resources_scores


def get_resource_keywords_table(db) -> DataFrame:
    """
    Get resource keywords dataframe
    :param db:
    :return: pd.DataFrame of resource's id and their top 3 keywords' id
    """
    try:
        resource_keywords = db.session.query(db_cls.ResourceKeywords).all()
        resource_id = []
        first_keyword_id = []
        second_keyword_id = []
        third_keyword_id = []

        for resource_keyword in resource_keywords:
            resource_id.append(resource_keyword.resource_id)
            first_keyword_id.append(resource_keyword.first_keyword_id)
            second_keyword_id.append(resource_keyword.second_keyword_id)
            third_keyword_id.append(resource_keyword.third_keyword_id)

        resource_keywords_table = DataFrame(
            {
                "resource_id": resource_id,
                "first_keyword_id": first_keyword_id,
                "second_keyword_id": second_keyword_id,
                "third_keyword_id": third_keyword_id,
            }
        )

        return resource_keywords_table

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def check_resource_exists(url: str) -> bool:
    """
    Check if resource exists
    :param url: url of resource
    :return: True if resource exists
    """
    resource = db_cls.Resource.query.filter_by(url=url).first()

    return resource is not None


def add_search_roadmap_fields_history(
    db, search_history_id: int, roadmap_fields: list[str]
) -> int:
    search_roadmap_field_ids = []
    for roadmap_field in roadmap_fields:
        search_roadmap_field_id = _add_search_roadmap_field(
            db, search_history_id, roadmap_field
        )

        if search_roadmap_field_id <= 0:
            return -1
        search_roadmap_field_ids.append(search_roadmap_field_id)

    return search_roadmap_field_ids


def _add_search_roadmap_field(db, search_history_id: int, roadmap_field: str) -> int:
    search_roadmap_field = db_cls.SearchRoadmapFields(search_history_id, roadmap_field)
    db.session.add(search_roadmap_field)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
        return -1
    return search_roadmap_field.id


def add_roadmap_fields_keywords(
    db, search_roadmap_field_id: int, keywords: list[str]
) -> int:
    roadmap_fields_keyword_ids = []
    for keyword in keywords:
        roadmap_field_keyword_id = _add_roadmap_field_keyword(
            db, search_roadmap_field_id, keyword
        )

        if roadmap_field_keyword_id <= 0:
            return -1
        roadmap_fields_keyword_ids.append(roadmap_field_keyword_id)

    return roadmap_fields_keyword_ids


def _add_roadmap_field_keyword(db, search_roadmap_field_id: int, keyword: str) -> int:
    roadmap_field_keyword = db_cls.RoadMapFieldKeywords(
        search_roadmap_field_id, keyword
    )

    db.session.add(roadmap_field_keyword)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
        return -1
    return roadmap_field_keyword.id


def add_search_resources_history(
    db, search_roadmap_fields_id: int, resource_ids: list[int]
):
    search_resource_history_ids = []
    for resource_id in resource_ids:
        search_resource_history_id = _add_search_resource_history(
            db, search_roadmap_fields_id, resource_id
        )

        if search_resource_history_id <= 0:
            return -1
        search_resource_history_ids.append(search_resource_history_id)

    return search_resource_history_ids


def _add_search_resource_history(db, search_roadmap_fields_id: int, resource_id: int):
    search_resource_history = db_cls.SearchResourceHistory(
        search_roadmap_fields_id, resource_id
    )

    db.session.add(search_resource_history)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
        return -1
    return search_resource_history.id


def add_resource_view_history(db, user_id: int, search_resource_history_id: int) -> int:
    """
    Add user resource view history
    :param db:
    :param user_id: viewer's user id
    :param search_resource_history_id: view resource under which search history
    :return: resource_view_history id or -1 if fail
    """
    resource_view_history = db_cls.UserResourceViewHistory(
        user_id, search_resource_history_id
    )

    db.session.add(resource_view_history)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
        return -1

    search_resource_history = db_cls.SearchResourceHistory.query.filter_by(
        id=search_resource_history_id
    ).first()
    viewed_resource_id = search_resource_history.resource_id
    add_resource_view_count(db, viewed_resource_id)
    return resource_view_history.id


def add_resource_view_count(db, resource_id: int) -> int:
    """
    Adds the number of views count of resource
    :param db:
    :param resource_id: resource's id
    :return: resource id or -1 if fail
    """
    resource = db_cls.Resource.query.filter_by(id=resource_id).first()

    resource.view_count = resource.view_count + 1

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to add resource '{resource} view_count ': {e}")
        return -1
    return resource.id


def _update_resource_score(db, resource_id: int):
    """
    Update user score of resource
    :param db:
    :param resource_id: id of resource
    :return: resource id if successfully update resource's score or -1 if fail
    """
    resource_score_histories = db_cls.RatingHistory.query.filter(
        db_cls.RatingHistory.resource_id.in_(resource_id)
    ).all()
    scores = array(
        [
            resource_score_history.score
            for resource_score_history in resource_score_histories
        ]
    )
    avg_scores = mean(scores, axis=0)

    resource = db_cls.Resource.query.filter_by(id=resource_id).first()
    resource.user_score = avg_scores

    db.session.add(resource)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to update resource '{resource} user_score': {e}")
        return -1
    return resource.id


def add_user_rating_history(db, user_id: int, resource_id: int, score: int):
    """
    Add or Update user's rating history
    :param db:
    :param user_id: user's id
    :param resource_id: resource's id
    :param score: rating score
    :return: rating_history id or -1 if fail
    """
    old_rating_history = db_cls.RatingHistory.query.filter_by(
        user_id=user_id, resource_id=resource_id
    ).first()
    if old_rating_history:  # if this user already rated this resource
        old_rating_history.score = score
        db.session.add(old_rating_history)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to update resource '{resource} user_rating_history': {e}")
            return -1
        _update_resource_score(db, resource_id)
        return old_rating_history.id

    else:  # else create new rating history
        rating_history = db_cls.RatingHistory(user_id, resource_id, score)

        db.session.add(rating_history)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to add resource '{resource} user_rating_history': {e}")
            return -1
        update_resource_score(db, resource_id)
        return rating_history.id
