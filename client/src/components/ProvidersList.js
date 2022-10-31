import React from 'react'

export default function ProvidersList({providers}) {

  return (
    <div >
        {
          providers && providers?.length > 0 ?
            [].concat(providers)
            .map((provider, idx) => { return (
              <div className='provided-route text-white' key={idx}>
                <span>route #{idx+1}</span>
                <div className="divider display-divider" />
                <h4 className='path-text'>{`${provider?.from_planet} -> ${provider?.to_planet}`}</h4>
                <p><span>Price:</span> {provider?.price?.toFixed(2)}</p>
                <p><span>Flight Start:</span> {provider?.flightStart}</p>
                <p><span>Flight End:</span> {provider?.flightEnd}</p>
                <p><span>Company:</span> {provider?.company}</p>
              </div>
            )})
            : (<div>Loading...</div>)
        }
    </div>
  )
}