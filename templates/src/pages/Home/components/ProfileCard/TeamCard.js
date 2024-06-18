import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Typography, Card, CardContent } from '@mui/material';
import theme from 'components/theme';

const palette = 'home';

const TeamCard = ({ data }) => {
    return (
        <div className={card(theme[palette])}>
            <Card>
                <Box className="image-box">
                    <Box
                        component="img"
                        sx={imgStyle}
                        p={0.5}
                        alt="spots image"
                        src={data['img']}
                    />
                </Box>
                <CardContent>
                    <Typography className="user-name" gutterBottom variant="h6" component="div" >
                        {data['teammate']}
                    </Typography>
                    <Typography className="user-content" variant="body2" color="text.secondary">
                        {data['content']}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default TeamCard

const card = (palette) => css`
transition: all 0.3s ease;
&:hover{
    transition: all 0.3s ease;
    transform: translateY(-15px);
}

.image-box{
    display: flex;
    justify-content: center;
}
.user-name{
    font-weight: 700;
    color:${palette['text']['dark']};
    text-align: center;
}
.user-content{
    font-weight: 700;
    color:${palette['primary']};
    text-align: center;
    letter-spacing: 3px;
}
`

const imgStyle = {
    height: "100px",
    width: "100px",
    borderRadius: '50%',
    objectFit: "cover",
    border: '  3px solid rgb(254, 206, 111)',
}
