import React from 'react'
import { convertTimeFromMSToText } from '../utils'
import './ProvidedRoutesDisplay.scss'

export default function ProvidedRoutesDisplay({ reservation }) {
  // const dispatch = useDispatch()
  // function handleClick() {
    // dispatch(changeSelectedRoute(route))
  // }

  // firstName, lastName, path, price, traveltime, companies
  return (
    <>
      <div className='provided-route text-white'>
        { JSON.stringify(reservation)}
        
        <h4>{reservation?.firstName} {reservation?.lastName}</h4>
        <h4>{reservation?.path?.join(' -> ')}</h4>
        <p>Price: {reservation?.totalPrice?.toFixed(2)}</p>
        <p>Travel Time: {convertTimeFromMSToText(reservation?.totalTravelTime)}</p>
        <h5>Companies: {reservation?.companies?.join(', ')}</h5>
      </div>
    </>
  )
}