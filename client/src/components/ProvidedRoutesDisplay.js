import React from 'react'
import { useDispatch } from 'react-redux'
import { changeSelectedRoute } from '../redux/reducers/selectedRoute'
import './ProvidedRoutesDisplay.scss'

export default function ProvidedRoutesDisplay({ route }) {
  const dispatch = useDispatch()
  function handleClick() {
    dispatch(changeSelectedRoute(route))
  }
  return (
    <>
      <div className='provided-route' onClick={handleClick}>
        <h4>{route?.path?.join(' -> ')}</h4>
        <p>Price: {route?.totalPrice?.toFixed(2)}</p>
        <p>Travel Time: {route?.totalTravelTime}</p>
        <p>Total Distance: {route?.totalDistance}</p>
        <h5>Companies: {route?.companies?.join(', ')}</h5>
      </div>
    </>
  )
}