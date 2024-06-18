import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import Carousel from "react-elastic-carousel";

import Card from 'pages/Home/components/ProfileCard/TeamCard';
import Haward from 'dist/image/teammate/haward.jpg';
import Tim from 'dist/image/teammate/tim.png';
import John from 'dist/image/teammate/john.jpg';
import Alan from 'dist/image/teammate/alan.jpg';
import Pin_hao from 'dist/image/teammate/PIN-HAO.jpg';
import Ryan from 'dist/image/teammate/Ryan.jpg';
import theme from 'components/theme';

const palette = 'home';

const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 3 },
];

const Profile = () => {
    const carouselRef = React.useRef(null);
    let resetTimeout;

    return (
        <ThemeProvider theme={cardTheme}>
            <Grid container className={sectionTitle(theme[palette])}>
                <Typography variant="h4" component="div" className='team-title'>
                    <Box fontWeight="fontWeightBold" color={theme[palette]['text']['dark']}>
                        OUR TEAM
                    </Box>
                </Typography>
            </Grid>
            <div className={style(theme[palette])}>
                <Carousel
                    breakPoints={breakPoints}
                    ref={carouselRef}
                    enableAutoPlay={true}
                    showArrows={false}
                    autoPlaySpeed={5000}
                    transitionMs={1000}
                    onNextEnd={({ index }) => {
                        clearTimeout(resetTimeout);
                        resetTimeout = setTimeout(() => {
                            carouselRef?.current?.goTo(0);
                        }, 5000); // same time
                    }}
                >
                    {[
                        { teammate: "John Lin", content: "全端開發｜Python開發", img: John },
                        { teammate: "Alan", content: "推薦系統演算法", img: Alan },
                        { teammate: "Tim Chen", content: "文字探勘", img: Pin_hao },
                        { teammate: "Ryan", content: "文字探勘", img: Ryan },
                        { teammate: "Haward", content: "Mentor", img: Haward },
                        { teammate: "Tim", content: "Mentor", img: Tim },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} px={1} py={1} key={index} style={{ width: "100%" }}>
                            <Card data={item} />
                        </Grid>
                    ))}
                </Carousel>
            </div>
        </ThemeProvider>
    )
}

export default Profile


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
                    padding: "20px 10px 10px 10px",
                    minHeight: "240px"
                }
            },
        }
    },
});


const sectionTitle = (palette) => css`
justify-content: center;
padding: 5rem 0;
.team-title{
    color:${palette['primary']};
}

`

const style = (palette) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: 0 auto;

  .rec-pagination button{
    box-shadow: none;
    background:white;   
    width:12px ;
    height:12px ;
    border-radius: 20px;
    &.eVXyLj{
        background: white;
        width:24px ;
    }
  }

  @media screen and (max-width: 1200px) {
    width: 88%;
  }

  @media screen and (max-width: 900px) {
    width: 93%;
  }

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`