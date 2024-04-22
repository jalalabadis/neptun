import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate();
  return (
    
    <div className="container">
    <div className="left-column">
        <div className="welcome-text">
            <img id="logo" src="/images/logo.png" alt="Neptun Logo" style={{maxWidth: "400px"}}/>
            <h1 style={{color:"white"}}>Hello, welcome!</h1>
        </div>
        <form id="login-form">
            <button type="button" className="button login-btn" onClick={()=>navigate('/profile#login')}>Log in</button>
            <button type="button" className="button signup-btn" onClick={()=>navigate('/profile#register')}>Sign up</button>
        </form>
    </div>
</div>
   

  )
}
