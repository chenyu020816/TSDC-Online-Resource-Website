import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 用戶景點清單資訊
export const GET_USER_LOADING = "GET_USER_LOADING";
export const GET_USER_LOADED = "GET_USER_LOADED";
export const GET_USER_ERROR = "GET_USER_ERROR";
export const GET_USER_RESET = "GET_USER_RESET";

// <--------- Spots reducer --------------->
const DEFAULT_USER_INFO = {
    userInfo: null,
    asyncStatusUserInfo: ASYNC_STATUS_LOADING,
};

export const userInfoReducer = (state = DEFAULT_USER_INFO, action) => {
    switch (action.type) {
        case GET_USER_LOADING:
            return { asyncStatusUserInfo: ASYNC_STATUS_LOADING, userInfo: null };
        case GET_USER_LOADED:
            return { asyncStatusUserInfo: ASYNC_STATUS_LOADED, userInfo: action.payload };
        case GET_USER_ERROR:
            return {
                asyncStatusUserInfo: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_USER_RESET:
            return DEFAULT_USER_INFO;
        default:
            return state;
    }
};
