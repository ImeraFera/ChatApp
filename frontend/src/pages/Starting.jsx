import { Box, Button, CircularProgress, Divider, Grid2, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import { auth } from '../configs/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../validations/Register';
import { loginSchema } from '../validations/Login';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, loginUser } from '../redux/slices/userSlice';
import { socket } from '../socket';

const CustomTextField = ({ label, helperText, error, ...props }) => (
    <TextField
        label={label}
        color='secondary'
        size='small'
        variant='standard'
        error={error}
        helperText={helperText}
        sx={{
            '& .MuiInputBase-input': {
                color: 'white',
            },
            '& .MuiInputLabel-root': {
                color: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
            },
        }}
        {...props}
    />
);

function Starting() {

    const dispatch = useDispatch();

    const navigation = useNavigate();

    const loading = useSelector(({ user }) => user.loading)

    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(loginUser(values)).unwrap();
                console.log('Giriş Başarılı!');
                toast.success('Giriş Başarılı!', {
                    autoClose: 1500,
                });
                navigation('/home');
            } catch (error) {
                console.log(error);
                toast.error('Giriş Başarısız!', {
                    autoClose: 1500,
                });
            }
        },
    });

    const registerFormik = useFormik({

        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {

                await dispatch(createUser(values))

                console.log('Kullanıcı kaydedildi');
                toast.success('Kayıt Başarılı! Giriş Yapabilirsiniz.', {
                    autoClose: 1500,
                });
                navigation('/home');
            } catch (error) {
                console.log(error);
                toast.error('Kayıt Başarısız!', {
                    autoClose: 1500,
                });
            }
        },
    });

    return (
        <Grid2
            height={'90vh'}
            container
            sx={{
                backdropFilter: 'blur(1px)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={4}
        >
            <Grid2 size={'grow'}>
                <Box height={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                    <Box>
                        <Typography color='white' textAlign={'center'} variant='h4'>
                            Login
                        </Typography>
                        <Box mt={5}>
                            <form onSubmit={loginFormik.handleSubmit}>
                                <Box display={'flex'} mb={2} flexDirection={'column'}>
                                    <CustomTextField
                                        label='E-mail'
                                        type='email'
                                        name='email'
                                        id='email'
                                        value={loginFormik.values.email}
                                        onChange={loginFormik.handleChange}
                                        error={Boolean(loginFormik.errors.email && loginFormik.touched.email)}
                                        helperText={loginFormik.touched.email ? loginFormik.errors.email : ''}
                                    />
                                </Box>
                                <Box display={'flex'} mb={2} flexDirection={'column'}>
                                    <CustomTextField
                                        label='Password'
                                        type='password'
                                        name='password'
                                        id='password'
                                        value={loginFormik.values.password}
                                        onChange={loginFormik.handleChange}
                                        error={Boolean(loginFormik.errors.password && loginFormik.touched.password)}
                                        helperText={loginFormik.touched.password ? loginFormik.errors.password : ''}
                                    />
                                </Box>
                                <Box display={'flex'} mt={5} flexDirection={'column'}>

                                    {loading ? (
                                        <Box display={'flex'} justifyContent={'center'}>
                                            <CircularProgress color='secondary'></CircularProgress>
                                        </Box>
                                    ) : (
                                        <Button type='submit' variant='contained' color='secondary'>Login</Button>
                                    )}
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Grid2>
            <Divider sx={{ bgcolor: 'white', opacity: '0.3' }} component={'hr'} variant='middle' orientation="vertical" flexItem />
            <Grid2 size={'grow'}>
                <Box height={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                    <Box>
                        <Typography color='white' textAlign={'center'} variant='h4'>
                            Register
                        </Typography>
                        <Box mt={5}>
                            <form onSubmit={registerFormik.handleSubmit}>
                                <Box display={'flex'} mb={2} flexDirection={'column'}>
                                    <CustomTextField
                                        label='Username'
                                        type='text'
                                        name='username'
                                        id='username'
                                        value={registerFormik.values.username}
                                        onChange={registerFormik.handleChange}
                                        error={Boolean(registerFormik.errors.username && registerFormik.touched.username)}
                                        helperText={registerFormik.touched.username ? registerFormik.errors.username : ''}
                                    />
                                </Box>
                                <Box display={'flex'} mb={2} flexDirection={'column'}>
                                    <CustomTextField
                                        label='E-mail'
                                        type='email'
                                        name='email'
                                        id='email'
                                        value={registerFormik.values.email}
                                        onChange={registerFormik.handleChange}
                                        error={Boolean(registerFormik.errors.email && registerFormik.touched.email)}
                                        helperText={registerFormik.touched.email ? registerFormik.errors.email : ''}
                                    />
                                </Box>
                                <Box display={'flex'} mb={2} flexDirection={'column'}>
                                    <CustomTextField
                                        label='Password'
                                        type='password'
                                        name='password'
                                        id='password'
                                        value={registerFormik.values.password}
                                        onChange={registerFormik.handleChange}
                                        error={Boolean(registerFormik.errors.password && registerFormik.touched.password)}
                                        helperText={registerFormik.touched.password ? registerFormik.errors.password : ''}
                                    />
                                </Box>
                                <Box display={'flex'} mb={2} flexDirection={'column'}>
                                    <CustomTextField
                                        label='Confirm Password'
                                        type='password'
                                        name='confirmPassword'
                                        id='confirmPassword'
                                        value={registerFormik.values.confirmPassword}
                                        onChange={registerFormik.handleChange}
                                        error={Boolean(registerFormik.errors.confirmPassword && registerFormik.touched.confirmPassword)}
                                        helperText={registerFormik.touched.confirmPassword ? registerFormik.errors.confirmPassword : ''}
                                    />
                                </Box>
                                <Box display={'flex'} mt={5} flexDirection={'column'}>
                                    {loading ? (
                                        <Box display={'flex'} justifyContent={'center'}>
                                            <CircularProgress color='secondary'></CircularProgress>
                                        </Box>
                                    ) : (
                                        <Button type='submit' variant='contained' color='secondary'>Register</Button>
                                    )}
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Grid2>
        </Grid2>
    );
}

export default Starting;
