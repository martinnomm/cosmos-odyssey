import React from 'react'
import './OriginDestinationSelector.scss'
import { selectOrigin, selectDestination } from '../redux/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { changeOrigin } from '../redux/reducers/origin'
import { changeDestination } from '../redux/reducers/destination'

export default function TravelRoute(props) {
  const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]

  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const dispatch = useDispatch()
  const handleOriginChange = (event) => { dispatch(changeOrigin(event.target.value)) } 
  const handleDestinationChange = (event) => { dispatch(changeDestination(event.target.value)) } 
  // TODO: Add sorting
  // TODO: Add filterin
  return (
    <div className='select-container'>
      <div>
        <label htmlFor='travel-origin'>Origin</label>
        <select value={origin} onChange={handleOriginChange} name='travel-origin' id='travel-origin' className='form-select'>
          <option disabled value=''>-- Select an option --</option>
          { planets.map( (planet, i) => { return (<option key={i} disabled={planet === destination}>{planet}</option>)})}
        </select>
      </div>
      <div>
        <label htmlFor='travel-destination'>Destination</label>
        <select value={destination} onChange={handleDestinationChange} name='travel-destination' id='travel-destination' className='form-select'>
          <option disabled value=''> -- Select an option --</option>
          { planets.map( (planet, i) => { return (<option key={i} disabled={planet === origin}>{planet}</option>)})}
        </select>
      </div>
    </div>
  )
}
