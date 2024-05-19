import React from "react";
import withRedux from "../../redux/setupRedux";
import { useLocation, useNavigate } from "react-router-dom";
import LoginScreen from './login';

const ProtectRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo = () => {
    navigate("/");
  };

  if (location.pathname == "/login") {
    return children;
  } else if (isAuthenticated) {
    return children;
  } else {
    return <LoginScreen/>
  }
};

export default withRedux(ProtectRoute);
