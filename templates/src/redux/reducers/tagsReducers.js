import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 儲存推薦顯示的標籤清單
export const GET_TAGS_LOADING = "GET_TAGS_LOADING";
export const GET_TAGS_LOADED = "GET_TAGS_LOADED";
export const GET_TAGS_ERROR = "GET_TAGS_ERROR";
export const GET_TAGS_RESET = "GET_TAGS_RESET";

export const GET_TAGS_UPDATE = "GET_TAGS_UPDATE";

// <--------- Spots reducer --------------->
const DEFAULT_TAGS_LIST = {
    tagList: [],
    asyncStatusGetTags: ASYNC_STATUS_LOADING,
};

export const tagsReducer = (state = DEFAULT_TAGS_LIST, action) => {
    switch (action.type) {
        case GET_TAGS_LOADING:
            return { asyncStatusGetTags: ASYNC_STATUS_LOADING, tagList: [] };
        case GET_TAGS_LOADED:
            return { asyncStatusGetTags: ASYNC_STATUS_LOADED, tagList: action.payload };
        case GET_TAGS_UPDATE:
            const arrayTagList = [...state.tagList];
            const updatedTagsList = arrayTagList.filter(item => item !== action.payload);
            return { asyncStatusGetTags: ASYNC_STATUS_LOADED, tagList: updatedTagsList };
        case GET_TAGS_ERROR:
            return {
                asyncStatusGetTags: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_TAGS_RESET:
            return DEFAULT_TAGS_LIST;
        default:
            return state;
    }
};
