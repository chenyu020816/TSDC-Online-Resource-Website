from openai import OpenAI
#from translate import Translator
from dotenv import load_dotenv,find_dotenv
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from fake_useragent import UserAgent
from utils.database_class import db
from utils.database_api import *
from bs4 import BeautifulSoup
import requests
import re
import ast

load_dotenv(find_dotenv())

client = OpenAI(api_key = os.environ.get("OPEN_AI_GPT_API"))

with open('./flow/prompt/memory.txt', 'r', encoding='utf-8') as file:
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
            ]
        )
        text = response.choices[0].message.content
        return text
    except:
        return keyword


def clean_url(url):
    parsed_url = urlparse(url)

    query_params = dict(parse_qsl(parsed_url.query))

    params_to_remove = ['dpr', 'blur', 'px', 'max-w']
    for param in params_to_remove:
        query_params.pop(param, None)

    new_query_string = urlencode(query_params)
    new_url = urlunparse(parsed_url._replace(query=new_query_string))

    return new_url
def extract_number(text):
    """
    從字串中擷取數字並轉換為整數。
    
    參數:
    text (str): 包含數字和單位的字串，例如"(23K reviews)"或"(123 reviews)"。

    返回:
    int: 轉換後的整數。如果沒有匹配到數字，返回None。
    """
    # 使用正則表達式擷取數字部分
    match = re.search(r'\d+(\.\d+)?[KkMm]?', text)
    
    if match:
        number_str = match.group()
        
        # 將K, M等單位轉換為具體數字
        if 'K' in number_str or 'k' in number_str:
            number = int(float(number_str.replace('K', '').replace('k', '')) * 1000)
        elif 'M' in number_str or 'm' in number_str:
            number = int(float(number_str.replace('M', '').replace('m', '')) * 1000000)
        else:
            number = int(number_str)
        
        return number
    else:
        return 0

def get_resource_keyword_list(title:str):
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
    ]
  )
  text = response.choices[0].message.content
  converted_list = ast.literal_eval(text)
  converted_list = [translate_keyword(tech) for tech in converted_list]
  return converted_list if len(converted_list) > 0 else [None, None, None]

def crawl_coursera_resourse(keyword):
    keyword_en = translate_keyword(keyword)

    url = "https://www.coursera.org/search?query={}".format(keyword_en)
    ua = UserAgent()
    random_user_agent = ua.random

    response = requests.get(url, headers = {
        'User-Agent': random_user_agent
    })

    if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
        
            elements = soup.select('ul.cds-9.css-5t8l4v.cds-10 li')
            try:
                for element in elements[:30]:
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
                            "resource_name": title if title else "",
                            "introduction": "",
                            "url": course_url if course_url else "",
                            "image_url": img_url if img_url else "",
                            "source_platform": "Coursera",
                            "resource_type": "open course",
                            "public_score": rating if rating else 0,
                            "user_score": 0,
                            "num_of_purchases": extract_number(student) if student else 0,
                            "price": 0,
                            "status": "publish",
                            "keywords": get_resource_keyword_list(title)
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
            except:
                pass
