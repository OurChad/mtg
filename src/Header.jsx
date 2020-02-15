import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const StyledHeader = styled.header`
  background: #A2C3A4;
  margin-bottom: 1.5rem;
`;

const HeaderContentContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.5rem 1rem;
`;

const AppName = styled.h1`
  margin: 0;
`;

const StyledLink = styled(Link)`
  color: #FFF;
  text-decoration: none;
`;

const Header = ({ siteTitle }) => (
  <StyledHeader>
    <HeaderContentContainer>
      <AppName>
        <StyledLink to="/">
          {siteTitle}
        </StyledLink>
      </AppName>
    </HeaderContentContainer>
  </StyledHeader>
);

Header.propTypes = {
    siteTitle: PropTypes.string.isRequired,
};

export default Header;