import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';


export default function BlogSearchInput() {
    const [inputKeyword, setInputKeyword] = React.useState([]);

    const handleChange = (event) => {
        setInputKeyword(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" value={inputKeyword} onChange={handleChange} />
            </FormControl>
        </div>
    );
}
