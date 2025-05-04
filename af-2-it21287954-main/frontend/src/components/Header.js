// File: frontend/src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const Logo = styled(Link)`
  font-weight: 800;
  font-size: 24px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = ({ user, logoutHandler }) => {
  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <Logo to="/">Countries Explorer</Logo>
          <Nav>
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <Button onClick={logoutHandler}>Logout</Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </Nav>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

export default Header;