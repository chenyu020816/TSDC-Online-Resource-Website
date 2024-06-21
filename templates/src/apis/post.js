import axios from "axios";
import baseUrl from "utils/getBaseURL";

const getRelatedPost = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/get_related_post`,
        data: _data
    });
};

const getPostKeyword = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/get_post_keyword`,
        data: _data
    });
};


const createUserPost = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/create_user_post`,
        data: _data
    });
};

export {
    getRelatedPost,
    getPostKeyword,
    createUserPost
};
