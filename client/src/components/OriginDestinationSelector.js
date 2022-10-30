import React from 'react'
import './OriginDestinationSelector.scss'
import { selectOrigin, selectDestination, selectSorting } from '../redux/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { changeOrigin } from '../redux/reducers/origin'
import { changeDestination } from '../redux/reducers/destination'
import { changeSorting } from '../redux/reducers/sorting'

export default function TravelRoute(props) {
  const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]

  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const sorting = useSelector(selectSorting)

  const dispatch = useDispatch()
  const handleOriginChange = (event) => { dispatch(changeOrigin(event.target.value)) } 
  const handleDestinationChange = (event) => { dispatch(changeDestination(event.target.value)) } 
  const handleSortingChange = (event) => { dispatch(changeSorting(event.target.value)) } 
  return (
    <div className='select-container'>
      <div className='row'>
        <div className='col-12 col-md-6 my-3'>
          <label htmlFor='travel-origin'>Origin</label>
          <select value={origin} onChange={handleOriginChange} name='travel-origin' id='travel-origin' className='form-select'>
            <option disabled value=''>-- Select an option --</option>
            { planets.map( (planet, i) => { return (<option key={i} disabled={planet === destination}>{planet}</option>)})}
          </select>
        </div>
        <div className='col-12 col-md-6 my-3'>
          <label htmlFor='travel-destination'>Destination</label>
          <select value={destination} onChange={handleDestinationChange} name='travel-destination' id='travel-destination' className='form-select'>
            <option disabled value=''> -- Select an option -- </option>
            { planets.map( (planet, i) => { return (<option key={i} disabled={planet === origin}>{planet}</option>)})}
          </select>
        </div>
        <div className='col-12 my-3'>
          Filtering
        </div>
        <div className='col-12 my-3'>
          <label htmlFor='sorting-type'>Sorting</label>
          <select value={sorting} onChange={handleSortingChange} name='sorting-type' id='sorting-type' className='form-select'>
            <option disabled value=''> -- Select Sorting -- </option>
            <option value='priceAsc'>Price Ascending</option>
            <option value='priceDesc'>Price Descending</option>
            <option value='distanceAsc'>Distance Ascending</option>
            <option value='distanceDesc'>Distance Descending</option>
            <option value='travelTimeAsc'>Travel Time Ascending</option>
            <option value='travelTimeDesc'>Travel Time Descending</option>
          </select>
        </div>
      </div>
    </div>
  )
}
