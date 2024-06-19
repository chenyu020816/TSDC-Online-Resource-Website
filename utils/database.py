import utils.database_class as db_cls


def create_user(
        db, username: str, email: str, password: str, role: str = "user"
) -> int:
    """
    Create a new user
    :param db:
    :param username: user's name
    :param email: user's email
    :param password: user's password
    :param role: user's role ["admin", "user", "teacher", "student"]
    :return: user's id or -1 if username exist or -2 if email exist or -3 if fail
    """
    existing_user = db_cls.User.query.filter_by(username=username).first()
    existing_email = db_cls.User.query.filter_by(email=email).first()
    if existing_user:
        print(f"User '{username}' already exists.")
        return -1
    if existing_email:
        print(f"Email '{email}' already exists.")
        return -2

    user = db_cls.User(username=username, email=email, password=password, role=role)

    db.session.add(user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create user '{username}': {e}")
        return -3
    return user.id


def login_user(username: str, password: str) -> int:
    """
    Login a user
    :param username: username input
    :param password: password input
    :return: user's id or -1 if password incorrect or -2 if username not exist
    """
    user = db_cls.User.query.filter_by(username=username).first()
    if user:
        if user.check_password(password):
            return user.id
        else:
            return -1
    else:
        return -2


def create_resource(
        db,
        resource_name: str,
        url: str,
        image_url: str,
        source_platform: str,
        resource_type: str,
        score: float,
        num_of_purchases: int,
        price: float = 0.0,
        status: str = "under_review",
) -> int:
    """
    Create a resource
    :param db:
    :param resource_name: name of resource
    :param url: url of resource
    :param image_url: url of image
    :param source_platform: platform of resource, ["YouTube", "Udemy", ...]
    :param resource_type: type of resource, ["video", "open course", "pay course", "book", ...]
    :param score: score of resource
    :param num_of_purchases: number of purchases
    :param price: price of resource
    :param status: status of resource, ["under_review", "publish", "delete""]
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
        url=url,
        image_url=image_url,
        source_platform=source_platform,
        resource_type=resource_type,
        score=score,
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


def user_upload_resource(
        db,
        user_id: int,
        resource_name: str,
        url: str,
        image_url: str,
        source_platform: str,
        resource_type: str,
        score: float,
        num_of_purchases: int,
        price: float = 0.0,
        status: str = "under_review",
) -> int:
    """
    Upload resource from user
    :param db:
    :param user_id: id of uploader
    :param resource_name: name of resource
    :param url: url of resource
    :param image_url: url of image
    :param source_platform: platform of resource, ["YouTube", "Udemy", ...]
    :param resource_type: type of resource, ["video", "open course", "pay course", "book", ...]
    :param score: score of resource
    :param num_of_purchases: number of purchases
    :param price: price of resource
    :param status: status of resource, ["under_review", "publish", "delete""]
    :return: user_upload_resource id or -1 if resource exist or -2 if fail
    """
    resource_upload_id = create_resource(
        db,
        resource_name,
        url,
        image_url,
        source_platform,
        resource_type,
        score,
        num_of_purchases,
        price,
        status,
    )

    if resource_upload_id != -1:  # if successfully create new resource
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


def search_user_by_id(user_id: int) -> dict:
    """
    Search user info
    :param user_id: user's id
    :return: {user_id, username, email, password, role} or {"error": -1} if user_id not exist
    """
    user = db_cls.User.query.filter_by(id=user_id).first()

    if not user:
        return {"error": -1}
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }


def search_user_by_name(user_name: int) -> dict:
    """
    Search user info
    :param user_name: user's name
    :return: {user_id, username, email, password, role} or {"error": -1} if user_id not exist
    """
    user = db_cls.User.query.filter_by(username=user_name).first()

    if not user:
        return {"error": -1}
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }


def search_resource_by_id(resource_id: int) -> dict:
    """
    Search resource by id
    :param resource_id: resource's id
    :return: {
        resource_id, resource_name, url, image_url, source_platform,
        resource_type, score, num_of_purchases, price, status
    } or {"error": -1} if resource_id not exist
    """
    resource = db_cls.Resource.query.filter_by(id=resource_id).first()

    if not resource:
        return {"error": -1}
    return {
        "resource_id": resource.id,
        "resource_name": resource.resource_name,
        "url": resource.url,
        "image_url": resource.image_url,
        "source_platform": resource.source_platform,
        "resource_type": resource.resource_type,
        "score": resource.score,
        "num_of_purchases": resource.num_of_purchases,
        "price": resource.price,
        "status": resource.status,
    }


def search_resource_by_name(resource_name: int) -> dict:
    """
    Search resource by name
    :param resource_name: resource's name
    :return: {
        resource_id, resource_name, url, image_url, source_platform,
        resource_type, score, num_of_purchases, price, status
    } or {"error": -1} if resource not exist
    """
    resource = db_cls.Resource.query.filter_by(resource_name=resource_name).first()

    if not resource:
        return {"error": -1}
    return {
        "resource_id": resource.id,
        "resource_name": resource.resource_name,
        "url": resource.url,
        "image_url": resource.image_url,
        "source_platform": resource.source_platform,
        "resource_type": resource.resource_type,
        "score": resource.score,
        "num_of_purchases": resource.num_of_purchases,
        "price": resource.price,
        "status": resource.status,
    }


def update_resource_data(
        db,
        resource_id: int,
        new_url: str = None,
        new_image_url: str = None,
        new_source_platform: str = None,
        new_resource_type: str = None,
        new_score: float = None,
        new_num_of_purchases: int = None,
        new_price: float = None,
        new_status: str = None,
) -> int:
    """
    Update resource data
    :param db:
    :param resource_id: id of resource which to update
    :param new_url: new url or None if stay the same
    :param new_image_url: new_image_url or None if stay the same
    :param new_source_platform: new_source_platform or None if stay the same
    :param new_resource_type: new_resource_type or None if stay the same
    :param new_score: new_score or None if stay the same
    :param new_num_of_purchases: new_num_of_purchases or None if stay the same
    :param new_price: new_price or None if stay the same
    :param new_status: new_status or None if stay the same
    :return: resource's id or -1 if resource exist or -2 if fail
    """

    resource = db_cls.Resource.query.filter_by(id=resource_id).first()

    if not resource:
        return -1
    else:
        if new_url:
            resource.url = new_url
        if new_image_url:
            resource.image_url = new_image_url
        if new_source_platform:
            resource.source_platform = new_source_platform
        if new_resource_type:
            resource.resource_type = new_resource_type
        if new_score:
            resource.score = new_score
        if new_num_of_purchases:
            resource.num_of_purchases = new_num_of_purchases
        if new_price:
            resource.price = new_price
        if new_status:
            resource.status = new_status

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Failed to update resource '{resource} status ': {e}")
            return -2
        return resource.id


def search_keyword_by_id(keyword_id: int) -> dict:
    keyword = db_cls.Keyword.query.filter_by(id=keyword_id).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi
    }


def search_keyword_by_name_eng(keyword_name_eng: str) -> dict:
    keyword = db_cls.Keyword.query.filter_by(name=keyword_name_eng).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi
    }


def search_keyword_by_name_chi(keyword_name_chi: str) -> dict:
    keyword = db_cls.Keyword.query.filter_by(name=keyword_name_chi).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi
    }


def search_post_by_id(post_id: int) -> dict:
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
                "status": post.status
            }


def search_post_by_title(post_title: str) -> dict:
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
                "status": post.status
            }


def is_all_english(s: str) -> bool:
    return s.isalpha() and s.isascii() and s.islower()


def add_resource_keyword(db, resource_id: int, keyword_name: str) -> int:
    if is_all_english(keyword_name):
        keyword = search_keyword_by_name_eng(keyword_name)
    else:
        keyword = search_keyword_by_name_chi(keyword_name)

    if "keyword_id" in keyword.keys():
        keyword_id = keyword["keyword_id"]
    else:
        return -3

    exist_resource_keyword = db_cls.Resource.query.filter_by(resource_id=resource_id, keyword_id=keyword_id).first()
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
