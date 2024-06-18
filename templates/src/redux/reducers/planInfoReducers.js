import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 用戶景點清單資訊
export const GET_PLAN_LOADING = "GET_PLAN_LOADING";
export const GET_PLAN_LOADED = "GET_PLAN_LOADED";
export const GET_PLAN_ERROR = "GET_PLAN_ERROR";
export const GET_PLAN_RESET = "GET_PLAN_RESET";

// <--------- Spots reducer --------------->
const DEFAULT_PLAN_INFO = {
    planInfo: null,
    asyncStatusPlanInfo: ASYNC_STATUS_LOADING,
};

export const planInfoReducer = (state = DEFAULT_PLAN_INFO, action) => {
    switch (action.type) {
        case GET_PLAN_LOADING:
            return { asyncStatusPlanInfo: ASYNC_STATUS_LOADING, planInfo: null };
        case GET_PLAN_LOADED:
            return { asyncStatusPlanInfo: ASYNC_STATUS_LOADED, planInfo: action.payload };
        case GET_PLAN_ERROR:
            return {
                asyncStatusPlanInfo: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_PLAN_RESET:
            return DEFAULT_PLAN_INFO;
        default:
            return state;
    }
};
