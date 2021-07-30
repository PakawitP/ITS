import React, { useState, } from "react";
import { useForm, Controller } from "react-hook-form";
import { Styles } from '../auth/Auth.styles'
import useSWR from 'swr'
import {
    Typography,
    // FormLabel,
    FormControl,
    // FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Box,
    Grid,
    TextField,
    Button,
    LinearProgress,
    Snackbar,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import {
    AssignmentInd,
    AssignmentReturnedOutlined,
    School,
    Wc,
    Class,
} from '@material-ui/icons';
import axios from "axios";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
// import { useHistory } from "react-router-dom";
import { URL } from '../../services/urlAPI'
// import { RountGuest } from "../../services/rountURL";
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { setToken } from '../../services/auth/auth'




interface IFormInput {
    Name: string;
    LastName: string;
    //   Email: string;
    School: number| null;
    //   Password: string;
    //   ConfirmP: string;
    Gender: number;
    Class: string | null;
    //   Question: string;
    //   Answer: string;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const PersonalInfor = () => {
    const fetcher = (url: any) => axios.get(url).then(res => res.data)
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const sty = Styles();
    // let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [emassage, Setemassage] = useState("")

    // useEffect(()=>{

    // },[])
    let dataUser = JSON.parse(localStorage.getItem('user') || '{}')

    const { data, error } = useSWR(URL.API_SchoolGuest_ALL, fetcher, { refreshInterval: 3000 })


    if (error) {
        return (
            <div>
                error {error}
            </div>
        )
    };


    if (!data || !dataUser) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (data) {
        console.log(data)
    };
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const onSubmit = (data: IFormInput) => {

        console.log("register", data)
        setLoading(true)
        return axios.post(URL.API_UpdateUser, {
            "user_id": dataUser.user_id,
            "user_first_name": data.Name,
            "user_last_name": data.LastName,
            //   "user_email": data.Email,
            //   "user_password": data.Password,
            "user_school_id": data.School,
            "user_gender": data.Gender,
            //   "user_role_id": 2,
            "user_class": data.Class,
            //   "user_answer" : data.Answer,
            //   "user_question" : data.Question,
        })
            .then(response => {
                console.log("response", response);
                if (response.data.msg === true) {
                    localStorage.removeItem('user');
                    setToken(response.data.data)
                    setLoading(false)
                    Setemassage("Save Success")
                    setOpenAlert(true)
                }
                else {
                    setLoading(false)
                    Setemassage(response.data.data)
                    setOpenAlert(true)
                }
                return response.data;
            })
    }


    return (
        <Dashboard>
            <div>
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
                                    ข้อมูลส่วนตัว
                                </Typography>
                                <AssignmentReturnedOutlined color="primary" className={sty.iconHeadersize} />
                            </Box>

                            <Box display="flex" justifyContent="center">
                                <div>
                                    <Controller
                                        name="Name"
                                        control={control}
                                        rules={{ required: 'ระบุชื่อ' }}
                                        defaultValue={dataUser.user_first_name}
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
                                        defaultValue={dataUser.user_last_name}
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

                            <Box display="flex">
                                <div>
                                    <Controller
                                        control={control}
                                        name="Gender"
                                        rules={{
                                            required: 'ระบุเพศ',
                                        }}
                                        defaultValue={dataUser.user_gender}
                                        render={({
                                            field: { onChange, value },

                                        }) => (
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <Wc color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>

                                                        <FormControl className={sty.rootB}>
                                                            <InputLabel id="demo-simple-select-label">เพศ</InputLabel>
                                                            <Select onChange={onChange} value={value}>
                                                                <MenuItem value={1}>ชาย</MenuItem>
                                                                <MenuItem value={2}>หญิง</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    />
                                    {errors.Gender && (
                                        <p className={sty.errorMes}>
                                            {errors.Gender.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Controller
                                        control={control}
                                        name="Class"
                                        // rules={{
                                        //     required: 'ระบุระดับชั้นเรียน',
                                        // }}
                                        defaultValue={dataUser.user_class}
                                        render={({
                                            field: { onChange, value },

                                        }) => (
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <Class color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>

                                                        <FormControl className={sty.rootB}>
                                                            <InputLabel id="demo-simple-select-label">ระดับชั้นเรียน</InputLabel>
                                                            <Select onChange={onChange} value={value}>
                                                            {dataUser.user_role_name === "Admin" && (<MenuItem value=""><em>ไม่ระบุ</em></MenuItem>)}
                                                                <MenuItem value={'ม.1'}>ม.1</MenuItem>
                                                                <MenuItem value={'ม.2'}>ม.2</MenuItem>
                                                                <MenuItem value={'ม.3'}>ม.3</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    />
                                    {errors.Class && (
                                        <p className={sty.errorMes}>
                                            {errors.Class.message}
                                        </p>
                                    )}
                                </div>
                            </Box>

                            <Box display="flex" justifyContent="flex-start" >
                                <div>
                                    <Controller
                                        control={control}
                                        name="School"
                                        // rules={{
                                        //     required: 'ระบุโรงเรียน',
                                        // }}
                                        defaultValue={dataUser.user_school_id}
                                        render={({
                                            field: { onChange, value },

                                        }) => (
                                            <div className={sty.root}>
                                                <Grid container spacing={1} alignItems="flex-end">
                                                    <Grid item>
                                                        <School color="primary" className={sty.iconFontsize} />
                                                    </Grid>
                                                    <Grid item>

                                                        <FormControl className={sty.rootB}>
                                                            <InputLabel id="demo-simple-select-label">โรงเรียน</InputLabel>
                                                            <Select onChange={onChange} value={value}>
                                                                {dataUser.user_role_name === "Admin" && (<MenuItem value=""><em>ไม่ระบุ</em></MenuItem>)}
                                                                {data.data.map((dat: any, key: number) => {
                                                                    return (<MenuItem value={dat.school_id}>{dat.school_name}</MenuItem>)
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    />
                                    {errors.School && (
                                        <p className={sty.errorMes}>
                                            {errors.School.message}
                                        </p>
                                    )}
                                </div>

                            </Box>

                            <div style={{ display: 'flex', justifyContent: 'center' }} className={sty.fieldButton}>
                                <div className={sty.root} >
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        บันทึก
                                    </Button>
                                </div>
                            </div>

                        </Box>
                    </Grid>
                </form>
                <Backdrop className={sty.backdrop} open={loading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={emassage === "Save Success" ? "success" : "error"}>
                        {emassage}
                    </Alert>
                </Snackbar>
            </div>
        </Dashboard >
    );
}

export default PersonalInfor