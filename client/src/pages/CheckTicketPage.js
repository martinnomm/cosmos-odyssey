import React, { useEffect } from 'react'
import './BuyTicketPage.scss'
import ProvidedRoutesList from '../components/ProvidedRoutesList.js'
import OriginDestinationSelector from '../components/OriginDestinationSelector.js'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoading, selectOrigin, selectDestination, selectProvidedRoutes } from '../redux/reducers'
import { fetchRoutes } from '../redux/reducers/providedRoutes'

export default function CheckTicketPage() {

  const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
  // Check validuntil
  // If no currentid or not valid, dispatch api loading
  // if validuntil is fine, useEffect and set up timeout for loading new data

  const loading = useSelector(selectLoading)
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const providedRoutes = useSelector(selectProvidedRoutes)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (loading) return
    if (planets.includes(origin) && planets.includes(destination)){
      dispatch(fetchRoutes({origin, destination}))
    }
  },[origin,destination])
  return (
    <>
      <ProvidedRoutesList loading={loading} providedRoutes={providedRoutes} />
    </>
  )
}