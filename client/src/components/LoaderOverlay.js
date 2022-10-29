import React from 'react'
import { useSelector } from 'react-redux'
import { selectShowLoaderOverlay } from '../redux/reducers'
import './LoaderOverlay.scss'

export default function LoaderOverlay() {
  const loading = useSelector(selectShowLoaderOverlay)
  return (
    <div className={loading ? 'loader-container show justify-content-center' : 'loader-container'}>
      <div className="spinner-grow " role="status">
      </div>
    </div>
  )
}
