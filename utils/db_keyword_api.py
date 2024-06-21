from sqlalchemy.orm import joinedload
from utils.database_class import db
import utils.database_class as db_cls


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


def search_keyword_by_id(keyword_id: int) -> dict:
    """
    Search keyword by id
    :param keyword_id: id of keyword
    :return:  {
        keyword_id, keyword_name_eng, keyword_name_chi
    } or {"error": -1} if keyword not exist
    """
    keyword = db_cls.Keyword.query.filter_by(id=keyword_id).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi,
    }


def search_keyword_by_name_eng(keyword_name_eng: str) -> dict:
    """
    Search keyword by english name
    :param keyword_name_eng: english name of keyword
    :return:  {
        keyword_id, keyword_name_eng, keyword_name_chi
    } or {"error": -1} if keyword not exist
    """
    keyword = db_cls.Keyword.query.filter_by(keyword_name_eng=keyword_name_eng).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi,
    }


def search_keyword_by_name_chi(keyword_name_chi: str) -> dict:
    """
    Search keyword by chinese name
    :param keyword_name_chi: chinese name of keyword
    :return:  {
        keyword_id, keyword_name_eng, keyword_name_chi
    } or {"error": -1} if keyword not exist
    """
    keyword = db_cls.Keyword.query.filter_by(keyword_name_chi=keyword_name_chi).first()
    if not keyword:
        return {"error": -1}
    return {
        "keyword_id": keyword.id,
        "keyword_name_eng": keyword.keyword_name_eng,
        "keyword_name_chi": keyword.keyword_name_chi,
    }


def add_resource_keywords(db, resource_id: int, keywords: list[str]) -> int:
    if keywords[0] is None:
        return -1

    def is_all_english(s: str) -> bool:
        """
        check whether s is all english
        :param s:
        :return: True if is all english, False otherwise
        """
        return s.isalpha() and s.isascii() and s.islower()

    keyword_ids = [1, 1, 1]
    i = 0
    for keyword_name in keywords:
        if is_all_english(keyword_name):
            keyword = search_keyword_by_name_eng(keyword_name)
        else:
            keyword = search_keyword_by_name_chi(keyword_name)

        if "keyword_id" in keyword.keys():
            # if keyword exists push to front
            # if there is any keyword not exist, it will set to keyword_id 0 - "Undefined"
            keyword_ids[i] = keyword["keyword_id"]
            i += 1

    resource_keywords = db_cls.ResourceKeywords(
        resource_id, keyword_ids[0], keyword_ids[1], keyword_ids[2]
    )

    db.session.add(resource_keywords)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Failed to add resource's keywords '{resource_keywords}': {e}")
        return -2
    return resource_keywords.id


def get_all_keywords(db):
    try:
        resource_keywords = db.session.query(db_cls.Keyword).all()
        return {
            'eng': [key.keyword_name_eng for key in resource_keywords],
            'chi': [key.keyword_name_chi for key in resource_keywords]
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
