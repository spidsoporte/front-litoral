/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import Logo1 from '../../../assets/images/Logo SPID/Logo-sin-letras.png';
import Logo2 from '../../../assets/images/Logo SPID/Logo.png';

const LogoIcon = (props) => {
  return (
    <Link underline="none" to="/">
      <img src={props.text ? Logo2 : Logo1} alt="Logo SPID" width='100%'/>
    </Link>
  );
};

export default LogoIcon;
