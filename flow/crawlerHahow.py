from openai import OpenAI
from translate import Translator
from dotenv import load_dotenv,find_dotenv
from fake_useragent import UserAgent
from utils.database_class import db
from utils.database_api import *
import requests
import json
import ast

load_dotenv(find_dotenv())

client = OpenAI(api_key = os.environ.get("OPEN_AI_GPT_API"))

with open('./flow/prompt/memory.txt', 'r', encoding='utf-8') as file:
    document = file.read()


def translate_keyword(keyword):
    translator = Translator(from_lang='zh', to_lang='en')
    result = translator.translate(keyword)
    return result


def get_resource_keyword_list(title:str):
  prompt = f"""
  資源名稱：{title}
  針對「資源名稱」，提供該資源的關鍵字組，須根據課程主軸由高到低排序最多三個關鍵字（以陣列方式列出項目，優先從「關鍵字檢索表」裡抓出對應合適的英文關鍵字）。
  輸出資料請以array格式輸出，參考<輸出範例>，只要輸出array的「格式化」資料即可。切勿回傳任何其他不相關的資訊或補充說明。
  <輸出範例>
  ['abc', 'abc', 'abc']
  <輸出範例>
  """
  response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": document},
        {"role": "user", "content": prompt},
    ]
  )
  text = response.choices[0].message.content
  converted_list = ast.literal_eval(text)
  converted_list = [translate_keyword(tech) for tech in converted_list]
  return converted_list

def crawl_hahow_resourse(keyword):
    url = "https://api.hahow.in/api/products/search?category=COURSE&limit=10&page=0&query={}&sort=RELEVANCE".format(keyword)

    ua = UserAgent()
    random_user_agent = ua.random

    response = requests.get(url, headers = {
        'User-Agent': random_user_agent
    })

    if response.status_code == 200:
            course_data = json.loads(response.text)

            for course in course_data['data']['courseData']['products']:
                print(course['title'])
                new_course = {
                        "resource_name": course['title'] if 'title' in course else "",
                        "introduction": "",
                        "url": f"https://hahow.in/courses/{course['uniquename']}" if 'uniquename' in course else "",
                        "image_url": course['coverImage']['url'] if 'coverImage' in course and 'url' in course['coverImage'] else "",
                        "source_platform": "Hahow",
                        "resource_type": "pay course",
                        "public_score": course['averageRating'] if 'averageRating' in course else 0,
                        "user_score": 0,
                        "num_of_purchases": course['numSoldTickets'] if 'numSoldTickets' in course else 0,
                        "price": course['price'] if 'price' in course else 0,
                        "status": "publish",
                        "keywords": get_resource_keyword_list(course['title'])
                    }
                print(new_course)
                res = create_resource(
                        db,
                        new_course['resource_name'],
                        new_course['introduction'],
                        new_course['url'],
                        new_course['image_url'],
                        new_course['source_platform'],
                        new_course['resource_type'],
                        new_course['public_score'],
                        new_course['user_score'],
                        new_course['num_of_purchases'],
                        new_course['price'],
                        new_course['status'],
                        new_course['keywords']
                )
                print(res)
