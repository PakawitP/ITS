import React from 'react';
import Routes from '../pages/Routes'
import { ThemeProvider } from '@material-ui/styles';
import theme from '../theme';

const  App:React.FC = () => {
  return (

    <div>
      <ThemeProvider theme={theme}>
        <Routes/>
      </ThemeProvider>
    </div>
  );
}

export default App;
