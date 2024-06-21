import csv

import yaml

# 讀取CSV文件
csv_file_path = "./resource_keywords.csv"

# 解析CSV數據
with open(csv_file_path, newline="", encoding="utf-8") as csv_file:
    csv_reader = csv.reader(csv_file)
    csv_data = list(csv_reader)

# 構建YAML結構
yaml_data = {"keywords": []}
for row in csv_data:
    print(f"- {[str(int(row[1])-55), row[2], row[3], row[4]]}")
    yaml_data["keywords"].append([row[1], row[2]])
