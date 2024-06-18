import React from 'react';
import { css, cx } from '@emotion/css/macro';
import { useMediaQuery } from "@uidotdev/usehooks";
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

import video from './video/nomenu.mp4';
import theme from 'components/theme';

const palette = 'home';

const Feature = () => {
    const progressBarRef = React.createRef();
    const [tab, setTab] = React.useState(1);
    const matchDownLg = useMediaQuery("only screen and (max-width : 1200px)");

    const handleClickCard = (tab) => {
        setTab(tab);
    }

    const handleTimeUpdate = (event) => {
        if (Math.round(event.target.currentTime) === 0 && !video.paused) setTab(1);
        if (Math.round(event.target.currentTime) === 6 && !video.paused) setTab(2);
        if (Math.round(event.target.currentTime) === 15 && !video.paused) setTab(3);

        const progressBar = progressBarRef.current;
        const progressPercentage = (event.target.currentTime / event.target.duration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    };

    return (
        <ThemeProvider theme={cardTheme}>
            <div className={featureStyle(theme[palette])}>
                <Grid item py={8} sx={{ px: { xs: 2, sm: 5, md: 10 } }}>
                    <Grid container direction="column">
                        <Typography variant="h4" component="div" className='section-title'>
                            <Box fontWeight="fontWeightBold" color={theme[palette]['text']['dark']}>
                                NoMenu如何運作？
                            </Box>
                        </Typography>
                        <Typography pt={2} className='subtitle2' variant="body1" component="div" color={theme[palette]['text']['lightdark']}>
                            Nomenu利用詞向量技術分析各景點的評論資訊，並利用推薦演算法為您推薦更多景點。
                        </Typography>
                    </Grid>
                    <Grid container sx={{ py: { xs: 3, sm: 8, md: 8 } }}>
                        <Grid item md={12} lg={7} >
                            <div className="video-container">
                                <video className='nomenu-video' preload="auto" playsInline autoPlay muted loop onTimeUpdate={handleTimeUpdate}>
                                    <source src={video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="progress-bar">
                                    <div className="progress-bar-inner" ref={progressBarRef}></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={12} lg={5} >
                            {matchDownLg ? (
                                <Grid container sx={{ pt: { xs: 1, sm: 3, md: 3 } }}>
                                    {[
                                        {
                                            title: "Step1：新增行程計畫",
                                            content: "登入後，於行程列表新增行程計畫。",
                                            icon: <AddCircleIcon className={cx('icon', tab === 1 ? '' : "active")} />
                                        },
                                        {
                                            title: "Step2：了解旅遊傾向",
                                            content: "Nomenu利用詞向量技術分析各景點的評論資訊。透過選擇旅遊縣市、景點標籤，讓Nomenu為你推薦可能感興趣的景點。",
                                            icon: <BarChartIcon className={cx('icon', tab === 2 ? '' : "active")} />
                                        },
                                        {
                                            title: "Step3：規劃行程順序",
                                            content: "利用推薦演算法持續向你提供更多景點選擇。拖曳景點卡片可調整行程順序。",
                                            icon: <AirplanemodeActiveIcon className={cx('icon', tab === 3 ? '' : "active")} />
                                        },
                                    ].map((item, index) => (
                                        <Grid item xs={12} sm={6} md={4} px={1} py={1} key={index}>
                                            <Card className='step-card'>
                                                <CardContent className='sm-card-container'>
                                                    <Box className="icon-box">
                                                        <div className={cx('icon-bg', tab === index + 1 ? '' : "active")}>
                                                            {item['icon']}
                                                        </div>
                                                    </Box>
                                                    <Typography className={cx('card-title', tab === index + 1 ? '' : "active2")} gutterBottom variant="subtitle1" component="div" >{item['title']}</Typography>
                                                    <Typography className={cx('card-content', tab === index + 1 ? '' : "active2")} variant="body2" color="text.secondary">{item['content']}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Grid container direction="column" gap={1.5} >
                                    <Card onClick={() => handleClickCard(1)}>
                                        <CardContent>
                                            <Typography className={cx('card-title', tab === 1 ? '' : "active")} gutterBottom variant="subtitle1" component="div" >Step1：新增行程計畫</Typography>
                                            <Typography className={cx('card-content', tab === 1 ? '' : "active")} variant="body2" color="text.secondary">登入後，於行程列表新增行程計畫。</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card onClick={() => handleClickCard(2)}>
                                        <CardContent>
                                            <Typography className={cx('card-title', tab === 2 ? '' : "active")} gutterBottom variant="subtitle1" component="div">Step2：了解旅遊傾向</Typography>
                                            <Typography className={cx('card-content', tab === 2 ? '' : "active")} variant="body2" color="text.secondary">Nomenu利用詞向量技術分析各景點的評論資訊。透過選擇旅遊縣市、景點標籤，讓Nomenu為你推薦可能感興趣的景點。</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card onClick={() => handleClickCard(3)}>
                                        <CardContent>
                                            <Typography className={cx('card-title', tab === 3 ? '' : "active")} gutterBottom variant="subtitle1" component="div">Step3：規劃行程順序</Typography>
                                            <Typography className={cx('card-content', tab === 3 ? '' : "active")} variant="body2" color="text.secondary">利用推薦演算法持續向你提供更多景點選擇。拖曳景點卡片可調整行程順序。</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </ThemeProvider>
    )
}

export default Feature

const cardTheme = createTheme({
    components: {
        // Name of the component
        MuiCard: {
            styleOverrides: {
                // Name of the slot
                root: {
                    cursor: "pointer",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 15px 0px rgba(95, 89, 89, 0.15)",
                }
            },
        },
        MuiCardContent: {
            styleOverrides: {
                // Name of the slot
                root: {
                    padding: "14px 14px 14px",
                    "&:last-child": {
                        padding: "14px"
                    }
                }
            },
        },
    },
});


const featureStyle = (palette) => css`
.sm-card-container{
    min-height: 300px;
    overflow: hidden;
}

.icon-box{
    display: flex;
    justify-content: center;
    margin: 20px 0;

    .icon-bg{
        height: 35px;
        width: 35px;
        padding: 8px;
        background:#FEE9BF;
        border-radius: 5px;
        transform: rotate(45deg);
        transition: all 0.3s ease;
        .icon{
            width: 35px;
            height: 35px;
            color: ${palette['primary']};
            transform: rotate(-45deg);
            transition: all 0.3s ease;
            &.active{
                transition: all 0.3s ease;
                color: #ababab;
            }
        }

        &.active{
            transition: all 0.3s ease;
            background:#D9D9D9 ;
        }
    }
}

.subtitle2{
    letter-spacing: 3px;
}

.video-container{ 
    width: 90%;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 0 0 2px rgba(0,0,0,.08), 0 4px 24px rgba(0,0,0,.08);
}

.nomenu-video{
    clip-path: inset(0px 0.5px);
    width: 100%;
}

.step-card{
    transition: all 0.3s ease;
    &:hover{
        transition: all 0.3s ease;
        transform: translateY(-15px);
    }
}

.card-title{
    margin: 0px;
    text-align: center;
    font-weight: 700;
    color: ${palette['primary']};
    transition: all 0.3s ease;
    &.active{
        color: ${palette['text']['dark']};
    }
    &.active2{
        color: #BFBFBF;
    }
}

.card-content{
    text-align: center;
    letter-spacing: 3px;
    margin-top: 6px;
    max-height: 100px;
    overflow: hidden;
    transition: all 0.3s ease;
    &.active{
        max-height: 0;
    }
    &.active2{
        color: #BFBFBF;
    }
}

.progress-bar {
  width: 100%;
  height: 3px; 
  margin-top: -5px;
  background-color: #ccc; 
  position: relative;
}

.progress-bar-inner {
  height: 100%;
  background-color: ${palette['primary']}; 
  width: 0; 
  transition: width 0.3s ease; 
}

@media screen and (max-width: 1200px) {
    .video-container{
        width: 100%;
    }
}

@media screen and (max-width: 900px) {
    .sm-card-container{
        min-height: 250px;
    }   
}

@media screen and (max-width: 600px) {
    .sm-card-container{
        min-height: 200px;
    }   
}

@media screen and (max-width: 450px) {
    .section-title{
        font-size: 20px;
    }   
    .subtitle2{
        font-size: 14px;
    }
    .icon-box{
    .icon-bg{
        height: 30px;
        width: 30px;
        padding: 5px;
        .icon{
            width: 30px;
            height: 30px;
        }
    }
}

}
`