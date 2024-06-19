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
