import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 儲存推薦顯示的標籤清單
export const GET_PLAN_TAGS_LOADING = "GET_PLAN_TAGS_LOADING";
export const GET_PLAN_TAGS_LOADED = "GET_PLAN_TAGS_LOADED";
export const GET_PLAN_TAGS_ERROR = "GET_PLAN_TAGS_ERROR";
export const GET_PLAN_TAGS_RESET = "GET_PLAN_TAGS_RESET";

// <--------- Plan tags reducer --------------->
const DEFAULT__PLAN_TAGS_LIST = {
    planTags: [],
    asyncStatusGetPlanTags: ASYNC_STATUS_LOADING,
};

export const planTagsReducer = (state = DEFAULT__PLAN_TAGS_LIST, action) => {
    switch (action.type) {
        case GET_PLAN_TAGS_LOADING:
            return { asyncStatusGetPlanTags: ASYNC_STATUS_LOADING, planTags: [] };
        case GET_PLAN_TAGS_LOADED:
            return { asyncStatusGetPlanTags: ASYNC_STATUS_LOADED, planTags: action.payload };
        case GET_PLAN_TAGS_ERROR:
            return {
                asyncStatusGetPlanTags: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_PLAN_TAGS_RESET:
            return DEFAULT__PLAN_TAGS_LIST;
        default:
            return state;
    }
};
