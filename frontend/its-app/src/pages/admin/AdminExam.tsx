import React from 'react'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { URL } from '../../services/urlAPI'
import { Styles } from './Admin.styles'
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    LinearProgress,
    InputBase,
    Box,
    Typography
} from '@material-ui/core'
import Tokenmismatch from '../auth/Tokenmismatch'
import SearchIcon from '@material-ui/icons/Search';
import { Assignment } from '@material-ui/icons';
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import ShowExam from '../../component/ShowExam'


const AdminExam: React.FC = () => {
    const classes = Styles();
    const [examID, setexamID] = React.useState(1)
    const [dataExam, setDataExam] = React.useState<any>([])
    const [search, setSearch] = React.useState("")

    const { data: Exam, error: errorExam } = useSWR(
        URL.API_ShowAdminExam + '/' + examID, fetcher,
        {
            refreshInterval: 3000
        }
    );
    const { data: Skill, error: errorSkill } = useSWR(
        URL.API_GetSkill, fetcher
    );
    const { data: quizSet, error: errorquizSet } = useSWR(
        URL.API_GetQuizSet, fetcher
    );

    React.useEffect(() => {
        if (Exam) {
            if (Exam.data.length > 0) {
                setDataExam(Exam.data)
            } else {
                setDataExam([])
            }

        }

    }, [examID, Exam])

    if (errorExam) {
        return (
            <div>
                {errorExam && (<div>
                    errorExam {errorExam}
                </div>)}
                {errorSkill && (<div>
                    errorSkill {errorSkill}
                </div>)}
                {errorquizSet && (<div>
                    errorquizSet {errorquizSet}
                </div>)}
            </div>
        )
    };
    if (!Exam || !Skill || !quizSet) {

        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (Exam && Skill && quizSet) {
        // if(Exam.data === "Token mismatch" && Exam.msg == false){
        //     setOpenmismatch(true)
        // }
        console.log('55', Exam)
    };

    const dicSkill = () => {
        var skill: { [id: number]: string; } = {};
        Skill.data.forEach((numskill: any) => {
            skill[numskill.skill_id] = numskill.skill_name
        });

        return skill
    }


    if (Exam.data === "Token mismatch" && Exam.msg === false) {
        return (
            <Tokenmismatch />
        )
    }

    const searchFilterFunction = (text: string) => {
        if (text !== "" && dataExam.length > 0) {
            const newData = dataExam.filter(function (item: any) {
                const itemData = item.quiz_proposition
                    ? item.quiz_proposition.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setDataExam(newData);
            setSearch(text);
        }
        else if (text !== "" && dataExam.length == 0) {
            const newData = Exam.data.filter(function (item: any) {
                const itemData = item.quiz_proposition
                    ? item.quiz_proposition.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setDataExam(newData);
            setSearch(text);
        }
        else {
            setDataExam(Exam.data);
            setSearch(text);
        }

    };



    return (
        <Dashboard>

            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    ข้อสอบ

                </Typography>
                <Assignment color="primary" className={classes.iconHeadersize} />
            </Box>

            <Box display="flex"
                flexDirection="row"
                alignItems="center"
                p={1}
                m={1}
            >

                <Box p={1}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon color="primary" />
                        </div>
                        <InputBase
                            onChange={(e) => searchFilterFunction(e.target.value)}
                            placeholder="ค้นหาโจทย์ข้อสอบ"
                            value={search}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </Box>
                <Box p={1}>
                    <FormControl className={classes.formControl}>
                        <InputLabel
                            id="demo-simple-select-label"
                        >
                            ชุดข้อสอบ
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={examID}
                            onChange={
                                (event: React.ChangeEvent<{ value: unknown }>) => {
                                    setexamID(parseInt(event.target.value as string));
                                }}
                        >
                            {quizSet.data.map((item: any) => {
                                return (
                                    <MenuItem value={item.quiz_set_id}>
                                        {item.quiz_set_name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {dataExam && (<ShowExam
                data={dataExam}
                Admin={true}
                skill={dicSkill()}
                timer={0}

            />)}
        </Dashboard>
    )
}

export default AdminExam;