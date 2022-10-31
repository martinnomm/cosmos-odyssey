import React from 'react'
import BuyTicketPage from './pages/BuyTicketPage'
import CheckTicketPage from './pages/CheckTicketPage'
import SideBarContainer from './components/SideBarContainer'
import { Routes, Route, NavLink } from 'react-router-dom'
import LoaderOverlay from './components/LoaderOverlay'

function App() {
  return (
    <>
    <div className='stars d-none d-md-block'/>
    <div className='twinkling d-none d-md-block'/>
    <div className='page-container container'>
      <div className='routing-section'> 
        <NavLink to='/' end>Buy Ticket</NavLink>
        <NavLink to='/check-ticket' exact={"true"}>Check Tickets</NavLink>
      </div>
      <Routes>
        <Route path='/' element={ <BuyTicketPage/> } />
        <Route path='/check-ticket' element={ <CheckTicketPage/> } />
      </Routes>
    </div>
    <SideBarContainer />
    <LoaderOverlay />
    </>
  )
}


export default App
