import {  doc, getDoc, updateDoc } from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaPen } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate} from 'react-router-dom';
import { FaExternalLinkAlt } from "react-icons/fa";

function Page({profiles}) {
  const navigate =useNavigate();
  const [userId, setUserID]=useState();
  const [userData, setUserData]=useState();
  const [imageUrl, setImageUrl] = useState(null);
  const [lodingthumbnail, setLodingThumbnail] = useState(false);
  const [userName, setUserName]=useState('');
  const [lable, setLable]=useState('');
  const [url, setUrl]=useState('');
  const [usernameEdit, setUserNameEdit]=useState(false);
  const [addbuttonEdit, setAddbutonEdit]=useState(false);
  const [editParmission, setEditParmission]=useState(false);

  useEffect(()=>{
    onAuthStateChanged(auth, user=>{
      if(user){
        setUserID(user.uid);
        if(user.uid===profiles){
          setEditParmission(true);
        }
      
      }
      });
    
      const fetcuserhData = async () => {
        const profileDocRef = doc(db, 'profiles', profiles);
        const docSnapshot = await getDoc(profileDocRef)
        const profileData = { id: docSnapshot.id, ...docSnapshot.data() };
        if(profileData.username){
        setUserData(profileData);
        setImageUrl(profileData.avatar&&profileData.avatar);
        }
        else{
          navigate('/');
        }
      };
      fetcuserhData();
    },[navigate, profiles]);



    const handleImageChange = async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        toast("No file selected.");
        return;
      }
      const file = files[0];
      setLodingThumbnail(true);
  
      const imageRef = ref(
        storage,
        `images/${file.name + Date.now()}`
      );
  
      try {
        // Upload image to storage
        await uploadBytes(imageRef, file);
  
        // Get download URL of the uploaded image
        const downloadUrl = await getDownloadURL(imageRef);
        const usercRefs = doc(db, "profiles", userId);
        await   updateDoc(usercRefs, {avatar: downloadUrl});
        console.log("Image uploaded successfully. Download URL:", downloadUrl);
        // Set the download URL in the state
        setImageUrl(downloadUrl);
        setLodingThumbnail(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error
      }
    };

    const handelusernameupdate= async()=>{
      if(userName){
      const usercRefs = doc(db, "profiles", userId);
      await   updateDoc(usercRefs, {username: userName});
      userData.username =  userName;
      toast("updateusername");
      setUserNameEdit(false);
      }
      else{
        toast('fill info');
      }
    };

    const handeladdbuttons=async()=>{
      if(lable&&url){
       const newItem = {
          "link": url,
          "label": lable
        };
        userData.buttons.push(newItem);
        console.log(userData.buttons)
        const usercRefs = doc(db, "profiles", userId);
        await   updateDoc(usercRefs, {buttons: userData.buttons});
        toast("update buttons");
        setAddbutonEdit(false);
      }
      else{
        toast('fill info');
      }
    };

    const handeldeleteitem= async(itemlabel)=>{
      console.log(lable)
     const deletebuttons = userData.buttons.filter(item => item.label !== itemlabel);
     const usercRefs = doc(db, "profiles", userId);
     await   updateDoc(usercRefs, {buttons: deletebuttons});

     const updatedUserData = {
      ...userData,
      buttons: deletebuttons
    };
    setUserData(updatedUserData);
     console.log(userData)
     toast("update buttons");
    };
const handelLogout= async()=>{
 await signOut(auth);
navigate('/');

};
  return (
    <> 
       {editParmission&&  <div id="logout-container" style={{position: "absolute", top: "10px", right: "10px"}}>
        <button id="logout-button" onClick={handelLogout} className="buttontrs">Logout</button>
    </div>}
    {!userId&& 
    <div id="logout-container" style={{position: "absolute", top: "10px", right: "10px"}}>
        <button id="logout-button" onClick={e=>navigate('/profile?login=true')} className="buttontrs">Login</button>
    </div>}


    {userData?
    <div style={{display:'flex', flexDirection: "column", gap: "10px"}}>
    <div id="profile-container">

      {editParmission?
        <div id="profile-picture" className={lodingthumbnail?"disablerty":""}>
        <input type="file" accept="image/*" id="imageInput" hidden onChange={handleImageChange}/>
        <label htmlFor="imageInput" className="image-button">
        {lodingthumbnail?
          <div className="linear-background"></div>
        :
       <img src={imageUrl?imageUrl:'https://dummyimage.com/80x80/555555/ffffff&text=a'} alt="" />
        }
       </label> 
       </div>:
      <div id="profile-picture" className={lodingthumbnail?"disablerty":""}>
      <img src={imageUrl?imageUrl:'https://dummyimage.com/80x80/555555/ffffff&text=a'} alt="" />
      </div>
       }


      {usernameEdit?
      <div id="username" style={{display:'flex', alignItems: 'center', gap: '10px'}}>
        <input type="text" value={userName} onChange={e=> setUserName(e.target.value)}
         className='editryuusinput'/> 
         <button className='editerbuttonsd' onClick={handelusernameupdate}>Update</button>
    </div>
    :
        <div id="username">
          {userData?.username} 
          {editParmission&&<FaPen style={{fontSize: '14px'}} onClick={e=>setUserNameEdit(true)} /> }
          </div>
}

<hr />

{userData.buttons?.map((item, index)=>{
return( 
  <button className='labrtyuttonsd' key={index}> 
  <Link to={item.link} target="blank">
  {item.label}  <FaExternalLinkAlt />
  </Link>

</button>

        
) })}

        </div>
        
      {(userData && editParmission) &&
      

<div id="button-container" >
  <table className='table'>
    <tbody>
      <tr>
    <th>Label</th>
<th>Url</th>
<th>Action</th>
</tr>
{userData.buttons?.map((item, index)=>{
return( 
  <tr key={index}> 
<td>{item.label}</td>
<td>{item.link}</td>
<td onClick={e=>handeldeleteitem(item.label)}>Delete</td>

</tr>

        
)

      })}

      </tbody>
   </table>

 
   <div>
   {addbuttonEdit?
   <div style={{display: 'flex', flexDirection: 'column', marginTop: '30px'}}> 
   <div style={{display: 'flex', gap: '5px'}}>
   <input value={lable} onChange={e=> setLable(e.target.value)} type="text" placeholder='Lable' />
   <input value={url} onChange={e=> setUrl(e.target.value)} type="text" placeholder='Url' />
   </div>
<button onClick={handeladdbuttons}>Submit</button>
    </div>
   :

<button onClick={e=>setAddbutonEdit(true)} style={{height: "30px", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: "14px"}}>Add Button</button>
     }
     </div>
 </div>}
    </div>:
    <div className="linear-background"></div>}
    </>
  )
}

export default Page