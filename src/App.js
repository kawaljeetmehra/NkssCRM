import './App.css';
import { useEffect, useState } from 'react';
import IndexScreen from './screens/home';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import UsersList from './screens/auth/user';
import { MyContextProvider } from './screens/context';
import AddUserComp from './screens/auth/adduser';
import AttendanceComp from './screens/attendance/attendance';
import LeaveComp from './screens/leaves/leaves';
import LoginScreen from './screens/auth/login';
import { Provider } from 'react-redux';
import {store} from './redux/store';
import ProtectRoute from './screens/auth/protectRoute';
import ProfileComp from "./screens/auth/profile";
import ShowChat from './screens/chat/showChat';

function App() {

  return (
    <div className="App"> 
        <BrowserRouter>
             <Provider store={store}>
                <ProtectRoute>
                  <Routes>
                      <Route path='/' element={<MyContextProvider><IndexScreen /></MyContextProvider>}/>
                      <Route path='/attendance' element={<MyContextProvider><AttendanceComp /></MyContextProvider>} />
                      <Route path='/profile' element={<MyContextProvider><ProfileComp /></MyContextProvider>} />
                      <Route path='/leaves' element={<MyContextProvider><LeaveComp /></MyContextProvider>} />
                      <Route path='/login' element={<MyContextProvider><LoginScreen /></MyContextProvider>} />
                      <Route path='/showchat' element={<MyContextProvider><ShowChat /></MyContextProvider>} />
                  </Routes>
                </ProtectRoute>
            </Provider>
        </BrowserRouter>
    </div>
  );
}

export default App;
