import React, { useState } from "react";
import { Styles } from './Admin.styles'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import axios from "axios";
import Tokenmismatch from '../auth/Tokenmismatch'
import {
    Typography,
    Box,
    Snackbar,
    // LinearProgress,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import {
    ControlPointDuplicate
} from '@material-ui/icons';
import {
    // RountAdmin,
    RountUsers
} from "../../services/rountURL";
import { useHistory } from "react-router-dom";
import { URL } from '../../services/urlAPI'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import SchoolFill from '../../component/SchoolFill'

export interface IFormInput {
    SchoolName: string;
    SchoolDirector: string;
    SchoolProfileSchool: string;
    SchoolProvince?: string;
    SchoolDistrict?: string;
    SchoolSubDistrict?: string;
    SchoolPicDirector?: any;
    CollectSchoolImage?: any;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const AddSchool = () => {
    const sty = Styles();
    let history = useHistory();


    const [colerAlert, setColerAlert] = React.useState(true);
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [emassage, Setemassage] = useState("")

    const onSubmit = (data: IFormInput) => {
        // console.log("school", data)
        setLoading(true)
        return axios.post(URL.API_CreateSchool, {
            "school_name": data.SchoolName,
            "school_director": data.SchoolDirector,
            "school_profile_school": data.SchoolProfileSchool,
            "school_province": data.SchoolProvince,
            "school_district": data.SchoolDistrict,
            "school_sub_district": data.SchoolSubDistrict,
            "school_pic_director": data.SchoolPicDirector,
            "collect_school_image": data.CollectSchoolImage,
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
                    setTimeout(() => { history.push(RountUsers.ShowSchool) }, 2000);
                }
                else {
                    setColerAlert(false)
                    Setemassage(response.data.data)

                }
                setOpenAlert(true)
                return response.data;
            })

    }


    let defaultV: IFormInput = {
        SchoolName: "",
        SchoolDirector: "",
        SchoolProfileSchool: "",
        // SchoolProvince: "",
        // SchoolDistrict: "",
        // SchoolSubDistrict: "",
        SchoolPicDirector: "",
        CollectSchoolImage: [{ "school_image_name": "" }],
    }


    return (
        <Dashboard>

            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={sty.MaginTopTitle}>
                    เพิ่มข้อมูลโรงเรียน
                </Typography>
                <ControlPointDuplicate color="primary" className={sty.iconHeadersize} />
            </Box>
            <SchoolFill
                onSubmit={onSubmit}
                defaultV={defaultV}
            />
            <Backdrop className={sty.backdrop} open={loading} >
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
    );
}

export default AddSchool