import {useState, useEffect} from 'react'
import type { Product } from '../models/product';
import Catalog from '../../features/catalog/Catalog';
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import NavBar from './NavBar';

function App() {

  const [products, setProducts]=useState<Product[]>([]);
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

  useEffect(() => {
    fetch('https://localhost:5001/api/products')
    .then(response => response.json ())
    .then(data => setProducts(data));

    
  }, [])


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
        <Catalog products={products}/>
      </Container>
    </Box>

    </ThemeProvider>
  )
}

export default App
