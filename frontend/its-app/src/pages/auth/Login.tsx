import React, { FC, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
    AccountCircle,
    Lock,
    ExitToAppOutlined,
    LockOpen,
    HowToReg
} from '@material-ui/icons';
import {
    Checkbox,
    Typography,
    FormControlLabel,
    Grid,
    Box,
    TextField,
    Button,
    Snackbar,
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { Styles } from './Auth.styles'
import { URL } from '../../services/urlAPI'
import { RountGuest, RountUsers } from '../../services/rountURL'
import LoginLayouts from '../../layouts/LoginLayouts'
import { setToken } from '../../services/auth/auth'

interface IFormInput {
    Email: string;
    Password: string;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login: FC = () => {

    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const sty = Styles();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const [showPassword, setShowPassword] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [emassage, Setemassage] = useState("")
    const [loading, setLoading] = useState(false);

    let history = useHistory();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };



    const onSubmit = (data: IFormInput) => {
        setLoading(true)
        return axios.post(URL.API_Login, {

            "user_email": data.Email,
            "user_password": data.Password
        })
            .then(response => {
                console.log("response", response);
                if (response.data.msg === true) {
                    setToken(response.data.data)
                    setLoading(false)
                   
                    history.push(RountUsers.Home);
               
                }
                else {
                    setLoading(false)
                    Setemassage(response.data.data)
                    setOpenAlert(true)
                }
                return response.data;
            })
    }

    // console.log("token", JSON.parse(localStorage.getItem('user') || '{}'))

    return (
        <LoginLayouts>
            <div>
                {/* {loading && <LinearProgress style={{ height: 4 }} />} */}
                <form onSubmit={handleSubmit(onSubmit)} className={sty.paper}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                    >
                        <Box
                            marginTop={2}
                            borderRadius={25}
                            borderColor='text.primary'
                            p={5}
                            border={1}
                            boxShadow={2}
                        >
                            <Box display="flex" justifyContent="flex-start" >
                                <Typography variant="h3" className={sty.MaginTopTitle}>
                                    เข้าสู่ระบบ
                                </Typography>
                                <ExitToAppOutlined color="primary" className={sty.iconHeadersize} />
                            </Box>

                            <Controller
                                name="Email"
                                control={control}
                                rules={{
                                    required: 'ระบุอีเมล',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'ระบุอีเมลให้ถูกต้อง',
                                    }
                                }}
                                defaultValue=""
                                render={({ field }) =>
                                    <div className={sty.root}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item>
                                                <AccountCircle color="primary" className={sty.iconFontsize} />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="input-with-icon-grid"
                                                    label="อีเมล"
                                                    {...field}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                }
                            />
                            {errors.Email && (
                                <p className={sty.errorMes}>
                                    {errors.Email.message}
                                </p>
                            )}

                            <Controller
                                name="Password"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'ระบุรหัสผ่าน' }}
                                render={({ field }) =>
                                    <div>
                                        <div className={sty.root}>
                                            <Grid container spacing={1} alignItems="flex-end">
                                                <Grid item>
                                                    <Lock color="primary" className={sty.iconFontsize} />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        type={showPassword ? "text" : "password"}
                                                        label="รหัสผ่าน"
                                                        {...field}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox style={{ marginLeft: 10 }}
                                                    checked={showPassword}
                                                    onChange={handleClickShowPassword}
                                                    color="primary"
                                                />
                                            } label="เเสดงรหัสผ่าน"
                                        />
                                    </div>
                                }
                            />
                            {errors.Password && (
                                <p className={sty.errorMes}>
                                    {errors.Password.message}
                                </p>
                            )}

                            <div className={sty.fieldButton} style={{ marginLeft: 10 }}>
                                <div className={sty.root}>
                                    <Button
                                        variant="contained"
                                        endIcon={<LockOpen />}
                                        type="submit"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        เข้าสู่ระบบ
                                    </Button>
                                </div>

                                <div className={sty.root}>
                                    <Button
                                        color="primary"
                                        component={Link}
                                        endIcon={<HowToReg />}
                                        to={RountGuest.Register}
                                        disabled={loading}
                                        variant="contained"
                                    >
                                        สมัคร
                                    </Button>
                                </div>
                                <Box display="flex" justifyContent="center" >
                                    <Link to={RountGuest.ResetPassword}>ลืมรหัสผ่าน</Link>
                                </Box>
                            </div>

                        </Box>
                    </Grid>

                </form>
                <Backdrop className={sty.backdrop} open={loading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {emassage}
                    </Alert>
                </Snackbar>
            </div>
        </LoginLayouts>
    )
}

export default Login