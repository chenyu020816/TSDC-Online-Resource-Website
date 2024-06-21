import React from 'react';
import { cx } from '@emotion/css/macro';
import { useSelector } from "react-redux";
import Chip from '@mui/material/Chip';
import { ThemeProvider, createTheme } from '@mui/material';
import theme from 'components/theme';

const palette = 'home';

const TagChip = ({ content }) => {

    return (
        <ThemeProvider theme={cardTheme}>
            <Chip label={content} variant="outlined" /* onClick={handleClick}  */ />
        </ThemeProvider>
    )
}
//array.includes(content)
export default TagChip

const cardTheme = createTheme({
    components: {
        MuiChip: {
            styleOverrides: {
                root: {
                    height: "25px",
                    color: theme[palette]['primary'],
                    border: "1.8px solid",
                    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
                }
            }
        }
    },
});