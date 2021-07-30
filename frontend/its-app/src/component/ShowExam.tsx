import React from 'react'
import { Styles } from '../pages/user/User.styles'
import {
    Grid,
    Button,
    Divider,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    FormLabel,
    Box,

} from '@material-ui/core'
import { Link } from "react-router-dom";
import { Check, Clear, Edit, AddCircle, Delete } from '@material-ui/icons';
import {
    RountAdmin,
} from '../services/rountURL'
import { URL } from '../services/urlAPI'
import CountdownTimer from '../component/timer/CountdownTimer'
import Confirm from './alerFun/Confirm'

export type PropsExam = {
    data: any
    Admin: boolean
    onSubmit?: (finalAnswer: any) => void;
    showSummitButton?: boolean
    dataTestMode?: any
    dataResponsive?: any
    skill?: any
    timer?: number
}

const ShowExam: React.FC<PropsExam> = ({ data,
    Admin,
    onSubmit,
    showSummitButton,
    skill,
    timer,
    dataTestMode,
    dataResponsive,
}) => {

    const classes = Styles();
    const [stateAnswer, setStateAnswer] = React.useState(data)
    const [disabledchoice, setDisabledchoice] = React.useState(false)
    const [dataTest, setDataTest] = React.useState(dataTestMode)
    const [open, setOpen] = React.useState(false);
    const [id, setID] = React.useState<number>(0);

    // console.log(dataResponsive)

    const handleChange = (event: any, choice: number, quiz: number, type: string) => {
        let newArr = [...stateAnswer]
        if (type === "select") {
            // console.log(event.target.value)
            newArr[quiz].quiz_choice[choice].choice_correct = event.target.value
        } else {
            newArr[quiz].quiz_choice[choice].choice_correct = event.target.checked
        }

        setStateAnswer(newArr);
    };

    const handleChangeDataTest = (event: React.ChangeEvent<HTMLInputElement>, point: number, test: number) => {
        // console.log((event.target as HTMLInputElement).value,test,point)
        let newOb = { ...dataTest }
        // console.log("newOb[test][point]",newOb[test][point])
        newOb[point][test] = (event.target as HTMLInputElement).value
        setDataTest(newOb)
        // console.log(newOb)
    }


    const checkAnswer = () => {
        let quizAnstemp = []
        let choiceTemp = []
        for (let i = 0; i < stateAnswer.length; i++) {
            choiceTemp = []
            for (let j = 0; j < stateAnswer[i].quiz_choice.length; j++) {
                // console.log(typeof (stateAnswer[i].quiz_choice[j].choice_correct))
                if (stateAnswer[i].quiz_choice[j].choice_correct !== false && typeof (stateAnswer[i].quiz_choice[j].choice_correct) === typeof (false)) {
                    choiceTemp.push(stateAnswer[i].quiz_choice[j].choice_id)

                }
                else {
                    let num = parseInt(stateAnswer[i].quiz_choice[j].choice_correct)
                    if (num >= 0) {
                        choiceTemp.push(num)
                    }
                    // if (typeof (stateAnswer[i].quiz_choice[j].choice_correct) == typeof ("") && stateAnswer[i].quiz_choice[j].choice_correct != -1) {
                    //     choiceTemp.push(stateAnswer[i].quiz_choice[j].choice_id)
                    //     console.log(stateAnswer[i].quiz_choice[j].choice_correct)
                }
            }
            let Anstemp = {
                "quiz_id": stateAnswer[i].quiz_id,
                "choice_id": choiceTemp
            }
            quizAnstemp.push(Anstemp)

        }

        if (dataTestMode !== undefined && dataResponsive !== undefined) {
            let value: any
            let ob: any
            let ardataTest = []
            for (let key in dataTest) {
                value = dataTest[key];
                for (let i = 0; i < value.length; i++) {
                    ob = {
                        quiz_id: key,
                        test_id: dataResponsive[i].test_id,
                        choice: value[i]
                    }
                    ardataTest.push(ob)

                }
            }

            return { quizAnstemp: quizAnstemp, dataTest: ardataTest }
        } else {
            return quizAnstemp
        }
        // return quizAnstemp
    }

    const CheckTrueFalseOrSort = (item: number | boolean): boolean => {
        if (typeof (item) === typeof (true)) {
            return true
        } else {
            return false
        }

    }


    const SizeImage = (image: any, type: boolean) => {
        if (image != null) {
            if (type === true) {
                return (
                    <div>
                        <img style={{ maxHeight: '100%', maxWidth: '100%' }} src={image} alt='img' />
                    </div>
                )
            }else{
                return (
                    <div>
                        <img style={{ maxHeight: '90%', maxWidth: '90%' }} src={image} alt='img' />
                    </div>
                )
            }
        }
    }

    const showAddExam = (point: string): boolean => {
        // console.log(point.length)
        if (point.length >= 5) {
            return false
        } else {
            return true
        }

    }

    const settime = (time: boolean) => {
        setDisabledchoice(time)
    }

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const setid = (id: number) => {
        setOpen(true)
        setID(id)

    }

    const ItemView = (item: any, quizekey: number) => {

        return (
            <div key={quizekey} >
                {Admin ?
                    <div style={{ marginLeft: 50 }}>
                        <Grid
                            container
                            direction="column"
                            alignItems='flex-start'
                        >
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
                                    {SizeImage(item.image_proposition,true)}

                                    <div className={classes.choiceMagin}>
                                        {item.quiz_choice.map((choice: any, key: number) => {
                                            return (
                                                <div key={key}>
                                                    {CheckTrueFalseOrSort(choice.choice_correct) ?
                                                        <div>
                                                            {choice.choice_id + 1} {choice.choice_name} {choice.choice_correct ? <Check color="primary" /> : <Clear color="primary" />}
                                                        </div>
                                                        :
                                                        <div>
                                                            {choice.choice_id + 1} {choice.choice_name}
                                                            <div style={{ color: "#6200EE" }} >
                                                                ลำดับที่ {parseInt(choice.choice_correct) + 1}
                                                            </div>
                                                        </div>
                                                    }
                                                    <div>
                                                        {SizeImage(choice.image,false)}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ marginTop: 30 }}>
                                        <Box p={1} >

                                            ข้อสอบทักษะ {skill[item.quiz_skill_id]} {'\n'}
                                            {/* ชุดข้อสอบ {item.quiz_quiz_set_id} {'\n'}
                                            คะเเนน {item.quiz_score} {'\n'}
                                            คะเเนนต่อคำตอบ {item.quiz_score_per_ans} {'\n'} */}

                                        </Box>

                                        <Box m={1} p={1} display="flex" flexDirection='row' >
                                            <Box p={1} >
                                                <Button variant="contained" color="primary"
                                                    endIcon={<Edit />}
                                                    component={Link} to={RountAdmin.EditExam + item.quiz_id}
                                                >
                                                    แก้ไข
                                                </Button>
                                            </Box>

                                            {showAddExam(item.quiz_point) ?
                                                <Box p={1} >
                                                    <Button variant="contained" color="primary"
                                                        component={Link} to={RountAdmin.AddSubExam + item.quiz_id}
                                                        endIcon={<AddCircle />}
                                                    >
                                                        เพิ่มข้อย่อย
                                                    </Button>
                                                </Box> : null}
                                            <Box p={1} >
                                                <Button variant="contained" color="primary"
                                                    onClick={() => { setid(item.quiz_id) }} endIcon={<Delete />}
                                                >
                                                    ลบ
                                                </Button>
                                            </Box>
                                        </Box>
                                    </div>
                                </Box>
                            </Box>

                        </Grid >
                    </div> :
                    <div style={{ marginLeft: 50 }}>
                        <Grid
                            container
                            // direction="column"
                            alignItems='flex-start'

                        >
                            <Grid item xs={12} sm={9}>
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
                                        {SizeImage(item.image_proposition,true)}
                                        <div className={classes.choiceMagin}>
                                            {item.quiz_choice.map((choice: any, key: number) => {
                                                return (
                                                    <div>
                                                        {item.type_choice ? <FormControlLabel
                                                            key={key}
                                                            control={<Checkbox onChange={(e) => handleChange(e, choice.choice_id, quizekey, "choice")} />}
                                                            label={choice.choice_name}
                                                            disabled={disabledchoice}
                                                        />
                                                            :
                                                            <div style={{ marginBottom: 15 }} >
                                                                <select
                                                                    onChange={(e) => handleChange(e, choice.choice_id, quizekey, "select")}
                                                                    disabled={disabledchoice}
                                                                    style={{ marginRight: 10 }}
                                                                >
                                                                    <option value={-1}> - </option>
                                                                    {item.choice_Select.map((item: number) => {
                                                                        return (
                                                                            <option value={item}>{item + 1}</option>
                                                                        )
                                                                    })}

                                                                </select>
                                                                {choice.choice_name}
                                                            </div>
                                                        }

                                                        <div>
                                                            {SizeImage(choice.image,false)}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                    </Box>
                                </Box>

                            </Grid>
                            {dataResponsive ?
                                <Grid item xs={3}>
                                    <Box p={1} m={1}>
                                        {dataResponsive.map((itemtest: any, key: number) => {

                                            return (
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend">{itemtest.subject}</FormLabel>
                                                    <RadioGroup
                                                        defaultValue="choiceOne"
                                                        // value={dataTest[itemtest.test_id][item.quiz_id]} 
                                                        onChange={(e) => { handleChangeDataTest(e, item.quiz_id, key) }}
                                                    >
                                                        <FormControlLabel value="choiceOne" control={<Radio />} label={itemtest.choiceOne} />
                                                        <FormControlLabel value="choiceTwo" control={<Radio />} label={itemtest.choiceTwo} />
                                                    </RadioGroup>
                                                </FormControl>
                                            )
                                        })}
                                    </Box>
                                </Grid > : null}
                        </Grid >
                    </div>
                }
                <Divider />
            </div>
        )
    }


    return (

        <div>
            
            {data.map(ItemView)}

            {onSubmit && showSummitButton ? <div className={classes.centerpage}>
                <Button
                    onClick={() => { onSubmit(checkAnswer()) }}
                    className={classes.maginChart}
                    color="primary"
                    variant="contained"

                >
                    ส่งข้อสอบ
                </Button>
            </div> : null}
            {!Admin && timer ?
                <CountdownTimer
                    timer={timer}
                    callbacktimer={settime}
                />
                : null}

            <Confirm
                open={open}
                id={id}
                handleCloseDialog={handleCloseDialog}
                URL_API={URL.API_DeleteExam}
            />

        </div>

    )
}

export default ShowExam;