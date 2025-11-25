import {useState} from 'react'
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

function App() {


  const [darkMode, setDarkMode]=useState(false);
  const palleteType = darkMode ? 'dark' : 'light'
  const theme = createTheme({
    palette:{
      mode: palleteType,
      background:{
        default: (palleteType === 'light') ? '#eaeaea' : '#121212'
      }
    }
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }




  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
    <NavBar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
    <Box
    sx={{
      minHight: '100vh',
      background: darkMode ? '#121212' : '#eaeaea'
    }}>
      <Container maxWidth= 'xl' sx={{mt: 14}}>
        <Outlet />
      </Container>
    </Box>

    </ThemeProvider>
  )
}

export default App
