import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";

const theme = createTheme();

const ForgotPassword = () => {

    const [questions, setQuestion] = React.useState('');
    const [resetPasswordEnable, setResetPasswordEnable] = React.useState(false);
    const [useremail,setUseremail] = React.useState('');
    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    }

    const [responsedata, setResponsedata] = React.useState({});
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setUseremail(data.get("username"));
        console.log({
            username: data.get("username"),
        });
        axios
            .get(`http://localhost:5000/forgotpassword/${data.get("username")}`)
            .then((response) => {
                if (response.data['response'] === 200) {
                    setResponsedata(response.data);
                }

            })
            .catch((err) => {
                console.log(err);
            });
    };

    const validateAnswers = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            question: data.get("questions"),
            answer: data.get("securityAnswer")
        });
        axios
            .post(`http://localhost:5000/forgotpassword/${data.get("username")}`, {
                question: data.get("questions"),
                answer: data.get("securityAnswer")
            })
            .then((response) => {
                if (response.data['response'] === 200) {
                    alert("answer is correct")
                    setResetPasswordEnable(true)
                }else{
                    alert("Please provide correct answers")
                }


            })
            .catch((err) => {
                console.log(err);
            });
        
    };

    const updatePassword=(event)=>{
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            password:data.get('password'),
            reenterpassword : data.get('reenterpassword')
        })
        axios
            .post(`http://localhost:5000/updatepassword/${useremail}`, {
                newpassword:data.get('password')
            })
            .then((response) => {
                if (response.data['response'] === 200) {
                    alert("password updated successfully")
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {resetPasswordEnable? <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Reset Password
                        <br />
                    </Typography>
                    <Typography component="h6">
                        Enter your username and we will help you reset your password.
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={updatePassword}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            type="password"
                            id="password"
                            label="Enter Password"
                            name="password"
                            autoComplete="password"
                            autoFocus
                        />
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            type="password"
                            id="reenterpassword"
                            label="Re-Enter Password"
                            name="reenterpassword"
                            autoComplete="reenterpassword"
                            autoFocus
                        />
                        <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Update Password
                                </Button>
                        
                    </Box>
                </Box>
                :
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Reset Password
                        <br />
                    </Typography>
                    <Typography component="h6">
                        Enter your username and we will help you reset your password.
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={Object.keys(responsedata).length === 0 ? handleSubmit : validateAnswers}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        {
                            Object.keys(responsedata).length === 0 ? <p></p> : <Select defaultValue='User'
                                labelId="demo-simple-select-questions"
                                id="demo-simple-select-security"
                                value={questions}
                                label="Type"
                                name="questions"
                                onChange={handleQuestionChange}
                            >
                                <MenuItem value={'What was the name of your high school?'}>What was the name of your high school?</MenuItem>
                                <MenuItem value={'What city were you born in?'}>What city were you born in?</MenuItem>
                                <MenuItem value={'What street did you live on in third grade?'}>What street did you live on in third grade?</MenuItem>
                            </Select>
                        }

                        {
                            Object.keys(responsedata).length === 0 ? <p></p> : <TextField
                                required
                                fullWidth
                                name="securityAnswer"
                                label="securityAnswer"
                                type="securityAnswer"
                                id="securityAnswer"
                                autoComplete="security-answer"
                            />
                        }

                        {
                            Object.keys(responsedata).length === 0 ? <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button> :
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Validate Answer
                                </Button>
                        }
                    </Box>
                </Box>}
            </Container>
        </ThemeProvider>
    );
};

export default ForgotPassword;