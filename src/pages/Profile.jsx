import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Page from './Page';

function Profile() {
  const navigate = useNavigate();
  const [searchparms]= useSearchParams('');
  const profiles =  searchparms.get('profile');
  
 const [ringCode, setRingCode] = useState(( searchparms.get('ringcode'))? searchparms.get('ringcode'):'');
 const [email, setEmail]=useState('');
 const [pass, setPass]=useState('');
 const [regemail, setRegEmail]=useState('');
 const [regpass, setRegPass]=useState('');
 const [ringData, setRingData]=useState();


useEffect(()=>{
////UserCheck
onAuthStateChanged(auth, user=>{
if(user){
navigate(`/profile?profile=${user.uid}`);
}
});
  const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, 'codes'));
  const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setRingData(dataArray);
};
fetchData();

},[navigate]);

 
const handelLogin =()=>{
  if (email && pass) {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        toast(errorMessage);
      });
  } else {
    toast("fill all Info");
  }

};

const userData = {
  username: 'New User',
  buttons: [
      { label: 'Join Our Mailing List', link: 'https://example.com' },
      { label: 'Explore Our Products', link: 'https://example.com' }
  ]
};

const handelSignup = async () => {
  try {
    if (regemail && regpass && ringCode) {
      const foundRingID = ringData.find(item => item.ringcode ===  parseFloat(ringCode) && item.claimed === false);
      if (foundRingID) {
  
  const userCredential = await createUserWithEmailAndPassword(auth, regemail, regpass);
  const user = userCredential.user;
  const usercRefs = doc(db, "profiles", user.uid);
  const updateUser = await  setDoc(usercRefs, userData);
  const ringRefs = doc(db, "codes", foundRingID.id);
  const updateRing = await  updateDoc(ringRefs, {claimed: true});
  console.log("User signed up successfully:", updateUser, updateRing);

      } else {
        toast("Ring Code Not available!");
      }
    } else {
      toast(!regemail ? "Email is required!" : !regpass ? "Password is required!" : "Ring code is required!");
    }
  } catch (error) {
    // Check for specific error codes and handle them accordingly
    if (error.code === "auth/email-already-in-use") {
      toast("Email is already in use!");
    } else if (error.code === "auth/weak-password") {
      toast("Password is too weak!");
    } else {
      // Log the full error object for debugging purposes
      console.error("Signup error:", error);
      toast("An error occurred during signup. Please try again later.");
    }
  }
};



  return (
    <div style={{display: 'flex', gap: "25px"}}>

   {!profiles ?<>
       <div id="login-container">
        <h2>Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)}
        type="email" id="login-email" placeholder="Email"/>
        <input value={pass} onChange={e=>setPass(e.target.value)}
        type="password" onClick={handelLogin}  id="login-password" placeholder="Password"/>
        <button id="login-button">Login</button>
    </div>


    <div id="registration-container">
        <h2>Register</h2>
        <input value={regemail} onChange={e=>setRegEmail(e.target.value)}
         type="email" id="register-email" placeholder="Email"/>
        <input value={regpass} onChange={e=>setRegPass(e.target.value)}
        type="password" id="register-password" placeholder="Password"/>
        <input type="text" value={ringCode}  onChange={e=>setRingCode(e.target.value)}
         id="register-ring-code" placeholder="Ring Code"/>
        <button onClick={handelSignup} id="register-button">Register</button>
        <div id="registration-message"></div>
    </div></>
    :
    <Page profiles={profiles}/>
    }
    <ToastContainer />
    </div>
  )
}

export default Profile