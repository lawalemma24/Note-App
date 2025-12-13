import { useState } from 'react'
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/homePage.jsx'
import CreatePage from './pages/createPage.jsx'
import NoteDetail from './pages/noteDetail.jsx'

function App() {
  return (
    <div>
      {/* Add Toaster component for toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <button onClick={() => toast.success("Your Toast Has worked")}>
        Click Me
      </button>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/create' element={<CreatePage/>} />
        <Route path='/note/:id' element={<NoteDetail/>} />  
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App