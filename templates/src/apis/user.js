import axios from "axios";
import baseUrl from "utils/getBaseURL";

/* const getUserDetail = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/getUserDetail`,
        data: _data
    });
};

const updateUserInfo = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/updateUserInfo`,
        data: _data
    });
};
 */
const userSignUp = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/user_signup`,
        data: _data
    });
};

const userLogin = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/user_login`,
        data: _data
    });
};

/* const commentSubmit = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/commentSubmit`,
        data: _data
    });
};

const getTagHistory = (_data) => {
    return axios({
        method: "post",
        url: `${baseUrl}/getTagHistory`,
        data: _data
    });
}; */

export { userSignUp, userLogin };
