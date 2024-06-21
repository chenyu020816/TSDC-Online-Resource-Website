import React from "react";
import store from "redux/store";
import * as postAPIs from "apis/post";


const useBlogGetPost = () => {

    const handleGetPostDataInit = React.useCallback(async () => {
        store.dispatch({ type: "GET_POST_LOADING" })
        try {
            const result = await postAPIs.getRelatedPost({ _keyword: '' })
            store.dispatch({ type: "GET_POST_LOADED", payload: result['data']['data'] })
        } catch (error) {
            store.dispatch({ type: "GET_POST_ERROR", payload: error.message })
        }
    }, [])

    const methods = {
        handleGetPostDataInit,
    };
    return methods;
}

export default useBlogGetPost