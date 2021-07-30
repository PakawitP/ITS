import {
    LinearProgress,
    // Typography,
    Box
} from '@material-ui/core'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { useParams } from "react-router-dom"
import { ScoreByUser } from '../../services/calculate/DataScore'
// import DoubleBarChar from '../../component/chart/DoubleBarChar'
import RadarChart from '../../component/chart/RadarChart'
// import BasicTable from '../../component/BasicTable'
// import { Styles } from './User.styles'
import { URL } from '../../services/urlAPI'
import Tokenmismatch from '../auth/Tokenmismatch'

const StudentShowScore = () => {
    // const classes = Styles();
    const { id } = useParams<any>();
    const { data: Data_Score, error: ErrorScore } = useSWR(
        (URL.API_ShowScoreStudent + '/' + id), fetcher
    );


    let DataAfterCal: any
    let AnswerScore: any = []

    if (ErrorScore) {
        <div>
            {ErrorScore && (<div>
                ErrorScore {ErrorScore}
            </div>)}
        </div>
    };
    if (!Data_Score) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (Data_Score.data === "Token mismatch" && Data_Score.msg === false) {
        return (
            <Tokenmismatch />
        )
    }

    if (Data_Score) {
        console.log("Data_Score.data.data", Data_Score)

        DataAfterCal = ScoreByUser(Data_Score.data.data, Data_Score.data.skill)
        console.log("DataAfterCal", DataAfterCal)
        Data_Score.data.data.forEach((item: any) => {
            AnswerScore.push(item.answer_score)
        });
    };


    return (
        <Dashboard>

            <Box
                display="flex"
                justifyContent="center"
            //    m={1} p={1}
            //    alignItems="center"
            //    flexDirection="column"
            // style={{ height: '60%' }}
            >
                <Box p={1} style={{ width: '60%' }}>
                    <RadarChart
                        Label={DataAfterCal.First.Skill}
                        FirstScore={DataAfterCal.First.ResultsScore}
                        SecondScore={DataAfterCal.Second.ResultsScore}
                        FirstLable={`ผลคะเเเนนครั้งที่ 1`}
                        SecondLable={`ผลคะเเเนนครั้งที่ 2`}
                        Title={`ผลคะเเเนนรวมของ ${Data_Score.data.data[0].name} (ร้อยละ)`}
                    />
                </Box>
            </Box>


            {/* <div className={classes.spaceChart}>
                    <div>
                        <Typography variant="h4" className={classes.headercenterpage}>
                            คะเเนนที่ทำได้เเต่ละข้อ
                        </Typography>                 
                        {AnswerScore.length == 2 ?
                            <BasicTable FirstScore={AnswerScore[0]} SecondScore={AnswerScore[1]} />
                            : <BasicTable FirstScore={AnswerScore[0]} />}
                    </div>
                </div> */}

        </Dashboard>

    )
}

export default StudentShowScore