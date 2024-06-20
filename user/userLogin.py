from flask import jsonify, request
from utils.database_class import db
from utils.database import *
import requests
import json

def login():
    input_value = request.get_json()
    return_code = login_user(input_value['name'], input_value['password'])
    if return_code == -2:
        return jsonify({"error":"使用者名稱或密碼錯誤"}), 400
    elif return_code == -1:
        return jsonify({"error":"密碼錯誤"}), 400
    else:
        return jsonify({"success":True, "data":return_code}), 200
    


def signup():
    input_value = request.get_json()
    return_code = create_user(
        db, 
        input_value['name'], 
        input_value['email'],
        input_value['password'],
    )
    if return_code == -2:
        return jsonify({"error":"Email已被使用"}), 400
    elif return_code == -1:
        return jsonify({"error":"使用者名稱已被使用"}), 400
    elif return_code == -3:
        return jsonify({"error":"註冊失敗，請聯繫官方處理"}), 400
    else:
        return jsonify({"success":True, "data":return_code}), 200