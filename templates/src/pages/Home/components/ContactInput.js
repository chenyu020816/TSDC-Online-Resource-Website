/* import React from 'react';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid, Button, InputLabel, Stack, FormHelperText, OutlinedInput } from '@mui/material';
import { motion } from 'framer-motion';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from 'utils/asyncStatus.constants';
import { storeData } from 'utils/snackbar.constants';
import * as userAPIs from 'apis/user';
import theme from 'components/theme';

const palette = 'Auth';

const ContactInput = () => {
    const name = localStorage.getItem('NOMENU_USER_NAME');

    const { enqueueSnackbar } = useSnackbar();
    const [asyncStatusButton, setAsyncStatusButton] = React.useState(ASYNC_STATUS_LOADED);

    return (
        <>
            <Formik
                initialValues={{
                    name: name,
                    email: '',
                    content: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('請輸入使用者名稱').matches(/^\S*$/, '使用者名稱不得含有空格'),
                    email: Yup.string().required('請輸入Email').email('必須是有效的電子郵件').max(255),
                    content: Yup.string().required('請輸入內容'),
                })}
                onSubmit={async (values, { setErrors, resetForm }) => {
                    let user = { name: values['name'], email: values['email'], content: values['content'] };
                    setAsyncStatusButton(ASYNC_STATUS_LOADING);
                    userAPIs.commentSubmit(user).then((res) => {
                        resetForm();
                        enqueueSnackbar(`已送出`, storeData);
                        setAsyncStatusButton(ASYNC_STATUS_LOADED);
                    }).catch((err) => {
                        setErrors({ submit: err['response']['data']['error'] });
                        setAsyncStatusButton(ASYNC_STATUS_LOADED);
                    })
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <Grid container >
                            <Grid item xs={12} sm={6} py={1} px={2}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name" style={{ fontSize: "16px" }}>使用者名稱</InputLabel>
                                    <OutlinedInput
                                        id="name"
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
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6} py={1} px={2}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email" style={{ fontSize: "16px" }}>Email</InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter user email"
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} py={1} px={2}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="content" style={{ fontSize: "16px" }}>想說的話</InputLabel>
                                    <OutlinedInput
                                        id="content"
                                        type="content"
                                        value={values.content}
                                        name="content"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter user content"
                                        fullWidth
                                        multiline
                                        rows={7}
                                        error={Boolean(touched.content && errors.content)}
                                    />
                                    {touched.content && errors.content && (
                                        <FormHelperText error id="standard-weight-helper-text-content">
                                            {errors.content}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={3} py={1} px={2}>
                                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                        disableElevation
                                        disabled={asyncStatusButton.loading}
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: asyncStatusButton.loading ? '#fee3af' : theme[palette]['primary'], height: "36.5px" }}
                                    >
                                        {asyncStatusButton.loading ? <CircularProgress size={20} sx={buttonStyle} /> : "送出"}
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

export default ContactInput

const buttonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
    color: 'white'
}
 */