import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { selectSelectedRoute, selectSelectedRouteProviders } from "../redux/reducers"
import { removeReservations } from "../redux/reducers/reservations"
import { removeSelectedRoute, removeSelectedRouteProviders } from "../redux/reducers/selectedRoute"
import { hideLoader, showLoader } from "../redux/reducers/showLoaderOverlay"
import SideBarBuy from './SideBarBuy'
import SideBarCheck from './SideBarCheck'

import './SideBarContainer.scss'

export default function SideBarContainer() {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        handleExit()
        dispatch(removeReservations())
    },[location])

    const selectedRoute = useSelector(selectSelectedRoute)
    const selectedRouteProviders = useSelector(selectSelectedRouteProviders)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    function handleExit() {
        dispatch(removeSelectedRoute())
        dispatch(removeSelectedRouteProviders())
        setFirstName("")
        setLastName("")
    }

    function handleReservationSubmit() {
        if(!firstName || !lastName || !selectedRoute) return
        dispatch(showLoader())
        fetch("http://localhost:3001/api/reservation", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'firstName': firstName, 'lastName':lastName, reservedRoute: selectedRoute}), 
        })
        .then(() => {
            dispatch(hideLoader())
            // Give confirmation TODO: toastr
            handleExit()
        })
        .catch((e) => { 
            dispatch(hideLoader())
            // Give server error text TODO: toastr
            console.error(e)
            handleExit()
        })
    }
    return (
        <>
        <div className={selectedRoute !== null && selectedRouteProviders !== null ? "offcanvas offcanvas-start w-25 show sidebar-container" : "offcanvas offcanvas-start w-25 sidebar-container"} id="offcanvas">
            <div className="offcanvas-header">
                <h4 className="offcanvas-title d-none d-sm-block" id="offcanvas"><strong>Route details:</strong></h4>
                <button type="button" className="btn-close text-reset" onClick={handleExit} aria-label="Close"></button>
            </div>
            <div className="divider"/>
            {
                location.pathname === '/' ? 
                <SideBarBuy handleReservationSubmit={handleReservationSubmit} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} selectedRoute={selectedRoute} selectedRouteProviders={selectedRouteProviders}/>
                : <SideBarCheck selectedReservation={selectedRoute} selectedReservationProviders={selectedRouteProviders}/>
            }
        </div>
        </>
    )
}
 