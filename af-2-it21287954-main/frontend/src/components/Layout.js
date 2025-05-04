// File: frontend/src/components/Layout.js
import React from 'react';
import Header from './Header';

const Layout = ({ children, user, logoutHandler }) => {
  return (
    <>
      <Header user={user} logoutHandler={logoutHandler} />
      <main className="container">{children}</main>
    </>
  );
};

export default Layout;