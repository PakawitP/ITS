import React from 'react'
import { fetcher } from '../../services/auth/auth'
import useSWR from 'swr'
import { URL } from '../../services/urlAPI'
import { Styles } from './User.styles'
import {
    Typography,
    Grid,
    Box,
    Button,
    LinearProgress,
    InputBase
} from '@material-ui/core'
import { FindInPage, Edit, Delete, Search } from '@material-ui/icons';
import { Link } from "react-router-dom";
import { RountAdmin, RountUsers } from '../../services/rountURL'
import Dashboard from '../../layouts/Mainlayouts/Dashboard'
import { AdminOrNot } from '../../services/auth/auth'
import Tokenmismatch from '../auth/Tokenmismatch'
import Confirm from '../../component/alerFun/Confirm'
import SchoolIcon from '@material-ui/icons/School';
const Showschool: React.FC = () => {

    const classes = Styles();
    const [open, setOpen] = React.useState(false);
    const [id, setID] = React.useState<number>(0);
    const [dataSchool, setDataSchool] = React.useState<any>([])
    const [search, setSearch] = React.useState("")


    const { data, error } = useSWR(
        (URL.API_SchoolGuest), fetcher, { refreshInterval: 3000 }
    );

    React.useEffect(() => {
        if (data) {
            if (data.data.length > 0) {
                setDataSchool(data.data)
            } else {
                setDataSchool([])
            }
        }
    }, [data])
    if (error) {
        return (
            <div>
                error {error}
            </div>
        )
    };
    if (!data) {
        return (
            <LinearProgress style={{ height: 4 }} />
        )
    };
    if (data.data === "Token mismatch" && data.msg === false) {
        return (
            <Tokenmismatch />
        )
    }
    if (data) {
        console.log(data)
    };


    const setid = (id: number) => {

        setOpen(true)
        setID(id)

    }
    const handleCloseDialog = () => {
        setOpen(false);
    };


    const ItemView = (item: any, key: number) => {
        return (
            <Grid key={key} item>
                <Box className={classes.Gridpaper}
                    border={1}
                    boxShadow={2}
                    borderRadius={25}
                    p={3}
                    borderColor='text.primary'
                >
                    <Typography variant="h3" className={classes.headercenterpage} >
                        {item.school_name}
                    </Typography>
                    {item.school_image.length > 0 ? <img src={item.school_image[0].school_image_name} alt="imageSchool" style={{ height: 200, width: 350 }}></img> : null}
                    <Typography variant="h5" className={classes.headercenterpage}>
                        ผู้อำนวยการ : {item.school_director}
                    </Typography>
                    <div className={classes.buttomcenterpage}>
                        <Box display="flex" alignItems='center' justifyContent="center" flexDirection="column" >
                            <Box >
                                <Button variant="contained" color="primary" style={{ margin: 10 }}
                                    endIcon={<FindInPage />} component={Link} to={RountUsers.DataSchool + item.school_id}
                                >
                                    รายละเอียด
                                </Button>
                            </Box>
                            {AdminOrNot() ?
                                <Box >
                                    <Button variant="contained" color="primary" style={{ margin: 10 }}
                                        endIcon={<Edit />} component={Link} to={RountAdmin.EditSchool + item.school_id}
                                    >
                                        แก้ไข
                                    </Button>
                                    <Button variant="contained" color="primary"
                                        onClick={() => { setid(item.school_id) }} endIcon={<Delete />}
                                    >
                                        ลบ
                                    </Button>
                                </Box>
                                : null}
                        </Box>
                    </div>
                </Box>
            </Grid >
        )
    }

    const searchFilterFunction = (text: string) => {
        if (text !== "" && dataSchool.length > 0) {
            const newData = dataSchool.filter(function (item: any) {
                const itemData = item.school_name
                    ? item.school_name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setDataSchool(newData);
            setSearch(text);
        }
        else if (text !== "" && dataSchool.length == 0) {
            const newData = data.data.filter(function (item: any) {
                const itemData = item.school_name
                    ? item.school_name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setDataSchool(newData);
            setSearch(text);
        }
        else {
            setDataSchool(data.data);
            setSearch(text);
        }

    };


    return (
        <Dashboard>
            <Box display="flex" justifyContent="center" style={{ marginBottom: 10 }}>
                <Typography variant="h3" className={classes.MaginTopTitle}>
                    รายชื่อโรงเรียน
                </Typography>
                <SchoolIcon color="primary" className={classes.iconHeadersize} />
            </Box>
            <Box display="flex"
                flexDirection="row"
                alignItems="center"
                p={1}
                m={1}
            >
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <Search color="primary" />
                    </div>
                    <InputBase
                        onChange={(e) => searchFilterFunction(e.target.value)}
                        placeholder="ค้นหารายชื่อโรงเรียน"
                        value={search}
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>

            </Box>
            <div>
                <Grid container className={classes.Gridroot} >
                    <Grid item xs={12} container justify="center" spacing={5}>
                        {dataSchool.map(ItemView)}
                    </Grid>
                </Grid>

            </div>
            <Confirm
                open={open}
                id={id}
                handleCloseDialog={handleCloseDialog}
                URL_API={URL.API_DeleteSchool}
            />
        </Dashboard>
    )
}

export default Showschool;