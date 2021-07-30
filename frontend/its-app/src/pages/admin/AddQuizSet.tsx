import React from 'react'
import { Styles } from './Admin.styles'
import {
    Typography,
    Box,
    LinearProgress,
    Snackbar,
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import axios from "axios";
import { URL } from '../../services/urlAPI'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import QuizSetFill from "../../component/QuizSetFill";
import { RountAdmin } from "../../services/rountURL";
import { useHistory } from "react-router-dom";
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import Tokenmismatch from '../auth/Tokenmismatch'
import AddBoxIcon from '@material-ui/icons/AddBox';

interface skill_p {
    skill_id: number;
    skill_name: string;
    skill_of_point: number;
}

export interface IFormInput {
    QuizSetName: string;
    Hour: number | string,
    Minute: number | string,
    Discription: string,
    PointToSkill: skill_p[],
    // dataskill ?: any,
}

export interface Point {
    skill_id: number;
    num_of_point: number;
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// var SkillPerPoint: { [id: number]: Point } = {}

const QuizSet = () => {
    const sty = Styles();

    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")
    const sop: skill_p[] = []
    let history = useHistory();

    const { data: dataskill, error: errorskil } = useSWR(
        [URL.API_GetSkill], fetcher, { refreshInterval: 3000 }
    );

    if (!dataskill) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };

    if (errorskil) {
        return (    
            <div>
                {errorskil && (
                    <div>errorskil{errorskil}</div>
                )}
            </div>
        )
    };

    if (dataskill) {
        // console.log("quiz_set_skill", dataskill)
    };

    if (dataskill.data === "Token mismatch" && dataskill.msg === false) {
        return (
            <Tokenmismatch/>
        )
    }

    const SkillofPoint = () => {
        dataskill.data.forEach((item: any) => {
            let temp = {
                skill_id: item.skill_id,
                skill_name: item.skill_name,
                skill_of_point: 1
            }
            sop.push(temp)
        });
        return sop
    }



    let defaultV: IFormInput = {
        QuizSetName: "",
        Hour: 1,
        Minute: 0,
        Discription: "",
        PointToSkill: SkillofPoint(),
        // dataskill: dataskill,
    }

    const onSubmit = (data: IFormInput) => {

        setLoading(true)
        const t = () => {

            let th = data.Hour.toString()
            let tm = data.Minute.toString()

            return (parseInt(th) * 60 + parseInt(tm))
        }

        const arraySkill = () => {
            let t = []
            for (let i = 0; i < sop.length; i++) {
                let Po = { skill_id: sop[i].skill_id, skill_of_point: data.PointToSkill[i].skill_of_point }
                t.push(Po)
            }
            return t
        }

        console.log("dataQuizSet", data)
        return axios.post(URL.API_CreateQuizSet, {
            "quiz_set_name": data.QuizSetName,
            "quiz_set_time": t(),
            "quiz_set_discription": data.Discription,
            "quiz_set_skill": arraySkill()

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
                    setTimeout(() => { history.push(RountAdmin.ShowQuizSet) }, 2000);
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
        <div>
            <Dashboard>

                <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                    <Typography variant="h3" className={sty.MaginTopTitle}>
                        เพิ่มข้อมูลชุดข้อสอบ
                    </Typography>
                    <AddBoxIcon color="primary" className={sty.iconHeadersize}/>

                </Box>
                <QuizSetFill
                    defaultV={defaultV}
                    onSubmit={onSubmit}
                />
                <Backdrop className={sty.backdrop} open={loading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar open={openAlert} autoHideDuration={5000} >
                    <Alert severity={colerAlert ? "success" : "error"}>
                        {emassage}
                    </Alert>
                </Snackbar>

            </Dashboard>

        </div>
    )
}

export default QuizSet