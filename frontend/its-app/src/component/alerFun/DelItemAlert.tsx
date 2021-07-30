import React from 'react'
import { Styles } from '../../pages/admin/Admin.styles'
import {
    Backdrop,
    CircularProgress,
    Snackbar,
} from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'


interface Props {
    loading: boolean
    openAlert : boolean
    colerAlert: boolean
    controlAlert : (control:boolean) => void;

}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DelItem: React.FC<Props> = ({ loading,openAlert,colerAlert,controlAlert}) => {
    const classes = Styles();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        controlAlert(false);
    };


    return (
        <div>
            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>


            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={colerAlert  ? "success" : "error"}>
                    {colerAlert ? <div>Delete Success</div> : <div>Error Delete</div>}
                </Alert>
            </Snackbar>

        </div>
    )

}

export default DelItem