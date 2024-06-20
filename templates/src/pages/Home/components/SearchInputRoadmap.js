import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import StartButton from 'pages/Home/components/SearchButtonRoadmap';
import { Box } from '@mui/material';
import useGetKeywordList from 'hook/useGetSearchKeyword';

const CustomizedInputBase = () => {
    const { handleAddKeyword } = useGetKeywordList();
    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        handleAddKeyword(event.target.value);
    };

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "90%", boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.15)" }}
        >
            <IconButton sx={{ p: '10px' }} aria-label="menu" disabled>
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '18px' }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
                value={inputValue}
                onChange={handleInputChange}
            />
            <Box sx={{ p: '10px' }} aria-label="search">
                <StartButton />
            </Box>
        </Paper>
    );
}


export default CustomizedInputBase