import React from 'react'
import './CosmosTravelApp.scss'
import TravelRoutesList from './TravelRoutesList.js'
import OriginDestinationSelector from './OriginDestinationSelector.js'
import myData from '../assets/travels.json'
export default function CosmosTravelApp() {

  
  const travelRoutes = myData.legs
  return (
    <>
    <OriginDestinationSelector />
    <TravelRoutesList travelRoutes={travelRoutes} />
    </>
  )
}
