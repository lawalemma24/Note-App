import React from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from 'lucide-react'

const NavBar = () => {
  return (
    <header className='bg-base-300 border-base-content/10'>
    <div className='mx-auto max-w-6xl'>
        <div className="mx-auto max-w-6xl p-4">
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-primary tracking-tight'>ThinkBoard</h1>
                <div className='flex items-center gap-4'>
                    <Link to={"/create"} className='btn btn-ghost btn-sm rounded-btn'>
                    <PlusIcon className='w-5 h-5 mr-2' />
                    <span>Create Note</span>

                    </Link>

                </div>
                
            </div>


        </div>

    </div>
    </header>
  )
}

export default NavBar