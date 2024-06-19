import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

export const GET_COURSE_LOADING = "GET_COURSE_LOADING";
export const GET_COURSE_LOADED = "GET_COURSE_LOADED";
export const GET_COURSE_ERROR = "GET_COURSE_ERROR";
export const GET_COURSE_RESET = "GET_COURSE_RESET";

export const GET_COURSE_UPDATE = "GET_COURSE_UPDATE";

// <--------- Spots reducer --------------->
const DEFAULT_COURSE_LIST = {
    courseList: {},
    asyncStatusGetCourse: ASYNC_STATUS_LOADING,
};

export const CourseReducer = (state = DEFAULT_COURSE_LIST, action) => {
    switch (action.type) {
        case GET_COURSE_LOADING:
            return { asyncStatusGetCourse: ASYNC_STATUS_LOADING, courseList: {} };
        case GET_COURSE_LOADED:
            return {
                asyncStatusGetCourse: ASYNC_STATUS_LOADED,
                courseList: action.payload,
            };
        case GET_COURSE_ERROR:
            return {
                asyncStatusGetCourse: {
                    ...ASYNC_STATUS_ERROR,
                    error: action.payload,
                },
            };
        case GET_COURSE_RESET:
            return DEFAULT_COURSE_LIST;
        default:
            return state;
    }
};
