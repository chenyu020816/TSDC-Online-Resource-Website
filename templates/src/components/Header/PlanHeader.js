import React from 'react';
import { css } from '@emotion/css/macro';
import { useMediaQuery } from "@uidotdev/usehooks";
import { Link, IconButton, Toolbar, AppBar, Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TuneIcon from '@mui/icons-material/Tune';

import logo from 'dist/image/logo.png';
import HeaderSearchBar from 'components/Header/components/HeaderSearchBar';

const createPlan = {
    background: "transparent",
    boxShadow: "none",
}

const plan = {
    background: "white",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.1)",
}

const PlanHeader = (props) => {
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const createCustomTheme = (page) => {
        return createTheme({
            components: {
                MuiAppBar: {
                    styleOverrides: {
                        root: page === "CreatePlan" ? createPlan : plan
                    },
                }
            }
        });
    };

    const cardTheme = createCustomTheme(props.palette);

    return (
        <ThemeProvider theme={cardTheme}>
            <div className={style(props.palette)}>
                <AppBar position="static" >
                    <Toolbar>
                        <Box >
                            <Link href="./" underline="none">
                                <img className='logo-icon' src={logo} alt='Nomenu' />
                            </Link>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1 }}
                        ></Typography>
                        {props.searchbar && !isSmallDevice ? <HeaderSearchBar /> : ""}
                        <Box ml={1.5} mr={1.5}>
                            <IconButton variant="soft" sx={iconButtonStyle} onClick={() => props.setOpenDiolog(true)}>
                                <TuneIcon sx={iconStyle} />
                            </IconButton>
                        </Box>
                        <Link href='./userPlan' underline="none">
                            <IconButton variant="soft" sx={iconButtonStyle}>
                                <HomeIcon sx={iconStyle} />
                            </IconButton>
                        </Link>
                    </Toolbar>
                </AppBar>
            </div>
        </ThemeProvider>
    )
}

export default PlanHeader

const iconStyle = {
    color: "#FFBD83",
    fontSize: "28px",
}

const iconButtonStyle = {
    width: 40,
    height: 40,
    padding: 0,
    borderRadius: 2,
    borderColor: "primary.main",
    background: "#FFF1D4",
    "&:hover": {
        background: "#ffecc5"
    }
}

const style = () => css`
.logo-icon{
    width: 130px;
}
`;