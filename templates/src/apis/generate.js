import axios from "axios";
import baseUrl from "utils/getBaseURL";

const generateRoadmap = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/generate_roadmap`,
        data: _data
    });
};


export {
    generateRoadmap,
};