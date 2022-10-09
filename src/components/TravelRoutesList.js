import React from 'react'
import './TravelRoutesList.scss'
import TravelRoute from './TravelRoute.js'
export default function TravelRoutesList({ travelRoutes }) {

  return (
    <div className='travel-routes-list'>
      <div className='travel-list-header'/>
      {
        travelRoutes.map( (travelRoute) => {
          return <TravelRoute travelRoute={travelRoute} key={travelRoute.id}/>
        })
      }
      <div className='travel-list-footer'/>
    </div>
  )
}
