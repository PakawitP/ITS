import React from 'react'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { URL } from '../../services/urlAPI'
import { Styles } from './User.styles'
import {
    Typography,
    Grid,
    LinearProgress,
    Button,
    Box
} from '@material-ui/core'
import { DataScore } from '../../services/calculate/DataScore'
import { RountUsers } from '../../services/rountURL'
import { useParams } from "react-router-dom"
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { UserBySchool } from '../../services/fillter/SchoolFillter'
import { Link } from "react-router-dom"
import {LocalLibrary} from '@material-ui/icons';
import DoubleBarChar from '../../component/chart/DoubleBarChar'
import Tokenmismatch from '../auth/Tokenmismatch'


const DataSchool: React.FC = () => {
    const { id } = useParams<any>();
    const classes = Styles();

    let DataAfterCal: any
    const { data: dataResults, error: errorResults } = useSWR(
        URL.API_ResultsSchool + '/' + id, fetcher
    );

    const { data: dataSchool, error: errorSchool } = useSWR(
        URL.API_GetSchoolID + '/' + id, fetcher, { refreshInterval: 3000 }
    );


    if (errorSchool) {
        return (
            <div>
                {errorSchool && (<div>
                    errorSchool {errorSchool}
                </div>)}
                {errorResults && (<div>
                    errorResults {errorResults}
                </div>)}

            </div>
        )

    };
    if (!dataSchool || !dataResults) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (dataSchool.data === "Token mismatch" && dataSchool.msg === false) {
        return (
            <Tokenmismatch />
        )
    }

    if (dataSchool) {
        // console.log("dataResults",dataResults)
        DataAfterCal = DataScore(dataResults.data.data, dataResults.data.skill, false)
    };



    const ItemView = (item: any, key: number) => {
        return (
            <Grid key={key} item>
                <img src={item.school_image_name} alt="imageSchool" style={{ height: 300, width: 450 }}></img>
            </Grid>
        )
    }
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
            <div >
                <Typography variant="h2" className={classes.headercenterpage} >
                    {dataSchool.data[0].school_name}
                </Typography>
                <div className={classes.headercenterpage}>
                    <img style={{ maxHeight: '80%', maxWidth: '80%' }} src={dataSchool.data[0].school_pic_director} alt="imageSchool" />
                    <Box p={1}>
                        <Typography variant="h5" className={classes.headercenterpage}>
                            ผู้อำนวยการ : {dataSchool.data[0].school_director}
                        </Typography>
                    </Box>
                </div>

                <Grid container className={classes.Gridroot} spacing={2}>
                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={5}>
                            {dataSchool.data[0].school_image.map(ItemView)}
                        </Grid>
                    </Grid>
                </Grid>

                <div className={classes.maginChart}>
                    <div className={classes.spaceChart}>
                        <Box display="flex" p={1} m = {1} justifyContent='flex-start'>
                            <LocalLibrary color="primary"/>
                            <Typography variant="h4" >     
                                ข้อมูลโรงเรียน                    
                            </Typography>
                            
                        </Box>
                        <Typography variant="h5">
                            {dataSchool.data[0].school_profile_school}
                        </Typography>
                        <Typography variant="h5">
                            อำเภอ {dataSchool.data[0].school_sub_district} จังหวัด {dataSchool.data[0].school_province}
                        </Typography>

                        <Typography variant="h5">
                            จำนวนผู้สอบครั้งที่ 1 จำนวน {DataAfterCal.FirstNCount} คน
                        </Typography>
                        <Typography variant="h5">
                            จำนวนผู้สอบครั้งที่ 2 จำนวน {DataAfterCal.SecondNCount} คน
                        </Typography>
                    </div>

                    <div className={classes.spaceChart}>
                        <DoubleBarChar
                            Label={DataAfterCal.First.Skill}
                            FirstScore={DataAfterCal.First.ResultsScore}
                            SecondScore={DataAfterCal.Second.ResultsScore}
                            FirstLable={`ผลคะเเเนนครั้งที่ 1 จำนวน ${DataAfterCal.FirstCount} คน`}
                            SecondLable={`ผลคะเเเนนครั้งที่ 2 จำนวน ${DataAfterCal.SecondCount} คน`}
                            Title={`ผลคะเเเนนรวม จำนวน ${DataAfterCal.SecondCount} คน (เปอร์เซ็น)`}
                        />
                    </div>
                    <div className={classes.spaceChart}>
                        <DoubleBarChar
                            Label={DataAfterCal.First.Skill}
                            FirstScore={DataAfterCal.MaleFirst.ResultsScore}
                            SecondScore={DataAfterCal.MaleSecond.ResultsScore}
                            FirstLable={`ผลคะเเเนนเพศชายครั้งที่ 1 จำนวน ${DataAfterCal.MaleFirstCount} คน`}
                            SecondLable={`ผลคะเเเนนเพศชายครั้งที่ 2 จำนวน ${DataAfterCal.MaleSecondCount} คน`}
                            Title={`ผลคะเเเนนเพศชาย จำนวน ${DataAfterCal.MaleSecondCount} คน (เปอร์เซ็น)`}
                        />
                    </div>
                    <div className={classes.spaceChart}>
                        <DoubleBarChar
                            Label={DataAfterCal.First.Skill}
                            FirstScore={DataAfterCal.FemaleFirst.ResultsScore}
                            SecondScore={DataAfterCal.FemaleSecond.ResultsScore}
                            FirstLable={`ผลคะเเเนนเพศหญิงครั้งที่ 1 จำนวน ${DataAfterCal.FemaleFirstCount} คน`}
                            SecondLable={`ผลคะเเเนนเพศหญิงครั้งที่ 2 จำนวน ${DataAfterCal.FemaleSecondCount} คน`}
                            Title={`ผลคะเเเนนเพศหญิง จำนวน ${DataAfterCal.FemaleSecondCount} คน (เปอร์เซ็น)`}
                        />
                    </div>

                    {dataResults.data.data.length > 0 && (<div className={classes.maginChart}>
                        <div className={classes.spaceChart}>
                            <div style={{ marginBottom: 20 }}>รายชื่อนักเรียนที่ข้อสอบ</div>
                            <div style={{ margin: 20 }}>
                                {UserBySchool(dataResults.data.data, id).map(StudentShow)}
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
        </Dashboard>
    )

}
export default DataSchool;