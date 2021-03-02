import React, { Component } from 'react';
import styles from './Orgcard.module.scss';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import starDisabledIcon from '../../../../../assets/icons/whiteStarInactive.svg';
import starEnabledIcon from '../../../../../assets/icons/whiteStarActive.svg';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import * as actions from '../Store/action';
import { withTranslation } from 'react-i18next';
// import _ from 'lodash';


class OrgCard extends Component {
    state = {
        colors: [
            '#E5DFED',
            '#F6E5F7',
            '#E3E7E8',
            '#E3E4FD',
            '#E1DBF4',
            '#F1E6DB'
        ]
    }

    getImageName = () => this.props.starredOrg ? starEnabledIcon : starDisabledIcon;


    toggleStar = (uuid) => {
        if (this.props.starredOrg) {
            this.props.deleteStarredOrg(uuid, this.props.filter);
        } else {
            this.props.postStarredOrgList(uuid, this.props.filter);
        }
    }
    
    displayName = (name) => {
        if (name.length > 30) {
            const updatedName = name.substring(0, 30) + '...';
            return (updatedName);
        }
        return (name);
    }

    handleOrgLogo = (orgName) => {
        let updatedShortName = orgName.split(' ');
        if (updatedShortName.length === 1) {
            updatedShortName = updatedShortName[0].substr(0, 2);
        }
        else if (updatedShortName.length > 1) {
            updatedShortName = updatedShortName[0].substr(0, 1) + updatedShortName[1].substr(0, 1);
        }
        return updatedShortName;
    }

    render() {
        const { t } = this.props;
        return (
            <div className={cx('col-4 py-3 px-3')}>

                <div className={cx(styles.CardLayout, styles.CardShadow, 'card card-body p-0')}>
                    <Link to={this.props.url} className={styles.Link}>

                        <div className={cx(styles.DefaultLogoStyle, 'col-12 my-auto text-center px-2 pt-2 pb-3')}
                             style={{ backgroundColor: this.props.brandColor}}
                             >
                            <div className="StarredCard">
                                <img className={cx(styles.Starred, styles.svg)} src={this.getImageName()} alt={t('translation_orgCard:image_alt_orgCard.starred')} onClick={(e) => { e.preventDefault(); this.toggleStar(this.props.index) }} />
                            </div>
                            {/* <div className="pt-4 pb-3">
                                {
                                    <img src={this.props.icon2} alt={t('translation_orgCard:image_alt_orgCard.defaultlogo')} />   
                                }
                            </div> */}
                            <div className={styles.padding}>
                                {this.handleOrgLogo(this.props.shortenName.toLowerCase())}
                            </div>
                        </div>
                    </Link>

                    <Link to={this.props.url} className={styles.Link}>

                        <div className={cx(styles.OrgNameCardStyle, 'px-2 pt-2')}>
                            <div className="container px-2 d-flex flex-column h-100">
                                <span className='d-flex flex-row'>
                                    <span className={styles.shortText}>{this.props.shortenName.toLowerCase()}</span>
                                    <img src={this.props.icon3} alt={t('translation_orgCard:image_alt_orgCard.arrowRight')}  className="ml-auto" />
                                </span>
                                <span className={cx('row no-gutters', styles.greyText)}>{this.displayName(this.props.legalName.toLowerCase())}</span>
                            </div>

                        </div>
                    </Link>
                </div>

            </div>

        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        postStarredOrgList: (uuid, filter) => dispatch(actions.postStarredOrgList(uuid, filter)),
        deleteStarredOrg: (uuid, filter) => dispatch(actions.deleteStarredOrg(uuid, filter))
    };
};

export default withTranslation() (withRouter(connect(null, mapDispatchToProps)(OrgCard)));