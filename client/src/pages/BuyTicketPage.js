import React, { useEffect } from 'react'
import ProvidedRoutesList from '../components/ProvidedRoutesList.js'
import OriginDestinationSelector from '../components/OriginDestinationSelector.js'
import { useDispatch, useSelector } from 'react-redux'
import { selectRoutesLoading, selectOrigin, selectDestination } from '../redux/reducers'
import { fetchRoutes } from '../redux/reducers/providedRoutes'
import { removeSelectedRoute, removeSelectedRouteProviders } from '../redux/reducers/selectedRoute'
import './Page.scss'
import { removeReservations } from '../redux/reducers/reservations.js'

/**
 * Router link page for selecting origin, destination, sorting and filtering to query routes and display those routes
 * @returns Router Link Buy Page
 */
export default function BuyTicketPage() {
  const loading = useSelector(selectRoutesLoading)
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const dispatch = useDispatch()

  // Fetch routes when changing origin or destination
  useEffect(() => {
    const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
    if (loading) return
    if (origin && destination && planets.includes(origin) && planets.includes(destination)) {
      dispatch(fetchRoutes({origin, destination}))
      dispatch(removeSelectedRoute())
      dispatch(removeSelectedRouteProviders())
      dispatch(removeReservations())
    }
  },[origin,destination, dispatch])
  
  

  return (
    <>
      <div className="page-row buy-page">
        <OriginDestinationSelector />
        <ProvidedRoutesList loading={loading} />
      </div>
    </>
  )
}
