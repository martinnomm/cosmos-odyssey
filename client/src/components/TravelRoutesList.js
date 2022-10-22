import React from 'react'
import './TravelRoutesList.scss'
import TravelRoute from './TravelRoute.js'
import { selectRoutes } from '../redux/reducers'
import { useSelector } from 'react-redux'

export default function TravelRoutesList(props) {
  const sel = useSelector(selectRoutes)
  return (
    <div className='travel-routes-list'>
      hmm: {JSON.stringify(sel)}
      <div className='travel-list-header'/>
      {
        sel.map( (travelRoute, idx) => {
          return <TravelRoute travelRoute={travelRoute} key={idx}/>
        })
      }
      <div className='travel-list-footer'/>
    </div>
  )
}
