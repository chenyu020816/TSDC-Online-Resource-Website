import ast
import json

import requests
from bs4 import BeautifulSoup

# from translate import Translator
from dotenv import find_dotenv, load_dotenv
from fake_useragent import UserAgent
from openai import OpenAI

from utils.database_api import *
from utils.database_class import db

load_dotenv(find_dotenv())

client = OpenAI(api_key=os.environ.get("OPEN_AI_GPT_API"))

with open("./flow/prompt/memory.txt", "r", encoding="utf-8") as file:
    document = file.read()


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
            ],
        )
        text = response.choices[0].message.content
        return text
    except:
        return keyword


def get_resource_keyword_list(title: str):
    prompt = f"""
  資源名稱：{title}
  針對「資源名稱」，提供該資源的關鍵字組，須根據課程主軸由高到低排序不超過三個關鍵字（以陣列方式列出項目，優先從「關鍵字檢索表」裡抓出對應合適的英文關鍵字）。
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
        ],
    )
    text = response.choices[0].message.content
    converted_list = ast.literal_eval(text)
    converted_list = [translate_keyword(tech) for tech in converted_list]
    return converted_list if len(converted_list) > 0 else [None, None, None]


def crawl_ntu_ocw_resourse(keyword):
    url = "https://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/search?term={}".format(keyword)
    ua = UserAgent()
    random_user_agent = ua.random

    response = requests.get(url, headers={"User-Agent": random_user_agent})

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")

        elements = soup.select("#coursebox_all .coursebox")
        try:
            for element in elements[:5]:
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
                new_course = {
                    "resource_name": title if title else "",
                    "introduction": "",
                    "url": course_url if course_url else "",
                    "image_url": img_url if img_url else "",
                    "source_platform": "NTU OpenCourseWare",
                    "resource_type": "open course",
                    "public_score": 0,
                    "user_score": 0,
                    "num_of_purchases": 0,
                    "price": 0,
                    "status": "publish",
                    "keywords": get_resource_keyword_list(title),
                }
                print(new_course)
                res = create_resource(
                    db,
                    new_course["resource_name"],
                    new_course["introduction"],
                    new_course["url"],
                    new_course["image_url"],
                    new_course["source_platform"],
                    new_course["resource_type"],
                    new_course["public_score"],
                    new_course["user_score"],
                    new_course["num_of_purchases"],
                    new_course["price"],
                    new_course["status"],
                    new_course["keywords"],
                )
                print(res)
        except:
            pass
