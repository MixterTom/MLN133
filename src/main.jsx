import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installContentProtection } from './utils/contentProtection'

installContentProtection({
  disableContextMenu: false, // Tắt chặn chuột phải để test
  disableSelection: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
