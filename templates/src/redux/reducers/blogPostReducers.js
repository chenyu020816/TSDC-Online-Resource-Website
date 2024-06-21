import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 用戶景點清單資訊
export const GET_POST_LOADING = "GET_POST_LOADING";
export const GET_POST_LOADED = "GET_POST_LOADED";
export const GET_POST_ERROR = "GET_POST_ERROR";
export const GET_POST_RESET = "GET_POST_RESET";

// <--------- Spots reducer --------------->
const DEFAULT_POST_INFO = {
    postList: [],
    asyncStatusPostList: ASYNC_STATUS_LOADING,
};

export const blogPostReducer = (state = DEFAULT_POST_INFO, action) => {
    switch (action.type) {
        case GET_POST_LOADING:
            return { asyncStatusPostList: ASYNC_STATUS_LOADING, postList: [] };
        case GET_POST_LOADED:
            return { asyncStatusPostList: ASYNC_STATUS_LOADED, postList: action.payload };
        case GET_POST_ERROR:
            return {
                asyncStatusPostList: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_POST_RESET:
            return DEFAULT_POST_INFO;
        default:
            return state;
    }
};
