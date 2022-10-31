import React from 'react'
import { useDispatch } from 'react-redux'
import { changeSelectedRoute, fetchSelectedRouteProviders } from '../redux/reducers/selectedRoute'
import { convertTimeFromMSToText } from '../utils'
import './ProvidedRoutesDisplay.scss'

export default function ReservationDisplay({ selectable, reservation }) {
  const dispatch = useDispatch()
  function handleClick() { 
    if(reservation && selectable) {
      dispatch(changeSelectedRoute(reservation))
      dispatch(fetchSelectedRouteProviders(reservation.providerIDS))
    }
  }
  return (
    <>
      <div className='provided-route text-white' onClick={handleClick}>
        <h4 className='path-text'>{reservation?.path?.map((planet, planetIDX)=> <span key={planetIDX}>{planet}</span>).reduce((prev, curr) => [prev, <span key={prev}> {'->'} </span>, curr])}</h4>
        <p><span>Price:</span> {reservation?.totalPrice?.toFixed(2)}</p>
        <p><span>Travel Time:</span> {convertTimeFromMSToText(reservation?.totalTravelTime)}</p>
        <h5><span>Companies:</span> {reservation?.companies?.join(', ')}</h5>
      </div>
    </>
  )
}