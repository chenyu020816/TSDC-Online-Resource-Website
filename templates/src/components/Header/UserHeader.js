import React from 'react';
import { HiMenu } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { cx, css } from '@emotion/css/macro';
import { Button, Link } from '@mui/material';
import logo from 'dist/image/logo.png';
import 'dist/scss/navbar.scss';

const page = [
  {
    name: '首頁',
    url: '/',
  },
  {
    name: '關於我們',
    url: '/#about',
  }
];

const UserHeader = (props) => {
  const [barClass, setBarClass] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false)

  const handleChangeBar = (index) => () => setBarClass(index);

  const userSignOut = () => {
    if (!isLogin) return

    localStorage.removeItem('NOMENU_LOGGED_IN')
    localStorage.removeItem('NOMENU_USER_NAME')
    localStorage.removeItem('NOMENU_USER_ID')
  }

  React.useEffect(() => {
    setIsLogin(localStorage.getItem('NOMENU_LOGGED_IN'))
  }, [])

  return (
    <div className={style(props.palette)}>
      <header className="header">
        <div className="logo">
          <Link href="/" underline="none">
            <img src={logo} alt='Nomenu' />
          </Link>
        </div>
        <nav className="navbar">
          <ul className={cx(barClass ? 'active' : '')}>
            {page.map((item, index) => (
              <li href="#" key={index}>
                <a href={item.url} >
                  {item.name}
                </a>
              </li>
            ))}
            {isLogin ? (
              <li href="#">
                <a href="./userPlan" >
                  個人資訊
                </a>
              </li>
            ) : ("")}
            <li className="sm-login" >
              <a href={isLogin ? "./" : "./login"}
                onClick={userSignOut}>
                {isLogin ? "登出" : "登入"}
              </a>
            </li>
          </ul>
        </nav>
        <nav className="login">
          <Button className={cx(barClass ? 'active' : '')} variant="contained" onClick={userSignOut}>
            <Link href={isLogin ? "./" : "./login"} underline="none">
              {isLogin ? "登出" : "登入"}
            </Link>
          </Button>
        </nav>
        <div className="menu-btn">
          {!barClass ? (
            <HiMenu className="menu-icon" onClick={handleChangeBar(true)} />
          ) : (
            <IoClose
              style={{ color: 'white' }}
              onClick={handleChangeBar(false)}
            />
          )}
        </div>
      </header>
    </div>
  );
};

export default UserHeader;

const style = (palette) => css`
  .header {
    position: fixed;
    display: flex;
    justify-content: space-between;
    width: 100vw;
    color: ${palette.navbar.text.primary};
    background-color: ${palette.navbar.background};
    border-bottom: 1px solid #eeeeee;
    box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.05);
    z-index: 1000;

    .logo {
        padding: 10px 25px ;
        img{
            width: 130px;
        }
    }

    .navbar {
      padding: 10px 25px ;
      display: flex;
      align-items: center;
      ul {
        display: flex;
        list-style-type: none;
        justify-content: space-around;
        width: 100%;
        li a {
          text-decoration: none;
          white-space: nowrap;
          letter-spacing: 5px;
          color: ${palette.navbar.text.primary};
          margin: 1rem 1rem;
          font-size: 18px;
          font-weight: bold;
          transition: 0.3s ease;
          cursor: pointer;
          &:hover {
            color: ${palette.navbar.text.secondary};
          }
        }
        .sm-login{
            display: none;
        }
      }
    }

    .login{
        width:5rem;
        padding: 10px 25px ;
        display: flex;
        align-items: center;
         .MuiButtonBase-root {
          height: 2rem;
          font-size: 16px;
          text-align: center;
          background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
          box-shadow: inset 0 0 0 0 ${palette.navbar.text.secondary} ;
          transition: all 0.5s;
          font-weight: bold;
          width: 90%;
          margin: 0 auto;
          a{
            color: white;
          }
          &:hover{
            transition: all 0.5s;
            transform: scale(1.1);
            box-shadow:inset -3.5em 0 0 0 ${palette.navbar.text.secondary}
            ,inset 3.5em 0 0 0 ${palette.navbar.text.secondary}; 
             
          }
        } 
    }
  }

  .menu-btn {
    color: ${palette.dark};
    font-size: 23px;
    cursor: pointer;
    display: none;
    transition: 0.5s ease;
    &.active {
      color: white;
      transition: 0.5s ease;
    }
  }

  @media screen and (max-width: 768px) {
    .menu-btn {
      display: block;
      position: fixed;
      margin-top: -5px;
      right: 1rem;
      top: 1.5rem;
      z-index: 999;
      .menu-icon {
        margin: auto 0;
      }
    }

    .header {
      .navbar ul {
        z-index: 20;
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100vh;
        width: 100%;
        left: -100%;
        top: 0;
        background: #2d2c2c;
        text-align: center;
        transition: all 0.3s ease;
        &.active {
          left: 0;
        }
        .sm-login{
            display: block;
        }
        li {
          a {
            display: inline-block;
            margin: 20px 0;
            font-size: 25px;
            color: white;
          }
        }
      }

      .login{
        display: none;
      }
    }
  }
`;
