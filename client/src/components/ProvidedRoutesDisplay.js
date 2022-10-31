import React from 'react'
import { useDispatch } from 'react-redux'
import { changeSelectedRoute, fetchSelectedRouteProviders } from '../redux/reducers/selectedRoute'
import { convertTimeFromMSToText } from '../utils'
import './ProvidedRoutesDisplay.scss'

export default function ProvidedRoutesDisplay({ selectable, route }) {
  const dispatch = useDispatch()
  function handleClick() { 
    if(route && selectable) {
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
            <div className='divider display-divider' />
            <p><span>Price:</span> {route?.totalPrice?.toFixed(2)}</p>
            <p><span>Travel Time:</span> {convertTimeFromMSToText(route?.totalTravelTime)}</p>
            <p><span>Total Distance:</span> {route?.totalDistance}</p>
            <h5><span>Companies:</span> {route?.companies?.join(', ')}</h5>
          </div>
        : <div className='provided-route text-white'>
            <h3>No Routes Available</h3>
          </div>
      }
    </>
  )
}