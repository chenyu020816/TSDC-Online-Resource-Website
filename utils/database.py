import os

import utils.database_class as db_cls


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


# Add search context history search resource history
