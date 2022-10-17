import React, { useEffect } from 'react'
import './CosmosTravelApp.scss'
import TravelRoutesList from './TravelRoutesList.js'
import OriginDestinationSelector from './OriginDestinationSelector.js'
import myData from '../assets/testingPaths.json'
import { useDispatch, useSelector } from 'react-redux'
import { selectValidUntil, selectLoading } from '../redux/reducers'
import { fetchRoutes } from '../redux/reducers/routeList'

export default function CosmosTravelApp() {

  // Check validuntil
  // If no currentid or not valid, dispatch api loading
  // if validuntil is fine, useEffect and set up timeout for loading new data

  const validUntil = useSelector(selectValidUntil)
  const loading = useSelector(selectLoading)

  // const dispatch = useDispatch()
  // useEffect(() => {

  //   dispatch(fetchRoutes())
  // })
  // useEffect(() => {
  //   if (loading) return
  //   if (!validUntil) {
  //     dispatch(fetchRoutes())
  //     console.log(validUntil)
  //   }
  // })
  const travelRoutes = myData.paths
  return (
    <>
      goo: {validUntil}
      <OriginDestinationSelector />
      <TravelRoutesList travelRoutes={travelRoutes} />
    </>
  )
}
