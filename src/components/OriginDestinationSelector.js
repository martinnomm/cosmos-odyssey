import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeOrigin } from '../redux/origin'
import { changeDestination } from '../redux/destination'
import './OriginDestinationSelector.scss'

export default function TravelRoute() {
    const { origin } = useSelector((state) => state.originReducer.origin)
    const { destination } = useSelector((state) => state.destinationReducer.destination)
    const dispatch = useDispatch()
  
    const handleOriginChange = (event) => {
        dispatch(changeOrigin(event.target.value))
    }
    const handleDestinationChange = (event) => {
        dispatch(changeDestination(event.target.value))
    }
  return (
    <div className='select-container'>
      <div>
        <label htmlFor='travel-origin'>Origin</label>
        <select value={origin} onChange={handleOriginChange} name='travel-origin' id='travel-origin' className='form-select'>
          <option disabled value=''> -- Select an option --</option>
          <option>Mercury</option>
          <option>Venus</option>
          <option>Earth</option>
          <option>Mars</option>
          <option>Jupiter</option>
          <option>Saturn</option>
          <option>Uranus</option>
          <option>Neptun</option>
        </select>
      </div>
      <div>
        <label htmlFor='travel-destination'>Destination</label>
        <select value={destination} onChange={handleDestinationChange} name='travel-destination' id='travel-destination' className='form-select'>
          <option disabled value=''> -- Select an option --</option>
          <option>Mercury</option>
          <option>Venus</option>
          <option>Earth</option>
          <option>Mars</option>
          <option>Jupiter</option>
          <option>Saturn</option>
          <option>Uranus</option>
          <option>Neptun</option>
        </select>
      </div>
    </div>
  )
}
