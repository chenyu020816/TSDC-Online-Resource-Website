import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 用戶景點清單資訊
export const GET_ROADMAP_LOADING = "GET_ROADMAP_LOADING";
export const GET_ROADMAP_LOADED = "GET_ROADMAP_LOADED";
export const GET_ROADMAP_ERROR = "GET_ROADMAP_ERROR";
export const GET_ROADMAP_RESET = "GET_ROADMAP_RESET";

// <--------- Spots reducer --------------->
const DEFAULT_ROADMAP_INFO = {
    roadmap: {
        'nodes': [],
        'edges': []
    },
    asyncStatusRoadmap: ASYNC_STATUS_LOADING,
};

export const roadmapReducer = (state = DEFAULT_ROADMAP_INFO, action) => {
    switch (action.type) {
        case GET_ROADMAP_LOADING:
            return {
                asyncStatusRoadmap: ASYNC_STATUS_LOADING, roadmap: {
                    'nodes': [],
                    'edges': []
                },
            };
        case GET_ROADMAP_LOADED:
            return { asyncStatusRoadmap: ASYNC_STATUS_LOADED, roadmap: action.payload };
        case GET_ROADMAP_ERROR:
            return {
                asyncStatusRoadmap: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_ROADMAP_RESET:
            return DEFAULT_ROADMAP_INFO;
        default:
            return state;
    }
};
