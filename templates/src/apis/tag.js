import axios from "axios";
import baseUrl from "utils/getBaseURL";

const getTagList = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/getTagList`,
        data: _data
    });
};

export { getTagList };
