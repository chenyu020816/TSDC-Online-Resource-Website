import React from 'react';
import { css } from '@emotion/css/macro';
import CircularProgress from '@mui/material/CircularProgress';
import { InputAdornment, Grid, Button, IconButton, InputLabel, Stack, FormHelperText, OutlinedInput } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from 'utils/asyncStatus.constants';
import * as userAPIs from "apis/user";
import theme from 'components/theme';

const palette = 'Auth';

const LoginInput = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [asyncStatusButton, setAsyncStatusButton] = React.useState(ASYNC_STATUS_LOADED);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Formik
                initialValues={{
                    name: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('請輸入使用者名稱').matches(/^\S*$/, '使用者名稱不得含有空格'),
                    password: Yup.string().max(255).required('請輸入密碼')
                })}
                onSubmit={async (values, { setErrors }) => {
                    let user = { name: values['name'], password: values['password'] };
                    setAsyncStatusButton(ASYNC_STATUS_LOADING);

                    // 用戶登入API
                    userAPIs.userLogin(user).then((res) => {
                        if (res['data']['success']) {
                            // 儲存狀態於用戶localStorage
                            localStorage.setItem('YFCII_LOGGED_IN', true);
                            localStorage.setItem('YFCII_USER_ID', res['data']['data']);
                            window.location.href = './';
                        }
                        // 自動跳轉至用戶詳情頁
                        //window.location.href = './userPlan';
                    }).catch((err) => {
                        setErrors({ submit: err['response']['data']['error'] });
                        setAsyncStatusButton(ASYNC_STATUS_LOADED);
                    })
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container className={loginStyle()}>
                            <Grid item xs={12} py={1}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name-login" style={{ fontSize: "16px" }}>使用者名稱</InputLabel>
                                    <OutlinedInput
                                        id="name-login"
                                        type="name"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter user name"
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-name-login">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Stack xs={12} py={1}>
                                    <InputLabel htmlFor="password-login" style={{ fontSize: "16px" }}>密碼</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12} py={1}>
                                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                        disableElevation
                                        disabled={asyncStatusButton.loading}
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: asyncStatusButton.loading ? '#fee3af' : theme[palette]['primary'], height: "36.5px" }}
                                    >
                                        {asyncStatusButton.loading ? <CircularProgress size={20} sx={buttonStyle} /> : "登入"}
                                    </Button>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default LoginInput

const loginStyle = () => css`
.MuiInputBase-root.MuiOutlinedInput-root input{
    padding:8px 14px ;
    font-size: 16px;
}
`

const buttonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
    color: 'white'
}
