import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';
export const Styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(2, 0),
        width: '80ch',
      },
    },
    rooT: {
      '& > *': {
        width: '50ch',
      },
    },
    errorMes: {
      color: 'red',
      fontSize: '11px'
    },
    paper: {
      marginTop: theme.spacing(10),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    fieldButton: {
      marginTop: theme.spacing(3),
      width: '30ch',
    },
    maginb: {
      marginRight: theme.spacing(2),
    },
    rootfilt: {
      '& > *': {
        width: '38ch',
        margin: theme.spacing(2),
      },
    },
    iconHeadersize: {
      fontSize: 40
    },
    MaginTopTitle: {
      marginTop: 5,
      marginRight: 10,
    },
    Gridroot: {

      flexGrow: 1,
    },
    Gridpaper: {
      margin: theme.spacing(3),
      alignItems: 'center',
    },
    centerpage: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    headercenterpage: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 20,
    },
    buttomcenterpage: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',

    },
    Gridchart: {
      margin: theme.spacing(6),
      height: 600,
      width: 600,
      alignItems: 'center',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    maginChart: {
      margin: theme.spacing(5),
    },
    spaceChart: {
      marginTop: 80,
    },
    choiceMagin: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(3),
    },
    paperdis: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(70),
        height: theme.spacing(50),
      },
    },
    absolute: {
      position: 'absolute',
      top: theme.spacing(10),
      right: theme.spacing(3),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.03),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.03),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      // height:50,
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }),
);

