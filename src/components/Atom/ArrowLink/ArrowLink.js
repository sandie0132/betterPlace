import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLinks as NavLink } from 'react-crux';
import styles from './ArrowLink.module.scss';

const ArrowLink = ({ url, label, className }) => (
  <Link to={url} className={styles.Link}>
    <NavLink label={label} className={className} />
  </Link>
);

export default ArrowLink;
