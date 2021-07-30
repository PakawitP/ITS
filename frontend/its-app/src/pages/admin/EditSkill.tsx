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
import { URL } from '../../services/urlAPI'
import { fetcher } from '../../services/auth/auth'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import SkillFill from '../../component/SkillFill'
import { RountAdmin } from "../../services/rountURL";
import { useHistory, useParams } from "react-router-dom";
import Tokenmismatch from '../auth/Tokenmismatch'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { IFormInput } from "./AddSkill";

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Skill = () => {

    const classes = Styles();
    const { id } = useParams<any>();
    console.log(id)
    let history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")
    var d: { [id: number] : any; } = {};
    const { data, error } = useSWR(
        URL.API_GetSkill, fetcher,{ refreshInterval: 3000 }
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
        console.log("skill", data.data)

    };
    if (data.data === "Token mismatch" && data.msg === false) {
        return (
            <Tokenmismatch/>
        )
    }

    const dataSK = () => {
        data.data.forEach((item:any) => {
            d[item.skill_id] = item
        });

        let defaultV: IFormInput = {
            SkillName: d[id].skill_name,
            SkillTotalScore: d[id].skill_total_score,
        }
        return defaultV
    }


    const onSubmit = (DATA: IFormInput) => {
        setLoading(true)

        let dat = { "skill_id": id }
        if (DATA.SkillName !== d[id].skill_name) {
            Object.assign(dat, { "skill_name": DATA.SkillName })
        }
        if (DATA.SkillTotalScore !== d[id].skill_total_score) {
            Object.assign(dat, { "skill_total_score": DATA.SkillTotalScore, })
        }
        Object.assign(dat, { "skill_quantity_per_quiz": 10, })
        return axios.put(URL.API_UpdateSkill, dat, {
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
                    setOpenAlert(true)
                    setTimeout(() => { history.push(RountAdmin.ShowSkill) }, 2000);
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
            {loading ?? <LinearProgress style={{ height: 4 }} />}
            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    แก้ไขข้อมูลความสามารถ
                </Typography>
            </Box>
            <SkillFill
                onSubmit={onSubmit}
                defaultV={dataSK()}
            />
            {/* {openAlert ?? <AlertFunction
                openAlert={openAlert}
                emassage={emassage}
                colerAlert={colerAlert}
            />} */}

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

export default Skill