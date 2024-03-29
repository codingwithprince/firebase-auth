/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useState } from 'react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import { initializeApp } from "firebase/app";
import { userContext } from './_app';
import { getAuth, signInWithPopup,signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signOut, createUserWithEmailAndPassword } from "firebase/auth";



export default function loginUser() {
    const [userLoggedIn, setUserLoggedIn] = useContext(userContext)

  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  })

  const router = useRouter();
  const firebaseConfig = {
    apiKey: "AIzaSyBErzJnwItXUZoXX_7HE9vI4RzjOZO0lFI",
    authDomain: "fir-auth-d106c.firebaseapp.com",
    projectId: "fir-auth-d106c",
    storageBucket: "fir-auth-d106c.appspot.com",
    messagingSenderId: "451585652973",
    appId: "1:451585652973:web:ea29440e5804ec0fb5f4e4"
  };

  const app = initializeApp(firebaseConfig);
  const provider = new GoogleAuthProvider();
//  update user name
  const updateUser = (name) =>{
    const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: name
      }).catch((error) => {
        console.log(error);
      });
  }

  const handleSignIn = () => {
    // sign in
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((res) => {
        const { displayName, email } = res.user;
        const currentUser = {
          name: displayName,
          email: email,
          isLoggedIn: true
        }
        setUser(currentUser);
      })
  }

  // sign out
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(res => {
        const currentUser = {
          name: '',
          email: '',
          isLoggedIn: false
        }
        setUser(currentUser);

      }).catch((error) => {
        console.log(error)
      });
  }

  // handle submit
  const handleSubmit = (e) => {
    // sign up
    if(newUser && user.email && user.password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(res => {
        const newUserInfo = {...user}
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUser(user.name)
      })
        .catch((error) => {
          const newUserInfo = {...user}
          newUserInfo.success = false;
          newUserInfo.error = "Email Already Used, Try another one.";
          setUser(newUserInfo)
        });
    }
    // sign in
    if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const { displayName, email } = res.user;
          const currentUser = {
            name: displayName,
            email: email,
            isLoggedIn: true
          }
          setUser(currentUser);
          setUserLoggedIn(true);
          router.push('/dash')
        })
        .catch((error) => {
          const currentUser = {...user}
          currentUser.error = 'Wrong Password !!!';
          setUser(currentUser)
        });
    }
    e.preventDefault();
  }
  // on change
  const handleChange = (e) => {
    let isFormValid;
    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const validPass = e.target.value.length > 6;
      const passHasNumber = /\d/.test(e.target.value);
      isFormValid = validPass && passHasNumber;
    }
    else {
      isFormValid = true;
    }
    if (isFormValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {user.isLoggedIn ? <div>
          {user.name && <h2>Welcome Mr. {user.name}</h2>}
          <h4>your email is {user.email}</h4>
          <button onClick={handleSignOut}>Sign Out</button>
        </div> :
          <div style={{textAlign:'center'}}>
            <h1 className={styles.title}>
              Welcome to <a href="https://nextjs.org">Authentication</a>
            </h1>
            <br />
            {/* ==== testing state ==== */}
            {/* <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p> */}
            <form onSubmit={handleSubmit} style={{textAlign:'center'}}>
              {
                newUser && <><input onBlur={handleChange} type="text" name="name" placeholder='Your Name' required />
                  <br /></>
              }
              
              <input onBlur={handleChange} type="email" name="email" placeholder='email' required />
              <br />
              <input onBlur={handleChange} type="password" name="password" placeholder='password' required />
              <br />
              <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id="" />
              <label htmlFor="uewUser">Create New Account</label>
              <br />
              <input type="submit" name="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
            </form>
            <br />
            <p>or</p>
            <br />
            {user.success ? <p style={{color: 'green'}}>Successfully {!newUser ? 'logged in' : 'Created'} !!!</p> : <p style={{color: 'red'}}>{user.error}</p>}
            <button onClick={handleSignIn}>Sign In with google</button>
          </div>
        }

      </div>
    </div>
  )
}
