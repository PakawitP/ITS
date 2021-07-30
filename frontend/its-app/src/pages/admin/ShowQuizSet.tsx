import React from 'react'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { URL } from '../../services/urlAPI'
import { Styles } from './Admin.styles'
import {
    Box,
    Button,
    LinearProgress,
    Divider,
    Typography
} from '@material-ui/core'
import { Link } from "react-router-dom";
import { RountAdmin } from '../../services/rountURL'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import Tokenmismatch from '../auth/Tokenmismatch'
import Confirm from '../../component/alerFun/Confirm'
import { Edit, Delete,AssignmentReturned } from '@material-ui/icons';

const QuizSet = () => {

    const classes = Styles();

    const [open, setOpen] = React.useState(false);
    const [id, setID] = React.useState<number>(0);


    const { data, error } = useSWR(
        URL.API_GetQuizSet, fetcher,{ refreshInterval: 3000 }
    );
    if (error) {
        return(
            <div>
                QuizSetError {error}
            </div>
        )
        
    };
    if (!data) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (data) {
        // console.log("", data)
    };
    if (data.data === "Token mismatch" && data.msg === false) {
        return (
            <Tokenmismatch />
        )
    }


    const handleCloseDialog = () => {
        setOpen(false);
      };

    const setid = (id:number) => {
        setOpen(true)
        setID(id)

    }

    const ItemView = (item: any, key: number) => {
        return (
            <div key={key} >
                <Box display="flex" p={1} bgcolor="background.paper">
                    <Box width="100%">
                        <p>ชุดที่ {key + 1}   ชุดข้อสอบ {item.quiz_set_name}</p>
                    </Box>
                    <Box flexShrink={0}>
                        <Button className={classes.maginT} variant="contained" color="primary"
                            endIcon={<Edit />} component={Link} to={RountAdmin.EditQuizSet + item.quiz_set_id}
                        >
                            แก้ไข
                        </Button>
                        <Button className={classes.maginT} variant="contained" color="primary"
                            onClick={()=>{setid(item.quiz_set_id)}} endIcon={<Delete />}
                        >
                            ลบ
                        </Button>
                    </Box>
                </Box>
                <Divider />
            </div>
        )
    }

    return (
        <Dashboard>
            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    ชุดข้อสอบ
                </Typography>
                <AssignmentReturned color="primary" className={classes.iconHeadersize}/>
            </Box>
            <div>
                {data.data.map(ItemView)}
            </div>

            <Confirm
                open = {open}
                id = {id}
                handleCloseDialog = {handleCloseDialog}
                URL_API  = {URL.API_DeleteQuizSet}
            />
        </Dashboard>
    )
}

export default QuizSet