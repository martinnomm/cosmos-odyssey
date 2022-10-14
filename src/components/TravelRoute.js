import React from 'react'
import './TravelRoute.scss'
export default function TravelRoute({ travelRoute }) {

  return (
    <>
      <div className='travel-route'>
        <h4>{travelRoute.path.join(' -> ')}</h4>
        <p>Price: {travelRoute.totalPrice}</p>
        <p>Travel Time: {travelRoute.totalTravelTime}</p>
        <h5>Companies: {travelRoute.companies.join(', ')}</h5>
      </div>
    </>
  )
}