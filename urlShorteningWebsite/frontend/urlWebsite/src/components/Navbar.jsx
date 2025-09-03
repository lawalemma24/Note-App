import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className=' bg-green-400 items-center justify-center w-full flex flex-col'>
      <h1 className='items-center justify-center flex p-10 capitalize font-bold font-serif rounded-2xl text-4xl text-white '>url Shortening Website</h1>
      <ul className='flex justify-center items-center gap-10 p-5 text-2xl font-serif font-bold text-white'>
        <Link to ='/'>Home</Link>
        <Link to ='/list'>List</Link >
      </ul>


    </div>
  )
}

export default Navbar