import React from 'react'
import './ProvidedRoutesList.scss'
import ProvidedRoutesDisplay from './ProvidedRoutesDisplay.js'

// TODO: "load max 50 tickets a pop, scrolling loads more type pagination "
export default function ProvidedRoutesList(props) {
  return (
    <div className='provided-routes-container'>
      <div className='provided-routes-list'>
        <div className='provided-list-header'/>
        {
            props.providedRoutes || props.loading ? props.providedRoutes.map( (providedRoute, idx) => { return <ProvidedRoutesDisplay  route={providedRoute} key={idx}/> })  : '<div>loading</div>' 
        }
        <div className='provided-list-footer'/>
      </div>
    </div>
  )
}
