import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Typography } from '@mui/material';
import { useSelector } from "react-redux";

import theme from 'components/theme';
import Header from 'components/Header/UserHeader';
import Footer from 'pages/Home/components/Footer';
import SearchInput from 'pages/Search/components/SearchInput';
import CourseRecommend from 'pages/Search/components/CourseRecommend';

const palette = 'home';

const Search = () => {
    const { courseList, asyncStatusGetCourse } = useSelector((store) => store.course);
    const courseArray = Object.values(courseList);
    const tabs = courseArray.map((courseData, index) => {
        return { id: courseData.domain, label: courseData.domain };
    });

    return (
        <div className={style(theme[palette])}>
            <div className={homeStyle(theme[palette])}>
                <Header palette={theme[palette]} typr="home" />
                <Grid container className='home-section' direction="column" alignItems="center">
                    <Grid item sm={12}>
                        <Typography className='title' textAlign="center" component="div" sx={{ typography: { xs: 'h6', sm: 'h5', md: 'h4', lg: "h4" } }}>
                            <Box fontWeight="fontWeightBold" color={theme[palette]['text']['primary']}>
                                <span className='subtitle'>What do you want to</span> Search？
                            </Box>
                        </Typography>
                        {/* <Box fontWeight="fontWeightBold" color={theme[palette]['text']['primary']}>
                        <span className='subtitle'>want to </span> Learn？
                    </Box>
                </Typography> */}

                    </Grid>
                    <Grid container pt={5} sx={{ width: { xs: "100%", sm: "100%", md: "70%" } }} direction="column" alignItems="center">
                        <SearchInput />
                    </Grid>
                </Grid>
            </div>
            <div className='feature-course-recommend'>
                <CourseRecommend courseList={courseList} tabs={tabs} />
            </div>
            <div className='footer-section'>
                <Footer />
            </div>
        </div>
    )
}

export default Search

const style = (palette) => css`
.footer-section{
    margin-top: 3rem;
    background:#393939;
}
`
const homeStyle = (palette) => css`
.home-section{
    padding: 8rem 0rem 0 0rem ;
    color: black;
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
    height: 100vh;
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
