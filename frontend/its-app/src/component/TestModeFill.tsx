
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { Styles } from '../pages/admin/Admin.styles'
import {
    // Checkbox,
    // Typography,
    // Grid,
    Box,
    TextField,
    Button,
    // LinearProgress
} from '@material-ui/core'
import { IFormInput } from '../pages/admin/TestModeAdd'
import {AddCircle} from '@material-ui/icons';
type Props = {
    onSubmit: (data: IFormInput) => void;
    defaultV: IFormInput;
}

const TestModeFill: React.FC<Props> = ({ onSubmit, defaultV }) => {

    const classes = Styles();
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>();

    return (

        <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
            <form onSubmit={handleSubmit(onSubmit)} >
                <Controller
                    name="subject"
                    control={control}
                    rules={{
                        required: 'ระบุหัวข้อ',
                    }}
                    defaultValue={defaultV.subject}
                    render={({ field }) =>
                        <div className={classes.root}>
                            <TextField
                                id="input-with-icon-grid"
                                label="หัวข้อ"
                                {...field}
                            />
                        </div>
                    }
                />
                {errors.subject && (
                    <p className={classes.errorMes}>
                        {errors.subject.message}
                    </p>
                )}

                <Box p={1} >
                    <Controller
                        name="choiceOne"
                        control={control}
                        rules={{
                            required: 'ระบุตัวเลือกที่ 1',
                        }}
                        defaultValue={defaultV.choiceOne}
                        render={({ field }) =>
                            <div>
                                <TextField
                                    id="input-with-icon-grid"
                                    label="ตัวเลือกที่ 1"
                                    {...field}
                                />
                            </div>
                        }
                    />
                    {errors.choiceOne && (
                        <p className={classes.errorMes}>
                            {errors.choiceOne.message}
                        </p>
                    )}
                </Box>
                <Box p={1} >

                    <Controller
                        name="choiceTwo"
                        control={control}
                        rules={{
                            required: 'ระบุตัวเลือกที่ 2',
                        }}
                        defaultValue={defaultV.choiceTwo}
                        render={({ field }) =>
                            <div>
                                <TextField
                                    id="input-with-icon-grid"
                                    label="ตัวเลือกที่ 2"
                                    {...field}
                                />
                            </div>
                        }
                    />
                    {errors.choiceTwo && (
                        <p className={classes.errorMes}>
                            {errors.choiceTwo.message}
                        </p>
                    )}
                </Box>



                <div className={classes.root}>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                    // disabled={loading}
                    endIcon={<AddCircle />}
                    >
                        บันทึก
                    </Button>
                </div>
            </form>
        </Box>
    )
}

export default TestModeFill