import React, { useState } from "react";
import { Styles } from './Admin.styles'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import axios from "axios";

import {
    Typography,
    Box,
    Snackbar,
    // Snackbar,
    LinearProgress,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import {
    ControlPointDuplicate
} from '@material-ui/icons';
import { 
    // RountAdmin, 
    RountUsers } from "../../services/rountURL";
import useSWR from 'swr'
import { useHistory, useParams } from "react-router-dom";
import { URL } from '../../services/urlAPI'
import { fetcher } from '../../services/auth/auth'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import SchoolFill from '../../component/SchoolFill'
import { IFormInput } from './AddSchool'
import Tokenmismatch from '../auth/Tokenmismatch'

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const School = () => {
    const sty = Styles();
    let history = useHistory();
    const { id } = useParams<any>();

    const [colerAlert, setColerAlert] = React.useState(true);
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [emassage, Setemassage] = useState("")

    const { data, error } = useSWR(
        URL.API_GetSchoolID + '/' + id, fetcher, { refreshInterval: 3000 }
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
        // console.log("school", data.data)

    };
    if (data.data === "Token mismatch" && data.msg === false) {
        return (
            <Tokenmismatch />
        )
    }

    const Imagecheck = (imageschool: any) => {
        let tempcheck: any = []
        imageschool.forEach((s: any) => {
            if (s.school_image_id) {
                tempcheck.push({ "school_image_id": s.school_image_id, "school_image_name": s.school_image_name })
            } else {
                tempcheck.push({ "school_image_name": s.school_image_name })
            }
        })

        // console.log("tempcheck", tempcheck)

        return { "collect_school_image": tempcheck }
    }

    const onSubmit = (DATA: IFormInput) => {
        setLoading(true)

        let dat = { "school_id": id, "school_pic_director": DATA.SchoolPicDirector, }
        // console.log("after", dat)
        if (DATA.SchoolName !== data.data.school_name) {
            Object.assign(dat, { "school_name": DATA.SchoolName })
        }
        if (DATA.SchoolDirector !== data.data.school_director) {
            Object.assign(dat, { "school_director": DATA.SchoolDirector, })
        }
        if (DATA.SchoolProfileSchool !== data.data.school_profile_school) {
            Object.assign(dat, { "school_profile_school": DATA.SchoolProfileSchool, })
        }
        if (DATA.SchoolSubDistrict !== data.data.school_sub_district) {
            Object.assign(dat, {
                "school_sub_district": DATA.SchoolSubDistrict,
                "school_district": DATA.SchoolDistrict,
                "school_province": DATA.SchoolProvince,
            })
        }
        if (DATA.CollectSchoolImage !== data.data.collect_school_image) {
            Object.assign(dat, Imagecheck(DATA.CollectSchoolImage))
        }



        // console.log("after", dat)
        return axios.put(URL.API_UpdateSchool, dat, {
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
        SchoolName: data.data[0].school_name,
        SchoolDirector: data.data[0].school_director,
        SchoolProfileSchool: data.data[0].school_profile_school,
        SchoolProvince: data.data[0].school_province,
        SchoolDistrict: data.data[0].school_district,
        SchoolSubDistrict: data.data[0].school_sub_district,
        SchoolPicDirector: data.data[0].school_pic_director,
        CollectSchoolImage: data.data[0].school_image,
    }


    return (
        <Dashboard>
            {/* {loading ? <LinearProgress style={{ height: 4 }} />: null} */}
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
            <Snackbar open={openAlert} autoHideDuration={5000} >
                <Alert severity={colerAlert ? "info" : "error"}>
                    {emassage}
                </Alert>
            </Snackbar>
            <Backdrop className={sty.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Dashboard>
    );
}

export default School