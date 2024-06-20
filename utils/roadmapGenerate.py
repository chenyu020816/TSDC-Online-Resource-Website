from dotenv import load_dotenv,find_dotenv
from flask import jsonify, request
from openai import OpenAI
import json
import re
import os

load_dotenv(find_dotenv())

def clean_llm_output(text):
    match = re.search(r'```json\n(.*?)\n```', text, re.DOTALL)
    if match:
        json_str = match.group(1)
    else:
        # 如果未找到標記，假設整個文本都是JSON
        json_str = text.strip("'''").strip()

    try:
        data = json.loads(json_str)
        
        return data
    except json.JSONDecodeError as e:
        return f"JSON解碼錯誤: {e}"

def generate_position(index):
    row = index // 4
    col = index % 4
    y_position = row * 250
    if row % 2 == 0:  # 偶數行，從左到右
        x_position = col * 400
    else:  # 奇數行，從右到左
        x_position = 1200 - col * 400
    return x_position, y_position, row

def generate_roadmap():
    input_data = request.get_json()
    keyword = input_data['_keyword']
    print(keyword)

    with open('utils/prompt/roadmap_output_example.txt', 'r', encoding='utf-8') as file:
        prompt_template_sample = file.read()

    with open('utils/prompt/roadmap_prompt.txt', 'r', encoding='utf-8') as file:
        prompt_template = file.read()
        prompt_template = prompt_template.format(keyword = keyword)

    prompt = prompt_template + prompt_template_sample

    api_key = os.environ.get("OPEN_AI_API")
    client = OpenAI(api_key = api_key)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt},
        ]
    )

    text = response.choices[0].message.content

    data = clean_llm_output(text)

    nodes = []
    edges = []
    for idx, (key, value) in enumerate(data.items(), start=1):
        x_position, y_position, row = generate_position(idx - 1)
        node = {
            "id": str(idx),
            "type": "custom",
            "position": { "x": x_position, "y": y_position },
            "data": {
                "row": row,
                "label": value["label"],
                "technologies": "、".join(value["technologies"]),
                "description": value["description"]
            },
            "connectable": False
        }
        nodes.append(node)
        if idx > 1:
            edge = {
                "id": f"e{idx-1}-{idx}",
                "source": str(idx-1),
                "target": str(idx),
                "type": "smoothstep"
            }
            edges.append(edge)
    return jsonify({
        "success": True,
        "nodes": nodes,
        "edges": edges
    })