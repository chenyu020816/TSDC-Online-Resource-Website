from flask import jsonify, request
from utils.database_class import db
from utils.database_api import *
from translate import Translator
import requests
import json

def translate_keyword(keyword):
    translator = Translator(from_lang='zh', to_lang='en')
    result = translator.translate(keyword)
    return result

def course_suggest_list():
    try:
        input_value = request.get_json()
        keyword_list = [translate_keyword(keyword) for keyword in input_value['keyword']]
        best_n_id = get_best_n_resources(
            db, keyword_list, 1500, 5
        )
        return jsonify({"success":True, "data":best_n_id.tolist()}), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500
    
def search_resource():
    try:
        input_value = request.get_json()
        resource_list = search_resource_by_id_list(input_value['resource_list'])
        return jsonify({"success":True, "data": resource_list}), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500
    
def give_rating():
    try:
        input_value = request.get_json()
        return_id = add_user_rating_history(
            db,
            input_value['user_id'],
            input_value['resource_id'],
            input_value['score']
        )
        return jsonify({"success":True, "data": return_id}), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500
    