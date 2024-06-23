import json

import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from flask import jsonify, request


def crawl_ntu_ocw():
    input_data = request.get_json()
    keyword = input_data["_keyword"]
    url = "https://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/search?term={}".format(keyword)

    ua = UserAgent()
    random_user_agent = ua.random

    response = requests.get(url, headers={"User-Agent": random_user_agent})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")

        elements = soup.select("#coursebox_all .coursebox")

        data = {"domain": "台大開放式課程", "success": True, "page": url, "courses": []}

        for element in elements[:10]:
            try:
                img = element.select_one(".coursepic img")
                img_url = img.get("src") if img else None

                url_elem = element.select_one(".coursepic a")
                course_url = url_elem.get("href") if url_elem else None

                title_elem = element.select_one(".coursetext .coursetitle a")
                title = title_elem.text.strip() if title_elem else None

                new_course = {
                    "img": img_url,
                    "url": course_url,
                    "title": title,
                    "price": None,
                    "rating": None,
                    "student": None,
                }
                data["courses"].append(new_course)
            except Exception as e:
                error_message = {
                    "domain": "台大開放式課程",
                    "sucess": False,
                    "page": url,
                    "message": f"An error occurred while processing an element: {e}",
                }
                return jsonify(error_message)
                # print(json.dumps(error_message, ensure_ascii = False, indent = 4))

        # print(json.dumps(data, ensure_ascii=False, indent=4))
        return jsonify(data)
    else:
        error_message = {
            "domain": "台大開放式課程",
            "sucess": False,
            "page": url,
            "message": f"Failed to retrieve the data. Status code: {response.status_code}",
        }
        # print(json.dumps(error_message, ensure_ascii = False, indent = 4))
        return jsonify(error_message)
