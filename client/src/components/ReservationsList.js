import React from 'react'
import './ProvidedRoutesList.scss'
import ReservationDisplay from './ReservationDisplay.js'

export default function ReservationsList(props) {
  return (
    <div className='provided-routes-container'>
      <div className='provided-routes-list'>
        <div className='provided-list-header'/>
        {
            props?.reservations || props.loading ? props?.reservations?.map( (reservation, idx) => { return <ReservationDisplay  reservation={reservation} key={idx}/> })  : '<div>loading</div>' 
        }
        <div className='provided-list-footer'/>
      </div>
    </div>
  )
}
