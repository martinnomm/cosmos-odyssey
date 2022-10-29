import React from 'react'
import BuyTicketPage from './pages/BuyTicketPage'
import CheckTicketPage from './pages/CheckTicketPage'
import SideBar from './components/SideBar'
import { Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <>
    <div className='stars'/>
    <div className='twinkling'/>
    <div className='some-routing-template'>
      <Link to='/'>Buy Ticket</Link>
      <Link to='/check-ticket'>Check Ticket</Link>
    </div>
    <Routes>
      <Route path='/' element={ <BuyTicketPage/> } />
      <Route path='/check-ticket' element={ <CheckTicketPage/> } />
    </Routes>
    <SideBar />
    </>
  )
}


export default App
