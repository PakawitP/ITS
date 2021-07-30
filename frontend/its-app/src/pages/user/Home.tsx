import React from 'react'
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import { RountGuest } from '../../services/rountURL';
import Dashboard from '../../layouts/Mainlayouts/Dashboard'

const Home: React.FC = () => {

    let history = useHistory();
    const Logout = () => {
        localStorage.removeItem('user')
        history.push(RountGuest.Login);
    }



    return (

        <Dashboard>
            <div>
                {/* <Button
                color="primary"
                variant="contained"
                onClick={Logout}
            >
                ออกจากระบบ
            </Button> */}
            </div>
        </Dashboard>
    )
}

export default Home;