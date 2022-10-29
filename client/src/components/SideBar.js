import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectSelectedRoute } from "../redux/reducers"
import { removeSelectedRoute } from "../redux/reducers/selectedRoute"
import ProvidedRoutesDisplay from "./ProvidedRoutesDisplay"

export default function SideBar() {
    const dispatch = useDispatch()
    const selectedRoute = useSelector(selectSelectedRoute)
    const firstName = useState('')
    const lastName = useState('')

    // DONE: Create reducer for selected ticket
    // DONE: When selectedTicket is not empty, show SideBar
    // Done: Sidebar X should empty selectedTicket
    // TODO: Reformat sidebar to display the selected route
    // DONE: Remove the previous shit from sidebar
    // TODO: Show input for first and last name
    // TODO: When input is clicked, check if both names exist, and if yes, do a post to database
    // TODO: Show route data like in route display
    // TODO: Create separate element for displaying all providers and their data
    /*
        SIDEBAR


        SIDEBAR

    
    */
    function handleExit() {
        dispatch(removeSelectedRoute())
    }
    function handleReservation() {
        // TODO: Check first name and last name

        // TODO: If (names etc fine) make reservation and exit
        // TODO: If some error with names, show red and dont exit
        handleExit()
    }
    return (
        <>
        <div className={selectedRoute !== null ? "offcanvas offcanvas-start w-25 show" : "offcanvas offcanvas-start w-25"} id="offcanvas">
            <div className="offcanvas-header">
                <h6 className="offcanvas-title d-none d-sm-block" id="offcanvas">Route details:</h6>
                <button type="button" className="btn-close text-reset" onClick={handleExit} aria-label="Close"></button>
            </div>
            <div className="offcanvas-body px-0">
                {/*
                    Input for first name and last name and button to reserve ticket
                */}
                {/* <div className="reservation-input-container row">
                    <label htmlFor="reservation-first-name">First name:</label>
                    <input type="text col-6" id="reservation-first-name"/>

                    <label htmlFor="reservation-last-name">Last name:</label>
                    <input type="text col-6" />
                    
                    <button type="text col-12" onClick={handleReservation}></button>
                </div> */}
                <ProvidedRoutesDisplay route={selectedRoute} />
                {/*
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
 