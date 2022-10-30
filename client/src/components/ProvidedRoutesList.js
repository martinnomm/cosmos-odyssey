import React from 'react'
import './ProvidedRoutesList.scss'
import ProvidedRoutesDisplay from './ProvidedRoutesDisplay.js'
import { useSelector } from 'react-redux'
import { selectProvidedRoutes, selectSorting } from '../redux/reducers'

// TODO: "load max 50 tickets a pop, scrolling loads more type pagination "
export default function ProvidedRoutesList(props) {

  const sorting = useSelector(selectSorting)
  const providedRoutes = useSelector(selectProvidedRoutes)
  function getSortedFunc(sort_type) {
    switch (sort_type) {
      case 'priceAsc':
        return (a,b) => (a.totalPrice > b.totalPrice) ? 1 : ((b.totalPrice > a.totalPrice) ? -1 : 0)
      case 'priceDesc':
        return (a,b) => (a.totalPrice < b.totalPrice) ? 1 : ((b.totalPrice < a.totalPrice) ? -1 : 0)
      case 'distanceAsc':
        return (a,b) => (a.totalDistance > b.totalDistance) ? 1 : ((b.totalDistance > a.totalDistance) ? -1 : 0)
      case 'distanceDesc':
        return (a,b) => (a.totalDistance < b.totalDistance) ? 1 : ((b.totalDistance < a.totalDistance) ? -1 : 0)
      case 'travelTimeAsc':
        return (a,b) => (a.totalTravelTime > b.totalTravelTime) ? 1 : ((b.totalTravelTime > a.totalTravelTime) ? -1 : 0)
      case 'travelTimeDesc':
        return (a,b) => (a.totalTravelTime < b.totalTravelTime) ? 1 : ((b.totalTravelTime < a.totalTravelTime) ? -1 : 0)
      default:
        return () => 1
    }
  }
  
  return (
    <div className='provided-routes-container'>
      <div className='provided-routes-list'>
        <div className='provided-list-header'/>
        {
            [].concat(providedRoutes)
            .sort(getSortedFunc(sorting))
            .map((providedRoute, idx) => { return <ProvidedRoutesDisplay  route={providedRoute} key={idx}/> })
        }
        <div className='provided-list-footer'/>
      </div>
    </div>
  )
}
