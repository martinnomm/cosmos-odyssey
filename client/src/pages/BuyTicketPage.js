import React, { useEffect } from 'react'
import './BuyTicketPage.scss'
import ProvidedRoutesList from '../components/ProvidedRoutesList.js'
import OriginDestinationSelector from '../components/OriginDestinationSelector.js'
import { useDispatch, useSelector } from 'react-redux'
import { selectRoutesLoading, selectOrigin, selectDestination, selectValidUntil } from '../redux/reducers'
import { fetchRoutes } from '../redux/reducers/providedRoutes'

export default function BuyTicketPage() {

  const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
  // Check validuntil
  // If no currentid or not valid, dispatch api loading
  // if validuntil is fine, useEffect and set up timeout for loading new data

  const loading = useSelector(selectRoutesLoading)
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const validUntil = useSelector(selectValidUntil)
  const dispatch = useDispatch()

  useEffect(() => {
    if (loading) return
    if (planets.includes(origin) && planets.includes(destination)){
      dispatch(fetchRoutes({origin, destination}))
    }
  },[origin,destination])

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      if (planets.includes(origin) && planets.includes(destination))
        dispatch(fetchRoutes({origin, destination}))
      else
        dispatch(fetchRoutes())
    }, validUntil - Date.now() > 0 ? validUntil - Date.now() + 50 : 50)
    return () => {
      clearTimeout(fetchTimeout)
    }
  })
  return (
    <>
      <OriginDestinationSelector />
      <ProvidedRoutesList loading={loading}/>
    </>
  )
}
