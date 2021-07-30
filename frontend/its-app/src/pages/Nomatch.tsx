import React from 'react'
import { Link } from "react-router-dom";
import { RountGuest } from '../services/rountURL';
import {
    Typography,
    Grid,
    Button,
} from '@material-ui/core'

const Nomatch: React.FC = () => {
    return (
        <div>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <Typography variant="h1" >404 Page Not Found</Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link} to={RountGuest.Login}
                    >
                        หน้าหลัก
                    </Button>
                </Grid>

            </Grid>

        </div>
    );
}

export default Nomatch;