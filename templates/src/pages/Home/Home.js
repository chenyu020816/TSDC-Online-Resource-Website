import React from 'react';
import { useSelector } from "react-redux";
import { css } from '@emotion/css/macro';
import { Box, Grid, Typography, Skeleton } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import theme from 'components/theme';
import Header from 'components/Header/UserHeader';
import Background from 'pages/Home/components/Background';
import homepage from 'dist/image/illustrator_homepage.png';
import BannerCard from 'pages/Home/components/BannerCard';
import Footer from 'pages/Home/components/Footer';
import SearchInput from 'pages/Home/components/SearchInputRoadmap';
import RoadmapTimeLine from 'pages/Home/components/RoadmapTimeLine';

//import CourseRecommend from 'pages/Home/components/CourseRecommend';

const palette = 'home';

const Home = () => {
    const { roadmap, asyncStatusRoadmap } = useSelector((store) => store.roadmap);
    const [progress, setProgress] = React.useState(100);
    const [buffer, setBuffer] = React.useState(100);

    const progressRef = React.useRef(() => { });

    React.useEffect(() => {
        progressRef.current = () => {
            if (progress >= 90) {
                setBuffer(progress);
            } else {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress((prevProgress) => Math.min(prevProgress + diff, 90));
                setBuffer((prevProgress) => Math.min(prevProgress + diff + diff2, 100));
            }
        };
    }, [progress]);

    React.useEffect(() => {
        if (!asyncStatusRoadmap.loading) {
            setProgress(100);
            setBuffer(100);
        } else {
            setProgress(0);
            setBuffer(10);
        }
    }, [roadmap]);


    React.useEffect(() => {
        const timer = setInterval(() => {
            progressRef.current();
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={style(theme[palette])}>
            <div className={homeStyle(theme[palette])}>
                <Header palette={theme[palette]} typr="home" />
                <Grid container className='home-section'>
                    <Grid item sm={6} pl={8} pt={7}>
                        <Typography className='title' component="div" sx={{ typography: { xs: 'h5', sm: 'h4', md: 'h3', lg: "h2" } }}>
                            <Box fontWeight="fontWeightBold" color={theme[palette]['text']['primary']}>
                                <span className='subtitle'>What do you</span>
                            </Box>
                            <Box fontWeight="fontWeightBold" color={theme[palette]['text']['primary']}>
                                <span className='subtitle'>want to </span> Learn？
                            </Box>
                        </Typography>
                        <Grid container pt={5}>
                            <SearchInput />
                        </Grid>
                    </Grid>
                    <Grid item sm={6} pr={8}>
                        <img className='home-photo' src={homepage} alt='home' />
                    </Grid>
                </Grid>
                <Background />
            </div>
            <Grid container px={8} pt={3} direction="column" alignItems="center">
                <Typography className='title' component="div" sx={{ typography: { xs: 'h5', sm: 'h4', md: 'h3', lg: "h2" } }}>
                    <Box fontWeight="fontWeightBold" color={theme[palette]['text']['dark']}>
                        Roadmap
                    </Box>
                </Typography>
                <Typography className='subtitle2' variant="body1" component="div" fontWeight={600} letterSpacing={3} color={theme[palette]['text']['lightdark']} pt={2}>
                    搜尋感興趣的領域，自動化幫助您生成學習路徑
                    <Box sx={{ width: '100%' }} pt={1}>
                        <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
                    </Box>
                </Typography>
            </Grid>
            <div className='feature-section'>
                {!asyncStatusRoadmap.loading ? (
                    <BannerCard />
                ) : (
                    <Grid container pt={3}>
                        <Skeleton variant="rounded" width="100%" height={400} />
                    </Grid>
                )}
            </div>
            <div className='feature-course-recommend'>
                <Grid container direction="column" alignItems="center">
                    <Grid item sm={12} pt={7} width="80%" >
                        <RoadmapTimeLine />
                    </Grid>
                </Grid>
            </div>
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
.home-photo{
    display: block;
    margin: 0 auto;
    width: 70%;
}

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
    .photo-container{
        height: 380px;
        .home-photo{
            //margin: 2rem auto 0;
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
            //width: 150%;
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
            //width: 200%;
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
