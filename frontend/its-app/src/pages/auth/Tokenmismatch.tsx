import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {  useHistory } from "react-router-dom";
import {RountGuest} from '../../services/rountURL'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const Tokenmismatch = () => {

    const classes = useStyles();
    const [openBackdrop,setopenBackdrop] = React.useState(false)
    const [openDialog,setopenDialog] = React.useState(true)
    let history = useHistory();

    const Logout = async () => {
        setopenDialog(false)
        await localStorage.removeItem('user')
        setopenBackdrop(true)
        setTimeout(() => { history.push(RountGuest.Login); }, 2000);  
    }

    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={()=>{}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"มีผู้เข้าใช้ระบบจากอุปกรณ์อื่น"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        กรุณาเข้าสู่ระบบใหม่อีกครั้งหรือรีเฟรชหน้านี้ 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{window.location.reload();}} color="primary">
                        รีเฟรช
                    </Button>
                    <Button onClick={()=>{Logout()}} color="primary">
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop className={classes.backdrop} open={openBackdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>

        </div>
    )
}

export default Tokenmismatch