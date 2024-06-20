import os

import utils.database_class as db_cls


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
    existing_resource = db_cls.Resource.query.filter_by(
        resource_name=resource_name
    ).first()
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


def create_keyword(db, keyword_eng: str, keyword_chi: str) -> int:
    """
    Create a keyword
    :param db:
    :param keyword_eng: english keyword name
    :param keyword_chi: chinese keyword name
    :return keyword id or -1 if keyword exist or -2 if fail
    """
    existing_keyword = db_cls.Keyword.query.filter_by(
        keyword_name_eng=keyword_eng
    ).first()
    if existing_keyword:
        print(f"Keyword '{keyword_eng}' already exists.")
        return -1

    keyword = db_cls.Keyword(keyword_name_eng=keyword_eng, keyword_name_chi=keyword_chi)

    db.session.add(keyword)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create keyword '{keyword}': {e}")
        return -2
    return keyword.id


def create_question(db, question_context: str) -> int:
    """
    Create a question
    :param db:
    :param question_context: question context
    :return: question id or -1 if question exist or -2 if fail
    """
    existing_question = db_cls.Question.query.filter_by(
        question_context=question_context
    ).first()
    if existing_question:
        print(f"Question '{question_context}' already exists.")
        return -1

    question = db_cls.Question(question_context=question_context)

    db.session.add(question)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create question '{question}': {e}")
        return -2
    return question.id


def create_post(
    db, user_id: int, title: str, body: str, status: str = "under_review"
) -> int:
    """
    Create a post
    :param db:
    :param user_id: id of publisher
    :param title: title of post
    :param body: context of post
    :param status: status of post ["under_review", "publish", "delete"]
    :return: post id or -1 if post exist or -2 if fail
    """
    existing_post = db_cls.Post.query.filter_by(title=title).first()
    if existing_post:
        print(f"Post '{title}' already exists.")
        return -1

    post = db_cls.Post(user_id=user_id, title=title, body=body, status=status)

    db.session.add(post)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create post '{post}': {e}")
        return -2
    return post.id


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


def search_keyword_by_id(keyword_id: int) -> dict:
    """
    Search keyword by id
    :param keyword_id: id of keyword
    :return:  {
        keyword_id, keyword_name_eng, keyword_name_chi
    } or {"error": -1} if keyword not exist
    """
    keyword = db_cls.Keyword.query.filter_by(id=keyword_id).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi,
    }


def search_keyword_by_name_eng(keyword_name_eng: str) -> dict:
    """
    Search keyword by english name
    :param keyword_name_eng: english name of keyword
    :return:  {
        keyword_id, keyword_name_eng, keyword_name_chi
    } or {"error": -1} if keyword not exist
    """
    keyword = db_cls.Keyword.query.filter_by(name=keyword_name_eng).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi,
    }


def search_keyword_by_name_chi(keyword_name_chi: str) -> dict:
    """
    Search keyword by chinese name
    :param keyword_name_chi: chinese name of keyword
    :return:  {
        keyword_id, keyword_name_eng, keyword_name_chi
    } or {"error": -1} if keyword not exist
    """
    keyword = db_cls.Keyword.query.filter_by(name=keyword_name_chi).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi,
    }


def search_post_by_id(post_id: int) -> dict:
    """
    Search post by id
    :param post_id: post's id
    :return: {
        post_id, title, body, user_name, status
    } or {"error": -1} if post not exist
    """
    post = db_cls.Post.query.filter_by(id=post_id).first()
    if not post:
        return {"error": -1}
    else:
        author = search_user_by_id(post.user_id)
        if "username" in author.keys():
            author_name = author["username"]
            return {
                "post_id": post.id,
                "title": post.title,
                "body": post.body,
                "user_name": author_name,
                "status": post.status,
            }


def search_post_by_title(post_title: str) -> dict:
    """
    Search post by title
    :param post_title: post's title
    :return: {
        post_id, title, body, user_name, status
    } or {"error": -1} if post not exist
    """
    post = db_cls.Post.query.filter_by(title=post_title).first()
    if not post:
        return {"error": -1}
    else:
        author = search_user_by_id(post.user_id)
        if "username" in author.keys():
            author_name = author["username"]
            return {
                "post_id": post.id,
                "title": post.title,
                "body": post.body,
                "user_name": author_name,
                "status": post.status,
            }


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


def add_resource_keyword(db, resource_id: int, keyword_name: str) -> int: ### Fix
    """
    Add keyword to resource
    :param db:
    :param resource_id: resource's id
    :param keyword_name: keyword's name (english or chinese)
    :return: resource_keyword's id or -1 if resource_keyword exist or -2 if fail or -3 if keyword not exist
    """

    def is_all_english(s: str) -> bool:
        """
        check whether s is all english
        :param s:
        :return: True if is all english, False otherwise
        """
        return s.isalpha() and s.isascii() and s.islower()

    if is_all_english(keyword_name):
        keyword = search_keyword_by_name_eng(keyword_name)
    else:
        keyword = search_keyword_by_name_chi(keyword_name)

    if "keyword_id" in keyword.keys():
        keyword_id = keyword["keyword_id"]
    else:
        return -3  # if keyword not exist in database

    exist_resource_keyword = db_cls.Resource.query.filter_by(
        resource_id=resource_id, keyword_id=keyword_id
    ).first()
    if exist_resource_keyword:
        return -1

    resource_keyword = db_cls.ResourceKeyword(resource_id, keyword_id)

    db.session.add(resource_keyword)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to add resource's keyword '{resource_keyword}': {e}")
        return -2
    return resource_keyword.id


