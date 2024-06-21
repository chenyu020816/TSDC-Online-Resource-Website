from flask import jsonify, request
from utils.database_class import db
from utils.database_api import *

def get_related_post():
    try:
        input_value = request.get_json()
        data = search_related_post_by_title(input_value['_keyword'])
        return jsonify({
            "success":True, 
            "data":data
            }), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500
    
def get_post_keyword():
    try:
        data = get_all_keywords(db)
        return jsonify({
            "success":True, 
            "data":data
            }), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500

def create_user_post():
    input_value = request.get_json()
    return_code = create_post(
        db,
        input_value['user_id'],
        input_value['title'],
        input_value['body'],
        input_value['keywords'],
    )
    if return_code == -1:
        return jsonify({
            "success":False, 
            "message":"Post already exists."
            }), 404
    elif return_code == -2:
        return jsonify({
            "success":False, 
            "message":"Failed to create post"
            }), 500
    else:
        return jsonify({
            "success":True, 
            "data":return_code
            }), 200