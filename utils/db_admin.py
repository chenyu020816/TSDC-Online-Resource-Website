import utils.database_class as db_cls


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
