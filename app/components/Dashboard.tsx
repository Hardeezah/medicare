import React from 'react'
import TopBar from './TopBar'
import CardComponent from './CardComponent'
import DoctorList from './DoctorList'
import Timeline from './Timeline'
import { History } from './History'
import Prescription from './Prescription'

const Dashboard = () => {
  const appointments = [
    {
      time: '9:00 AM',
      title: 'Doctor Consultation',
      description: 'Appointment with Dr. Smith for regular check-up.',
    },
    {
      time: '10:30 AM',
      title: 'Dentist Appointment',
      description: 'Teeth cleaning session with Dr. John.',
    },
  ];
  return (
    <div>
      <TopBar/>
      <CardComponent/>
      <div className="flex justify-between flex-col md:flex-row gap-10 ">
          <DoctorList/>
          <div className="">
          <Timeline appointments={appointments}/>
      </div>
      <div className="flex">
        <History/>
        <Prescription/>
      </div>
      </div>
    </div>

  )
}

export default Dashboard