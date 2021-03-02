import React, { Component } from 'react';
import styles from './FlagCard.module.scss';
import cx from 'classnames';
import FolderIcon from '../../../../components/Atom/FolderIcon/FolderIcon';
// import Flag from 'react-world-flags';

class FlagCard extends Component {
    render() {
        return (
            <div className={this.props.isSelectedFlag ? styles.selectedFlagCard : styles.FlagCard} onClick={() => this.props.handleClick()}>
                <FolderIcon />

                {/* {this.props.tagType === 'country' ? 
                <Flag code={ this.props.tagCode} height="15"/> 
                : <FolderIcon/>} */}
                <span className={cx('ml-2', styles.CountryText)}>{this.props.tagName}</span>
            </div>
        );
    }
}

export default FlagCard;