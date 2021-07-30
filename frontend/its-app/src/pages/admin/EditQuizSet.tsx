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
import { useParams } from "react-router-dom";
import { URL } from '../../services/urlAPI'
import { fetcher } from '../../services/auth/auth'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import QuizSetFill from "../../component/QuizSetFill";
import { RountAdmin } from "../../services/rountURL";
import { useHistory } from "react-router-dom";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { IFormInput } from "./AddQuizSet";
import Tokenmismatch from '../auth/Tokenmismatch'
import EditIcon from '@material-ui/icons/Edit';

var skill: { [id: number]: number } = {};


const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditQuizSet = () => {

    const classes = Styles();
    const { id } = useParams<any>();
    console.log(id)
    let history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")
    let sop: any[] = []

    const { data: dataquizset, error: errorquizset } = useSWR(
        URL.API_GetQuizSet, fetcher, { refreshInterval: 3000 }
    );

    const { data: dataskill, error: errorskill } = useSWR(
        URL.API_GetSkill, fetcher, { refreshInterval: 3000 }
    );

    if (errorquizset || errorskill) {
        <div>
            {errorquizset && (
                <div>errorquizset {errorquizset}</div>
            )}
            {errorskill && (
                <div>errorskil {errorskill}</div>
            )}
           
        </div>
    };
    if (!dataquizset || !dataskill) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (dataquizset && dataskill) {
        console.log("EditQuizSet", dataquizset.data)

    };

    if (dataskill.data === "Token mismatch" && dataskill.msg === false) {
        return (
            <Tokenmismatch />
        )
    }

    const DataQuizSetFind = () => {
        let temp = dataquizset.data.find((item: any) => {
            return item.quiz_set_id == id
        })
        return temp
    }

    let quizseth = DataQuizSetFind()

    const sortSkill = () => {

        quizseth.quiz_set_skill.forEach((item: any) => {
            skill[item.skill_id] = item.skill_of_point
        });

        dataskill.data.forEach((item: any) => {
            let temp
            if (skill[item.skill_id]) {
                temp = {
                    skill_id: item.skill_id,
                    skill_name: item.skill_name,
                    skill_of_point: skill[item.skill_id]
                }
            } else {
                temp = {
                    skill_id: item.skill_id,
                    skill_name: item.skill_name,
                    skill_of_point: 0
                }
            }

            sop.push(temp)
        });
        return sop
    }

    const timeSet = () => {
        let time = quizseth.quiz_set_time
        let a = time / 60
        let b = a % 1
        let c = a - b
        return { hour: c, minute: time % 60 }
    }


    let defaultV: IFormInput = {
        QuizSetName: quizseth.quiz_set_name,
        Hour: timeSet().hour,
        Minute: timeSet().minute,
        Discription: quizseth.quiz_set_discription,
        PointToSkill: sortSkill(),
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
        // console.log("t", t())
        // console.log("arraySkill", arraySkill())
        // console.log(data)

        return axios.put(URL.API_UpdateQuizSet, {
            "quiz_set_id": id,
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
        <Dashboard>

            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    แก้ไขข้อมูลชุดข้อสอบ
                </Typography>
                <EditIcon color="primary" className={classes.iconHeadersize}/>
            </Box>

            <QuizSetFill
                defaultV={defaultV}
                onSubmit={onSubmit}
            />

            {/* {openAlert ?? <AlertFunction
                openAlert={openAlert}
                emassage={emassage}
                colerAlert={colerAlert}
            />} */}

            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={openAlert} autoHideDuration={5000} >
                <Alert severity={colerAlert ? "info" : "error"}>
                    {emassage}
                </Alert>
            </Snackbar>
        </Dashboard>
    )
}

export default EditQuizSet