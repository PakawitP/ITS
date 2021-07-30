import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Styles } from '../pages/admin/Admin.styles'
import { IFormInput } from '../pages/admin/AddSchool'
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Divider,
} from '@material-ui/core';
// import {ControlPointDuplicate} from '@material-ui/icons';
import Address from "./address/address";
import { useState } from "react";
import { Delete, AddCircle,AddToPhotos } from '@material-ui/icons';
// import { ResizeImage } from "../services/image/ResizeImage"


type Props = {
    onSubmit: (data: IFormInput) => void;
    defaultV: IFormInput;
}


const SchoolFill: React.FC<Props> = ({ onSubmit, defaultV }) => {
    const classes = Styles();
    const { control, 
        handleSubmit, 
        formState: { errors }, 
        setError, 
        setValue, 
        getValues } = useForm<IFormInput>();


    const [picD, setPicD] = useState<any>(defaultV.SchoolPicDirector)
    const [picS, setPicS] = useState<any>(defaultV.CollectSchoolImage)


    const onChange = (e: any, typeflie: string, index: number) => {
        const file = e.target.files[0]
        let reader = new FileReader();

        console.log(file)
        if (!file) {
            // console.log("not_file")
            return false
        }

        if (file.size > 1024000) {
            alert('ใช้ไฟล์ขนาดไม่เกิน 1 MB')
            e.target.value = null;
            return false;
        }
        if (!file.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPRG|)$/)) {
            alert('ใช้ไฟล์นามสกุล .jpg .jpeg .png')
            e.target.value = null;
            return false;
        }
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeflie === "directer") {
                setPicD(reader.result)
                // console.log(reader.result)
                setValue("SchoolPicDirector", reader.result, { shouldValidate: true })
            }
            if (typeflie === "school") {
                const temp = [...picS];
                temp.splice(index, 1, { "school_image_name": reader.result })
                setValueimageSchool(temp)
            }
            console.log("reader.result", reader.result)
        };
    };

    const setValueimageSchool = (temp: object) => {
        setPicS(temp)
        console.log(temp)
        setValue("CollectSchoolImage", temp, { shouldValidate: true })
    }


    const handleRemoveItem = (item: number) => {
        const temp = [...picS];
        temp.splice(item, 1)
        setValueimageSchool(temp);
    }


    const addresscb = (address: any) => {
        setValue("SchoolProvince", address.p, { shouldValidate: true })
        setValue("SchoolDistrict", address.a, { shouldValidate: true })
        setValue("SchoolSubDistrict", address.d, { shouldValidate: true })
        // console.log("address", address)

    }

    const SizeImage = (image: any) => {
        if (image !== "") {
            return (
                <Box display="flex" justifyContent="center" >
                    <img style={{ width: 400 }} src={image} alt='img'/>
                </Box>
            )
        }
    }


    const ItemView = (item: any, key: number) => {
        return (

            <div key={key} >
                <Box display="flex" justifyContent="center" >
                    {/* {item.school_image_name != "" ? <img style={{ height: 100, width: 150 }} src={picS[key].school_image_name} /> : null} */}

                    {SizeImage(item.school_image_name)}
                </Box>
                <Box display="flex" justifyContent="center" p={1} m={1}>
                    <input
                        onChange={(e) => onChange(e, "school", key)}
                        type="file"
                        accept=".png,.jpg,.jpeg"
                    />
                    <IconButton aria-label="delete"
                        color="primary"
                        onClick={() => handleRemoveItem(key)}
                        style={{ marginTop: -10 }}
                    >
                        <Delete fontSize="inherit" />
                    </IconButton>
                </Box>
                <Divider style={{ margin: 10 }} />
            </div>

        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.paper} >
                <Box display="flex" justifyContent="flex-start" flexDirection='column' m={1} p={1} >
                    <Box
                        border={1}
                        boxShadow={2}
                        borderRadius={25}
                        p={3}
                        borderColor='text.primary'
                    >
                        <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                            <Typography variant="h4">
                                ข้อมูลโรงเรียน
                            </Typography>
                        </Box>
                        <Box display="flex"  >

                            <Box className={classes.rootfilt}>
                                <Controller
                                    name="SchoolName"
                                    control={control}
                                    rules={{ required: 'ระบุชื่อโรงเรียน' }}
                                    defaultValue={defaultV.SchoolName}
                                    render={({ field }) =>
                                        <TextField
                                            label="ชื่อโรงเรียน"
                                            {...field}
                                        />
                                    }
                                />
                                {errors.SchoolName && (
                                    <p className={classes.errorMes}>
                                        {errors.SchoolName.message}
                                    </p>
                                )}
                            </Box>

                            <Box className={classes.rootfilt} >
                                <Controller
                                    name="SchoolDirector"
                                    control={control}
                                    rules={{ required: 'ระบุชื่อผู้อำนวยการ' }}
                                    defaultValue={defaultV.SchoolDirector}
                                    render={({ field }) =>
                                        <TextField
                                            label="ชื่อผู้อำนวยการ"
                                            {...field}
                                        />

                                    }
                                />
                                {errors.SchoolDirector && (
                                    <p className={classes.errorMes}>
                                        {errors.SchoolDirector.message}
                                    </p>
                                )}
                            </Box>
                        </Box>

                        <div className={classes.root}>
                            <Controller
                                name="SchoolProfileSchool"
                                control={control}
                                rules={{ required: 'ระบุข้อมูลโรงเรียน' }}
                                defaultValue={defaultV.SchoolProfileSchool}
                                render={({ field }) =>

                                    <TextField
                                        {...field}
                                        label="ข้อมูลโรงเรียน"
                                        multiline
                                        rowsMax={4}
                                    />


                                }
                            />

                            {errors.SchoolProfileSchool && (
                                <p className={classes.errorMes}>
                                    {errors.SchoolProfileSchool.message}
                                </p>
                            )}

                        </div>

                        <Box
                            display="flex"
                            justifyContent="center"
                            flexDirection='column'
                            alignItems='center'
                            style={{ marginTop: 40 }}
                        >
                            รูปผู้อำนวยการ


                            <Box p={1} m={1} >
                                {/* {picD ? <img style={{ height: 200, width: 140 }} src={picD} /> : null} */}
                                {picD ? <img style={{ height: 140 }} src={picD} alt='picD'/> : null}

                            </Box>
                            <Box p={1} m={1} style={{ marginLeft: 75 }}>
                                <input
                                    // {...register("SchoolPicDirector", { required: 'เพิ่มรูปภาพ' })}
                                    onChange={(e) => onChange(e, "directer", 0)}
                                    id="directer"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                />
                            </Box>

                            {errors.SchoolPicDirector && (
                                <p className={classes.errorMes}>
                                    {errors.SchoolPicDirector.message}
                                </p>
                            )}

                        </Box>

                        <Box
                            display="flex"
                            justifyContent="center"
                            flexDirection='column'
                            alignItems='center'
                            style={{ marginTop: 40 }}
                        >
                            ที่อยู่โรงเรียน


                            {defaultV.SchoolSubDistrict ?
                                <Address
                                    add={addresscb}
                                    addressProps={{ d: defaultV.SchoolSubDistrict, a: defaultV.SchoolDistrict, p: defaultV.SchoolProvince }}
                                /> :
                                <Address
                                    add={addresscb}
                                />
                            }
                            {errors.SchoolProvince && (
                                <p className={classes.errorMes}>
                                    {errors.SchoolProvince.message}
                                </p>
                            )}
                        </Box>

                    </Box>
                    <Box
                        border={1}
                        boxShadow={2}
                        borderRadius={25}
                        p={3}
                        borderColor='text.primary'
                        style={{ marginTop: 20 }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={1} m={1}>
                            <Box p={1} m={1}>
                                <Typography variant="h4">
                                    รูปภาพโรงเรียนเพิ่มเติม
                                </Typography>
                            </Box>
                            {picS.map(ItemView)}
                            <Box p={1} m={1}>
                                {picS.length < 4 ?
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<AddCircle />}
                                        onClick={() => { setPicS([...picS, { "school_image_name": "" }]) }}
                                        className={classes.fieldButton}
                                    >
                                        เพิ่มรูปภาพ
                                    </Button>
                                    : null}
                            </Box>
                            {errors.CollectSchoolImage && (
                                <p className={classes.errorMes}>
                                    {errors.CollectSchoolImage.message}
                                </p>
                            )}
                        </Box>
                    </Box>
                </Box>

                <div style={{ display: 'flex', justifyContent: 'center' }} className={classes.fieldButton}>
                    <div className={classes.rooT} >
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            endIcon={<AddToPhotos />}
                            onClick={() => {
                                if (getValues("SchoolProvince") === undefined) {
                                    if (defaultV.SchoolProvince === undefined) {
                                        setError("SchoolProvince", {
                                            type: "manual",
                                            message: "ระบุที่อยู่โรงเรียน"
                                        });
                                    } else {
                                        setValue("SchoolProvince", defaultV.SchoolProvince, { shouldValidate: true })
                                        setValue("SchoolDistrict", defaultV.SchoolDistrict, { shouldValidate: true })
                                        setValue("SchoolSubDistrict", defaultV.SchoolSubDistrict, { shouldValidate: true })
                                    }
                                }
                                if (getValues("SchoolPicDirector") === undefined && defaultV.SchoolPicDirector === "") {
                                    setError("SchoolPicDirector", {
                                        type: "manual",
                                        message: "ระบุรูปผู้อำนวยการ"
                                    });
                                }
                                if (getValues("CollectSchoolImage") === undefined && picS[0].school_image_name === "") {
                                    setError("CollectSchoolImage", {
                                        type: "manual",
                                        message: "ระบุรูปโรงเรียนเพิ่มเติ่ม"
                                    });
                                }
                                // console.log("getValues",picS[0].school_image_name)
                                // console.log("defaultV.CollectSchoolImage",defaultV.CollectSchoolImage[0].school_image_name)
                            }
                            }
                        >
                            บันทึก
                        </Button>
                    </div>
                </div>
            </form>

        </div >
    )
}

export default SchoolFill;