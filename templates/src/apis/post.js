import axios from "axios";
import baseUrl from "utils/getBaseURL";

const getRelatedPost = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/get_related_post`,
        data: _data
    });
};

export { getRelatedPost };
