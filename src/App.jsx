import './App.css';

import Home from './components/Home/Home'
import { Auth } from './components/Auth/Auth';
import { Spinner } from './components/Spinner/Spinner'
import Account from './components/Account/Account';
import { auth, getUser } from './components/Firebase/firebase';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GlobalState } from './components/Global/Context';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const getUserDetails = async (uid) => {
    await getUser(uid).then((user) => {
      if (user === null) {
        setDataLoaded(true);
        return
      }
      setIsAuthenticated(true);
      setUserDetails(user);
      setDataLoaded(true);
      // console.log(user);
    }).catch((error) => {
      setDataLoaded(true);
      console.log(error.message);
    })
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setDataLoaded(true);
        setIsAuthenticated(false);
        return;
      }
      const uid = user.uid;
      getUserDetails(uid);
      // console.log(user)
    })
  }, [])

  return (
    <div className='App'>
      <Router>
        {dataLoaded ?
          <Routes>
            {!isAuthenticated && <>
              <Route path='/login' element={<Auth />} />
              <Route path='/signup' element={<Auth isSignup />} />
            </>
            }
            <Route path='/account' element={<Account setIsAuthenticated={setIsAuthenticated} userDetails={userDetails} />} />
            <Route path='/' element={<Home isAuthenticated={isAuthenticated} />} />
            <Route path='*' element={<Navigate to={('/')} />} />
          </Routes>
          :
          <div className="spinner-container">
            <Spinner />
          </div>
        }
      </Router>
      <ToastContainer autoClose={2500} />
    </div>
  )
}

export default App
