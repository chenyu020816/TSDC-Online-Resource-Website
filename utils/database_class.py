from datetime import datetime

import yaml
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, username, email, password, role):
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User %r>" % self.username


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    resource_name = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), unique=True, nullable=False
    )
    url = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    source_platform = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Float, nullable=False)
    num_of_purchases = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(255), nullable=False)

    def __init__(
        self,
        resource_name,
        url,
        image_url,
        source_platform,
        resource_type,
        score,
        num_of_purchases,
        price: float = 0.0,
        status: str = "under_review",
    ):
        self.resource_name = resource_name
        self.url = url
        self.image_url = image_url
        self.source_platform = source_platform
        self.type = resource_type
        self.score = score
        self.num_of_purchases = num_of_purchases
        self.price = price
        self.status = status

    def __repr__(self):
        return "<Resource %r>" % self.resource_name


class Keyword(db.Model):
    __tablename__ = "keywords"

    id = db.Column(db.Integer, primary_key=True)
    keyword_name_eng = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), unique=True, nullable=False
    )
    keyword_name_chi = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )

    def __init__(self, keyword_name_eng, keyword_name_chi):
        self.keyword_name_eng = keyword_name_eng
        self.keyword_name_chi = keyword_name_chi

    def __repr__(self):
        return "<Keyword %r>" % self.keyword_name


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), unique=True, nullable=False
    )
    body = db.Column(db.Text(collation="utf8mb4_unicode_ci"), nullable=False)
    status = db.Column(db.String(255), nullable=False)
    post_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    __table_args__ = (
        db.Index('uq_body', db.text('body(255)'), unique=True),
    )

    def __init__(self, user_id, title, body, status="under_review"):
        self.user_id = user_id
        self.title = title
        self.body = body
        self.status = status

    def __repr__(self):
        return "<Post %r>" % self.title


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    question_context = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), unique=True, nullable=False
    )

    def __init__(self, question_context):
        self.question_context = question_context

    def __repr__(self):
        return "<Question %r>" % self.id


class UserResourceUploadHistory(db.Model):
    __tablename__ = "user_resource_upload_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    upload_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, resource_id):
        self.user_id = user_id
        self.resource_id = resource_id

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


class PostKeyword(db.Model):
    __tablename__ = "post_keyword"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    keyword_id = db.Column(db.Integer, db.ForeignKey("keywords.id"), nullable=False)

    def __init__(self, post_id, keyword_id):
        self.post_id = post_id
        self.keyword_id = keyword_id

    def __repr__(self):
        return "<ResourceKeyword %r>" % self.id


class SearchHistory(db.Model):
    __tablename__ = "search_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    search_context = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    search_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, search_context):
        self.user_id = user_id
        self.search_context = search_context

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
    rate_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, resource_id, score):
        self.user_id = user_id
        self.resource_id = resource_id
        self.score = score

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


TABLES = (
    User,
    Resource,
    Keyword,
    Post,
    Question,
    UserResourceUploadHistory,
    ResourceKeyword,
    SearchHistory,
    SearchResourceHistory,
    RatingHistory,
    RatingQuestion,
)


def init_tables(app, table_classes=TABLES):
    with app.app_context():
        insp = inspect(db.engine)
        for table_class in table_classes:
            if not insp.has_table(table_class.__tablename__):
                table_class.__table__.create(db.engine)

        default_data = init_default_data()

        for table in default_data:
            for data in table:
                db.session.add(data)
        db.session.commit()


def read_default_data(file_path):
    with open(file_path, "r") as file:
        data = yaml.safe_load(file)
    return data


def init_default_data(file_path="./database-default-data.yaml"):
    data = read_default_data(file_path=file_path)

    users = data.get("users", [])
    keywords = data.get("keywords", [])

    user_objects = [
        User(username=user[0], email=user[1], password=user[2], role=user[3])
        for user in users
    ]
    keyword_objects = [
        Keyword(keyword_name_eng=keyword[0], keyword_name_chi=keyword[1])
        for keyword in keywords
    ]

    datas = [user_objects, keyword_objects]
    return datas
