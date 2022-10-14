import React from 'react'
import './TravelRoutesList.scss'
import TravelRoute from './TravelRoute.js'
import { selectRoutes } from '../redux/reducers'
import { useSelector } from 'react-redux'

export default function TravelRoutesList(props) {
  const sel = useSelector(selectRoutes)
  return (
    <div className='travel-routes-list'>
      hmm: {sel}
      <div className='travel-list-header'/>
      {
        props.travelRoutes.map( (travelRoute) => {
          return <TravelRoute travelRoute={travelRoute} key={travelRoute.id}/>
        })
      }
      <div className='travel-list-footer'/>
    </div>
  )
}
