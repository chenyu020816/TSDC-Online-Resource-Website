from flask import jsonify, request
from fake_useragent import UserAgent
import requests
import json

def crawl_hahow():
    input_data = request.get_json()
    keyword = input_data['_keyword']
    url = "https://api.hahow.in/api/products/search?category=COURSE&limit=24&page=0&query={}&sort=RELEVANCE".format(keyword)

    ua = UserAgent()
    random_user_agent = ua.random

    response = requests.get(url, headers = {
        'User-Agent': random_user_agent
    })

    if response.status_code == 200:
        try:
            course_data = json.loads(response.text)
            
            data = {
                "sucess": True,
                "page": f"https://hahow.in/search?query={keyword}",
                "courses": []
            }
            
            for course in course_data['data']['courseData']['products'][:10]:
                try:
                    new_course = {
                        "img": course['coverImage']['url'] if 'coverImage' in course and 'url' in course['coverImage'] else None,
                        "url": f"https://hahow.in/courses/{course['uniquename']}" if 'uniquename' in course else None,
                        "title": course['title'] if 'title' in course else None,
                        "price": course['price'] if 'price' in course else None,
                        "rating": course['averageRating'] if 'averageRating' in course else None,
                        "student": course['numSoldTickets'] if 'numSoldTickets' in course else None,
                    }
                    data["courses"].append(new_course)
                except KeyError as e:
                    error_message = {
                        "sucess": False,
                        "page": f"https://hahow.in/search?query={keyword}",
                        "message": f"Key error: {e} in course: {course['_id']}"
                    }
                    return jsonify(error_message)
                    # print(json.dumps(error_message, ensure_ascii = False, indent = 4))
                except Exception as e:
                    error_message = {
                        "sucess": False,
                        "page": f"https://hahow.in/search?query={keyword}",
                        "message": f"An error occurred: {e} in course: {course['_id']}"
                    }
                    return jsonify(error_message)
                    # print(json.dumps(error_message, ensure_ascii = False, indent = 4))

            # print(json.dumps(data, ensure_ascii = False, indent = 4))
            return jsonify(data)
        except json.JSONDecodeError as e:
            error_message = {
                "sucess": False,
                "page": f"https://hahow.in/search?query={keyword}",
                "message": f"Failed to parse JSON:, {e}"
            }
            return jsonify(error_message)
            # print(json.dumps(error_message, ensure_ascii = False, indent = 4))
    else:
        error_message = {
            "sucess": False,
            "page": f"https://hahow.in/search?query={keyword}",
            "message": f"Failed to retrieve the data. Status code: {response.status_code}"
        }
        return jsonify(error_message)
        # print(json.dumps(error_message, ensure_ascii = False, indent = 4))