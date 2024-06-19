import React from "react";
import store from "redux/store";
import * as crawlerAPIs from 'apis/crawler';

const useGetCrawlerCourse = () => {

    const handleGetCourseraList = React.useCallback(async (_keyword) => {
        store.dispatch({ type: "GET_COURSE_LOADING" })
        try {
            const result = await crawlerAPIs.crawlCoursera({ _keyword: _keyword })
            store.dispatch({ type: "GET_COURSE_LOADED", payload: result['data'] })
        } catch (error) {
            store.dispatch({ type: "GET_COURSE_ERROR", payload: error.message })
        }
    }, [])

    const handleGetHahowList = React.useCallback(async (_keyword) => {
        store.dispatch({ type: "GET_COURSE_LOADING" })
        try {
            const result = await crawlerAPIs.crawlHahow({ _keyword: _keyword })
            store.dispatch({ type: "GET_COURSE_LOADED", payload: result['data'] })
        } catch (error) {
            store.dispatch({ type: "GET_COURSE_ERROR", payload: error.message })
        }
    }, [])

    const handleGetAllCourses = React.useCallback(async (_keyword) => {
        store.dispatch({ type: "GET_COURSE_LOADING" });

        try {
            const [hahowResult, courseraResult] = await Promise.all([
                crawlerAPIs.crawlHahow({ _keyword: _keyword }),
                crawlerAPIs.crawlCoursera({ _keyword: _keyword }),
            ]);

            const combinedResult = {
                0: hahowResult.data,
                1: courseraResult.data,
            };

            store.dispatch({
                type: "GET_COURSE_LOADED",
                payload: combinedResult,
            });
        } catch (error) {
            store.dispatch({ type: "GET_COURSE_ERROR", payload: error.message });
        }
    }, []);

    const courseMethods = {
        handleGetCourseraList,
        handleGetHahowList,
        handleGetAllCourses
    };
    return courseMethods;
}

export default useGetCrawlerCourse