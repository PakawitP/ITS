import React from 'react'
import {
    Box,
    Typography,
    LinearProgress,
    Snackbar,
    Backdrop,
    CircularProgress,
} from "@material-ui/core";
import { Styles } from './Admin.styles'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { PostAddSharp } from '@material-ui/icons';
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import axios from "axios";
import { URL } from '../../services/urlAPI'
import { useParams } from "react-router-dom";
import {
    FormValues
    // , subSkill 
} from "./AddExam";
import ExamFill from "../../component/ExamFill";
import { useHistory } from "react-router-dom";
import { RountAdmin } from "../../services/rountURL";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import Tokenmismatch from '../auth/Tokenmismatch'


const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

var sub: { [id: number]: any } = {}

export default function EditExam() {

    const classes = Styles();
    const { id } = useParams<any>();

    let history = useHistory();

    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")
    const [typeC, setTypeC] = React.useState<any>()

    const quizSet = (data: any) => {
        if (data) {
            return data
        } else {
            return null
        }

    }

    const callbackChoice = (type: string) => {
        setTypeC(type)
    }

    const onSubmit = (data: FormValues) => {


        let subSkill: any = [];
        let DataChoice: any = [];

        console.log(data)
        setLoading(true)

        for (let i = 0; i < data.Choice.length; i++) {
            let t: any
            if (typeC === "chocieTF") {
                if (typeof (data.Choice[i].choice_correct) === typeof (true)) {
                    t = data.Choice[i].choice_correct
                } else {
                    t = false
                }
            } else {
                t = data.Choice[i].choice_correct
            }
            DataChoice.push(
                {
                    choice_id: i,
                    choice_name: data.Choice[i].choice_name,
                    choice_correct: t,
                    image: data.ChoiceImage[i].image,

                })
        }

        Object.keys(data.QuizSubSkill).forEach(function (key) {
            if (data.QuizSubSkill[key].skill_id !== 0) {
                subSkill.push(data.QuizSubSkill[key])
            }

        });

        return axios.put(URL.API_UpdateQuiz, {
            "quiz_id": id,
            "quiz_proposition": data.Proposition,
            "quiz_choice": DataChoice,
            "quiz_skill_id": data.SkillTest,
            "quiz_quiz_set_id": quizSet(data.QuizSet),
            "image_proposition": data.ImageProposition || null,
            "quiz_subskill": subSkill

        }, {
            headers: {
                Authorization: `${JSON.parse(localStorage.getItem('user') || '{}').token}`
            }
        })
            .then(response => {
                // console.log("response", response);
                setLoading(false)
                if (response.data.msg === true) {
                    setColerAlert(true)
                    Setemassage("Save Success")
                    setTimeout(() => { history.push(RountAdmin.ShowExam) }, 2000);
                }
                else {
                    setColerAlert(false)
                    Setemassage(response.data.data)
                }
                setOpenAlert(true)
                return response.data;
            })
    }

    const { data: dataskill, error: errorskill } = useSWR(
        [URL.API_GetSkill], fetcher, { refreshInterval: 3000 }

    );
    const { data: dataquizset, error: errorquizset } = useSWR(
        [URL.API_GetQuizSet], fetcher, { refreshInterval: 3000 }

    );
    const { data: dataExam, error: errorExam } = useSWR(
        URL.API_GetExamID + '/' + id, fetcher, { refreshInterval: 3000 }

    );
    if (errorExam || errorskill || errorquizset) {
        <div>
            {errorExam && (
                <div>errorExam {errorExam}</div>
            )}
            {errorskill && (
                <div>errorskill {errorskill}</div>
            )}
            {errorquizset && (
                <div>errorquizset {errorquizset}</div>
            )}
        </div>
    };
    if (!dataExam || !dataskill || !dataquizset) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (dataExam && dataskill && dataquizset) {
        // console.log("dataExam.data.quiz_choice[0].choice_correct",dataExam.data.quiz_choice[0].choice_correct)
        // console.log("quiz_quiz_set_id",dataValidat)
    };
    if (dataskill.data === "Token mismatch" && dataskill.msg === false) {
        return (
            <Tokenmismatch />
        )
    }

    const SeparateImage = () => {
        let Image: any[] = []

        dataExam.data.quiz_choice.forEach((item: any) => {
            Image.push({ choice_id: item.choice_id, image: item.image })
        })
        return Image
    }

    const SeparateChoice = () => {

        let Choice: any[] = []

        dataExam.data.quiz_choice.forEach((item: any) => {
            Choice.push({ choice_name: item.choice_name, choice_correct: item.choice_correct, choice_id: item.choice_id })
        })
        return Choice
    }

    const SubskillCount = (): boolean => {
        let count = 0
        dataExam.data.quiz_subskill.forEach((item: any) => {
            if (item.score_percent) {
                count++
            }
            // count = count + item.score_percent
        })
        if (count > 0) {
            return true
        } else {
            return false
        }


        // return subSkill
    }


    const sortSubskill = () => {
        dataExam.data.quiz_subskill.forEach((item: any) => {
            sub[item.skill_id] = item
        });

        return sub
    }

    let defaultV: FormValues = {
        Proposition: dataExam.data.quiz_proposition,
        QuizSet: dataExam.data.quiz_quiz_set_id,
        SkillTest: dataExam.data.quiz_skill_id,
        Choice: SeparateChoice(),
        /////
        ImageProposition: dataExam.data.image_proposition,
        ChoiceImage: SeparateImage(),
        QuizSubSkill: sortSubskill(),
        dataquizset: dataquizset,
        dataskill: dataskill,
    }




    const choiceType = () => {

        if (typeof (dataExam.data.quiz_choice[0].choice_correct) === typeof (true)) {
            // console.log("555")
            return "chocieTF"
        } else {
            return "chocieSort"
        }
    }

    const show_quiz_set = () => {
        if (dataExam.data.sub_exam != null) {
            return true
        } else {
            return false
        }
    }

    return (
        <Dashboard>

            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    แก้ไขข้อมูลข้อสอบ
                </Typography>
                <PostAddSharp color="primary" className={classes.iconHeadersize} />
            </Box>
            <ExamFill
                defaultV={defaultV}
                onSubmit={onSubmit}
                choiceType={choiceType()}
                quiz_score_per_ans={dataExam.data.quiz_score_per_ans}
                quiz_score={dataExam.data.quiz_score}
                show_skill={SubskillCount()}
                not_show_quiz_set={show_quiz_set()}
                type_choice = {callbackChoice}
            />
            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={openAlert} autoHideDuration={2000} >
                <Alert severity={colerAlert ? "info" : "error"}>
                    {emassage}
                </Alert>
            </Snackbar>
        </Dashboard>
    );
}
