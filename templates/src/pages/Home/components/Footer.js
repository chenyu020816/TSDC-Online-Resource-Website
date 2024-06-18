import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Toolbar, Typography, Link } from '@mui/material';

import theme from 'components/theme';

const palette = 'home';

const Footer = () => {
    return (
        <div className={footer()}>
            <Toolbar className='footer-container'>
                <Box >
                    <Typography className='footer-content' variant="subtitle2" color={theme[palette]['light']} component="span" style={{ letterSpacing: "2px" }}>
                        Created By&nbsp;
                        <Link href="#" underline="none">
                            <Typography component="span" variant="subtitle2" color={theme[palette]['primary']} target="_blank">
                                YFCII&nbsp;
                            </Typography>
                        </Link>
                        &copy;&nbsp;2024 All rights reserved.
                    </Typography>
                </Box>
            </Toolbar>
        </div>
    )
}

export default Footer

const footer = () => css`
.footer-container{
    justify-content: center;
}

@media screen and (max-width:600px ){
    .footer-content{
        font-size: 12px;
    }
}

@media screen and (max-width:500px ){
    .footer-content{
        font-size: 12px;
    }
}

`