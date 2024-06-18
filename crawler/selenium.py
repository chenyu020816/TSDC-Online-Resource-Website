import undetected_chromedriver as uc
from fake_useragent import UserAgent
from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time

ua = UserAgent()
random_user_agent = ua.random

chrome_options = uc.ChromeOptions()

# 允許所有網站通知行為
chrome_options.add_argument("--incognito")
chrome_options.add_experimental_option(
    "prefs", 
    {
        "profile.default_content_setting_values.notifications": 1
    }
)
chrome_options.add_argument(f"user-agent={random_user_agent}")
driver = uc.Chrome(options = chrome_options)
driver.set_window_size(800, 800)


keyword = "資料科學"
url = f'https://hahow.in/search?query={keyword}'

driver.get(url)

try:
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".gpGMUd .sc-1awt4tz-2.kxOqpt"))
    )
    print("Page is ready!")
except Exception as e:
    print("An error occurred:", e)

print(driver.page_source)

soup = BeautifulSoup(driver.page_source, 'html.parser')
elements = soup.select('.gpGMUd .sc-1awt4tz-2.kxOqpt')

print(elements)

url_list, title_list, comment_list, price_list = [], [], [], []
for element in elements[:10]:
    print(element)
    print(element.select_one('a.sc-182wmlr-0.kjoIFx'))
    url_list.append(element.select_one('a.sc-182wmlr-0.kjoIFx').get('href'))
    title_list.append(element.select_one('h2.sc-q2wevv-5.fOGVtl').text)
    comment_list.append(element.select_one('.sc-12oa02i-0.cxkXUj').get_text())
    price_list.append(element.select_one('div.sc-yvm8f9-3.zkOtE').get_text())

df = pd.Dataframe({
    'url_list': url_list,
    'title_list': title_list,
    'comment_list': comment_list,
    'price_list': price_list,
})
print(df)