import React from 'react'
import './ProvidedRoutesList.scss'
import ProvidedRoutesDisplay from './ProvidedRoutesDisplay.js'
import { useSelector } from 'react-redux'
import { selectFiltering, selectProvidedRoutes, selectSorting } from '../redux/reducers'

// TODO: pagination
// TODO: Move sorting / filtering to backend?
export default function ProvidedRoutesList(props) {

  const sorting = useSelector(selectSorting)
  const filtering = useSelector(selectFiltering)
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
    <div className='provided-routes-list'>
      {
        providedRoutes && providedRoutes?.length > 0 ?
          [].concat(providedRoutes) 
          .sort(getSortedFunc(sorting))
          .filter((providedRoute) => providedRoute.companies.every((company) => !filtering.map(filter => filter.value).includes(company)))
          .map((providedRoute, idx) => { return <ProvidedRoutesDisplay selectable={true}  route={providedRoute} key={idx}/> })
          :
        <ProvidedRoutesDisplay selectable={false}/>
      }
    </div>
  )
}
