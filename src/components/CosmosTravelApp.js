import React, { useState } from 'react'
import './CosmosTravelApp.scss'
import TravelRoutesList from './TravelRoutesList.js'
import myData from '../assets/travels.json'
export default function CosmosTravelApp(props) {

  const [ origin, setOrigin ] = useState('')
  const [ destination, setDestination ] = useState('mercury')

  const handleOriginChange = (event) => {
    setOrigin(event.target.value)
  }
  const handleDestinationChange = (event) => {
    setDestination(event.target.value)
  }
  const travelRoutes = myData.legs
  return (
    <>
    <div className='select-container'>
      <div>
        <label htmlFor='travel-origin'>Origin</label>
        <select value={origin} onChange={handleOriginChange} name='travel-origin' id='travel-origin' className='form-select'>
          <option disabled value=''> -- Select an option --</option>
          <option disabled={destination === 'mercury'}>Mercury</option>
          <option disabled={destination === 'venus'}>Venus</option>
          <option disabled={destination === 'earth'}>Earth</option>
          <option disabled={destination === 'mars'}>Mars</option>
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
        </select>
      </div>
    </div>
    <TravelRoutesList travelRoutes={travelRoutes} />
    </>
  )
}
