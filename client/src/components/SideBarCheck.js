import React from "react"
import ProvidersList from "./ProvidersList"
import ReservationDisplay from "./ReservationDisplay"

export default function SideBarCheck(props) {
    return (
        <div className="offcanvas-body px-0">
            <h5 className="px-2"><strong>Ticket for:</strong> {props?.selectedReservation?.firstName} {props?.selectedReservation?.lastName}</h5>
            <div className="divider"></div>
            <h5 className="px-2">Reserved Ticket:</h5>
            <ReservationDisplay selectable={false} reservation={props?.selectedReservation} /> 
            <div className="divider"></div>
            <h5 className="px-2">Route Providers:</h5>
            <ProvidersList providers={props?.selectedReservationProviders} />
        </div>
    )
}
 