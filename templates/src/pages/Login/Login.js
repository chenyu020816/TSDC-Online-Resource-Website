import React from 'react';
import { useMediaQuery } from "@uidotdev/usehooks";
import { Link, Grid, Toolbar, AppBar, Box, Stack, Typography, Card } from '@mui/material';

import theme from 'components/theme';
import logo from 'dist/image/logo.png';
import LoginInput from 'pages/Login/components/LoginInput';

const palette = 'Auth';

const Login = () => {
    const matchDownSM = useMediaQuery("only screen and (max-width : 900px)");

    return (
        <Box style={container}>
            <AppBar position="static" style={{ background: "transparent", boxShadow: "none" }}>
                <Toolbar>
                    <Link href="./" underline="none">
                        <img className='logo-icon' width="130px" src={logo} alt='YFCII' />
                    </Link>
                </Toolbar>
            </AppBar>
            <Grid item xs={12}>
                <Grid
                    item
                    xs={12}
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: { xs: 'calc(100vh - 110px)', sm: 'calc(100vh - 118px)' } }}
                >
                    <Card sx={{ width: { xs: "90%", sm: "500px" }, borderRadius: "10px", boxShadow: "0px 0px 28px 0px rgba(0, 0, 0, 0.14)" }}>
                        <Grid item py={7} sx={{ px: { xs: 2.5, sm: 5 } }}>
                            <Stack direction='row' justifyContent='space-between' alignItems="baseline" mb={3}>
                                <Typography variant="h5" color={theme[palette]['dark']} fontWeight="700" >
                                    登入
                                </Typography>
                                <Link href="./register" underline="none">
                                    <Typography variant="body1" color={theme[palette]['primary']} fontWeight="700">
                                        沒有帳號嗎？
                                    </Typography>
                                </Link>
                            </Stack>
                            <LoginInput />
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            <Grid item xs={12} px={3} >
                <Stack
                    direction={matchDownSM ? 'column' : 'row'}
                    justifyContent={matchDownSM ? 'center' : 'space-between'}
                    spacing={2}
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                >
                    <Typography variant="subtitle2" color={theme[palette]['lightdark']} component="span" >
                        Created By&nbsp;
                        <Link href="#" underline="none">
                            <Typography component="span" variant="subtitle2" color={theme[palette]['primary']} target="_blank">
                                YFCII&nbsp;
                            </Typography>
                        </Link>
                        &copy;2024 All rights reserved.
                    </Typography>
                </Stack>
            </Grid>
        </Box>
    )
}

export default Login

const container = {
    position: "absolute",
    height: '100vh',
    width: '100vw',
    backgroundImage: 'linear-gradient(to left bottom, #ffffff, #f7faff, #f1f6ff, #d0ddff, #bcccff)'
    // backgroundImage: 'linear-gradient(to left bottom, #ffffff, #fff9ff, #fff2f1, #fff3d0, #feffbc)'
}