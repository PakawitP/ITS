import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Styles } from './Auth.styles'
import {
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    LinearProgress,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import {
    AssignmentTurnedInRounded,
    AccountCircle,
    AssignmentRounded,
    AssignmentInd,
    Save,
    VpnLock
    // School,
    // Wc,
    // Class,
    // Help,
    // QuestionAnswer

} from '@material-ui/icons';
import axios from "axios";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useHistory } from "react-router-dom";
import { URL } from '../../services/urlAPI'
import { RountGuest } from "../../services/rountURL";
import LoginLayouts from '../../layouts/LoginLayouts'



interface IFormInput {
    Name: string;
    LastName: string;
    Email: string;
    Password: string;
    ConfirmP: string;
    Answer: string;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const ResetPasswoed = () => {
    const {  control, handleSubmit, getValues, formState: { errors } } = useForm<IFormInput>();
    const sty = Styles();
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [emassage, Setemassage] = useState("")
    const [answer, setAnswer] = useState(false)
    const [answermassage, setAnswermassage] = useState("")

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const onSubmit = (data: IFormInput) => {

        // console.log("register", data)
        setLoading(true)
        if (answer === false) {
            return axios.post(URL.API_ResetPassword, {
                "user_first_name": data.Name,
                "user_last_name": data.LastName,
                "user_email": data.Email,
                "user_password": data.Password,
                "user_answer": data.Answer

            })
                .then(response => {
                    console.log("response", response);
                    if (response.data.msg === true) {
                        setAnswer(true)
                        setAnswermassage(response.data.data)
                        setLoading(false)
                        // Setemassage("Reset Password Success")
                        // setOpenAlert(true)
                        // setTimeout(() => { history.push(RountGuest.Login) }, 2000);
                    }
                    else {
                        setLoading(false)
                        Setemassage(response.data.data)
                        setOpenAlert(true)
                    }
                    return response.data;
                })
        } else {
            return axios.post(URL.API_AnsResetPassword, {
                "user_first_name": data.Name,
                "user_last_name": data.LastName,
                "user_email": data.Email,
                "user_password": data.Password,
                "user_answer": data.Answer

            })
                .then(response => {
                    console.log("response", response);
                    if (response.data.msg === true) {
                        setLoading(false)
                        Setemassage("Reset Password Success")
                        setOpenAlert(true)
                        setTimeout(() => { history.push(RountGuest.Login) }, 2000);
                    }
                    else {
                        setLoading(false)
                        Setemassage(response.data.data)
                        setOpenAlert(true)
                    }
                    return response.data;
                })
        }
    }


    return (
        <LoginLayouts>
            <div>
                {loading && <LinearProgress style={{ height: 4 }} />}
                <form onSubmit={handleSubmit(onSubmit)} className={sty.paper} >
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                    >
                        <Box
                            marginTop={1}
                            borderRadius={25}
                            borderColor='text.primary'
                            p={4}
                            border={1}
                            boxShadow={2}
                        >

                            <Box display="flex" justifyContent="flex-start" >
                                <Typography variant="h3" className={sty.MaginTopTitle}>
                                    เปลี่ยนรหัสผ่าน
                                </Typography>
                                <VpnLock color="primary" className={sty.iconHeadersize} />
                            </Box>

                            <Box display="flex" justifyContent="flex-start" >
                                <div>
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
                                </div>
                            </Box>

                            <Box display="flex" justifyContent="center">
                                <div>
                                    <Controller
                                        name="Name"
                                        control={control}
                                        rules={{ required: 'ระบุชื่อ' }}
                                        defaultValue=""
                                        render={({ field }) =>
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <AssignmentInd color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            label="ชื่อ"
                                                            {...field}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    />
                                    {errors.Name && (
                                        <p className={sty.errorMes}>
                                            {errors.Name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Controller
                                        name="LastName"
                                        control={control}
                                        rules={{ required: 'ระบุนามสกุล' }}
                                        defaultValue=""
                                        render={({ field }) =>
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <AssignmentInd color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            label="นามสกุล"
                                                            {...field}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    />
                                    {errors.LastName && (
                                        <p className={sty.errorMes}>
                                            {errors.LastName.message}
                                        </p>
                                    )}
                                </div>
                            </Box>

                            <Box display="flex" justifyContent="center">
                                <div>
                                    <Controller
                                        name="Password"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: 'ระบุรหัสผ่าน',
                                            minLength: {
                                                value: 6,
                                                message: 'ต้องมีความยาวมากกว่า 6 ตัวอักษร',
                                            },
                                            pattern: {
                                                value: /[A-Za-z0-9_]$/,
                                                message: 'ใช้ตัวอักษร a-z,A-Z,0-9,_',
                                            },
                                        }}
                                        render={({ field }) =>
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <AssignmentRounded color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            type="password"
                                                            label="รหัสผ่านที่ต้องการเปลี่ยน"
                                                            {...field}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    />
                                    {errors.Password && (
                                        <p className={sty.errorMes}>
                                            {errors.Password.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Controller
                                        name="ConfirmP"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: 'ยันยันรหัสผ่าน',
                                            validate: (value: string) => {
                                                return value === getValues("Password") || "รหัสผ่านไม่เหมือนกัน"
                                            },
                                        }}
                                        render={({ field }) =>
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <AssignmentTurnedInRounded color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            label="ยันยันรหัสผ่าน"
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    />
                                    {errors.ConfirmP && (
                                        <p className={sty.errorMes}>
                                            {errors.ConfirmP.message}
                                        </p>
                                    )}
                                </div>
                            </Box>

                            <Dialog open={answer} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">ตอบคำถามเพื่อเปลี่ยนรหัสผ่าน</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {answermassage}
                                    </DialogContentText>
                                    <Controller
                                        name="Answer"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) =>

                                            <TextField
                                                label='คำตอบ'
                                                {...field}
                                            />
                                        }
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => { setAnswer(false) }} color="primary">
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading} onClick={handleSubmit(onSubmit)} color="primary">
                                        ตกลง
                                    </Button>
                                </DialogActions>
                            </Dialog>


                            <div style={{ display: 'flex', justifyContent: 'center' }} className={sty.fieldButton}>
                                <div className={sty.root} >
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={loading}
                                        endIcon={<Save />}
                                    >
                                        เปลี่ยนรหัสผ่าน
                                    </Button>
                                </div>
                            </div>

                        </Box>
                    </Grid>
                </form>
                <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={emassage === "Reset Password Success" ? "success" : "error"}>
                        {emassage}
                    </Alert>
                </Snackbar>
            </div>
        </LoginLayouts >
    );
}

export default ResetPasswoed