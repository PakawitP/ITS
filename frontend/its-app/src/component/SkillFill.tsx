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
import { IFormInput } from '../pages/admin/AddSkill'
import PublishIcon from '@material-ui/icons/Publish';
type Props = {
    onSubmit: (data: IFormInput) => void;
    defaultV: IFormInput;
}

const Skill: React.FC<Props> = ({ onSubmit, defaultV }) => {

    const classes = Styles();
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>();

    return (

        <Box display="flex" justifyContent="center" m={2} p={2}>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Controller
                    name="SkillName"
                    control={control}
                    rules={{
                        required: 'ระบุชื่อทักษะ',
                    }}
                    defaultValue={defaultV.SkillName}
                    render={({ field }) =>
                        <div className={classes.root}>
                            <TextField
                                id="input-with-icon-grid"
                                label="ชื่อทักษะ"
                                {...field}
                            />
                        </div>
                    }
                />
                {errors.SkillName && (
                    <p className={classes.errorMes}>
                        {errors.SkillName.message}
                    </p>
                )}


                <Box display="flex" justifyContent="center" m={2} p={2}>
                    <Controller
                        name="SkillTotalScore"
                        control={control}
                        rules={{
                            required: 'ระบุคะแนนรวมทักษะ',
                            pattern: {
                                value: /^[0-9]*$/,
                                message: 'ระบุเป็นตัวเลข',
                            }
                        }}
                        defaultValue={defaultV.SkillTotalScore}
                        render={({ field }) =>
                            <div >
                                <TextField
                                    id="input-with-icon-grid"
                                    label="คะแนนทักษะเเต่ละข้อ"
                                    {...field}
                                />
                            </div>
                        }
                    />
                    {errors.SkillTotalScore && (
                        <p className={classes.errorMes}>
                            {errors.SkillTotalScore.message}
                        </p>
                    )}
                </Box>




                <div className={classes.root}>
                    <Button
                        endIcon={<PublishIcon />}
                        variant="contained"
                        type="submit"
                        color="primary"
                    // disabled={loading}
                    >
                        บันทึก
                    </Button>
                </div>
            </form>
        </Box>
    )
}

export default Skill