import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Styles } from './Auth.styles'
import useSWR from 'swr'
import {
  Typography,
  // FormLabel,
  FormControl,
  // FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Grid,
  TextField,
  Button,
  LinearProgress,
  Snackbar,
  FormHelperText,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import {
  AssignmentTurnedInRounded,
  AccountCircle,
  AssignmentRounded,
  AssignmentInd,
  AssignmentReturnedOutlined,
  School,
  Wc,
  Class,
  Help,
  QuestionAnswer,
  Save

} from '@material-ui/icons';
import axios from "axios";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useHistory } from "react-router-dom";
import { URL } from '../../services/urlAPI'
import { RountGuest } from "../../services/rountURL";
import LoginLayouts from '../../layouts/LoginLayouts'
// import { setToken } from '../../services/auth/auth'




interface IFormInput {
  Name: string;
  LastName: string;
  Email: string;
  School: number;
  Password: string;
  ConfirmP: string;
  Gender: number;
  Class: string;
  Question: string;
  Answer: string;
}

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const Register = () => {
  const fetcher = (url: any) => axios.get(url).then(res => res.data)
  const { control, handleSubmit, getValues, formState: { errors } } = useForm<IFormInput>();
  const sty = Styles();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [emassage, Setemassage] = useState("")


  const { data, error } = useSWR(URL.API_SchoolGuest_ALL, fetcher)
  if (error) {
    console.log(error)
  };
  if (!data) {
    return (
      <LinearProgress style={{ height: 4 }} />
    )
  };
  if (data) {
    console.log(data)
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const onSubmit = (data: IFormInput) => {

    console.log("register", data)
    setLoading(true)
    return axios.post(URL.API_Register, {
      "user_first_name": data.Name,
      "user_last_name": data.LastName,
      "user_email": data.Email,
      "user_password": data.Password,
      "user_school_id": data.School,
      "user_gender": data.Gender,
      "user_role_id": 2,
      "user_class": data.Class,
      "user_answer": data.Answer,
      "user_question": data.Question,
    })
      .then(response => {
        console.log("response", response);
        if (response.data.msg === true) {
          setLoading(false)
          Setemassage("Register Success")
          setOpenAlert(true)
          setTimeout(() => { history.push(RountGuest.Login) }, 2000);
        }
        else {
          setLoading(false)
          Setemassage(response.data.data)
          setOpenAlert(true)
        }
        return response.data;
      })
  }


  return (
    <LoginLayouts>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className={sty.paper} >
          <Grid
            container
            direction="column"
            alignItems="center"
          >
            <Box
              marginTop={1}
              borderRadius={25}
              borderColor='text.primary'
              p={4}
              border={1}
              boxShadow={2}
            >

              <Box display="flex" justifyContent="flex-start" >
                <Typography variant="h3" className={sty.MaginTopTitle}>
                  ???????????????
                </Typography>
                <AssignmentReturnedOutlined color="primary" className={sty.iconHeadersize} />
              </Box>

              <Box display="flex" justifyContent="center">
                <div>
                  <Controller
                    name="Name"
                    control={control}
                    rules={{ required: '????????????????????????' }}
                    defaultValue=""
                    render={({ field }) =>
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <AssignmentInd color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="????????????"
                              {...field}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }
                  />
                  {errors.Name && (
                    <p className={sty.errorMes}>
                      {errors.Name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    name="LastName"
                    control={control}
                    rules={{ required: '?????????????????????????????????' }}
                    defaultValue=""
                    render={({ field }) =>
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <AssignmentInd color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="?????????????????????"
                              {...field}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }
                  />
                  {errors.LastName && (
                    <p className={sty.errorMes}>
                      {errors.LastName.message}
                    </p>
                  )}
                </div>
              </Box>

              <Box display="flex" justifyContent="center">
                <div>
                  <Controller
                    name="Password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: '????????????????????????????????????',
                      minLength: {
                        value: 6,
                        message: '???????????????????????????????????????????????????????????? 6 ????????????????????????',
                      },
                      pattern: {
                        value: /[A-Za-z0-9_]$/,
                        message: '????????????????????????????????? a-z,A-Z,0-9,_',
                      },
                    }}
                    render={({ field }) =>
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <AssignmentRounded color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>
                            <TextField
                              type="password"
                              label="????????????????????????"
                              {...field}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }
                  />
                  {errors.Password && (
                    <p className={sty.errorMes}>
                      {errors.Password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="ConfirmP"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: '??????????????????????????????????????????',
                      validate: (value: string) => {
                        return value === getValues("Password") || "????????????????????????????????????????????????????????????"
                      },
                    }}
                    render={({ field }) =>
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <AssignmentTurnedInRounded color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="??????????????????????????????????????????"
                              type="password"
                              {...field}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }
                  />
                  {errors.ConfirmP && (
                    <p className={sty.errorMes}>
                      {errors.ConfirmP.message}
                    </p>
                  )}
                </div>
              </Box>

              <Box display="flex" justifyContent="center" >
                <div>
                  <Controller
                    name="Email"
                    control={control}
                    rules={{
                      required: '???????????????????????????',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: '?????????????????????????????????????????????????????????',
                      }
                    }}
                    defaultValue=""
                    render={({ field }) =>
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <AccountCircle color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="???????????????"
                              {...field}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }
                  />
                  {errors.Email && (
                    <p className={sty.errorMes}>
                      {errors.Email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="School"
                    rules={{
                      required: '????????????????????????????????????',
                    }}
                    render={({
                      field: { onChange },

                    }) => (
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <School color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>

                            <FormControl className={sty.rootB}>
                              <InputLabel id="demo-simple-select-label">????????????????????????</InputLabel>
                              <Select onChange={onChange}>
                                {data.data.map((dat: any, key: number) => {
                                  return (<MenuItem value={dat.school_id}>{dat.school_name}</MenuItem>)
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  />
                  {errors.School && (
                    <p className={sty.errorMes}>
                      {errors.School.message}
                    </p>
                  )}
                </div>

              </Box>

              <Box display="flex">
                <div>
                  <Controller
                    control={control}
                    name="Gender"
                    rules={{
                      required: '?????????????????????',
                    }}
                    render={({
                      field: { onChange },

                    }) => (
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <Wc color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>

                            <FormControl className={sty.rootB}>
                              <InputLabel id="demo-simple-select-label">?????????</InputLabel>
                              <Select onChange={onChange}>
                                <MenuItem value={1}>?????????</MenuItem>
                                <MenuItem value={2}>????????????</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  />
                  {errors.Gender && (
                    <p className={sty.errorMes}>
                      {errors.Gender.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    control={control}
                    name="Class"
                    rules={{
                      required: '??????????????????????????????????????????????????????',
                    }}
                    render={({
                      field: { onChange },

                    }) => (
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <Class color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>

                            <FormControl className={sty.rootB}>
                              <InputLabel id="demo-simple-select-label">??????????????????????????????????????????</InputLabel>
                              <Select onChange={onChange}>
                                <MenuItem value={'???.1'}>???.1</MenuItem>
                                <MenuItem value={'???.2'}>???.2</MenuItem>
                                <MenuItem value={'???.3'}>???.3</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  />
                  {errors.Class && (
                    <p className={sty.errorMes}>
                      {errors.Class.message}
                    </p>
                  )}
                </div>
              </Box>
              <Box display="flex" justifyContent="center" >
                <div>
                  <Controller
                    control={control}
                    name="Question"
                    rules={{
                      required: '???????????????????????????',
                    }}
                    render={({
                      field: { onChange },

                    }) => (
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <Help color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>

                            <FormControl className={sty.rootB}>
                              <InputLabel id="demo-simple-select-label">???????????????</InputLabel>
                              <Select onChange={onChange}>
                                <MenuItem value={'???????????????????????????????????????????????????'}>???????????????????????????????????????????????????</MenuItem>
                                <MenuItem value={'?????????????????????????????????????????????????????????'}>?????????????????????????????????????????????????????????</MenuItem>
                                <MenuItem value={'????????????????????????????????????????????????????????????'}>????????????????????????????????????????????????????????????</MenuItem>
                                <MenuItem value={'?????????????????????????????????????????????????????????????????????????????????'}>?????????????????????????????????????????????????????????????????????????????????</MenuItem>
                                <MenuItem value={'??????????????????????????????????????????????????????'}>??????????????????????????????????????????????????????</MenuItem>
                              </Select>
                              <FormHelperText>??????????????????????????????????????????????????????????????????????????????????????????????????????</FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  />
                  {errors.Question && (
                    <p className={sty.errorMes}>
                      {errors.Question.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="Answer"
                    control={control}
                    rules={{
                      required: '???????????????????????????',

                    }}
                    defaultValue=""
                    render={({ field }) =>
                      <div className={sty.root}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item>
                            <QuestionAnswer color="primary" className={sty.iconFontsize} />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="???????????????"
                              helperText="?????????????????????????????????????????????????????????????????????"
                              {...field}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }
                  />
                  {errors.Answer && (
                    <p className={sty.errorMes}>
                      {errors.Answer.message}
                    </p>
                  )}
                </div>



              </Box>

              <div style={{ display: 'flex', justifyContent: 'center' }} className={sty.fieldButton}>
                <div className={sty.root} >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    endIcon={<Save />}
                    disabled={loading}
                  >
                    ???????????????????????????
                  </Button>
                </div>
              </div>

            </Box>
          </Grid>
        </form>
        <Backdrop className={sty.backdrop} open={loading} >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={emassage === "Register Success" ? "success" : "error"}>
            {emassage}
          </Alert>
        </Snackbar>
      </div>
    </LoginLayouts >
  );
}

export default Register