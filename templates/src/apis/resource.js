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

export { courseSuggestList, searchResource };
