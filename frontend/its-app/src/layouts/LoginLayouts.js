import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {
  // Grid,
  Toolbar,
  Typography,
  // Box,
  // Container,
} from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import Footer from './Footer'
// import {Facebook,SportsSoccer} from '@material-ui/icons';
// import PSU from '../component/image/PSU.png'
// import NBTC from '../component/image/NBTC.png'



// const useStyles = makeStyles((theme) => ({
//   heroContent: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(8, 0, 6),
//   },
//   heroButtons: {
//     marginTop: theme.spacing(4),
//   },
//   card: {
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   footer: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(5),
//   },
// }));


export default function LoginLayouts(props) {

  const { children } = props;
  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar >
          <Typography variant="h4" color="inherit" noWrap>
            PSU2RBL
          </Typography>
        </Toolbar>
      </AppBar>

      <main >

        {children}
      </main>

      {/* Footer */}
      <Footer />
      {/* End footer */}
    </React.Fragment>
  );
}