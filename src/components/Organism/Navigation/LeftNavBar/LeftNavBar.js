import React,{Component} from "react";
import { NavLink } from "react-router-dom";
import LogoIcon from "./LogoIcon/LogoIcon";
import styles from './LeftNavBar.module.scss';
import bplogo from "../../../../assets/icons/betterPlaceNewLogo.svg";

class LeftNavBar extends Component {
  render() {
    return (
      <div className={styles.logoMarginBottom}>
        <div>
          <NavLink to="/">
            <LogoIcon url={bplogo} alt="BetterPlace Logo" className={styles.size}/>
          </NavLink>
        </div>
      </div>
    );
  }
}

export default LeftNavBar;
