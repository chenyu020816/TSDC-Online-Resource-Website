import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

export const GET_TABLE_LOADING = "GET_TABLE_LOADING";
export const GET_TABLE_LOADED = "GET_TABLE_LOADED";
export const GET_TABLE_ERROR = "GET_TABLE_ERROR";
export const GET_TABLE_RESET = "GET_TABLE_RESET";

export const GET_TABLE_UPDATE = "GET_TABLE_UPDATE";

// <--------- Spots reducer --------------->
const DEFAULT_TABLE_LIST = {
    table: [],
    asyncStatusGetTable: ASYNC_STATUS_LOADING,
};

export const searchTableReducer = (state = DEFAULT_TABLE_LIST, action) => {
    switch (action.type) {
        case GET_TABLE_LOADING:
            return { asyncStatusGetTable: ASYNC_STATUS_LOADING, table: [] };
        case GET_TABLE_LOADED:
            return { asyncStatusGetTable: ASYNC_STATUS_LOADED, table: action.payload };
        case GET_TABLE_ERROR:
            return {
                asyncStatusGetTable: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_TABLE_RESET:
            return DEFAULT_TABLE_LIST;
        default:
            return state;
    }
};
