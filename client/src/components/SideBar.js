import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectSelectedRoute } from "../redux/reducers"
import { removeSelectedRoute } from "../redux/reducers/selectedRoute"
import { hideLoader, showLoader } from "../redux/reducers/showLoaderOverlay"
import InputName from "./InputName"
import ProvidedRoutesDisplay from "./ProvidedRoutesDisplay"
import './SideBar.scss'

export default function SideBar() {
    const dispatch = useDispatch()
    const selectedRoute = useSelector(selectSelectedRoute)
    
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    // DONE: Create reducer for selected ticket
    // DONE: When selectedTicket is not empty, show SideBar
    // DONE: Sidebar X should empty selectedTicket
    // DONE: Reformat sidebar to display the selected route
    // DONE: Remove the previous shit from sidebar
    // DONE: Show input for first and last name
    // DONE: When input is clicked, check if both names exist, and if yes, do a post to database
    // DONE: Show route data like in route display
    // TODO: Create separate element for displaying all providers and their data
 


    function handleExit() {
        dispatch(removeSelectedRoute())
        setFirstName("")
        setLastName("")
    }
    


    function handleReservationSubmit() {
        // if(!firstName) setFirstNameError(true)
        // if(!lastName) setLastNameError(true)
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
        <div className={selectedRoute !== null ? "offcanvas offcanvas-start w-25 show" : "offcanvas offcanvas-start w-25"} id="offcanvas">
            <div className="offcanvas-header text-black">
                <h4 className="offcanvas-title d-none d-sm-block" id="offcanvas"><strong>Route details:</strong></h4>
                <button type="button" className="btn-close text-reset" onClick={handleExit} aria-label="Close"></button>
            </div>
            <div className="divider"/>
            <div className="offcanvas-body px-0 text-black">
                <h5 className="px-2">Reservation:</h5>
                <InputName onSubmit={handleReservationSubmit} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName}/>
                {/* <div className="reservation-input-container row px-2 text-black justify-content-center">
                    <h5>Reservation:</h5>
                    <div className="mb-3 col-8">
                        <label className="my-2" htmlFor="reservation-first-name">First name:</label>
                        <input className={ firstNameError ? "mx-2 form-control is-invalid":"mx-2 form-control"} type="text" id="reservation-first-name" name="reservation-first-name" value={firstName} onChange={handleFirstNameChange}/>
                    </div>
                    <div className="mb-3 col-8">
                        <label className="my-2" htmlFor="reservation-last-name">Last name:</label>
                        <input className={ lastNameError ? "mx-2 form-control is-invalid":"mx-2 form-control"} type="text" id="reservation-last-name" name="reservation-first-name" value={lastName} onChange={handleLastNameChange}/>
                    </div>
                    <button className="btn btn-primary col-8 my-2" onClick={handleReservationSubmit}>Reserve Ticket</button>
                </div> */}
                <div className="divider"></div>
                <h5 className="px-2">Selected Route:</h5>
                <ProvidedRoutesDisplay route={selectedRoute} />

                <div className="divider"></div>
                <h5 className="px-2">Route Providers:</h5>
                
                {/*
                // TODO: Add list here of all the providers for currently selected route
                    Bring out specific providers and their information
                 */}


                {/* <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                    <li className="nav-item">
                        <a href="#" className="nav-link text-truncate">
                            <i className="fs-5 bi-house"></i><span className="ms-1 d-none d-sm-inline">Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#submenu1" className="nav-link text-truncate">
                            <i className="fs-5 bi-speedometer2"></i><span className="ms-1 d-none d-sm-inline">Dashboard</span> </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-truncate">
                            <i className="fs-5 bi-table"></i><span className="ms-1 d-none d-sm-inline">Orders</span></a>
                    </li>
                    <li className="dropdown">
                        <a href="#" className="nav-link dropdown-toggle  text-truncate" id="dropdown" aria-expanded="false">
                            <i className="fs-5 bi-bootstrap"></i><span className="ms-1 d-none d-sm-inline">Bootstrap</span>
                        </a>
                        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdown">
                            <li><a className="dropdown-item" href="#">New project...</a></li>
                            <li><a className="dropdown-item" href="#">Settings</a></li>
                            <li><a className="dropdown-item" href="#">Profile</a></li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>
                            <li><a className="dropdown-item" href="#">Sign out</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-truncate">
                            <i className="fs-5 bi-grid"></i><span className="ms-1 d-none d-sm-inline">Products</span></a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-truncate">
                            <i className="fs-5 bi-people"></i><span className="ms-1 d-none d-sm-inline">Customers</span> </a>
                    </li>
                </ul> */}
            </div>
        </div>
{/* <div className="container-fluid">
    <div className="row">
        <div className="col min-vh-100 py-3">
            <button className="btn float-end" role="button">
                <i className="bi bi-arrow-right-square-fill fs-3" ></i>
            </button>
            Content..
        </div>
    </div>
</div> */}

        </>
    )
}
 