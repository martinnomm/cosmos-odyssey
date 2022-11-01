import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputName from '../components/InputName'
import ReservationsList from '../components/ReservationsList'
import { selectReservations, selectReservationsLoading } from '../redux/reducers'
import { fetchReservations } from '../redux/reducers/reservations'
import './Page.scss'

/**
 * Router link page for selecting first and last name to query for previously made reservations and display them
 * @returns Router Link Check Ticket Page
 */
export default function CheckTicketPage() {

  const dispatch = useDispatch()
  const reservations = useSelector(selectReservations)
  const loading = useSelector(selectReservationsLoading)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('') 

  const handleSubmit = () => {
    if (loading) return
    if (firstName && lastName && firstName.length > 0 && lastName.length > 0) {
      dispatch(fetchReservations({firstName, lastName}))
    }
  }

  return (
    <>
      <div className="page-row buy-page">
        <InputName className="select-container" buttonName={"Check for tickets"} onSubmit={handleSubmit} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName}/>
        {
          reservations && reservations?.length > 0 && <h2 className="mx-auto mt-2">{reservations[0].firstName} {reservations[0].lastName}</h2>
        }
        <ReservationsList loading={loading} reservations={reservations} />
      </div>
    </>
  )
}
