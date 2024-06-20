import utils.database_class as db_cls
from utils.db_user_api import *


def create_post(
    db, user_id: int, title: str, body: str
) -> int:
    """
    Create a post
    :param db:
    :param user_id: id of publisher
    :param title: title of post
    :param body: context of post
    :return: post id or -1 if post exist or -2 if fail
    """
    existing_post = db_cls.Post.query.filter_by(title=title).first()
    if existing_post:
        print(f"Post '{title}' already exists.")
        return -1
    role = search_user_by_id(user_id)["role"]
    if role in ["admin", "publisher"]:
        status = "publish"
    else:
        status = "under_review"
    post = db_cls.Post(user_id=user_id, title=title, body=body, status=status)

    db.session.add(post)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create post '{post}': {e}")
        return -2
    return post.id


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