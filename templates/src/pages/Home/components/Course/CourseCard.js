import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Stack, Typography, Card, CardContent, Chip, Skeleton, Button } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CardMedia from '@mui/material/CardMedia';
import { ThemeProvider, createTheme } from '@mui/material';
import { AiFillStar } from 'react-icons/ai';

import theme from 'components/theme';
import { hover } from '@testing-library/user-event/dist/hover';
import { transform } from 'framer-motion';
import transitions from '@material-ui/core/styles/transitions';

const palette = 'home';

const SpotPlanCard = ({ data }) => {
    return (
        <ThemeProvider theme={cardTheme}>
            <Grid item pt={0.75} pb={0.75} sx={{ height: '100%' }}>
                <a href={data.url ? data.url : "#"} style={{ textDecoration: 'none', height: '100%' }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image={data.img ? data.img : "#"}
                            title="green iguana"
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Stack direction="row" justifyContent="left">
                                <Typography pr={2} sx={{ typography: { sm: 'h6', xs: 'body1' } }} variant="h5" component="div" >
                                    <Box fontWeight="fontWeightBold" color={theme[palette]['dark']}>
                                        {data.title ? data.title : "--"}
                                    </Box>
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="left" alignItems="center" gap={2}>
                                <Stack direction="row" justifyContent="left" alignItems="center" py={1}>
                                    <AiFillStar style={iconStarStyle} />
                                    <Typography variant="subtitle1" component="div" pl={0.5}>{data.rating ? data.rating : "--"}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="left" alignItems="center" py={1}>
                                    <SupervisorAccountIcon style={iconPeopleStyle} />
                                    <Typography variant="subtitle1" component="div" pl={0.5}>{data.student ? data.student : "--"}</Typography>
                                </Stack>
                            </Stack>
                            <Typography pt={1} letterSpacing={1} variant="h6" component="div" fontWeight={600} color={theme[palette]['dark']}>
                                {data.price ? `NT $${data.price}` : ""}
                            </Typography>
                        </CardContent>
                    </Card>
                </a>
            </Grid>
        </ThemeProvider>
    );
}

export default SpotPlanCard


const iconStarStyle = {
    width: "19px",
    height: "19px",
    color: "rgb(254, 206, 111)"
}

const iconPeopleStyle = {
    width: "24px",
    height: "24px",
    color: "rgb(199, 199, 199)"
}

const cardTheme = createTheme({
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    height: "100%",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    '&:hover': {
                        transform: "scale(1.05)",
                    }
                }
            }
        }
    },
});