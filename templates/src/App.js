import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from "notistack";
import { Global, css } from '@emotion/react';

import Home from 'pages/Home/Home';
import Login from 'pages/Login/Login';
import Register from 'pages/Register/Register';
import Grow from 'utils/Grow';
import 'dist/scss/home.scss';
import { Provider } from "react-redux";
import store from "redux/store";

function App() {
  const isLogin = localStorage.getItem('NOMENU_LOGGED_IN') === 'true'

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={1} preventDuplicate TransitionComponent={Grow}>
        <Global styles={globalStyles} />
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={isLogin ? <Navigate to="/userPlan" /> : <Login />}></Route>
            <Route path="/register" element={isLogin ? <Navigate to="/userPlan" /> : <Register />}></Route>
          </Routes>
        </Router>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;

const globalStyles = css`
  /* 全域滾動條樣式 */
  /* 修改滾動條軌道的背景色 */
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* 修改滾動條的寬度 */
  ::-webkit-scrollbar {
    width: 4px;
  }

  /* 修改滾動條滑塊的樣式 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #BFBFBF; /* 請替換為你的顏色值 */
  }
`;