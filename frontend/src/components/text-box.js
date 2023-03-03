import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function TextFieldSizes() {
    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 10, width: '50ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    //label="Searc"
                    id="outlined-size-small"
                    defaultValue="Search"
                    size="small"
                />
            </div>
        </Box>
    );
}
