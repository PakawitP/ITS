import React from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Styles } from '../pages/admin/Admin.styles'
import {
    Slider,
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core'
import { IFormInput } from '../pages/admin/AddQuizSet'
import {Publish}  from '@material-ui/icons';
interface Props {
    defaultV: IFormInput
    onSubmit: (data: IFormInput) => void
}

const QuizSetFill: React.FC<Props> = ({ defaultV, onSubmit }) => {

    const classes = Styles();
    const {
        control,
        handleSubmit,
        formState: { errors } } = useForm<IFormInput>({
            defaultValues: {
                PointToSkill: defaultV.PointToSkill
            },
            mode: "onBlur"
        });

    const { fields, } = useFieldArray({
        name: "PointToSkill",
        control
    });

    let minutesixten: string[] = []

    const createminutes = () => {
        let temp: string
        minutesixten = []
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                temp = "0" + i.toString()
            } else {
                temp = i.toString()
            }
            minutesixten.push(temp)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    m={1}
                    p={1}
                >
                    <Box
                        border={1}
                        boxShadow={2}
                        borderRadius={25}
                        p={3}
                        borderColor='text.primary'
                        className={classes.maginBottom}
                    >
                        <Box p={1} >
                            <Controller
                                name="QuizSetName"
                                control={control}
                                rules={{
                                    required: 'ระบุชื่อชุดข้อสอบ'
                                }}
                                defaultValue={defaultV.QuizSetName}
                                render={({ field }) =>
                                    <div >
                                        <TextField
                                            id="input-with-icon-grid"
                                            label="ชื่อชุดข้อสอบ"
                                            {...field}
                                        />
                                    </div>
                                }
                            />
                            {errors.QuizSetName && (
                                <p className={classes.errorMes}>
                                    {errors.QuizSetName.message}
                                </p>
                            )}
                        </Box>

                        <Box p={1} className={classes.marginBT}>
                            <Controller
                                name="Discription"
                                control={control}
                                defaultValue={defaultV.Discription}
                                render={({ field }) =>
                                    <TextField
                                        className={classes.textFildDis}
                                        id="outlined-multiline-static"
                                        label="กฎ/คำชี้เเนะในการทำข้อสอบ"
                                        {...field}
                                        multiline
                                        rows={10}
                                        variant="outlined"
                                    />
                                }
                            />
                        </Box>

                        <Box p={1} className={classes.marginBT}>
                            <div>
                                เวลาในการทำข้อสอบ
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="Hour"
                                    defaultValue={defaultV.Hour}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <FormControl
                                        // className={sty.rootB}
                                        >
                                            <InputLabel id="demo-simple-select-label">ชั่วโมง</InputLabel>
                                            <Select onChange={onChange} value={value} >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={2}>2</MenuItem>
                                                <MenuItem value={3}>3</MenuItem>
                                            </Select>
                                        </FormControl>

                                    )}
                                />
                                {createminutes()}
                                <Controller
                                    control={control}
                                    name="Minute"
                                    defaultValue={defaultV.Minute}
                                    render={({
                                        field: { onChange, value },

                                    }) => (
                                        <FormControl
                                        // className={sty.rootB}
                                        >
                                            <InputLabel id="demo-simple-select-label">นาที</InputLabel>
                                            <Select onChange={onChange} value={value} >
                                                {minutesixten.map((i: string) => {
                                                    return <MenuItem value={parseInt(i)}>{i}</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </Box>

                        <Box p={1} className={classes.marginBT}>
                            <div>
                                จำนวนข้อสอบที่สุ่ม
                            </div>
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.id}>
                                        <section key={field.id}>
                                            <Box display="flex"
                                                justifyContent="flex-start"
                                                p={1}
                                            >
                                                <div
                                                    className={classes.rooT}
                                                >
                                                    <Controller
                                                        name={`PointToSkill.${index}.skill_of_point` as const}
                                                        control={control}
                                                        defaultValue={field.skill_of_point}
                                                        render={({ field: { onChange, value, } }) =>
                                                            <div>
                                                                <div style={{ marginTop: 10 }}>
                                                                    {field.skill_name}
                                                                </div>

                                                                <Slider
                                                                    value={value}
                                                                    onChange={
                                                                        (event: any, newValue: number | number[]) => { onChange(newValue) }
                                                                    }
                                                                    aria-labelledby="discrete-slider"
                                                                    valueLabelDisplay="auto"
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={10}
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            </Box>
                                        </section>
                                    </div>

                                );
                            })}
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center" m={1} p={1} >
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        endIcon={<Publish />}
                    // disabled={loading}
                    >
                        บันทึก
                    </Button>
                </Box>
            </form>
        </div>
    )
}

export default QuizSetFill