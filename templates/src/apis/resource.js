import axios from "axios";
import baseUrl from "utils/getBaseURL";

const courseSuggestList = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/course_suggest_list`,
        data: _data
    });
};

const searchResource = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/search_resource`,
        data: _data
    });
};

const giveRating = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/give_rating`,
        data: _data
    });
};

const recordUserKeyword = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/record_user_keyword`,
        data: _data
    });
};


const recordResourceView = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/record_resource_view`,
        data: _data
    });
};

export { courseSuggestList, searchResource, giveRating, recordUserKeyword, recordResourceView };
