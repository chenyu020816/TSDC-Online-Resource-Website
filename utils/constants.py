import yaml

with open("./database-default-data.yaml", "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)

KEYWORDS_LIST = data.get("keywords", [])

KEYWORDS_ENG = [keyword[0] for keyword in KEYWORDS_LIST]
KEYWORDS_CHI = [keyword[1] for keyword in KEYWORDS_LIST]

DISTANCE_WEIGHTS = [5, 3, 1]
SCORES_WEIGHTS = [1.0, 4.0, 4.0, 0]
