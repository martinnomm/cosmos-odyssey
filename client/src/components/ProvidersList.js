import React from 'react'

export default function ProvidersList({providers}) {

  return (
    <div className='provided-routes-container'>
      <div className=''>
        <div className='provided-list-header'/>
        {
          providers && providers?.length > 0 ?
            [].concat(providers)
            .map((provider, idx) => { return (
              <div className='provided-route text-white' key={idx}>
                <h4 className='path-text'>{`${provider?.from_planet} -> ${provider?.to_planet}`}</h4>
                <p>Price: {provider?.price?.toFixed(2)}</p>
                <p>Flight Start: {provider?.flightStart}</p>
                <p>Flight End: {provider?.flightEnd}</p>
                <p>Company: {provider?.company}</p>
              </div>
            )})
            : (<div>Loading...</div>)
        }
        <div className='provided-list-footer'/>
      </div>
    </div>
  )
}