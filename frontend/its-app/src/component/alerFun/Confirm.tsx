import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
    DialogContent,
    DialogContentText,
} from '@material-ui/core'

import { delQuizset } from '../../services/auth/DelData'
import DelItemAlert from '../../component/alerFun/DelItemAlert'

interface Props {
    open: boolean
    id: number
    handleCloseDialog: () => void
    URL_API: string
}


const Confirm: React.FC<Props> = ({ open, id, handleCloseDialog, URL_API }) => {
    const [loading, setLoading] = React.useState(false);
    const [colerAlert, setColerAlert] = React.useState(true);
    const [openAlert, setOpenAlert] = React.useState(false);

    const delQuizSet = async () => {
        handleCloseDialog()
        setLoading(true)
        if (await delQuizset(id, URL_API)) {
            setColerAlert(true)
        } else {
            setColerAlert(false)
        }
        setLoading(false)
        setOpenAlert(true)
    }

    const controlAlert = (control: boolean) => {
        setOpenAlert(control)
    }

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"ยืนยันการลบข้อมูล"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        การลบข้อมูลอาจมีผลเสียต่อการทำงานในส่วนเเสดงเเละบันทึกผลของระบบ คุณต้องการยืนยันที่จะลบหรือไม่
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        ยกเลิก
                    </Button>
                    <Button onClick={delQuizSet} color="primary" autoFocus>
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>
            <DelItemAlert
                loading={loading}
                openAlert={openAlert}
                colerAlert={colerAlert}
                controlAlert={controlAlert}
            />

        </div>
    )

}

export default Confirm