def add_resource_keywords(db, resource_id: int, keywords: list[str]) -> int:
    if keywords[0] is None:
        return -1

    def is_all_english(s: str) -> bool:
        """
        check whether s is all english
        :param s:
        :return: True if is all english, False otherwise
        """
        return s.isalpha() and s.isascii() and s.islower()

    keyword_ids = [0, 0, 0]
    i = 0
    for keyword_name in keywords:
        if is_all_english(keyword_name):
            keyword = search_keyword_by_name_eng(keyword_name)
        else:
            keyword = search_keyword_by_name_chi(keyword_name)

        if "keyword_id" in keyword.keys():
            # if keyword exists push to front
            # if there is any keyword not exist, it will set to keyword_id 0 - "Undefined"
            keyword_ids[i] = keyword["keyword_id"]
            i += 1

    resource_keywords = db_cls.ResourceKeywords(resource_id, keyword_ids[0], keyword_ids[1], keyword_ids[2])

    db.session.add(resource_keywords)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to add resource's keywords '{resource_keywords}': {e}")
        return -2
    return resource_keywords.id


def add_post_update_history(
    db, user_id: int, post_id: int, property_name: str, old_value: str, new_value: str
) -> int:
    """
    Add post update history
    :param db:
    :param user_id: id of user who update post
    :param post_id: post's id
    :param property_name: name of property which is updated
    :param old_value: old value of property
    :param new_value: new value of property
    :return: post_update_history id or -1 if fail
    """
    post_update_history = db_cls.PostUpdateHistory(
        user_id=user_id,
        post_id=post_id,
        property_name=property_name,
        old_value=old_value,
        new_value=new_value,
    )

    db.session.add(post_update_history)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to update post's history '{post_update_history}': {e}")
        return -1
    return post_update_history.id


def add_post_body_update_history(
    db, user_id: int, post_id: int, old_body: str, new_body: str
) -> int:
    """
    Add post body update history
    :param db:
    :param user_id: id of user who update post' body
    :param post_id: post' id
    :param old_body: old body of post
    :param new_body: new body of post
    :return: post_body_update_history id or -1 if fail
    """
    post_body_update_history = db_cls.PostBodyUpdateHistory(
        user_id=user_id, post_id=post_id, old_body=old_body, new_body=new_body
    )

    db.session.add(post_body_update_history)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to update post's body history '{post_body_update_history}': {e}")
        return -1
    return post_body_update_history.id


def user_update_post(
    db,
    user_id: int,
    post_id: int,
    new_title: str = None,
    new_body: str = None,
) -> int:  # Fix user id == author
    """
    Update post
    :param db:
    :param user_id: id of user who update post
    :param post_id: post's id
    :param new_title: new title of post or None if stay the same
    :param new_body: new body of post or None if stay the same
    :return: post id or -1 if user not exist or -2 if post not exist or -3 if user is not author | admin or -4 if fail
    """
    user = db_cls.User.query.filter_by(id=user_id).first()
    post = db_cls.Post.query.filter_by(id=post_id).first()

    if not user:
        return -1
    if not post:
        return -2
    else:
        if user_id != post.user_id or user.role != "admin":
            return -3

        if new_title:
            old_value = post.title
            post.title = new_title
            res = add_post_update_history(
                db, user_id, post_id, "title", old_value, new_title
            )
            if res < 0:
                return -4
        if new_body:
            old_value = post.body
            post.body = new_body
            res = add_post_body_update_history(
                db, user_id, post_id, old_value, new_body
            )
            if res < 0:
                return -4
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to update post '{post}': {e}")
            return -4
        return post.id


def admin_update_post_status(db, user_id: int, post_id: int, new_status: str) -> int:
    user = db_cls.User.query.filter_by(id=user_id).first()
    post = db_cls.Post.query.filter_by(id=post_id).first()
    if not user:
        return -1
    if not post:
        return -2
    if user.role == "admin":
        old_status = post.status
        if old_status == new_status:
            return -5
        post.status = new_status
        post_status_update_history = db_cls.PostStatusUpdateHistory(
            user_id=user_id,
            post_id=post_id,
            old_status=old_status,
            new_status=new_status,
        )

        db.session.add(post_status_update_history)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to update post status'{post}': {e}")
            return -3
        return post_status_update_history.id
    else:
        return -4


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


def admin_update_resource_status(
    db, user_id: int, resource_id: int, new_status: str
) -> int:
    user = db_cls.User.query.filter_by(id=user_id).first()
    resource = db_cls.Resource.query.filter_by(id=resource_id).first()
    if not user:
        return -1
    if not resource:
        return -2
    if user.role == "admin":
        old_status = resource.status
        if old_status == new_status:
            return -5
        resource.status = new_status
        resource_status_update_history = db_cls.ResourceStatusUpdateHistory(
            user_id=user_id,
            resource_id=resource_id,
            old_status=old_status,
            new_status=new_status,
        )

        db.session.add(resource_status_update_history)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to update resource status'{resource}': {e}")
            return -3
        return resource_status_update_history.id
    else:
        return -4


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

# Add search context history search resource history
