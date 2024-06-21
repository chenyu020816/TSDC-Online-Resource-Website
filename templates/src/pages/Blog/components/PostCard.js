import * as React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Microlink from '@microlink/react';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import PropTypes from 'prop-types';
import { number } from 'yup';

const palette = 'home';

/* Rating */
const StyledRating = muiStyled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};

/* */

const ExpandMore = muiStyled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function extractUrls(body) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return body.match(urlRegex);
}

function convertDateString(dateString) {
    // 解析日期字符串
    const date = new Date(dateString);

    // 獲取月、日、年
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    // 格式化結果
    return `${month} ${day}, ${year}`;
}

function customCardContent(text) {
    const truncatedBody = text.length > 100 ? `${text.substring(0, 100)}...` : text;

    return truncatedBody.replace(/\n/g, '<br>');
}

const PostCard = ({ data }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [avatarColor] = React.useState(getRandomColor());
    const [ratingValue, setRatingValue] = React.useState(null);
    const [urls, setUrls] = React.useState([]);

    const handleGiveRating = (event) => {
        console.log(event.target.value);
        setRatingValue(Number(event.target.value))
    }

    React.useEffect(() => {
        const extractedUrls = extractUrls(data.body);
        setUrls(extractedUrls);
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <ThemeProvider theme={cardTheme}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: avatarColor, width: 45, height: 45 }} aria-label="recipe">
                            {data['user_name'].charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {data['title']}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body2" color="textSecondary" component="div">
                            {data['user_name']}
                            <span style={{ margin: '0 8px' }}>•</span>
                            {convertDateString(data['post_at'])}
                        </Typography>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: customCardContent(data['body']) }} />
                </CardContent>
                <Microlink url={urls[0]} direction="rtl" />
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <Typography variant="body1" fontWeight={600}>
                            查看全文👉
                        </Typography>
                        {/* <FavoriteIcon /> */}
                    </IconButton>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography dangerouslySetInnerHTML={{ __html: data['body'].replace(/\n/g, '<br>') }} />
                    </CardContent>
                    <CardActions disableSpacing>
                        <StyledRating
                            name="highlight-selected-only"
                            value={ratingValue}
                            onChange={handleGiveRating}
                            IconContainerComponent={IconContainer}
                            getLabelText={(value) => customIcons[value].label}
                            highlightSelectedOnly
                        />
                    </CardActions>
                </Collapse>
            </Card>
        </ThemeProvider>
    );
}

export default PostCard



const cardTheme = createTheme({
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    height: "100%",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                }
            }
        }
    },
});