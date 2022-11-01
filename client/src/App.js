import React, { useEffect } from 'react'
import BuyTicketPage from './pages/BuyTicketPage'
import CheckTicketPage from './pages/CheckTicketPage'
import SideBarContainer from './components/SideBarContainer'
import { Routes, Route, NavLink } from 'react-router-dom'
import LoaderOverlay from './components/LoaderOverlay'
import { useDispatch, useSelector } from 'react-redux'
import { selectValidUntil } from './redux/reducers'
import { fetchRoutes } from './redux/reducers/providedRoutes'
import { removeSelectedRoute, removeSelectedRouteProviders } from './redux/reducers/selectedRoute'
import { removeReservations } from './redux/reducers/reservations'

function App() {

  // Fetch for new routes when validUntil runs out
  const dispatch = useDispatch()
  const validUntil = useSelector(selectValidUntil)
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      dispatch(fetchRoutes())
      dispatch(removeSelectedRoute())
      dispatch(removeSelectedRouteProviders())
      dispatch(removeReservations())
    }, new Date(validUntil).getTime() - Date.now() > 0 ? new Date(validUntil).getTime() - Date.now() : 500)
    return () => {
      clearTimeout(fetchTimeout)
    }
  }, [validUntil])

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
