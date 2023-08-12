
import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Login from './login';
import Register from './registration';
import { useNavigate } from 'react-router-dom';

interface Props {
  onDone?: () => void;
  defaultTab?: '1' | '2';
}

const Authentication = ({
  onDone,
  defaultTab = '1',
}: Props) => {
  const [value, setValue] = React.useState<string>(defaultTab);
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onFinishAuth = () => {
    if (onDone) {
      onDone();
    } else {
      navigate('/');
    }
  };

  return (
    <Grid container justifyContent="center">
        <Grid item xs={10} sm={8}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="Tabs">
                <Tab label="Login" value="1" />
                <Tab label="New user" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Login onLoggedIn={onFinishAuth} />
            </TabPanel>
            <TabPanel value="2">
              <Register onRegistered={onFinishAuth} />
            </TabPanel>
          </TabContext>
        </Grid>
    </Grid>
  )
};

export default Authentication;