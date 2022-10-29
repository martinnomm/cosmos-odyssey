import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputName from '../components/InputName'
import ReservationsList from '../components/ReservationsList'
import { selectReservations, selectReservationsLoading } from '../redux/reducers'
import { fetchReservations } from '../redux/reducers/reservations'
import './CheckTicketPage.scss'

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
      <InputName className="select-container" buttonName={"Check for tickets"} onSubmit={handleSubmit} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName}/>
      <ReservationsList loading={loading} reservations={reservations} />
    </>
  )
}
