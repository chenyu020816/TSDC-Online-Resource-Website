import React from "react";
import store from "redux/store";

const useGetKeywordList = () => {

    const handleAddKeyword = (data) => {
        store.dispatch({ type: "GET_KEYWORD_LOADED", payload: data })
    }

    const keywordMethods = {
        handleAddKeyword
    };
    return keywordMethods;
}

export default useGetKeywordList
