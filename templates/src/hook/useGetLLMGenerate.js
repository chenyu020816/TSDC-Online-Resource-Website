import React from "react";
import store from "redux/store";
import * as generateAPIs from 'apis/generate';

const useGetLLMGenerate = () => {

    const handleGetRoadmapData = React.useCallback(async (_keyword) => {
        store.dispatch({ type: "GET_ROADMAP_LOADING" })
        try {
            const result = await generateAPIs.generateRoadmap({ _keyword: _keyword })
            store.dispatch({ type: "GET_ROADMAP_LOADED", payload: result['data'] })
        } catch (error) {
            store.dispatch({ type: "GET_ROADMAP_ERROR", payload: error.message })
        }
    }, [])

    const methods = {
        handleGetRoadmapData,
    };
    return methods;
}

export default useGetLLMGenerate