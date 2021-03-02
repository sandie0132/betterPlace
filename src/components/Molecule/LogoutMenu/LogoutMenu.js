import React, { Component } from "react";
import styles from './LogoutMenu.module.scss';

class LogoutMenu extends Component {

    render(){
        return(
            <React.Fragment>
                <div className={styles.dropdown}>
                    <ul>
                        <li className={styles.dropdownOption}>logout</li>
                        <li className={styles.dropdownOption}>account settings</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}

export default LogoutMenu;