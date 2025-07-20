import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QuizProvider } from './contexts/QuizContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <AuthProvider>
      <QuizProvider>
        <App />
      </QuizProvider>
    </AuthProvider>
  </React.StrictMode>,
)
