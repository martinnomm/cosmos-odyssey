import React, { useEffect } from 'react'
import ProvidedRoutesList from '../components/ProvidedRoutesList.js'
import OriginDestinationSelector from '../components/OriginDestinationSelector.js'
import { useDispatch, useSelector } from 'react-redux'
import { selectRoutesLoading, selectOrigin, selectDestination, selectValidUntil } from '../redux/reducers'
import { fetchRoutes } from '../redux/reducers/providedRoutes'
import { removeSelectedRoute, removeSelectedRouteProviders } from '../redux/reducers/selectedRoute'
import './Page.scss'
import { removeReservations } from '../redux/reducers/reservations.js'

export default function BuyTicketPage() {

  const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]

  const loading = useSelector(selectRoutesLoading)
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const validUntil = useSelector(selectValidUntil)
  const dispatch = useDispatch()

  // Fetch routes when changing origin or destination
  useEffect(() => {
    if (loading) return
    if (origin && destination && planets.includes(origin) && planets.includes(destination)) {
      dispatch(fetchRoutes({origin, destination}))
      dispatch(removeSelectedRoute())
      dispatch(removeSelectedRouteProviders())
      dispatch(removeReservations())
    }
  },[origin,destination])
  
  // Fetch routes when validUntil runs out
  useEffect(() => {
    console.log(new Date(validUntil).toString(), Date.now().toString())
    const fetchTimeout = setTimeout(() => {
      if (planets.includes(origin) && planets.includes(destination)) dispatch(fetchRoutes({origin, destination}))
      else dispatch(fetchRoutes())
      dispatch(removeSelectedRoute())
      dispatch(removeSelectedRouteProviders())
      dispatch(removeReservations())
    }, new Date(validUntil).getTime() - Date.now() > 0 ? new Date(validUntil).getTime() - Date.now() : 500)
    return () => {
      clearTimeout(fetchTimeout)
    }
  })

  return (
    <>
      <div className="page-row buy-page">
        <OriginDestinationSelector />
        <ProvidedRoutesList loading={loading} />
      </div>
    </>
  )
}
