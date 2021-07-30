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
    Box,
    Grid,
    InputBase,
    Divider,
    Typography,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import PieChart from '../../component/chart/PieChart'
import Tokenmismatch from '../auth/Tokenmismatch'

const EvaluationResults: React.FC = () => {
    const classes = Styles();
    const [examID, setexamID] = React.useState(1)
    const [dataExam, setDataExam] = React.useState<any>([])
    const [search, setSearch] = React.useState("")



    const { data: Exam, error: errorExam } = useSWR(
        URL.API_GetAnswerScoreTestMode + '/' + examID, fetcher
    );
    const { data: ChoiceTest, error: errorChoiceTest } = useSWR(
        URL.API_GetChoiceTestModeAll, fetcher
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
    }, [examID,Exam])

    if (errorExam || errorChoiceTest || errorquizSet) {
        return (
            <div>
                {errorExam && (
                    <div>errorExam {errorExam}</div>
                )}
                {errorChoiceTest && (
                    <div>errorChoiceTest {errorChoiceTest}</div>
                )}
                {errorquizSet && (
                    <div>errorquizSet {errorquizSet}</div>
                )}
            </div>
        )
    };
    if (!Exam || !ChoiceTest || !quizSet) {

        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (Exam && ChoiceTest && quizSet) {
        // console.log('55', Exam)
    };

    if (Exam.data === "Token mismatch" && Exam.msg === false) {
        return (
            <Tokenmismatch />
        )
    }


    const chart = (item: any) => {
        if (item.choiceOne.score + item.choiceTwo.score === 0) {
            return
        }
        return (
            <Grid item xs={12} sm={6}>
                <div
                // className={classes.spaceChart}
                >
                    <PieChart
                        Label={[item.choiceOne.name, item.choiceTwo.name]}
                        Score={[item.choiceOne.score, item.choiceTwo.score]}
                        Title={item.test_name}
                    />
                </div>
            </Grid>

        )
    }

    const ItemView = (item: any, quizekey: number) => {

        return (
            <div key={quizekey} >
                <div style={{ marginLeft: 50 }}>
                    <Grid
                        container
                        // direction="column"
                        alignItems='flex-start'
                    >
                        <Grid item xs={7}>
                            <Box display="flex" flexDirection="row" p={1} m={1}>
                                <Box p={1}>
                                    {item.quiz_point}.{'\t'}
                                </Box>
                                <Box p={1}>
                                    {
                                        item.quiz_proposition.split('\n').map((item: string) => {
                                            return (
                                                <span>
                                                    {item}
                                                    <br />
                                                </span>
                                            );
                                        })
                                    }
                                    {/* {SizeImage(item.image_proposition)} */}
                                    {item.image_proposition ? <div>
                                        <img style={{ maxHeight: '100%', maxWidth: '100%' }} src={item.image_proposition} alt="image_proposition" />
                                    </div> : null}

                                    <div className={classes.choiceMagin}>
                                        {item.quiz_choice.map((choice: any, key: number) => {
                                            return (
                                                <div key={key}>
                                                    {key + 1} {choice.choice_name}
                                                    {/* <div>
                                                    {SizeImage(choice.image)}
                                                </div> */}
                                                    {choice.image ? <div>
                                                        <img style={{ maxHeight: '90%', maxWidth: '90%' }} src={choice.image} alt="image_m" />
                                                    </div> : null}

                                                </div>
                                            )
                                        })}
                                    </div>
                                </Box>
                            </Box>
                        </Grid >
                        <Grid item xs={5} >
                            {item.choice_test[0].choiceOne.score
                                + item.choice_test[1].choiceTwo.score !== 0 ?
                                <Box >
                                    <Box display="flex" justifyContent="center" p={1} m={1}>
                                        <Typography variant="h4" className={classes.MaginTopTitle}>
                                            สรุปผลการประเมินข้อสอบ (ร้อยละ)
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        {item.choice_test.map(chart)}
                                    </Grid>
                                </Box> : <Box p={1} m={1}> ยังไม่มีคะเเนนประเมิน </Box>}
                        </Grid >
                    </Grid >
                </div>
                <Divider style={{ marginTop: 20 }} />
            </div>
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
            {/* {<div> */}
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                p={1}
                m={1}
            >
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
            {Exam.data.length > 0 ?
                <div>
                    <Box
                        display="flex"
                        justifyContent="center"
                        m={1} p={1}
                        alignItems="center"
                        flexDirection="column"
                    >
                        <Box p={1}>
                            <Typography variant="h3" className={classes.MaginTopTitle}>
                                สรุปผลการประเมินข้อสอบ (ร้อยละ)
                            </Typography>

                        </Box>

                        <Box p={1} width={"75%"}>

                            <Grid container spacing={3}>
                                {Exam.totel.map(chart)}
                            </Grid>
                        </Box>
                    </Box>
                    <Box p={1} m={1} flexDirection='column'>
                        <Box p={1}>
                            <Typography variant="h3" className={classes.MaginTopTitle}>
                                สรุปผลการประเมินข้อสอบรายข้อ
                            </Typography>
                        </Box>

                        <Box display="flex"
                            flexDirection="row"
                            alignItems="center"
                            p={1}
                            m={1}>
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
                    </Box>
                </div> : null}
            {dataExam.map(ItemView)}
            {/* </div>} */}
        </Dashboard>
    )
}

export default EvaluationResults;