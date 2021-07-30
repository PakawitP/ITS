import React from 'react'
import {
    // Paper,
    // Grid,
    Button,
    LinearProgress,
    // Divider,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from '@material-ui/core'



import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { Link } from "react-router-dom"
import { DataScore } from '../../services/calculate/DataScore'
import { URL } from '../../services/urlAPI'
import { RountUsers } from '../../services/rountURL'
// import PolarAreaChar from '../../component/chart/PolarAreaChart'
import DoubleBarChar from '../../component/chart/DoubleBarChar'
import { Province, School, UserBySchool } from '../../services/fillter/SchoolFillter'
// import { set } from 'react-hook-form'
import { Styles } from './User.styles'
import Tokenmismatch from '../auth/Tokenmismatch'

const TestResults = () => {


    const { data: Data_Score, error: ErrorScore } = useSWR(
        (URL.API_GetScoreTotalAnswer), fetcher
    );
    const { data: Data_School, error: ErrorSchool } = useSWR(
        (URL.API_GetAddressBySchool), fetcher
    );

    const classes = Styles();
    const [DataAfterCal, setDataAfterCal] = React.useState<any>(null)
    const [s, setS] = React.useState<number>(-1)
    const [t, setT] = React.useState<any>(null)
    const [p, setP] = React.useState<number>(0)


    if (ErrorScore || ErrorSchool) {
        return (
            <div>
                <div>
                    ErrorScore {ErrorScore}
                </div>
                <div>
                    ErrorSchool {ErrorSchool}
                </div>
            </div>
        )
    };
    if (!Data_Score || !Data_School) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (Data_Score.data === "Token mismatch" && Data_Score.msg === false) {
        return (
            <Tokenmismatch/>
        )
    }
    if (Data_Score && Data_School) {
        // console.log("Data_Score",Data_Score)
        if (t == null) {
            setT(Data_School.data[0].data_school)
            setDataAfterCal(DataScore(Data_Score.data.data, Data_Score.data.skill, true))
        }

    };


    const handleChangeProvince = (e: number) => {
        setS(-1)
        setP(e)
        setT(Data_School.data[e].data_school)
        if (e === 0) {
            setDataAfterCal(DataScore(Data_Score.data.data, Data_Score.data.skill, true))
            return
        }
        let provinceData = Province(Data_School.data[e].data_school, Data_Score.data.data)
        setDataAfterCal(DataScore(provinceData, Data_Score.data.skill, true))
    };

    const handleChangeSchool = (e: number) => {

        setS(e)
        if (e === -1) {
            let provinceData = Province(Data_School.data[p].data_school, Data_Score.data.data)
            setDataAfterCal(DataScore(provinceData, Data_Score.data.skill, true))
            return
        }
        let SchoolData = School(e, Data_Score.data.data)
        setDataAfterCal(DataScore(SchoolData, Data_Score.data.skill, true))
    };

    const StudentShow = (item: any, key: number) => {
        return (
            <div>
                {key + 1}. {item.name}
                <Button component={Link} to={RountUsers.StudentScore + item.user_id}>รายละเอียด</Button>
                
            </div>
        )
    }


    return (
        <Dashboard>

            <FormControl className={classes.formControl}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    จังหวัด
                </InputLabel>
                <Select
                    value={p}
                    onChange={(e: any) => { handleChangeProvince(parseInt(e.target.value)) }}
                    displayEmpty
                    className={classes.selectEmpty}
                >

                    {Data_School.data.map((dat: any, key: number) => {

                        return (<MenuItem key={key} value={dat.province_id}>{dat.province_name}</MenuItem>)
                    })}

                </Select>

            </FormControl>
            {t != null ? <FormControl className={classes.formControl}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    โรงเรียน
                </InputLabel>
                <Select
                    value={s}
                    onChange={(e: any) => { handleChangeSchool(parseInt(e.target.value)) }}
                    displayEmpty
                    className={classes.selectEmpty}
                >
                    <MenuItem value={-1}>{"ทั้งหมด"}</MenuItem>
                    {t.map((dat: any, key: number) => {

                        return (<MenuItem key={key} value={dat.school_id}>{dat.school_name}</MenuItem>)
                    })}

                </Select>

            </FormControl> : null}


            {DataAfterCal != null ? <div>


                {/* {DataAfterCal.FirstNCount != DataAfterCal.SecondNCount ? <div>
                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>
                            <PolarAreaChar
                                Label={DataAfterCal.FirstN.Skill}
                                Score={DataAfterCal.FirstN.ResultsScore}
                                Lable={`ผลคะเเนนครั้งที่ 1 จำนวน ${DataAfterCal.FirstNCount} คน`}
                                Title={`ผลคะเเนนรวมครั้งที่ 1 จำนวน ${DataAfterCal.FirstNCount} คน ( ร้อยละ )`}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PolarAreaChar
                                Label={DataAfterCal.SecondN.Skill}
                                Score={DataAfterCal.SecondN.ResultsScore}
                                Lable={`ผลคะเเนนครั้งที่ 2 จำนวน ${DataAfterCal.SecondNCount} คน`}
                                Title={`ผลคะเเนนรวมครั้งที่ 2 จำนวน ${DataAfterCal.SecondNCount} คน ( ร้อยละ )`}
                            />
                        </Grid>

                    </Grid>

                </div> : null} */}
                <div className={classes.maginChart}>
                    <div className={classes.spaceChart}>
                        <DoubleBarChar
                            Label={DataAfterCal.First.Skill}
                            FirstScore={DataAfterCal.First.ResultsScore}
                            SecondScore={DataAfterCal.Second.ResultsScore}
                            FirstLable={`ผลคะเเนนครั้งที่ 1 จำนวน ${DataAfterCal.FirstCount} คน`}
                            SecondLable={`ผลคะเเนนครั้งที่ 2 จำนวน ${DataAfterCal.SecondCount} คน`}
                            Title={`ผลคะเเนนรวม จำนวน ${DataAfterCal.SecondCount} คน ( ร้อยละ )`}
                        />
                    </div>
                    <div className={classes.spaceChart}>
                        <DoubleBarChar
                            Label={DataAfterCal.First.Skill}
                            FirstScore={DataAfterCal.MaleFirst.ResultsScore}
                            SecondScore={DataAfterCal.MaleSecond.ResultsScore}
                            FirstLable={`ผลคะเเนนเพศชายครั้งที่ 1 จำนวน ${DataAfterCal.MaleFirstCount} คน`}
                            SecondLable={`ผลคะเเนนเพศชายครั้งที่ 2 จำนวน ${DataAfterCal.MaleSecondCount} คน`}
                            Title={`ผลคะเเนนเพศชาย จำนวน ${DataAfterCal.MaleSecondCount} คน ( ร้อยละ )`}
                        />
                    </div>
                    <div className={classes.spaceChart}>
                        <DoubleBarChar
                            Label={DataAfterCal.First.Skill}
                            FirstScore={DataAfterCal.FemaleFirst.ResultsScore}
                            SecondScore={DataAfterCal.FemaleSecond.ResultsScore}
                            FirstLable={`ผลคะเเนนเพศหญิงครั้งที่ 1 จำนวน ${DataAfterCal.FemaleFirstCount} คน`}
                            SecondLable={`ผลคะเเนนเพศหญิงครั้งที่ 2 จำนวน ${DataAfterCal.FemaleSecondCount} คน`}
                            Title={`ผลคะเเนนเพศหญิง จำนวน ${DataAfterCal.FemaleSecondCount} คน ( ร้อยละ )`}
                        />
                    </div>
                </div>
            </div> : null}
            {s !== -1 ?
                <div className={classes.maginChart}>
                    <div className={classes.spaceChart}>
                        <div style={{ marginBottom: 20 }}>รายชื่อนักเรียนที่ข้อสอบ</div>
                        <div style={{ margin: 20 }}>
                            {UserBySchool(Data_Score.data.data, s).map(StudentShow)}
                        </div>
                    </div>
                </div> : null
            }

        </Dashboard>

    )
}

export default TestResults