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
import {Edit,AddCircle,ImportContacts, EditAttributesOutlined} from '@material-ui/icons';
const ShowChoiceTestMode = () => {
    const classes = Styles();

    const { data, error } = useSWR(
        URL.API_GetChoiceTestModeAll, fetcher,{ refreshInterval: 3000 }
    );
    if (error) {
        console.log(error)
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
            <Tokenmismatch/>
        )
    }

    const ItemView = (item: any, key: number) => {
        return (
            <div key={key} >
                <Box display="flex" p={1} bgcolor="background.paper">
                    <Box width="100%">
                        {/* <p> {item.test_id} </p>  */}
                        <Typography variant="h4" className={classes.MaginTopTitle}>
                            {item.subject}
                        </Typography>
                        <p> ตัวเลือกที่ 1 {item.choiceOne} </p>
                        <p> ตัวเลือกที่ 2 {item.choiceTwo} </p>
                    </Box>
                    <Box flexShrink={0}>
                        <Button className={classes.maginT} variant="contained" color="primary"
                            component={Link} to={RountAdmin.EditTestMode + item.test_id}
                            endIcon={<Edit />}
                        >
                            แก้ไข
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
                    เเบบประเมิน
                </Typography>
                <ImportContacts color="primary" className={classes.iconHeadersize} />
            </Box>
            <div>
                {data.data.map(ItemView)}
            </div>
            <Box display="flex" p={1} justifyContent='center'>
                <Button className={classes.maginT} variant="contained" color="primary"
                    component={Link} to={RountAdmin.AddTestMode} endIcon={<AddCircle />}
                >
                    เพิ่ม
                </Button>
            </Box>
        </Dashboard>
    )
}

export default ShowChoiceTestMode