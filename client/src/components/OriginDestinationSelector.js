import React from 'react'
import Select from 'react-select';
import './OriginDestinationSelector.scss'
import { selectOrigin, selectDestination, selectSorting, selectFiltering } from '../redux/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { changeOrigin } from '../redux/reducers/origin'
import { changeDestination } from '../redux/reducers/destination'
import { changeSorting } from '../redux/reducers/sorting'
import { changeFiltering } from '../redux/reducers/filtering'
export default function TravelRoute(props) {
  const planets = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]

  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const sorting = useSelector(selectSorting)
  const filtering = useSelector(selectFiltering)
  const companies = [
    { value: 'Explore Origin', label: 'Explore Origin' },
    { value: 'Spacelux', label: 'Spacelux' },
    { value: 'Travel Nova', label: 'Travel Nova' },
    { value: 'Galaxy Express', label: 'Galaxy Express' },
    { value: 'Space Piper', label: 'Space Piper' },
    { value: 'SpaceX', label: 'SpaceX' },
    { value: 'Space Odyssey', label: 'Space Odyssey' },
  ]
  const sortingOptions = [
    { value: '', label: '-- Select Sorting --' },
    { value: 'priceAsc', label: 'priceAsc' },
    { value: 'priceDesc', label: 'priceDesc' },
    { value: 'distanceAsc', label: 'distanceAsc' },
    { value: 'distanceDesc', label: 'distanceDesc' },
    { value: 'travelTimeAsc', label: 'travelTimeAsc' },
    { value: 'travelTimeDesc', label: 'travelTimeDesc' },
  ]
  const dispatch = useDispatch()
  const handleOriginChange = (event) => { dispatch(changeOrigin(event.target.value)) } 
  const handleDestinationChange = (event) => { dispatch(changeDestination(event.target.value)) } 
  const handleSortingChange = (event) => { dispatch(changeSorting(event.value )) } 
  const handleFilteringChange = (event) => { dispatch(changeFiltering(event))} 
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
          <label htmlFor='filtering-type'>Filter out companies</label>
          <Select
            value={filtering}
            onChange={handleFilteringChange}
            isMulti
            name="filtering-type"
            options={companies}
            className="basic-multi-select"
            classNamePrefix="select"
            id="filtering-type"
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), option: (styles) => {return {...styles, color: 'black'}} }}
          />  
        </div>
        <div className='col-12 my-3'>
          <label htmlFor='sorting-type'>Sorting</label>
          <Select
            value={{value: sorting, label: sorting}}
            onChange={handleSortingChange}
            name="filtering-type"
            options={sortingOptions}
            className="basic-single"
            classNamePrefix="select"
            id="filtering-type"
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), option: (styles) => {return { ...styles, color: 'black'}} }}
          />
        </div>
      </div>
    </div>
  )
}
