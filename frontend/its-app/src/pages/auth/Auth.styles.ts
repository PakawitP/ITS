import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const Styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {    
        margin: theme.spacing(1,0),
        width: '30ch',
      },
    },
    errorMes : {
      color: 'red',
      marginLeft: theme.spacing(5), 
      fontSize: '11px'
    },
    paper: {
      marginTop: theme.spacing(3),

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    fieldButton:{
      marginTop: theme.spacing(3),
    },
    MaginButton:{
      alignItems: 'center',
    },
    MaginTopTitle:{
      marginTop : 5,
      marginRight: 10,
    },
    iconHeadersize:{
      fontSize : 40
    },
    iconFontsize:{
      fontSize : 30
    },
    rootB: {    
        width: '23ch',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

