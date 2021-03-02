import React, { Component } from 'react';
import cx from 'classnames';
import styles from './OrgLogo.module.scss';
import themes from '../../../theme.scss';

const bgColor = themes.secondaryLabel;

class OrgLogo extends Component {

    shortenName = (name) => {

        let updatedShortName = name.split(" ");

        if (updatedShortName.length === 1) {
            updatedShortName = updatedShortName[0].substr(0, 2);
        }
        else if (updatedShortName.length > 1) {
            updatedShortName = updatedShortName[0].substr(0, 1) + updatedShortName[1].substr(0, 1);
        }
        return updatedShortName.toUpperCase();
    }

    render() {
        return (
            <div className={cx(styles.ColorBox)}
                style={this.props.brandColor ? { backgroundColor: this.props.brandColor } : { backgroundColor: bgColor }}>
                <div className={styles.whiteFont}>
                    {this.shortenName(this.props.name)}
                </div>
            </div>
        )
    }
}

export default OrgLogo;