import React from 'react'
import { Styles } from './Admin.styles'
import axios from "axios";
import {
    Typography,
    Box,
    LinearProgress,
    Snackbar,
    Backdrop,
    CircularProgress,
} from '@material-ui/core'

import useSWR from 'swr'
import { fetcher } from '../../services/auth/auth'
import {AspectRatio} from '@material-ui/icons';
import { URL } from '../../services/urlAPI'
import TestModeFill from '../../component/TestModeFill'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import Tokenmismatch from '../auth/Tokenmismatch'
import { RountAdmin } from "../../services/rountURL";
import {useHistory, useParams } from "react-router-dom";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

export interface IFormInput {
    subject : string;
    choiceOne : string;
    choiceTwo : string;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditTestMode = () => {

    const classes = Styles();
    const { id } = useParams<any>();
    let history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")

    const { data, error } = useSWR(
        URL.API_GetChoiceTestModeByID + "/" + id  , fetcher
    );

    if (error) {
        return (
            <div>
                error {error}
            </div>
        )
    };
    if (!data) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (data) {
        console.log( data.data)

    };
    if (data.data === "Token mismatch" && data.msg === false) {
        return (
            <Tokenmismatch/>
        )
    }

    let defaultV: IFormInput = {
        subject: data.data.subject,
        choiceOne: data.data.choiceOne,
        choiceTwo: data.data.choiceTwo,
    }

   

    const onSubmit = (data: IFormInput) => {
        setLoading(true)
        return axios.put(URL.API_UpdateGetChoiceTestMode, {
            "test_id" : id,
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
                    แก้ไขข้อมูลโหมดทดสอบ
                </Typography>
                <AspectRatio color="primary" className={classes.iconHeadersize} />
            </Box>
            
            <TestModeFill
                onSubmit={onSubmit}
                defaultV={defaultV}
            />
            
            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={openAlert} autoHideDuration={5000}>
                <Alert  severity={colerAlert ? "info" : "error"}>
                    {emassage}
                </Alert>
            </Snackbar>
        </Dashboard>
    )
}

export default  EditTestMode