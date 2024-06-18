import React from 'react';
import { css } from '@emotion/css/macro';
import { Typography, CardMedia } from '@mui/material';

const ShowCard = ({ data }) => {
    return (
        <div className={card()}>
            <CardMedia
                component="img"
                alt="place photo"
                height="100"
                width="200"
                image={data['url']}
                className='card-media'
            />
            <Typography className='plan-name' variant="subtitle2" component="span">{data['name']}</Typography>
        </div>
    )
}

export default ShowCard

const card = () => css`
width: 200px;
.card-media{
    border-radius: 10px;
    filter:brightness(40%);
}
.plan-name{
    position: relative;
    bottom: 30px;
    left: 12px;
    color: white;
    z-index: 100;
    color: white;
    font-size: 14px;
    letter-spacing: 3px;
    font-weight: 700;
}
`