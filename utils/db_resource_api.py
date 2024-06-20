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
    user_score: float = 0.0,
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
    :param user_score: user score of resource
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
        user_score=user_score,
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
    user_score: float = 0.0,
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
    :param user_score: user score of resource
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
        user_score,
        num_of_purchases,
        price,
        status,
        keywords=keywords
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
    new_user_score: float = None,
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
    :param new_user_score: new_user_score or None if stay the same
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
        if new_user_score:
            old_value = resource.user_score
            resource.user_score = new_user_score
            res = add_resource_update_history(
                db,
                user_id,
                resource_id,
                "user_score",
                str(old_value),
                str(new_user_score),
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
    }


def check_resource_exists(url: str) -> bool:
    resource = db_cls.Resource.query.filter_by(url=url).first()

    return resource is not None