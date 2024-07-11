

import React from 'react'
import { GoogleLogin } from 'react-google-login'

export default function App() {
  const gotopage = reponse => {
    console.log('hi');
  }
  const showerror = error => {
    console.log(error);
  }
  return (
    <div>
      <div>
        <h1>Google calender Api</h1>
      </div>
      <div>
        <GoogleLogin
          clientId='285103588292-h521q4au7g1vvdtjbrsrqsti420jdq9g.apps.googleusercontent.com'
          buttonText='sign-in'
          onSuccess={gotopage}
          onFailure={showerror}
          cookiePolicy={'single_host_origin'}
          responseType='code'
          accessType='offline'
          scope='openid email profile https://www.googleapis.com/auth/calendar'>
        </GoogleLogin>
      </div>
    </div>
  )
}
