import React from "react"
import HomePage from "./pages/HomePage.jsx"
import NoteDetail from "./pages/NoteDetail.jsx"
import CreateNote from "./pages/CreateNote.jsx"
import { Routes } from "react-router-dom"
// import { toast } from "react-hot-toast"
import { Route } from "react-router-dom"
// import HomePage from "./pages/HomePage.jsx"
import './app.css'
import UpdateNote from "./pages/UpdateNote.jsx"

function App() {
 

  return (
    <div data-theme="dark" className="">
      {/* <HomePage /> */}
  
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/notes/:id" element={<NoteDetail />} />
      <Route path="/create" element={<CreateNote />} />
      <Route path="/edit/:id" element={<UpdateNote />} />
    </Routes>

    </div>
  )
}

export default App