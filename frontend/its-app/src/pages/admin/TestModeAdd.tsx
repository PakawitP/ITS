import React from 'react'
import { Styles } from './Admin.styles'
import axios from "axios";
import {
    Typography,
    Box,
    // LinearProgress,
    Snackbar,
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import {Queue} from '@material-ui/icons';
import { URL } from '../../services/urlAPI'
import TestModeFill from '../../component/TestModeFill'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
// import SkillFill from '../../component/SkillFill'
import { RountAdmin } from "../../services/rountURL";
import { useHistory } from "react-router-dom";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import Tokenmismatch from '../auth/Tokenmismatch'


export interface IFormInput {
    subject: string;
    choiceOne: string;
    choiceTwo: string;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TestModeAdd = () => {

    const classes = Styles();
    let history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")

    let defaultV: IFormInput = {
        subject: "",
        choiceOne: "",
        choiceTwo: "",
    }



    const onSubmit = (data: IFormInput) => {
        setLoading(true)
        return axios.post(URL.API_SaveChoiceTestMode, {
            "subject": data.subject,
            "choiceOne": data.choiceOne,
            "choiceTwo": data.choiceTwo,
        }, {
            headers: {
                Authorization: `${JSON.parse(localStorage.getItem('user') || '{}').token}`
            }
        })
            .then(response => {
                console.log("response", response);
                setLoading(false)
                if (response.data.msg === true) {
                    setColerAlert(true)
                    Setemassage("Save Success")
                    setTimeout(() => { history.push(RountAdmin.ShowChoiceTestMode) }, 2000);
                }
                else {
                    setColerAlert(false)
                    Setemassage(response.data.data)
                }
                setOpenAlert(true)
                return response.data;
            })
    }




    return (
        <Dashboard>

            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    เพิ่มข้อมูลโหมดทดสอบ
                </Typography>
                <Queue color="primary" className={classes.iconHeadersize} />
            </Box>

            <TestModeFill
                onSubmit={onSubmit}
                defaultV={defaultV}
            />

            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={openAlert} autoHideDuration={5000} >
                <Alert severity={colerAlert ? "success" : "error"}>
                    {emassage}
                </Alert>
            </Snackbar>
            {emassage === 'Token mismatch' && (
                <Tokenmismatch />
            )}
        </Dashboard>
    )
}

export default TestModeAdd