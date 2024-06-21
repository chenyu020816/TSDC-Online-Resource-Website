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
    photo_path = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, username, email, photo_path, password, role):
        self.username = username
        self.email = email
        self.photo_path = photo_path
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
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    introduction = db.Column(db.Text(collation="utf8mb4_unicode_ci"), nullable=False)
    url = db.Column(db.String(255), unique=True, nullable=False)
    image_url = db.Column(db.String(255), unique=True, nullable=False)
    source_platform = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    public_score = db.Column(db.Float, nullable=False)
    user_score = db.Column(db.Float, nullable=False)
    num_of_purchases = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(255), nullable=False)
    view_count = db.Column(db.Integer, nullable=False, default=0)

    __table_args__ = (db.Index("uq_introduction", db.text("introduction(255)")),)

    def __init__(
        self,
        resource_name,
        introduction,
        url,
        image_url,
        source_platform,
        resource_type,
        public_score,
        user_score,
        num_of_purchases,
        price: float = 0.0,
        status: str = "under_review",
    ):
        self.resource_name = resource_name
        self.introduction = introduction
        self.url = url
        self.image_url = image_url
        self.source_platform = source_platform
        self.type = resource_type
        self.public_score = public_score
        self.user_score = user_score
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
        return "<Keyword %r>" % self.keyword_name_eng


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

    __table_args__ = (db.Index("uq_body", db.text("body(255)")),)

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
        return "<Question %r>" % self.question_context


class PostImages(db.Model):
    __tablename__ = "posts_images"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    image_name = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), unique=True, nullable=False
    )
    image_path = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), unique=True, nullable=False
    )

    def __init__(self, post_id, image_name, image_path):
        self.post_id = post_id
        self.image_name = image_name
        self.image_path = image_path

    def __repr__(self):
        return "<PostImages %r>" % self.image_name


class UserResourceUploadHistory(db.Model):
    __tablename__ = "user_resource_upload_history"

    id = db.Column(db.Integer, primary_key=True)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    upload_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, resource_id):
        self.uploaded_by = user_id
        self.resource_id = resource_id

    def __repr__(self):
        return "<UserResourceUploadHistory %r>" % self.id


class ResourceKeywords(db.Model):
    __tablename__ = "resource_keywords"

    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), unique = True, nullable=False)
    first_keyword_id = db.Column(db.Integer, db.ForeignKey("keywords.id"), nullable=False)
    second_keyword_id = db.Column(db.Integer, db.ForeignKey("keywords.id"), nullable=False)
    third_keyword_id = db.Column(db.Integer, db.ForeignKey("keywords.id"), nullable=False)

    def __init__(self, resource_id, first_keyword_id, second_keyword_id, third_keyword_id):
        self.resource_id = resource_id
        self.first_keyword_id = first_keyword_id
        self.second_keyword_id = second_keyword_id
        self.third_keyword_id = third_keyword_id

    def __repr__(self):
        return "<ResourceKeyword %r>" % self.id


class PostKeywords(db.Model):
    __tablename__ = "post_keywords"

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


class ResourceUpdateHistory(db.Model):
    __tablename__ = "resource_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    property_name = db.Column(db.String(255), nullable=False)
    old_value = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    new_value = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    update_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, resource_id, property_name, old_value, new_value):
        self.updated_by = user_id
        self.resource_id = resource_id
        self.property_name = property_name
        self.old_value = old_value
        self.new_value = new_value

    def __repr__(self):
        return "<ResourceUpdateHistory %r>" % self.id


class PostUpdateHistory(db.Model):
    __tablename__ = "post_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    property_name = db.Column(db.String(255), nullable=False)
    old_value = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    new_value = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    update_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, post_id, property_name, old_value, new_value):
        self.updated_by = user_id
        self.post_id = post_id
        self.property_name = property_name
        self.old_value = old_value
        self.new_value = new_value

    def __repr__(self):
        return "<PostUpdateHistory %r>" % self.id


class PostBodyUpdateHistory(db.Model):
    __tablename__ = "post_body_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    old_body = db.Column(db.Text(collation="utf8mb4_unicode_ci"), nullable=False)
    new_body = db.Column(db.Text(collation="utf8mb4_unicode_ci"), nullable=False)
    update_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    __table_args__ = (
        db.Index("uq_old_body", db.text("old_body(255)")),
        db.Index("uq_new_body", db.text("new_body(255)")),
    )

    def __init__(self, user_id, post_id, old_body, new_body):
        self.updated_by = user_id
        self.post_id = post_id
        self.old_body = old_body
        self.new_body = new_body

    def __repr__(self):
        return "<PostBodyUpdateHistory %r>" % self.id


class UserUpdateHistory(db.Model):
    __tablename__ = "user_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    property_name = db.Column(db.String(255), nullable=False)
    old_value = db.Column(db.String(255), nullable=False)
    new_value = db.Column(db.String(255), nullable=False)
    update_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, property_name, old_value, new_value):
        self.updated_by = user_id
        self.property_name = property_name
        self.old_value = old_value
        self.new_value = new_value

    def __repr__(self):
        return "<UserUpdateHistory %r>" % self.id


class PostStatusUpdateHistory(db.Model):
    __tablename__ = "post_status_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    old_status = db.Column(db.String(255), nullable=False)
    new_status = db.Column(db.String(255), nullable=False)
    update_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, post_id, old_status, new_status):
        self.updated_by = user_id
        self.post_id = post_id
        self.old_status = old_status
        self.new_status = new_status

    def __repr__(self):
        return "<PostStatusUpdateHistory %r>" % self.id


