import axios from "axios";
import baseUrl from "utils/getBaseURL";

const getSpotDetail = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/getSpotDetail`,
        data: _data
    });
};


const getSpotInfo = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/getSpotInfo`,
        data: _data
    });
};

const searchSpot = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/searchSpot`,
        data: _data
    });
};


// const userSignOut = () => {
//    return axios({
//        method: "get",
//        url: `${baseUrl}/signout`
//    });
//};


export { getSpotDetail, getSpotInfo, searchSpot };
