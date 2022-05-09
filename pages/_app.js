import { createContext, useState } from 'react'
import '../styles/globals.css'

export const userContext = createContext();

function MyApp({ Component, pageProps }) {
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  return <userContext.Provider value={[userLoggedIn, setUserLoggedIn]}>
           <Component {...pageProps} />
         </userContext.Provider>


 
 
}

export default MyApp
