import React from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
    Divider,
    TextField,
    Button,
    Box,
    IconButton,
    Slider,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import { Styles } from '../pages/admin/Admin.styles'
import { FormValues } from '../pages/admin/AddExam'
import {
    Delete,
    AddCircle,
    // SubdirectoryArrowRight,
    Publish
} from '@material-ui/icons';
// import { ResizeImage } from "../services/image/ResizeImage"

type Props = {
    onSubmit: (data: FormValues) => void
    defaultV: FormValues
    choiceType?: string
    quiz_score_per_ans?: number | string
    quiz_score?: number | string
    show_skill: boolean
    not_show_quiz_set?: boolean
    type_choice : (type: string) => void
}

const ExamFill: React.FC<Props> = ({ onSubmit,
    defaultV,
    quiz_score_per_ans,
    quiz_score,
    choiceType,
    show_skill,
    not_show_quiz_set,
    type_choice }) => {



    const classes = Styles();

    const [picS, setPicS] = React.useState<any[]>(defaultV.ChoiceImage)
    const [choideType, setChoiceType] = React.useState<string | undefined>(choiceType)
    const [TempSubSkill, setTempSubSkill] = React.useState<any>(defaultV.QuizSubSkill)
    const [mergeSkill, setMergeSkill] = React.useState<any[]>(defaultV.dataskill.data)
    const [showSubSkill, setShowSubSkill] = React.useState<boolean>(show_skill)
    const [skill, setSkill] = React.useState<string | number>(defaultV.SkillTest)
    const [imagePro, setImagePro] = React.useState<any>(defaultV.ImageProposition)



    React.useEffect(() => {
        if (defaultV.SkillTest !== "" && defaultV.SkillTest !== undefined) {
            let temp = [...defaultV.dataskill.data]
            let skill = temp.findIndex((item: any) => {
                return item.skill_id == defaultV.SkillTest
            })

            if (skill >= 0) {
                temp.splice(skill, 1)
                let tempSub = { ...TempSubSkill }
                tempSub[defaultV.SkillTest] = { skill_id: defaultV.SkillTest, score_percent: 0 }

                setTempSubSkill(tempSub)
            }

            setMergeSkill(temp)
        }
        if (defaultV.SkillTest !== '') {
            setValue('SkillTest', defaultV.SkillTest)
        }
    }, [])



    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        getValues,
        clearErrors,
        watch,
        formState: { errors } } = useForm<FormValues>({
            defaultValues: {
                Choice: defaultV.Choice
            },
            mode: "onBlur"
        });

    const { fields, append, remove } = useFieldArray({
        name: "Choice",
        control
    });

    const watchQuizSet = watch('QuizSet')
    const onChange = (e: any, typeflie: string, index: number) => {
        const file = e.target.files[0]
        let reader = new FileReader();

        if (!file) {
            return false
        }
        if (file.size > 102400) {
            alert('ใช้ไฟล์ขนาดไม่เกิน 100 KB')
            e.target.value = null;
            return false;
        }
        if (!file.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
            alert('ใช้ไฟล์นามสกุล .jpg .jpeg .png')
            e.target.value = null;
            return false;
        }
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeflie === "proposition") {
                setImagePro(reader.result)

            }

            if (typeflie === "choice") {
                // console.log("index",index)
                const temp = [...picS];
                const tempT = temp[index];
                tempT.image = reader.result
                // console.log("tempT",tempT)
                temp.splice(index, 1, tempT)
                setValueimage(temp)
            }
        };
    };

    const handleRemoveItem = (item: number) => {
        const temp = [...picS];
        temp.splice(item, 1)
        setValueimage(temp)
    }

    const setValueimage = (temp: any) => {
        setPicS(temp)
    }


    const Makeselectskill = (item: any) => {
        return (
            <option value={item.skill_id}>{item.skill_name}</option>
        )
    }

    const Makeselectsort = (item: any, key: number) => {
        return (
            <option value={key}>{key + 1}</option>
        )
    }

    const Makeselectquizset = (item: any) => {
        return (
            <option value={item.quiz_set_id}>{item.quiz_set_name}</option>
        )
    }

    const Makesubskill = (item: any, key: number) => {
        let t = mergeSkill[key].skill_id
        if (TempSubSkill[t]) {
            return (
                <Box>
                    <Typography id="discrete-slider" gutterBottom>
                        {item.skill_name}
                    </Typography>
                    <Slider
                        // defaultValue={defaultV.QuizSubSkill[item.skill_id].score_percent}
                        value={TempSubSkill[t].score_percent}
                        aria-labelledby="discrete-slider"
                        onChange={(event: any, newValue: number | number[]) => {
                            let temp = { ...TempSubSkill }
                            temp[t] = { skill_id: t, score_percent: newValue }
                            setTempSubSkill(temp)
                        }}
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                    />
                </Box>
            )
        }
        else {
            let tempSub = { ...TempSubSkill }
            tempSub[t] = { skill_id: t, score_percent: 0 }
            setTempSubSkill(tempSub)

            return (
                <Box>
                    <Typography id="discrete-slider" gutterBottom>
                        {item.skill_name}
                    </Typography>
                    <Slider
                        defaultValue={0.0}
                        aria-labelledby="discrete-slider"
                        onChange={(event: any, newValue: number | number[]) => {
                            let temp = { ...TempSubSkill }
                            temp[t] = { skill_id: t, score_percent: newValue }
                            setTempSubSkill(temp)
                        }}
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                    />
                </Box>
            )
        }

    }

    const checkTypeBoolean = (item: any): boolean => {
        if (item === true || item === false) {
            return item
        } else {
            return false
        }
    }

    const checkTypeNumber = (item: any): number => {
        if (item !== true || item !== false) {
            return item
        } else {
            return getValues("Choice").length
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
            } else {
                return (
                    <div>
                        <img style={{ maxHeight: '90%', maxWidth: '90%' }} src={image} alt='img' />
                    </div>
                )
            }
        }
    }

    const HideSkill = (e: any) => {
        setSkill(e.target.value)
        console.log("e.target.value", e.target.value)
        let temp = [...defaultV.dataskill.data]
        let skill = defaultV.dataskill.data.findIndex((item: any) => {
            return item.skill_id == e.target.value
        })
        console.log("skill", skill)
        if (skill >= 0) {
            temp.splice(skill, 1)
            let tempSub = { ...TempSubSkill }
            tempSub[e.target.value] = { skill_id: parseInt(e.target.value), score_percent: 0 }

            setTempSubSkill(tempSub)
        }
        setValue('SkillTest', e.target.value)
        if (getValues("SkillTest") !== -1 || getValues("SkillTest") !== undefined || getValues("SkillTest") !== '') {
            clearErrors("SkillTest")
        }
        setMergeSkill(temp)

    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.paper}>

                <Box display="flex" justifyContent="flex-start" flexDirection='column' m={1} p={1} >

                    <Box
                        border={1}
                        boxShadow={2}
                        borderRadius={25}
                        p={3}
                        borderColor='text.primary'
                        className={classes.maginBottom}
                    >
                        <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                            <Typography variant="h4">
                                โจทย์ข้อสอบ
                            </Typography>
                        </Box>
                        <div className={classes.root}>
                            <Controller
                                name="Proposition"
                                control={control}
                                rules={{ required: 'ระบุโจทย์ข้อสอบ' }}
                                defaultValue={defaultV.Proposition}
                                render={({ field }) =>

                                    <TextField
                                        {...field}
                                        label="ระบุโจทย์ข้อสอบ"
                                        multiline
                                        rowsMax={8}
                                    />
                                }
                            />

                            <div className={classes.rooT}>
                                <input
                                    onChange={(e) => onChange(e, "proposition", 0)}
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                />
                            </div>
                            <div className={classes.maginT}>
                                {SizeImage(imagePro, true)}
                            </div>
                            {errors.Proposition && (
                                <p className={classes.errorMes}>
                                    {errors.Proposition.message}
                                </p>
                            )}

                        </div>
                    </Box>
                    <Box
                        border={1}
                        boxShadow={2}
                        borderRadius={25}
                        p={3}
                        borderColor='text.primary'
                        className={classes.maginBottom}
                    >
                        <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                            <Typography variant="h4">
                                ตัวเลือกคำตอบ
                            </Typography>
                        </Box>
                        <Box m={1} p={1}>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">ประเภทตัวเลือก</InputLabel>
                                <Select
                                    value={choideType}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                        let st = event.target.value as string
                                        let tempArr: any = []
                                        let a = {}
                                        fields.forEach((item: any) => {
                                            if (st === "chocieTF") {
                                                a = {
                                                    choice_correct: false,
                                                    choice_id: item.choice_id,
                                                    choice_name: item.choice_name,
                                                    id: item.id
                                                }
                                            } else {
                                                a = {
                                                    choice_correct: -1,
                                                    choice_id: item.choice_id,
                                                    choice_name: item.choice_name,
                                                    id: item.id
                                                }
                                            }
                                            tempArr.push(a)
                                        });
                                        setValue('Choice', tempArr)
                                        type_choice(st)
                                        setChoiceType(st);
                                    }}
                                >
                                    <MenuItem value={"chocieTF"}>ตัวเลือกเเบบปรนัย</MenuItem>
                                    <MenuItem value={"chocieSort"}>ตัวเลือกเรียงลำดับ</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {fields.map((field, index) => {
                            return (
                                <div key={field.id}>
                                    <section key={field.id}>

                                        <Box display="flex" justifyContent="flex-start">
                                            <Box p={1} m={2}>
                                                {index + 1}.
                                            </Box>
                                            <Box>
                                                <div className={classes.rooT}>
                                                    <Controller
                                                        name={`Choice.${index}.choice_name` as const}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        defaultValue={field.choice_name}
                                                        render={({ field }) =>
                                                            <TextField
                                                                label="ตัวเลือก"
                                                                multiline
                                                                rowsMax={4}
                                                                {...field}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <div className={classes.rooT}>
                                                    <div className={classes.maginT}>
                                                        {SizeImage(picS[index].image, false)}
                                                        {/* {picS[index].image != null ? <img style={{ height: 100, width: 100 }} src={picS[index].image} /> : null} */}
                                                    </div>

                                                    <input
                                                        onChange={(e) => onChange(e, "choice", index)}
                                                        type="file"
                                                        accept=".png,.jpg,.jpeg"
                                                    />
                                                </div>
                                            </Box>
                                            <Box style={{ marginTop: 20 }}>
                                                {choideType === "chocieTF" ?
                                                    <input
                                                        style={{ width: 15, height: 15 }}
                                                        {...register(`Choice.${index}.choice_correct` as const)}
                                                        defaultChecked={checkTypeBoolean(field.choice_correct)}
                                                        type="checkbox"
                                                    />
                                                    :
                                                    <select
                                                        {...register(`Choice.${index}.choice_correct` as const)}
                                                        defaultValue={checkTypeNumber(field.choice_correct)}
                                                    >
                                                        <option value={-1}>เลือกลำดับ</option>
                                                        {getValues("Choice").map(Makeselectsort)}

                                                    </select>
                                                }

                                                <IconButton aria-label="delete"
                                                    color="primary"
                                                    onClick={() => {
                                                        remove(index)
                                                        handleRemoveItem(index)
                                                    }}>
                                                    <Delete fontSize="inherit" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </section>

                                    <Divider className={classes.maginT} />
                                </div>

                            );
                        })}
                        {errors.Choice && (
                            <p className={classes.errorMes}>
                                ตรวจสอบข้อมูลตัวเลือก
                            </p>
                        )}

                        <Box display="flex" justifyContent="center" style={{ margin: 10 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<AddCircle />}
                                onClick={() => {
                                    append({
                                        choice_name: "",
                                        choice_correct: false,
                                    })

                                    let temparr = [...picS]
                                    temparr.push({ image: null, choice_id: picS.length })
                                    setPicS(temparr)
                                }
                                }
                            >
                                เพิ่มตัวเลือก
                            </Button>
                        </Box>

                    </Box>


                    <Box
                        border={1}
                        boxShadow={2}
                        borderRadius={25}
                        p={3}
                        borderColor='text.primary'
                    >
                        <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                            <Typography variant="h4">
                                ประเภททักษะ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="center" m={1} p={1} >
                            <Box m={1} p={1} flexDirection='column' justifyContent="center">
                                <Box>
                                    <label>ประเภททักษะหลัก</label>
                                </Box>
                                <Box >
                                    <select
                                        onChange={(e) => { HideSkill(e) }}
                                        defaultValue={defaultV.SkillTest}
                                    >
                                        <option value={-1}>เลือกประเภททักษะ</option>
                                        {defaultV.dataskill.data.map(Makeselectskill)}
                                    </select>
                                </Box>
                                <Box >
                                    {errors.SkillTest && (
                                        <p className={classes.errorMes}>
                                            {errors.SkillTest.message}
                                        </p>

                                    )}

                                </Box>
                            </Box>
                            {!not_show_quiz_set ?
                                <Box m={1} p={1} justifyContent="center">
                                    <Box>
                                        <label>ชุดข้อสอบ</label>
                                    </Box>
                                    <Box>
                                        <select {...register("QuizSet", { required: 'ระบุชุดข้อสอบ' })}
                                            defaultValue={defaultV.QuizSet}
                                        >
                                            <option value={-1}>เลือกชุดข้อสอบ</option>
                                            {defaultV.dataquizset.data.map(Makeselectquizset)}

                                        </select>

                                    </Box>
                                    <Box >
                                        {watchQuizSet === -1 && (
                                            <p className={classes.errorMes}>
                                                ระบุชุดข้อสอบ
                                            </p>

                                        )}
                                    </Box>
                                </Box> : null}


                        </Box>

                        <Box m={1} p={1} >

                            <Box m={1} p={1} flexDirection='column' justifyContent="center">
                                <FormControlLabel
                                    control={<Checkbox checked={showSubSkill} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setShowSubSkill(event.target.checked)
                                    }
                                    }
                                        color='primary'
                                        name="checkedA" />}
                                    label="ประเภททักษะย่อย"
                                />
                            </Box>
                            <Box m={1} p={1}  >
                                {showSubSkill ? <Box>
                                    {mergeSkill.map(Makesubskill)}
                                </Box> : null}
                            </Box>

                        </Box>

                        {quiz_score_per_ans && quiz_score ?
                            <Box m={1} p={1} flexDirection='column' justifyContent="center">
                                <Box>
                                    <label>คะเเนน {quiz_score}</label>
                                </Box>
                                <Box>
                                    <label>คะเเนนต่อคำตอบ {quiz_score_per_ans}</label>
                                </Box>
                            </Box> : null
                        }

                    </Box>
                </Box>



                <div style={{ display: 'flex', justifyContent: 'center' }} className={classes.fieldButton}>
                    <div className={classes.rooT} >
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            endIcon={<Publish />}
                            type="submit"
                            onClick={() => {
                                let t = 0
                                let u = 0
                                let dat = getValues("Choice")
                                for (let i = 0; i < dat.length; i++) {

                                    if (choideType === "chocieTF") {

                                        if (dat[i].choice_correct === true) {
                                            t++

                                        }
                                    }
                                    else {
                                        if (dat[i].choice_correct === -1) {
                                            u++
                                        }
                                    }
                                }

                                if (t === 0 && choideType === "chocieTF") {

                                    setError("Choice", {
                                        type: "manual",
                                        message: ""
                                    });
                                }
                                if (u !== 0 && choideType === "chocieSort") {
                                    setError("Choice", {
                                        type: "manual",
                                        message: ""
                                    });
                                } else {
                                    clearErrors("Choice")
                                }

                                if (not_show_quiz_set === false) {
                                    if (getValues("QuizSet") === -1 || getValues("QuizSet") === "") {
                                        setError("QuizSet", {
                                            type: "manual",
                                            message: "ระบุชุดข้อสอบ"
                                        });
                                    }
                                }
                                // console.log(getValues("SkillTest"))
                                if (getValues("SkillTest") === -1 || getValues("SkillTest") === '' || getValues("SkillTest") === undefined) {

                                    setError("SkillTest", {
                                        type: "manual",
                                        message: "ระบุประเภททักษะ"
                                    });
                                } else {
                                    // clearErrors("SkillTest")
                                    setValue("ChoiceImage", picS, { shouldValidate: true })
                                    setValue("QuizSubSkill", TempSubSkill, { shouldValidate: true })
                                    setValue('SkillTest', skill)
                                    setValue("ImageProposition", imagePro, { shouldValidate: true })
                                }


                            }}
                        >
                            บันทึกข้อสอบ
                        </Button>
                    </div>
                </div>
            </form>

        </div>

    );
}

export default ExamFill