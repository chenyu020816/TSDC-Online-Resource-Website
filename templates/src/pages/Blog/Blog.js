import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Typography, Stack } from '@mui/material';
import { useSelector } from "react-redux";

import theme from 'components/theme';
import Background from 'pages/Home/components/Background';

import Header from 'components/Header/UserHeader';
import Footer from 'pages/Home/components/Footer';
import MultiTagSelector from 'pages/Blog/components/MultiTagSelector';
import BlogSearchInput from 'pages/Blog/components/BlogSearchInput';
import PostCard from 'pages/Blog/components/PostCard';

import * as postAPIs from "apis/post";

const palette = 'home';

const Blog = () => {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        postAPIs.getRelatedPost({ _keyword: '統計系' }).then((res) => {
            if (res['data']['success']) {
                console.log(res['data']['data']);
                setPosts(res['data']['data']);
            }
        })
    }, [])

    return (
        <div className={style(theme[palette])}>
            <div className={homeStyle(theme[palette])}>
                <Header palette={theme[palette]} typr="home" />
                <Grid container className='home-section' >
                    <Grid item sm={4} pl={8}>
                        <Typography className='title' component="div" sx={{ typography: { xs: 'h5', sm: 'h5', md: 'h4', lg: "h3" } }}>
                            <Box fontWeight="fontWeightBold" color={theme[palette]['text']['primary']}>
                                專欄文章
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={8} pr={8}>
                        <Grid container>
                            <Grid item sm={6} px={1}>
                                <MultiTagSelector />
                            </Grid>
                            <Grid item sm={6} px={1}>
                                <BlogSearchInput />
                            </Grid>
                        </Grid>
                        {/* <img className='home-photo' src={homepage} alt='home' /> */}
                    </Grid>
                    <Background />
                </Grid>
                <Grid container px={5} pt={3}>
                    {posts.map((post, index) => (
                        <Grid item sm={6} pt={3} key={index}>
                            <PostCard data={post} />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div className='footer-section'>
                <Footer />
            </div>
        </div>
    )
}

export default Blog

const style = (palette) => css`

.footer-section{
    margin-top: 3rem;
    background:#393939;
}
`

const homeStyle = (palette) => css`
min-height: 100vh;

.home-section{
    height: 250px;
    border-radius: 50px;
    padding: 8rem 0rem 0 0rem ;
    color: black;
    background-color: white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
    .subtitle{
        letter-spacing: 3px;
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
    .home-section{
        padding: 5rem 1rem 0 1rem ;
    }
}

@media screen and (max-width:600px ) {
    .home-section{
        padding: 5rem 1rem 0 1rem ;
    }
}

@media screen and (max-width:400px ) {
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
