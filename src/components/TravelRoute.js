import React from 'react'
import './TravelRoute.scss'
export default function TravelRoute({ travelRoute }) {

  return (
    <div className='travel-route'>
      {travelRoute.id}
    </div>
  )
}
