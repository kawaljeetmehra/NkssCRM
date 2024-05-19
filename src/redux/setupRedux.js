import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loginHere, logout } from ".";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loading: state.loading,
    error:state.error,
    isAuthenticated:state.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (payload) => dispatch(loginHere(payload)),
    logout: () => dispatch(logout()),
  };
};

const withRedux = (WrappedComponent) => {
  const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(({ ...props }) => (
    <WrappedComponent {...props} />
  ));

  return (props) => (
      <ConnectedComponent {...props} />
  );
};

export default withRedux;