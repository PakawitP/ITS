import React from "react";
import {
  Box,
  Typography,
  Snackbar,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { Styles } from './Admin.styles'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { PostAddSharp } from '@material-ui/icons';
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import axios from "axios";
import ExamFill from "../../component/ExamFill";
import { URL } from '../../services/urlAPI'
import { useHistory } from "react-router-dom";
import { RountAdmin } from "../../services/rountURL";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useParams } from "react-router-dom";
import Tokenmismatch from '../auth/Tokenmismatch'


export interface quiz_choice {
  choice_name: string;
  choice_correct: boolean | number;
  choice_id: number | string;
}


export interface ChoiceImage {
  choice_id: number;
  image: string | null;
}

export interface SubSkill {
  skill_id: number;
  score_percent: number;
}

export interface FormValues {
  Proposition: string;
  QuizSet: number | string;
  SkillTest: number | string;
  Choice: quiz_choice[];
  ImageProposition?: any;
  ChoiceImage: any[];
  QuizSubSkill: any;
  dataskill: any
  dataquizset: any
};
export var subSkill: { [id: number]: SubSkill } = {}


const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Exam() {
  let history = useHistory();
  const classes = Styles();
  const { id } = useParams<any>();
  const [loading, setLoading] = React.useState(false);
  const [colerAlert, setColerAlert] = React.useState(true);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [emassage, Setemassage] = React.useState("")
  const [typeC, setTypeC] = React.useState<any>()

  const { data: dataskill, error: errorskill } = useSWR(
    [URL.API_GetSkill], fetcher
  );

  const { data: dataquizset, error: errorquizset } = useSWR(
    [URL.API_GetQuizSet], fetcher
  );

  const { data: examsetquiz, error: errorexamsetquiz } = useSWR(
    id ? [URL.API_GetExamSetID + '/' + id] : null, fetcher
  );

  if (errorquizset || errorexamsetquiz || errorskill) {
    return (
      <div>
        {errorexamsetquiz && (
          <div>errorexamsetquiz {errorexamsetquiz}</div>
        )}
        {errorquizset && (
          <div>errorquizset {errorquizset}</div>
        )}
        {errorskill && (
          <div>errorskill {errorskill}</div>
        )}
      </div>
    )
  };



  if (!dataskill || !dataquizset) {
    return (
      <LinearProgress style={{ height: 4 }} />
    )
  };

  if (id !== undefined && !examsetquiz) {
    return (
      <LinearProgress style={{ height: 4 }} />
    )
  }

  if (dataskill && dataquizset && examsetquiz) {
    // console.log("skill", examsetquiz)
  };

  if (dataskill.data === "Token mismatch" && dataskill.msg === false) {
    return (
      <Tokenmismatch />
    )
  }

  // console.log("id", id)
  const SubskillByID = () => {
    dataskill.data.forEach((item: any) => {
      subSkill[item.skill_id] = { skill_id: item.skill_id, score_percent: 0 }
    });
    return subSkill
  }



  let defaultV: FormValues = {
    Proposition: "",
    ImageProposition: null,
    QuizSet: "",
    SkillTest: "",
    Choice: [{ choice_name: "", choice_correct: false, choice_id: 0 }],
    ChoiceImage: [{ choice_id: 0, image: null }],
    QuizSubSkill: SubskillByID(),
    dataquizset: dataquizset,
    dataskill: dataskill,
  }

  const saveQuizSet = (quizset: number | string) => {
    if (id) {
      return examsetquiz.data.quiz_quiz_set_id
    } else {
      return quizset
    }
  }


  const onSubmit = (data: FormValues) => {
    let subSkill: any = [];
    let DataChoice: any = [];

    setLoading(true)

    for (let i = 0; i < data.Choice.length; i++) {
      // DataChoice.push(
      //   {
      //     choice_name: data.Choice[i].choice_name,
      //     choice_correct: data.Choice[i].choice_correct,
      //     image: data.ChoiceImage[i].image,
      //   })

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
      subSkill.push(data.QuizSubSkill[key])
    });

    return axios.post(URL.API_CreateExam, {
      "quiz_proposition": data.Proposition,
      "quiz_choice": DataChoice,
      "quiz_skill_id": data.SkillTest,
      "quiz_quiz_set_id": saveQuizSet(data.QuizSet),
      "image_proposition": data.ImageProposition || null,
      "quiz_subskill": subSkill,
      "sub_exam": id || null,
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



  const show_quiz_set = (): boolean => {
    if (id) {
      return true
    } else {
      return false
    }
  }

  const callbackChoice = (type: string) => {
    setTypeC(type)
  }


  return (
    <Dashboard>

      <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
        <Typography variant="h3" className={classes.MaginTopTitle}>
          เพิ่มข้อมูลข้อสอบ
        </Typography>
        <PostAddSharp color="primary" className={classes.iconHeadersize} />
      </Box>
      <div>
        <ExamFill
          defaultV={defaultV}
          choiceType={"chocieTF"}
          onSubmit={onSubmit}
          show_skill={false}
          not_show_quiz_set={show_quiz_set()}
          type_choice={callbackChoice}
        />
      </div>
      <Backdrop className={classes.backdrop} open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={openAlert} autoHideDuration={5000} >
        <Alert severity={colerAlert ? "success" : "error"}>
          {emassage}
        </Alert>
      </Snackbar>
    </Dashboard>
  );
}
