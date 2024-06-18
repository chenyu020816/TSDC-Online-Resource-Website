import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

export const WAY_POINT_LOADING = "WAY_POINT_LOADING";
export const WAY_POINT_LOADED = "WAY_POINT_LOADED";
export const WAY_POINT_ERROR = "WAY_POINT_ERROR";
export const WAY_POINT_RESET = "WAY_POINT_RESET";


// <--------- Way Point reducer --------------->
const DEFAULT_WAY_POINT = {
    wayPoints: [],
    asyncStatusWayPoints: ASYNC_STATUS_LOADING,
};

export const googleMapReducer = (state = DEFAULT_WAY_POINT, action) => {
    switch (action.type) {
        case WAY_POINT_LOADING:
            return { asyncStatusWayPoints: ASYNC_STATUS_LOADING, wayPoints: [] };
        case WAY_POINT_LOADED:
            return { WAY_POINT_ERROR: ASYNC_STATUS_LOADED, wayPoints: action.payload };
        case WAY_POINT_ERROR:
            return {
                asyncStatusWayPoints: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case WAY_POINT_RESET:
            return DEFAULT_WAY_POINT;
        default:
            return state;
    }
};
