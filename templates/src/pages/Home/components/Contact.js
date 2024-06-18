import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Typography } from '@mui/material';
import theme from 'components/theme';
import ContactInput from './ContactInput';

const palette = 'home';

const Contact = () => {
    return (
        <div>
            <Grid container className={sectionTitle(theme[palette])}>
                <Typography variant="h4" component="div" className='team-title'>
                    <Box fontWeight="fontWeightBold" >
                        GET IN TOUCH
                    </Box>
                </Typography>
            </Grid>
            <Grid container py={4} sx={{ px: { xs: 1, sm: 5, md: 15, lg: 40 } }}>
                <ContactInput />
            </Grid>
        </div>
    )
}

export default Contact

const sectionTitle = (palette) => css`
justify-content: center;
padding: 6rem 0 3rem 0;
.team-title{
    color:${palette['primary']};
}

`