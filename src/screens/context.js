// MyContext.js
import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
    const [showNav, setShowNav] = useState(true);
    
    const handleNav = () => {
         if(showNav){
              setShowNav(false)
         }else{
              setShowNav(true)
         }
    }

  return (
    <MyContext.Provider value={{ showNav, handleNav }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
