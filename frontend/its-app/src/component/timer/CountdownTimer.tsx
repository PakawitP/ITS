import React from 'react'

import {
    Tooltip,
    Fab
} from '@material-ui/core'
import Countdown from 'react-countdown';
import { Styles } from '../../pages/user/User.styles'


interface props {
    timer: number
    callbacktimer: (time: boolean) => void
}

const CountdownTimer: React.FC<props> = ({ timer, callbacktimer }) => {
    const classes = Styles();
    const [nowTime, setDisabledchoice] = React.useState<any>(Date.now())
    // let d:any
    React.useEffect(()=>{
        setDisabledchoice(Date.now())
    },[])

    const renderer = ({ hours, minutes, seconds, completed }: any) => {
        let tm = ''
        if (completed) {
            callbacktimer(true)
        }
        if (completed) {
            return (<div>หมดเวลา</div>);
        }
        else {
            // console.log(`${hours} : ${minutes}`);
            if (minutes < 1 && hours < 1) {

                return <span>{seconds}</span>;
            }
            else if (minutes < 10) {
                tm = '0' + minutes.toString()
            }
            else {
                tm = minutes.toString()
            }
            return <span>{hours}:{tm}</span>;
        }
    };

    return (
        <div>
            <Tooltip title="เวลาที่เหลือ" >
                <Fab color="primary"
                    className={classes.absolute}
                >
                    <Countdown
                        date={nowTime + timer * 60 * 1000}
                        renderer={renderer}
                    />
                </Fab>
            </Tooltip>

        </div>
    )

}

export default CountdownTimer
