from flask import jsonify, request
from utils.database_api import search_related_post_by_title

def get_related_post():
    input_value = request.get_json()
    data = search_related_post_by_title(input_value['_keyword'])
    return jsonify({
        "success":True, 
        "data":data
        }), 200
    