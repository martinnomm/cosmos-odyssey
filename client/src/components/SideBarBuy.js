import React from "react"
import InputName from "./InputName"
import ProvidedRoutesDisplay from "./ProvidedRoutesDisplay"
import ProvidersList from "./ProvidersList"

export default function SideBarBuy(props) {
    return (
        <div className="offcanvas-body px-0">
            <h5 className="px-2">Reservation:</h5>
            <InputName onSubmit={props?.handleReservationSubmit} firstName={props?.firstName} setFirstName={props?.setFirstName} lastName={props?.lastName} setLastName={props?.setLastName}/>
            <div className="divider"></div>
            <h5 className="px-2">Selected Route:</h5>
            <ProvidedRoutesDisplay selectable={false} route={props?.selectedRoute} />
            <div className="divider"></div>
            <h5 className="px-2">Route Providers:</h5>
            <ProvidersList providers={props?.selectedRouteProviders} />
        </div>
    )
}
 