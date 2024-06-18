import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

// 儲存推薦顯示的景點清單
export const GET_SPOTS_LOADING = "GET_SPOTS_LOADING";
export const GET_SPOTS_LOADED = "GET_SPOTS_LOADED";
export const GET_SPOTS_ERROR = "GET_SPOTS_ERROR";
export const GET_SPOTS_RESET = "GET_SPOTS_RESET";

export const GET_SPOTS_UPDATE = "GET_SPOTS_UPDATE";

// <--------- Spots reducer --------------->
const DEFAULT_SPOTS_LIST = {
    spotsList: [],
    asyncStatusGetSpots: ASYNC_STATUS_LOADING,
};

export const spotsReducer = (state = DEFAULT_SPOTS_LIST, action) => {
    switch (action.type) {
        case GET_SPOTS_LOADING:
            return { asyncStatusGetSpots: ASYNC_STATUS_LOADING, spotsList: [] };
        case GET_SPOTS_LOADED:
            return { asyncStatusGetSpots: ASYNC_STATUS_LOADED, spotsList: action.payload };
        case GET_SPOTS_UPDATE:
            const arrayPlan = [...state.spotsList];
            const updatedSpotsList = arrayPlan.filter(item => item.name !== action.payload.name);
            return { asyncStatusGetSpots: ASYNC_STATUS_LOADED, spotsList: updatedSpotsList };
        case GET_SPOTS_ERROR:
            return {
                asyncStatusGetSpots: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_SPOTS_RESET:
            return DEFAULT_SPOTS_LIST;
        default:
            return state;
    }
};
