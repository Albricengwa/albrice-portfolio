import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PortfolioProvider } from './context/PortfolioContext'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <PortfolioProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </PortfolioProvider>
)
