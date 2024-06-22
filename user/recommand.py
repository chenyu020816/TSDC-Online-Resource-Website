from flask import jsonify, request
from utils.database_class import db
from utils.database_api import *
#from translate import Translator
import requests
import json

from dotenv import load_dotenv,find_dotenv
from openai import OpenAI

load_dotenv(find_dotenv())

api_key = os.environ.get("OPEN_AI_GPT_API")

with open('flow/prompt/memory.txt', 'r', encoding='utf-8') as file:
    document = file.read()

client = OpenAI(api_key = api_key)

def translate_keyword(keyword):
    try:
        prompt = f"""
            關鍵字：{keyword}
            若該關鍵字為英文則直接回傳該關鍵字。若關鍵字為中文，請翻譯成英文，回傳單字即可。不要回傳任何不相關的內容或補充。
            """
        response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
                {"role": "system", "content": document},
                {"role": "user", "content": prompt},
            ]
        )
        text = response.choices[0].message.content
        return text
    except:
        return keyword

def course_suggest_list():
    try:
        input_value = request.get_json()
        keyword_list = [translate_keyword(keyword) for keyword in input_value['keyword']]
        print(keyword_list)
        best_n_id = get_best_n_resources(
            db, keyword_list, 1500, 5
        )
        print(best_n_id)
        return jsonify({"success":True, "data":best_n_id.tolist()}), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500
    
def search_resource():
    try:
        input_value = request.get_json()
        user_id = input_value.get('user_id')
        if user_id:
            resource_list = search_resource_by_id_list_with_rating_score(user_id, input_value['resource_list'])
        else:
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

def count_reaource_count():
    try:
        input_value = request.get_json()
        return_id = add_resource_view_history(
            db,
            input_value['user_id'],
            input_value['resource_id'],
        )
        if return_id == -1:
            return jsonify({"success":False, "message": "An error occurred"}), 400
        else:
            return jsonify({"success":True, "data": return_id}), 200
    except Exception as e:
        return jsonify({
            "success":False, 
            "message":e
            }), 500
    
def record_user_keyword():
    input_value = request.get_json()
    user_id = input_value['user_id']
    query = input_value['keyword']
    roadmap_domain = input_value['roadmap_domain']
    roadmap = input_value['roadmap']

    search_history_id = add_user_search_history(db, user_id, query)
    if search_history_id == -1:
        return jsonify({"success":False, "message": "An error occurred"}), 400
    else:
        search_roadmap_field_ids = add_search_roadmap_fields_history(db, search_history_id, roadmap_domain)
        if search_roadmap_field_ids[0] == -1:
            return jsonify({"success":False, "message": "An error occurred"}), 400
        else:
            results = []
            for index, search_roadmap_field_id in enumerate(search_roadmap_field_ids):
                keyword_list = roadmap[index]['technologies'].split("、")
                keyword_list = [translate_keyword(keyword) for keyword in keyword_list]
                roadmap_fields_keyword_ids = add_roadmap_fields_keywords(db, search_roadmap_field_id, keyword_list)
                best_n_id = get_best_n_resources(
                    db, keyword_list, 1500, 5
                )
                search_resource_history_ids = add_search_resources_history(db, search_roadmap_field_id,best_n_id.tolist())
                if search_resource_history_ids == -1:
                    return jsonify({"success":False, "message": "An error occurred"}), 400
                else:
                    results.append(search_resource_history_ids)
            return jsonify({"success":True, "data": results}), 200
        
def record_resource_view():
    input_value = request.get_json()
    user_id = input_value['user_id']
    search_id = input_value['search_id']
    return_code = add_resource_view_history(db, user_id, search_id)
    if return_code == -1:
        return jsonify({"success":False, "message": "An error occurred"}), 400
    else:
        return jsonify({"success":True, "data": return_code}), 200