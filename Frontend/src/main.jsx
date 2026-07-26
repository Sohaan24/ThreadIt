import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MyProvider  } from './Components/MyContext.jsx'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <MyProvider>
    <App />
  </MyProvider>
  </BrowserRouter>
     
  </StrictMode>,
) ;
