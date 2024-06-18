const baseUrl = process.env.REACT_APP_ENV === "production"
    ? 'https://no-menu.herokuapp.com/'
    //? 'https://no-menu-test-f7d73a71c236.herokuapp.com/'
    : 'http://127.0.0.1:8000';

export default baseUrl;
