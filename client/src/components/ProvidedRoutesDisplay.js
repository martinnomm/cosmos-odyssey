import React from 'react'
import { useDispatch } from 'react-redux'
import { changeSelectedRoute, fetchSelectedRouteProviders } from '../redux/reducers/selectedRoute'
import { convertTimeFromMSToText } from '../utils'
import './ProvidedRoutesDisplay.scss'

export default function ProvidedRoutesDisplay({ route }) {
  const dispatch = useDispatch()
  function handleClick() { 
    if(route) {
      dispatch(changeSelectedRoute(route))
      dispatch(fetchSelectedRouteProviders(route.routeProviders))
    }
  }
  return (
    <>
      {
        route
        ? <div className='provided-route text-white' onClick={handleClick}>
            <h4 className='path-text'>{route?.path?.map((planet, planetIDX)=> <span key={planetIDX}>{planet}</span>).reduce((prev, curr) => [prev, <span key={prev}> {'->'} </span>, curr])}</h4>
            <p>Price: {route?.totalPrice?.toFixed(2)}</p>
            <p>Travel Time: {convertTimeFromMSToText(route?.totalTravelTime)}</p>
            <p>Total Distance: {route?.totalDistance}</p>
            <h5>Companies: {route?.companies?.join(', ')}</h5>
          </div>
        : <div className='provided-route text-white'>
            <h3>No Routes Available</h3>
          </div>
      }
    </>
  )
}