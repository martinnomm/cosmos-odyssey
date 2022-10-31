import React from 'react'
import './ProvidedRoutesList.scss'
import ReservationDisplay from './ReservationDisplay.js'

export default function ReservationsList(props) {
  return (
    <div className='provided-routes-list'>
      {
          props?.reservations || props.loading ? props?.reservations?.map( (reservation, idx) => { return <ReservationDisplay selectable={true} reservation={reservation} key={idx}/> })  : '<div>loading</div>' 
      }
    </div>
  )
}
