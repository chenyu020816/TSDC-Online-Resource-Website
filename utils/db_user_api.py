import os

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
    photo_path = os.path.join("./user_photos", "default.png")
    user = db_cls.User(
        username=username,
        email=email,
        photo_path=photo_path,
        password=password,
        role=role,
    )

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


def search_user_by_id(user_id: int) -> dict:
    """
    Search user info
    :param user_id: user's id
    :return: {user_id, username, email, photo_path, role} or {"error": -1} if user_id not exist
    """
    user = db_cls.User.query.filter_by(id=user_id).first()

    if not user:
        return {"error": -1}
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "photo_path": user.photo_path,
        "role": user.role,
    }


def search_user_by_name(user_name: int) -> dict:
    """
    Search user info
    :param user_name: user's name
    :return: {user_id, username, email, photo_path, role} or {"error": -1} if user_id not exist
    """
    user = db_cls.User.query.filter_by(username=user_name).first()

    if not user:
        return {"error": -1}
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "photo_path": user.photo_path,
        "role": user.role,
    }


def add_user_search_history(db, user_id: int, search_context: str) -> int:

    search_history = db_cls.SearchHistory(
        user_id=user_id, search_context=search_context
    )

    db.session.add(search_history)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to add search history for user '{user_id}': {e}")
        return -1
    return search_history.id
