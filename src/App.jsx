import React from 'react'
import GoogleCalendar
  from './GoogleCalendar'
import { GoogleLogin } from 'react-google-login'
import Schedule from './Schedule'


const App = () => {

  return (
    <div>

      <h1>google cal api</h1>

      <GoogleCalendar
      />
      <Schedule />
    </div>

  )
}

export default App
