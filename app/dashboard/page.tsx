import React from 'react'
import Navbar from "../component/Navbar"
import Sidebar from '../component/Sidebar';
import Dashboard from './Dashboard';
const dashboard = () => {
  return (
    <div>
<Navbar/>
<Sidebar/>
<Dashboard/>
    </div>
  )
}

export default dashboard;