from flask import jsonify, request
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from fake_useragent import UserAgent
from bs4 import BeautifulSoup
import requests
import json

def clean_url(url):
    parsed_url = urlparse(url)

    query_params = dict(parse_qsl(parsed_url.query))

    params_to_remove = ['dpr', 'blur', 'px', 'max-w']
    for param in params_to_remove:
        query_params.pop(param, None)

    new_query_string = urlencode(query_params)
    new_url = urlunparse(parsed_url._replace(query=new_query_string))

    return new_url


def crawl_coursera():
    input_data = request.get_json()
    keyword = input_data['_keyword']
    url = "https://www.coursera.org/search?query={}".format(keyword)

    ua = UserAgent()
    random_user_agent = ua.random

    response = requests.get(url, headers = {
        'User-Agent': random_user_agent
    })

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        elements = soup.select('ul.cds-9.css-5t8l4v.cds-10 li')
        
        data = {
            "success": True,
            "page": f"https://www.coursera.org/search?query={keyword}",
            "courses": []
        }
        
        for element in elements[:10]:
            try:
                img = element.select_one('.cds-CommonCard-previewImage img')
                img_url = clean_url(img.get('src')) if img else None

                url_elem = element.select_one('a.cds-CommonCard-titleLink')
                course_url = f"https://www.coursera.org{url_elem.get('href')}" if url_elem else None

                title_elem = element.select_one('h3.cds-CommonCard-title')
                title = title_elem.text.strip() if title_elem else None

                rating_elem = element.select_one('.cds-CommonCard-ratings .css-2xargn')
                rating = rating_elem.text.strip() if rating_elem else None

                student_elem = element.select_one('.cds-CommonCard-ratings .css-vac8rf')
                student = student_elem.text.strip() if student_elem else None

                new_course = {
                    "img": img_url,
                    "url": course_url,
                    "title": title,
                    "price": None,
                    "rating": rating,
                    "student": student,
                }
                data["courses"].append(new_course)
            except Exception as e:
                error_message = {
                    "sucess": False,
                    "page": f"https://hahow.in/search?query={keyword}",
                    "message": f"An error occurred while processing an element: {e}"
                }
                return jsonify(error_message)
                # print(json.dumps(error_message, ensure_ascii = False, indent = 4))

        # print(json.dumps(data, ensure_ascii=False, indent=4))
        return jsonify(data)
    else:
        error_message = {
            "sucess": False,
            "page": f"https://hahow.in/search?query={keyword}",
            "message": f"Failed to retrieve the data. Status code: {response.status_code}"
        }
        return jsonify(error_message)
        # print(json.dumps(error_message, ensure_ascii = False, indent = 4))

