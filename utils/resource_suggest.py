import Levenshtein
import numpy as np
import pandas as pd
from translate import Translator

import utils.database_class as db_cls
from utils.constants import *
from utils.db_resource_api import *


def translate2eng(text):
    """
    Translates Chinese text to English
    :param text: Chinese text
    :return: translated text
    """
    translator = Translator(from_lang="zh", to_lang="en")
    result = translator.translate(text)
    return result


def compute_distance(query: str, keywords: list[str]) -> list[int]:
    """
    Computes distance between query and keywords
    :param query: query text
    :param keywords: keywords list
    :return: a list of distance of each keyword with query
    """
    result = map(lambda keyword: Levenshtein.distance(query, keyword), keywords)
    return list(result)


def get_keyword_distance_table(
    query: str, keywords: list[str] = KEYWORDS_ENG
) -> pd.DataFrame:
    distances = compute_distance(query, keywords)
    distances[0] = 500
    keyword_distances = pd.DataFrame(
        {"keyword_id": range(1, len(distances) + 1), "distances": distances}
    )
    return keyword_distances


def get_resource_query_weighted_distance(
    resources_table,
    query: str,
    keywords: list[str] = KEYWORDS_ENG,
    weights: list[int] = DISTANCE_WEIGHTS,
) -> pd.DataFrame:
    keyword_distances = get_keyword_distance_table(query, keywords)
    resource_table = resources_table.merge(
        keyword_distances, left_on="first_keyword_id", right_on="keyword_id", how="left"
    )
    # resource_table.drop(columns=["first_keyword_id", "keyword_id"], inplace=True)
    resource_table.rename(columns={"distances": "first_keyword_distance"}, inplace=True)

    resource_table = resource_table.merge(
        keyword_distances,
        left_on="second_keyword_id",
        right_on="keyword_id",
        how="left",
    )
    # resource_table.drop(columns=["second_keyword_id", "keyword_id"], inplace=True)
    resource_table.rename(
        columns={"distances": "second_keyword_distance"}, inplace=True
    )

    resource_table = resource_table.merge(
        keyword_distances, left_on="third_keyword_id", right_on="keyword_id", how="left"
    )
    # resource_table.drop(columns=["third_keyword_id", "keyword_id"], inplace=True)
    resource_table.rename(columns={"distances": "third_keyword_distance"}, inplace=True)

    weighted_distance = (
        weights[0] * resource_table["first_keyword_distance"]
        + weights[1] * resource_table["second_keyword_distance"]
        + weights[2] * resource_table["third_keyword_distance"]
    )

    return np.array(weighted_distance, dtype=np.float32)


def filter_resource_by_queries_distance(
    resources_table, queries: list[str], threshold: int
) -> list[int]:
    queries_distances = np.zeros(resources_table.shape[0], dtype=np.float32)
    for query in queries:
        weighted_distance = get_resource_query_weighted_distance(resources_table, query)
        queries_distances += weighted_distance
    queries_distances /= len(queries)
    mask = queries_distances <= threshold
    filtered_resource_id = resources_table["resource_id"][mask]
    filtered_query_distances = queries_distances[mask]

    return [filtered_resource_id.to_list(), filtered_query_distances]


def softmax(x):
    e_x = np.exp(x - np.max(x))  # Subtracting np.max(x) for numerical stability
    return e_x / e_x.sum(axis=0)


def get_filtered_resources_rank(
    filtered_resource_ids: list[int],
    filtered_query_distances: np.array,
    filtered_resources_scores: dict,
    distance_threshold: int,
    scores_weights: list[float] = SCORES_WEIGHTS,
) -> list[int]:

    filtered_query_distances = softmax(distance_threshold - filtered_query_distances)
    scores = (
        scores_weights[0] * filtered_resources_scores["view_count"]
        + scores_weights[1] * filtered_resources_scores["user_score"]
        + scores_weights[2] * filtered_resources_scores["public_score"]
        # scores_weights[3] * filtered_resources_scores["num_of_purchases"]
    ) * filtered_query_distances  # larger is better

    sorted_rank = np.argsort(scores)[::-1]

    return np.array(filtered_resource_ids)[sorted_rank]


def get_best_n_resources(
    db, queries: list[str], distance_threshold: int, filter_num: int
):
    resources_table = get_resource_keywords_table(db)
    filtered_resource_ids, filtered_query_distances = (
        filter_resource_by_queries_distance(
            resources_table, queries, distance_threshold
        )
    )
    filtered_resources_scores = search_resources_scores(filtered_resource_ids)

    sorted_resources_id = get_filtered_resources_rank(
        filtered_resource_ids,
        filtered_query_distances,
        filtered_resources_scores,
        distance_threshold,
    )

    if filter_num > len(sorted_resources_id):
        return sorted_resources_id
    else:
        return sorted_resources_id[:filter_num]
