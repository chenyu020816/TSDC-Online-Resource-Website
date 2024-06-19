import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

export const GET_KEYWORD_LOADING = "GET_KEYWORD_LOADING";
export const GET_KEYWORD_LOADED = "GET_KEYWORD_LOADED";
export const GET_KEYWORD_ERROR = "GET_KEYWORD_ERROR";
export const GET_KEYWORD_RESET = "GET_KEYWORD_RESET";

export const GET_KEYWORD_UPDATE = "GET_KEYWORD_UPDATE";

// <--------- Spots reducer --------------->
const DEFAULT_KEYWORD_LIST = {
    keyword: "",
    asyncStatusGetKeyword: ASYNC_STATUS_LOADING,
};

export const KeywordReducer = (state = DEFAULT_KEYWORD_LIST, action) => {
    switch (action.type) {
        case GET_KEYWORD_LOADING:
            return { asyncStatusGetKeyword: ASYNC_STATUS_LOADING, keyword: "" };
        case GET_KEYWORD_LOADED:
            return { asyncStatusGetKeyword: ASYNC_STATUS_LOADED, keyword: action.payload };
        case GET_KEYWORD_ERROR:
            return {
                asyncStatusGetKeyword: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_KEYWORD_RESET:
            return DEFAULT_KEYWORD_LIST;
        default:
            return state;
    }
};
