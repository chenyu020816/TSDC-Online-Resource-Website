import React from 'react';
import { css } from '@emotion/css/macro';
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Typography, Card, CardContent, Chip, Skeleton, Button } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CardMedia from '@mui/material/CardMedia';
import { ThemeProvider, createTheme } from '@mui/material';
import { AiFillStar } from 'react-icons/ai';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import theme from 'components/theme';
import { hover } from '@testing-library/user-event/dist/hover';
import { transform } from 'framer-motion';
import transitions from '@material-ui/core/styles/transitions';

const palette = 'home';


const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff6d75',
    },
});


const CourseCardRoadMap = ({ data }) => {
    const [ratingValue, setRatingValue] = React.useState(null);

    const handleGiveRating = (event) => {
        setRatingValue(Number(event.target.value))
    }

    return (
        <ThemeProvider theme={cardTheme}>
            <Grid item pt={0.75} pb={0.75} sx={{ height: '100%' }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={data.image_url ? data.image_url : "#"}
                        title="green iguana"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="left">
                            <a href={data.url ? data.url : "#"} style={{ textDecoration: 'none', height: '100%' }}>
                                <Typography pr={2} sx={{ typography: { sm: 'h6', xs: 'body1' } }} variant="h5" component="div" >
                                    <Box fontWeight="fontWeightBold" color={theme[palette]['dark']}>
                                        {data.resource_name ? data.resource_name : "--"}
                                    </Box>
                                </Typography>
                            </a>
                        </Stack>
                        <Stack direction="row" justifyContent="left" alignItems="center" gap={2}>
                            <Stack direction="row" justifyContent="left" alignItems="center" py={1}>
                                <AiFillStar style={iconStarStyle} />
                                <Typography variant="subtitle1" component="div" pl={0.5}>{data.score ? data.score : "--"}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="left" alignItems="center" py={1}>
                                <SupervisorAccountIcon style={iconPeopleStyle} />
                                <Typography variant="subtitle1" component="div" pl={0.5}>{data.num_of_purchases ? data.num_of_purchases : "--"}</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                            <Typography pt={1} letterSpacing={1} variant="h6" component="div" fontWeight={600} color={theme[palette]['dark']}>
                                {data.price ? `NT $${data.price}` : ""}
                            </Typography>
                            <StyledRating
                                name="customized-color"
                                getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                precision={0.5}
                                icon={<FavoriteIcon fontSize="inherit" />}
                                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                value={ratingValue}
                                onChange={handleGiveRating}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default CourseCardRoadMap


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
                        transform: "scale(1.03)",
                    }
                }
            }
        }
    },
});