import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { RountGuest, RountUsers, RountAdmin } from '../../services/rountURL'
import {
    mainListItems,
    secondaryListItems,
    // thirdListItems 
} from './listItems';
import { useHistory } from "react-router-dom";
import Footer from '../Footer'
import { AdminOrNot } from '../../services/auth/auth';
// import { Button } from '@material-ui/core';


const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


export default function Dashboard(props) {

    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEltest, setAnchorEltest] = React.useState(null);
    const [anchorElExam, setAnchorElExam] = React.useState(null);
    const [anchorElOption, setAnchorElOption] = React.useState(null);
    const [openLogout, setOpenLogout] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openBackdrop, setopenBackdrop] = React.useState(false)



    let data = JSON.parse(localStorage.getItem('user') || '{}')
    const { children } = props;
    const classes = useStyles();



    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClicktest = (event) => {
        setAnchorEltest(event.currentTarget);
    };

    const handleClickExam = (event) => {
        setAnchorElExam(event.currentTarget);
    };

    const handleCloseOption = () => {
        setAnchorElOption(null);
    };


    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClosetest = () => {
        setAnchorEltest(null);
    };

    const handleCloseExam = () => {
        setAnchorElExam(null);
    };

    const handleOpenLogout = () => {
        setAnchorElOption(null);
        setOpenLogout(true);

    };

    const handleCloseLogout = () => {
        setOpenLogout(false);
    };



    let admin = AdminOrNot()


    const Logout = async () => {
        setOpenLogout(false);
        await localStorage.removeItem('user')
        setopenBackdrop(true)
        setTimeout(() => { history.push(RountGuest.Login); }, 2000);
    }


    const TestResults = () => {
        history.push(RountUsers.TestResults)
    }

    const HomePage = () => {
        history.push(RountUsers.Home)
    }

    return (
        <div className={classes.root}>

            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    {admin ? <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton> : null}
                    <IconButton color="inherit" onClick={HomePage}>
                        <HomeIcon fontSize='large' />
                    </IconButton>
                    <Typography onClick={HomePage} component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
                        PSU2RBL
                    </Typography>
                    {admin ? <IconButton
                        color="inherit"
                        // onClick={TestResults}
                        onClick={handleClicktest}
                    >
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            โหมดประเมินเเบบทดสอบ
                        </Typography>
                    </IconButton> : null}
                    <IconButton color="inherit" onClick={handleClickExam}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            เเบบทดสอบ
                        </Typography>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        // onClick={TestResults}
                        onClick={admin ? TestResults : handleClick}
                    >
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            ผลการทดสอบ
                        </Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={(e)=>{setAnchorElOption(e.currentTarget)}}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            ตัวเลือกเพิ่มเติม
                        </Typography>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {admin ? <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Divider />
                <List>{secondaryListItems}</List>
                <Divider />
                {/* <List>{thirdListItems}</List>
                <Divider /> */}

            </Drawer> : null}
            <main className={classes.content} >

                <Container maxWidth="lg" className={classes.container}>
                    <div className={classes.appBarSpacer}  />
                    <Box flexDirection='Column'>
                        <Box width="100%" >
                            {children}
                        </Box>
                        <Box>
                            <Footer />
                        </Box>
                    </Box>
                </Container>
            </main>


            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { history.push(RountUsers.StudentScore + data.user_id) }}>ผลของตนเอง</MenuItem>
                <MenuItem onClick={TestResults}>ผลทั้งหมด</MenuItem>
            </Menu>

            <Menu
                id="simple-menu"
                anchorEl={anchorEltest}
                keepMounted
                open={Boolean(anchorEltest)}
                onClose={handleClosetest}
            >
                <MenuItem onClick={() => { history.push(RountAdmin.EvaluationResults) }}>ผลการประเมิน</MenuItem>
                <MenuItem onClick={() => { history.push(RountAdmin.ShowChoiceTestMode) }}>เพิ่ม/แก้ไขเเบบประเมิน</MenuItem>
            </Menu>

            <Menu
                id="simple-menu"
                anchorEl={anchorElExam}
                keepMounted
                open={Boolean(anchorElExam)}
                onClose={handleCloseExam}
            >
                <MenuItem onClick={() => { history.push(RountUsers.ExamTest) }}>แบบทดสอบ</MenuItem>
                <MenuItem onClick={() => { history.push(RountUsers.TestModeExam) }}>ประเมินเเบบทดสอบ</MenuItem>
            </Menu>

            <Menu
                id="simple-menu"
                anchorEl={anchorElOption}
                keepMounted
                open={Boolean(anchorElOption)}
                onClose={handleCloseOption}
            >
                <MenuItem onClick={() => { history.push(RountUsers.PersonalInfor) }}>ข้อมูลส่วนตัว</MenuItem>
                <MenuItem onClick={handleOpenLogout }>ออกจากระบบ</MenuItem>
            </Menu>


            <Dialog
                open={openLogout}
                onClose={handleCloseLogout}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"ต้องการออกจากระบบใช่หรือไม่"}</DialogTitle>

                <DialogActions>
                    <Button onClick={handleCloseLogout} color="primary">
                        อยู่ในระบบต่อ
                    </Button>
                    <Button onClick={Logout} color="primary" autoFocus>
                        ออกจากระบบ
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop className={classes.backdrop} open={openBackdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    );
}