import React from "react";
import styles from "./LogoIcon.module.scss";

const logoIcon = props => (
  <div className={styles.LogoIcon}>
    <img src={props.url} alt={props.alt} className={props.className} />
  </div>
);

export default logoIcon;
