import utils.database_class as db_cls


def create_user(db, username: str, password: str, role: str = "user") -> bool:
    user = db_cls.User(username=username, password=password, role=role)
    existing_user = db_cls.User.query.filter_by(username=username).first()
    if existing_user:
        print(f"User '{username}' already exists.")
        return False
    db.session.add(user)
    db.session.commit()
    return True


def login_user(username: str, password: str) -> str:
    user = db_cls.User.query.filter_by(username=username).first()
    if user:
        if user.check_password(password):
            return "login_success"
        else:
            return "password incorrect"
    else:
        return "user not found"


def create_resource(
    db,
    resource_name,
    url,
    image_url,
    source_platform,
    resource_type,
    score,
    num_of_purchases,
    price=0,
) -> bool:
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
    """
    resource = db_cls.Resource(
        resource_name=resource_name,
        url=url,
        image_url=image_url,
        source_platform=source_platform,
        resource_type=resource_type,
        score=score,
        num_of_purchases=num_of_purchases,
        price=price,
    )
    existing_resource = db_cls.Resource.query.filter_by(resource_name=resource_name).first()
    if existing_resource:
        print(f"Resource '{resource_name}' already exists.")
        return False

    db.session.add(resource)
    db.session.commit()
    return True


def create_keyword(db, keyword_eng: str, keyword_chi: str) -> bool:
    """
    Create a keyword
    :param db:
    :param keyword_eng: english keyword name
    :param keyword_chi: chinese keyword name
    """
    keyword = db_cls.Keyword(keyword_name_eng=keyword_eng, keyword_name_chi=keyword_chi)

    existing_keyword = db_cls.Keyword.query.filter_by(keyword_name_eng=keyword_eng).first()
    if existing_keyword:
        print(f"Keyword '{keyword}' already exists.")
        return False

    db.session.add(keyword)
    db.session.commit()
    return True


def create_question(db, question_context: str) -> bool:
    question = db_cls.Question(question_context=question_context)

    existing_question = db_cls.Question.query.filter_by(question_context=question_context).first()
    if existing_question:
        print(f"Question '{question_context}' already exists.")
        return False

    db.session.add(question)
    db.session.commit()
    return True


def create_post(db, user_id: int, title: str, body: str, status="under_review") -> bool:
    post = db_cls.Post(user_id=user_id, title=title, body=body, status=status)

    existing_post = db_cls.Post.query.filter_by(title=title).first()
    if existing_post:
        print(f"Post '{title}' already exists.")
        return False

    db.session.add(post)
    db.session.commit()
    return True
