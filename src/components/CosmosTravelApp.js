import React from 'react'
import './CosmosTravelApp.scss'
import TravelRoutesList from './TravelRoutesList.js'
import OriginDestinationSelector from './OriginDestinationSelector.js'
import myData from '../assets/testingPaths.json'

export default function CosmosTravelApp() {

  const travelRoutes = myData.paths
  return (
    <>
      <OriginDestinationSelector />
      <TravelRoutesList travelRoutes={travelRoutes} />
    </>
  )
}
