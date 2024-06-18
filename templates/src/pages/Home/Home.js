import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Typography } from '@mui/material';

import theme from 'components/theme';
import Header from 'components/Header/UserHeader';
import Background from 'pages/Home/components/Background';
import StartButton from 'pages/Home/components/StartButton';
import homeDemo from 'dist/image/homepage.png';
import SpotsShow from 'pages/Home/components/SpotsShow';
import Feature from 'pages/Home/components/Feature/Feature';
import Profile from 'pages/Home/components/ProfileCard/Profile';
import BannerCard from 'pages/Home/components/BannerCard';
import Contact from 'pages/Home/components/Contact';
import Footer from 'pages/Home/components/Footer';
import * as crawlerAPIs from 'apis/crawler';

const palette = 'home';

const Home = () => {

    React.useEffect(() => {
        crawlerAPIs.crawlHahow({ _keyword: '資料科學' }).then((res) => {
            console.log(res);
        })
    }, [])

    return (
        <div className={style(theme[palette])}>
            <div className={homeStyle(theme[palette])}>
                <Header palette={theme[palette]} typr="home" />
                <Grid container className='home-section'>
                    <BannerCard />
                    {/* <Grid item xs={12} mx={20} sx={{ mx: { sm: 0, md: 5, lg: 20 } }}>
                        {/* <Typography className='title' component="div" sx={{ typography: { xs: 'h5', sm: 'h4', md: 'h4', lg: "h4" } }}>
                            <Box fontWeight="fontWeightBold" textAlign="center" color={theme[palette]['text']['primary']}>
                                NoMenu <span className='subtitle'>讓旅遊更輕鬆</span>
                            </Box>
                        </Typography>
                        <Typography className='subtitle2' variant="body1" component="div" color={theme[palette]['text']['lightdark']}>
                            Nomenu是一個旅遊推薦平台，我們利用詞向量以及推薦模型等技術，提供用戶最合適的景點。讓您可以專注於行程的規劃，而非苦惱於找尋景點。
                        </Typography> */}
                    {/* <Grid container direction="column" alignItems="center" >
                            <StartButton />
                        </Grid>
                    </Grid> */}
                </Grid>
                {/* <Grid container className='photo-container' >
                    <img className='home-photo' src={homeDemo} alt='home' />
                </Grid> */}
                {/* <Background /> */}
            </div>
            {/*             <div className='spotsLine-section'>
                <SpotsShow />
            </div> */}
            {/*             <div className='feature-section'>
                <Feature />
            </div> */}
            {/*             <div className='profile-section' id='about'>
                <Profile />
            </div> */}
            {/* <div className='contact-section'>
                <Contact />
            </div> */}
            <div className='footer-section'>
                <Footer />
            </div>
        </div>
    )
}

export default Home

const style = (palette) => css`
.spotsLine-section{
    overflow: hidden;
    margin-top: 20px;
}

.feature-section{
    background:${palette['bg2']};
}

.profile-section{
    position: relative;
    height: 78vh;
    &::before{
        content: '';
        position: absolute;
        width: 100%;
        background: #FFE7B8;
        clip-path: inset(65% 0 0 0);
        z-index: -1;
        height: 100%;
    }
}

.footer-section{
    margin-top: 3rem;
    background:#393939;
}
`

const homeStyle = (palette) => css`
height: 100vh;
.photo-container{
    overflow: hidden;
    position: absolute;
    height: 470px;
    .home-photo{
        margin: 3.5rem auto 0;
        position: absolute;
        bottom: -10;
        width: 100%;
        left: 50%;
        right: 50%;
        transform: translateX(-50%)!important;
    }
}

.home-section{
    padding: 5rem 1rem 0 1rem ;
    color: black;
    .subtitle{
        letter-spacing: 5px;
        font-weight: 700;
        color: ${palette['text']['dark']};
    }

    .subtitle2{
        letter-spacing: 5px;
        text-align: center;
        margin: 25px 0;
    }
}

@media screen and (max-width:768px ) {
    height: 100vh;
    .photo-container{
        height: 380px;
        .home-photo{
            margin: 2rem auto 0;
        }
    }
    .home-section{
        padding: 5rem 1rem 0 1rem ;
    }
}

@media screen and (max-width:600px ) {
    .photo-container{
        height: 400px;
        .home-photo{
            width: 150%;
        }
    }
    .home-section{
        padding: 5rem 1rem 0 1rem ;
    }
}

@media screen and (max-width:400px ) {
    .photo-container{
        height: 380px;
        .home-photo{
            width: 200%;
        }
    }
    .home-section{
        padding: 5rem 1rem 0 1rem ;
        .title{
            font-size: 20px;
        }
        .subtitle2{
            font-size: 14px;
        }
    }
}
`
