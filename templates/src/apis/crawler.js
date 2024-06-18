import axios from "axios";
import baseUrl from "utils/getBaseURL";

const crawlNtuOcw = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/crawl_ntu_ocw`,
        data: _data
    });
};

const crawlCoursera = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/crawl_coursera`,
        data: _data
    });
};

const crawlHahow = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/crawl_hahow`,
        data: _data
    });
};


export {
    crawlNtuOcw,
    crawlCoursera,
    crawlHahow
};