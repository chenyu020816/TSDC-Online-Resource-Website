from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()
table_names = [
    "users",
    "resources",
    "keywords",
    "posts",
    "questions",
    "user_resource_upload_history",
    "resource_keyword",
    "search_history",
    "search_resource_history",
    "rating_history",
    "rating_question",
]


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, username, password, role, created_at):
        self.username = username
        self.password_hash = generate_password_hash(password)
        self.role = role
        self.created_at = created_at

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User %r>" % self.username


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    resource_name = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255), nullable=False)
    source_platform = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)

    def __init__(self, resource_name, link, source_platform, type):
        self.resource_name = resource_name
        self.link = link
        self.source_platform = source_platform
        self.type = type

    def __repr__(self):
        return "<Resource %r>" % self.resource_name


class Keyword(db.Model):
    __tablename__ = "keywords"

    id = db.Column(db.Integer, primary_key=True)
    keyword_name = db.Column(db.String(255), nullable=False)

    def __init__(self, keyword_name):
        self.keyword_name = keyword_name

    def __repr__(self):
        return "<Keyword %r>" % self.keyword_name


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, title, body, created_at):
        self.user_id = user_id
        self.title = title
        self.body = body
        self.created_at = created_at

    def __repr__(self):
        return "<Post %r>" % self.title


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    question_context = db.Column(db.Text, nullable=False)

    def __init__(self, question_context):
        self.question_context = question_context

    def __repr__(self):
        return "<Question %r>" % self.id


class UserResourceUploadHistory(db.Model):
    __tablename__ = "user_resource_upload_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    upload_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, resource_id, upload_at):
        self.user_id = user_id
        self.resource_id = resource_id
        self.upload_at = upload_at

    def __repr__(self):
        return "<UserResourceUploadHistory %r>" % self.id


class ResourceKeyword(db.Model):
    __tablename__ = "resource_keyword"

    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    keyword_id = db.Column(db.Integer, db.ForeignKey("keywords.id"), nullable=False)

    def __init__(self, resource_id, keyword_id):
        self.resource_id = resource_id
        self.keyword_id = keyword_id

    def __repr__(self):
        return "<ResourceKeyword %r>" % self.id


class SearchHistory(db.Model):
    __tablename__ = "search_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    search_context = db.Column(db.String(255), nullable=False)
    search_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, search_context, search_at):
        self.user_id = user_id
        self.search_context = search_context
        self.search_at = search_at

    def __repr__(self):
        return "<SearchHistory %r>" % self.id


class SearchResourceHistory(db.Model):
    __tablename__ = "search_resource_history"

    id = db.Column(db.Integer, primary_key=True)
    search_history_id = db.Column(
        db.Integer, db.ForeignKey("search_history.id"), nullable=False
    )
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)

    def __init__(self, search_history_id, resource_id):
        self.search_history_id = search_history_id
        self.resource_id = resource_id

    def __repr__(self):
        return "<SearchResourceHistory %r>" % self.id


class RatingHistory(db.Model):
    __tablename__ = "rating_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    rate_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, resource_id, score, rate_at):
        self.user_id = user_id
        self.resource_id = resource_id
        self.score = score
        self.rate_at = rate_at

    def __repr__(self):
        return "<RatingHistory %r>" % self.id


class RatingQuestion(db.Model):
    __tablename__ = "rating_question"

    id = db.Column(db.Integer, primary_key=True)
    rating_history_id = db.Column(
        db.Integer, db.ForeignKey("rating_history.id"), nullable=False
    )
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def __init__(self, rating_history_id, question_id, score):
        self.rating_history_id = rating_history_id
        self.question_id = question_id
        self.score = score

    def __repr__(self):
        return "<RatingQuestion %r>" % self.id


def init_tables(app, table_classes=table_names):
    with app.app_context():
        insp = inspect(db.engine)
        for table_class in table_classes:
            if not insp.has_table(table_class.__tablename__):
                table_class.__table__.create(db.engine)

        default_data = init_default_data()

        for data in default_data:
            db.session.add(data)
        db.session.commit()


def init_default_data():
    admin01 = User(username="admin01", password="I3aIO0GapcxfT7WP", role="admin")
    admin02 = User(username="admin02", password="I3aIO0GapcxfT7WP", role="admin")
    user_test = User(username="user_test", password="T5Do9EAtQAqTtfR4O", role="user")
    teacher_test = User(
        username="teacher_test", password="T5Do9EAtQAqTtfR4O", role="teacher"
    )
    student_test = User(
        username="student_test", password="T5Do9EAtQAqTtfR4O", role="student"
    )

    keyword_eng_datascience = Keyword(keyword_name="Data Science")
    keyword_chi_datascience = Keyword(keyword_name="資料科學")

    datas = [
        admin01,
        admin02,
        user_test,
        teacher_test,
        student_test,
        keyword_eng_datascience,
        keyword_chi_datascience,
    ]

    return datas


def test():
    pass


if __name__ == "__main__":
    test()
