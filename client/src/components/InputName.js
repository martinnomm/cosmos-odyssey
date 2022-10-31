import React, { useState } from "react"

export default function InputName(props) {
    
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)

    const handleFirstNameChange = (event) => {
        props?.setFirstName(event.target.value)
        setFirstNameError(false)
    }
    const handleLastNameChange = (event) => {
        props?.setLastName(event.target.value)
        setLastNameError(false)
    }
    function handleSubmit () {
        if (!props?.firstName) setFirstNameError(true)
        if (!props?.lastName) setLastNameError(true)
        if ( !props?.firstName || !props?.lastName) return

        setFirstNameError(false)
        setLastNameError(false)
        props.onSubmit()
    }
    return (
        <div className="row px-2 justify-content-center">
            <div className="col-12 col-md-6 my-3 px-4">
                <label className="my-2" htmlFor="name-input-first-name">First name:</label>
                <input className={ firstNameError ? "mx-2 form-control is-invalid text-black":"mx-2 form-control text-black"} type="text" id="name-input-first-name" name="name-input-first-name" value={props?.firstName} onChange={handleFirstNameChange}/>
            </div>
            <div className="col-12 col-md-6 my-3 px-4">
                <label className="my-2" htmlFor="name-input-last-name">Last name:</label>
                <input className={ lastNameError ? "mx-2 form-control is-invalid text-black":"mx-2 form-control text-black"} type="text" id="name-input-last-name" name="name-input-first-name" value={props?.lastName} onChange={handleLastNameChange}/>
            </div>
            <button className="btn btn-success col-8 my-2" onClick={handleSubmit}>{props?.buttonName ? props.buttonName : 'Reserve Ticket'}</button>
        </div>
    )
}