import React from "react";
import styles from "./RightNavBar.module.scss";
import cx from "classnames";

const RightNavBar = props => {
  return (
    
      <div className={cx(styles.RightNavCard, props.className, )} 
      style={props.style}>{props.content}</div>
    
  );
};

export default RightNavBar;