class ResourceStatusUpdateHistory(db.Model):
    __tablename__ = "resource_status_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    old_status = db.Column(db.String(255), nullable=False)
    new_status = db.Column(db.String(255), nullable=False)
    update_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, resource_id, old_status, new_status):
        self.updated_by = user_id
        self.resource_id = resource_id
        self.old_status = old_status
        self.new_status = new_status

    def __repr__(self):
        return "<ResourceStatusUpdateHistory %r>" % self.id


class PostImageUpdateHistory(db.Model):
    __tablename__ = "post_image_update_history"

    id = db.Column(db.Integer, primary_key=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    old_image_path = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )
    new_image_path = db.Column(
        db.String(255, collation="utf8mb4_unicode_ci"), nullable=False
    )

    def __init__(self, user_id, post_id, old_image_path, new_image_path):
        self.updated_by = user_id
        self.post_id = post_id
        self.old_image_path = old_image_path
        self.new_image_path = new_image_path

    def __repr__(self):
        return "<PostImageUpdateHistory %r>" % self.id


class ResourceViewCount(db.Model):
    __tablename__ = "resource_view_count"

    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    count = db.Column(db.Integer, nullable=False)

    def __init__(self, resource_id, count):
        self.resource_id = resource_id
        self.count = count

    def __repr__(self):
        return "<ResourceViewCount %r>" % self.id


class UserSaveResources(db.Model):
    __tablename__ = "user_save_resources"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)
    save_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, resource_id):
        self.user_id = user_id
        self.resource_id = resource_id

    def __repr__(self):
        return "<UserSaveResource %r>" % self.id


class SearchRoadmapFields(db.Model):
    __tablename__ = "search_roadmap_fields"

    id = db.Column(db.Integer, primary_key=True)
    search_history_id = db.Column(db.Integer, db.ForeignKey("search_history.id"), nullable=False)
    roadmap_field_name = db.Column(db.String(255, collation="utf8mb4_unicode_ci"), nullable=False)

    def __init__(self, search_history_id, roadmap_field_name):
        self.search_history_id = search_history_id
        self.roadmap_field_name = roadmap_field_name

    def __repr__(self):
        return "<SearchRoadMapFields %r>" % self.id


class SearchResourceHistory(db.Model):
    __tablename__ = "search_resource_history"

    id = db.Column(db.Integer, primary_key=True)
    search_roadmap_fields_id = db.Column(db.Integer, db.ForeignKey("search_roadmap_fields.id"), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey("resources.id"), nullable=False)

    def __init__(self, search_roadmap_fields_id, resource_id):
        self.search_roadmap_fields_id = search_roadmap_fields_id
        self.resource_id = resource_id

    def __repr__(self):
        return "<SearchResourceHistory %r>" % self.id


class RoadMapFieldKeywords(db.Model):
    __tablename__ = "roadmap_field_keywords"

    id = db.Column(db.Integer, primary_key=True)
    search_roadmap_fields_id = db.Column(db.Integer, db.ForeignKey("search_roadmap_fields.id"), nullable=False)
    keywords = db.Column(db.String(255, collation="utf8mb4_unicode_ci"), nullable=False)

    def __init__(self, search_roadmap_fields_id, keywords):
        self.search_roadmap_fields_id = search_roadmap_fields_id
        self.keywords = keywords

    def __repr__(self):
        return "<RoadMapFieldKeywords %r>" % self.id


class UserResourceViewHistory(db.Model):
    __tablename__ = "user_view_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    search_resource_id = db.Column(db.Integer, db.ForeignKey("search_resource_history.id"), nullable=False)
    view_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __init__(self, user_id, search_resource_id):
        self.user_id = user_id
        self.search_resource_id = search_resource_id

    def __repr__(self):
        return "<UserResourceViewHistory %r>" % self.id


TABLES = (
    User,
    Resource,
    Keyword,
    Post,
    PostImages,
    PostKeywords,
    Question,
    UserResourceUploadHistory,
    ResourceKeywords,
    SearchHistory,
    SearchRoadmapFields,
    SearchResourceHistory,
    RatingHistory,
    RatingQuestion,
    ResourceUpdateHistory,
    PostUpdateHistory,
    PostBodyUpdateHistory,
    UserUpdateHistory,
    PostImageUpdateHistory,
    ResourceStatusUpdateHistory,
    RoadMapFieldKeywords,
    UserSaveResources,
    # ResourceViewCount,
    UserResourceViewHistory
)


def init_tables(app, table_classes=TABLES):
    with app.app_context():
        insp = inspect(db.engine)
        with_data = True
        for table_class in table_classes:
            if not insp.has_table(table_class.__tablename__):
                with_data = False
                table_class.__table__.create(db.engine)
        if with_data: return
        default_data = init_default_data()
        
        for table in default_data:
            for data in table:
                db.session.add(data)
        db.session.commit()

        user_id = 1
        title = "測試文章Title"
        body = "這是測試文章內容"
        post = Post(user_id=user_id, title=title, body=body)
        db.session.add(post)
        db.session.commit()


def read_default_data(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)
    return data


def init_default_data(file_path="./database-default-data.yaml"):
    data = read_default_data(file_path=file_path)

    users = data.get("users", [])
    keywords = data.get("keywords", [])

    user_objects = [
        User(
            username=user[0],
            email=user[1],
            photo_path=f"{user[1]}.png",
            password=user[2],
            role=user[3],
        )
        for user in users
    ]
    keyword_objects = [
        Keyword(keyword_name_eng=keyword[0], keyword_name_chi=keyword[1])
        for keyword in keywords
    ]

    datas = [user_objects, keyword_objects]
    return datas
