import React from "react"
import CreateNote from "./pages/CreateNote.jsx"
import './App.css'
// import UpdateNote from "./pages/UpdateNote.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import NavBar from "./pages/NavBar.jsx"
import Notes from "./pages/Notes.jsx"
import Favorites from "./pages/Favorites.jsx"
import EditNote from "./pages/EditNote.jsx"
import Statistics from "./pages/Statistics.jsx"
import { BrowserRouter as  Router, Routes, Route, Navigate } from "react-router-dom"
// import EditNote from "./pages/EditNote.jsx"


function App() {
 

  return (
    <div data-theme="dark">
    
      <div  className="min-h-screen bg-gray-50">
      <NavBar />
      <main>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/edit/:id" element={<EditNote />} />
      <Route path="/create" element={<CreateNote />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/statistics" element={<Statistics />} />

   
    </Routes>
    </main>
    </div>
  

    </div>
  )
}

export default App