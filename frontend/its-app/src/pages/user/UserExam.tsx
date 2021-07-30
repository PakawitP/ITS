import React from 'react'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { URL } from '../../services/urlAPI'
import axios from "axios";
import { Styles } from '../user/User.styles'
import {
    Button,
    LinearProgress,
    Snackbar,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Box,
    Paper,
    Typography,
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
// import { Link } from "react-router-dom";
import { CheckCircle } from '@material-ui/icons';
import { RountUsers } from '../../services/rountURL'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import ShowExam from '../../component/ShowExam'
import { useHistory } from "react-router-dom";
import Tokenmismatch from '../auth/Tokenmismatch'


const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AdminExam: React.FC = () => {
    const classes = Styles();
    const [flip, setFlip] = React.useState(false)
    const [examID, setexamID] = React.useState(1)
    let history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [emassage, Setemassage] = React.useState("")
    // const [examDis, setExamDis] = React.useState("")
    let data_user = JSON.parse(localStorage.getItem('user') || '{}')
    // console.log("data_user", data_user)
    React.useEffect(() => {

    }, [examID])




    const { data: Exam, error: errorExam } = useSWR(
        URL.API_GetExamForTest + '/' + examID, fetcher, {
        revalidateOnFocus: false,
        // revalidateOnMount: false,
        // revalidateOnReconnect: false,
        // refreshWhenOffline: false,
        // refreshWhenHidden: false,
        refreshInterval: 0
    }
    );

    const { data: quizSet, error: errorquizSet } = useSWR(
        URL.API_GetQuizSet, fetcher
    );

    const { data: TimeQuiz, error: errorTimeQuiz } = useSWR(
        URL.API_GetTimeQuiz, fetcher
    );

    if (errorquizSet || errorTimeQuiz) {
        return (
            <div>
                <div>
                    errorTimeQuiz {errorquizSet}
                </div>
                <div>
                    errorquizSet {errorquizSet}
                </div>
            </div>
        )
    }



    if (errorExam) {
        console.log(errorExam)
    };
    if (!Exam || !quizSet || !TimeQuiz) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (Exam.data === "Token mismatch" && Exam.msg === false) {
        return (
            <Tokenmismatch />
        )
    }
    if (Exam && quizSet && TimeQuiz) {
        console.log("TimeQuiz", Exam)
    };


    const onSubmit = (finalAnswer: any) => {

        // console.log(data)
        // console.log("final", finalAnswer)
        setLoading(true)
        // console.log(data_school_id)
        return axios.post(URL.API_SaveExam, {
            "user_id": data_user.user_id,
            "school_id": data_user.user_school_id,
            "name": data_user.user_first_name + " " + data_user.user_last_name,
            "user_gender": data_user.user_school_id,
            "quiz_set_id": examID,
            "quiz": finalAnswer,
            "totel_quiz": Exam.totel_id_quiz,
            "class": data_user.user_class,
            "data_test": null
        }, {
            headers: {
                Authorization: `${JSON.parse(localStorage.getItem('user') || '{}').token}`
            }
        }).then(response => {
            console.log("response", response);
            setLoading(false)
            if (response.data.msg === true) {
                setColerAlert(true)
                Setemassage("Save Success")
                setTimeout(() => { history.push(RountUsers.StudentScore + data_user.user_id) }, 3000);
            }
            else {
                setColerAlert(false)
                Setemassage(response.data.data)
            }
            setOpenAlert(true)
            return response.data;
        })

    }

    const showSummitButton = (): boolean => {
        if (data_user.user_role_name === "Admin") {
            return false
        } else {
            return true
        }
    }


    const AnswerSheet = () => {
        if (TimeQuiz.data < 2) {
            let quizAnstemp = []
            let choiceTemp = []
            let choiceSelect = []
            let c: boolean | number //คำตอบเริ่มต้น
            let choiceTF: boolean | undefined
            for (let i = 0; i < Exam.data.length; i++) { // ข้อสอบเเต่ละข้อ
                choiceTemp = []
                choiceSelect = []
                if (typeof (Exam.data[i].quiz_choice[1].choice_correct) == typeof (true)) {
                    c = false
                    choiceTF = true
                } else {
                    c = 1
                    choiceTF = false
                }
                for (let j = 0; j < Exam.data[i].quiz_choice.length; j++) {

                    choiceSelect.push(Exam.data[i].quiz_choice[j].choice_id)
                    let Temp = {
                        "choice_id": Exam.data[i].quiz_choice[j].choice_id,
                        "choice_name": Exam.data[i].quiz_choice[j].choice_name,
                        "choice_correct": c,
                        "image": Exam.data[i].quiz_choice[j].image,
                    }
                    choiceTemp.push(Temp)

                }
                let Anstemp = {
                    "quiz_point": Exam.data[i].quiz_point,
                    "quiz_id": Exam.data[i].quiz_id,
                    "quiz_proposition": Exam.data[i].quiz_proposition,
                    "quiz_choice": choiceTemp,
                    "image_proposition": Exam.data[i].image_proposition,
                    "type_choice": choiceTF,
                    "choice_Select": choiceSelect,
                }
                quizAnstemp.push(Anstemp)

            }

            return quizAnstemp
        }
        else {
            return
        }
    }



    // console.log(AnswerSheet())


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setexamID(parseInt(event.target.value as string));

    };

    const createTime = () => {
        let time = Exam.dis_quiz_set.quiz_set_time
        let a = time / 60
        let b = a % 1
        let c = a - b
        let s
        if (time % 60 === 0) {
            s = `${c} ชั่วโมง `
        } else {
            s = `${c} ชั่วโมง ${time % 60} นาที`
        }

        return s
    }


    return (
        <Dashboard>

            {TimeQuiz.data >= 2 ?
                <Box display="flex" alignItems="center" flexDirection="column" style={{ marginBottom: 10 }}>
                    <CheckCircle color="primary" style={{ fontSize: 50 }} />
                    <Typography variant="h3">
                        คุณ {data_user.user_first_name + " " + data_user.user_last_name} ได้ทำเเบบทดสอบครบเเล้ว
                    </Typography>
                </Box> :
                <div>

                    {flip ?

                        <ShowExam
                            data={AnswerSheet()}
                            onSubmit={onSubmit}
                            Admin={false}
                            timer={Exam.dis_quiz_set.quiz_set_time}
                            showSummitButton={showSummitButton()}
                        />

                        :
                        <div className={classes.centerpage}>

                            {TimeQuiz.data < 1 ?
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">
                                        ชุดข้อสอบ
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={examID}
                                        onChange={handleChange}
                                    >
                                        {quizSet.data.map((item: any) => {
                                            return (
                                                <MenuItem value={item.quiz_set_id}>
                                                    {item.quiz_set_name}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl> : null}
                            <div className={classes.paperdis}>
                                <Paper elevation={5} >
                                    <Box display="flex" justifyContent="center" style={{ margin: 15 }}>
                                        <Typography variant="h4" className={classes.MaginTopTitle}>
                                            กฎ/คำชี้เเนะในการทำข้อสอบ
                                        </Typography>
                                    </Box>
                                    {Exam.dis_quiz_set.quiz_set_discription ? <div style={{ margin: 10 }}>
                                        {
                                            Exam.dis_quiz_set.quiz_set_discription.split('\n').map((item: string) => {
                                                return (
                                                    <span>
                                                        {item}
                                                        <br />
                                                    </span>
                                                );
                                            })
                                        }
                                    </div> : null}
                                    <div style={{ margin: 10 }}>
                                        เวลาทำข้อสอบ {createTime()}
                                    </div>
                                </Paper>
                            </div>


                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => { setFlip(true) }}
                            >
                                เข้าสู่การทำข้อสอบ
                            </Button>
                        </div>
                    }
                </div>
            }

            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={openAlert} autoHideDuration={5000} >
                <Alert severity={colerAlert ? "success" : "error"}>
                    {emassage}
                </Alert>
            </Snackbar>

        </Dashboard>
    )
}

export default AdminExam;