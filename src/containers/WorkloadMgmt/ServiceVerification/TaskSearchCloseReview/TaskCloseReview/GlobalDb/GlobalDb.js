import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './GlobalDb.module.scss';

import profile from '../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';
import checkId from '../../../../../../assets/icons/checkId.svg';
import inactiveCheck from '../../../../../../assets/icons/inactiveCheck.svg';

import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';


class GlobalDb extends Component {

    componentDidMount() {
        if (this.props.taskData.profilePicUrl) {
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }

    date = (dateInput) => {
        if (!_.isEmpty(dateInput)) {
            let dateIn = dateInput.split("-");
            let outputDate = dateIn[2] + "." + dateIn[1] + "." + dateIn[0];
            return outputDate;
        }
        else return null;
    }

    openNewTab = (url, check) => {
        if (!_.isEmpty(url) && this.props.seconds !== 0 && !check) {
            window.open(url)
        }
        if (!_.isEmpty(url) && check) {
            window.open(url)
        }
    }

    render() {
        const empId = this.props.taskData.empId;
        const { t } = this.props;
        return (
            !_.isEmpty(this.props.taskData) ?
                <div className={this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                    <div>
                        <div className="d-flex">
                            {_.includes(this.props.loadingQueue, empId) ?
                                <span className={styles.loaderBackground}>
                                    <img className={styles.loader} src={loader} alt='' />
                                </span>
                                : <span>
                                    <img
                                        src={this.props.taskData.profilePicUrl ?
                                            (this.props.images[empId] ?
                                                this.props.images[empId]['image']
                                                : profile)
                                            : profile}
                                        className={styles.Profile}
                                        alt=""
                                    />
                                </span>
                            }
                            <div>
                                {!_.isEmpty(this.props.taskData.fullName) ?
                                    <label className={styles.SubHeading}>{this.props.taskData.fullName}</label>
                                    : null}<br />
                                <label className={styles.OptionWithHeading}>
                                    {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''}
                                    {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | " : ''}
                                    {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ''}
                                </label>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="row no-gutters justify-content-between" style={{ marginTop: "2rem" }}>
                                {this.props.taskData.fullName ?
                                    <div className="d-flex flex-column col-8">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.fullName}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:globaldb.name')}</span>
                                    </div> : null}

                                <span>
                                    <img
                                        className={cx("ml-auto", styles.hover)}
                                        src={(this.props.seconds !== 0 && !this.props.disabled) ? checkId : inactiveCheck}
                                        alt=''
                                        onClick={!_.isEmpty(this.props.taskData.checkUrl) ?
                                            () => this.openNewTab(this.props.taskData.checkUrl, false)
                                            : () => this.openNewTab("https://worldcheck.refinitiv.com/", false)}
                                    />
                                </span>
                            </div>

                            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                {!_.isEmpty(this.props.taskData.globaldb) ?
                                    <React.Fragment>
                                        {!_.isEmpty(this.props.taskData.globaldb.dob) ?
                                            <div className="d-flex flex-column col-4">
                                                <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.date(this.props.taskData.globaldb.dob)}</span>
                                                <span className={styles.subTextLabel}>{t('translation_docVerification:globaldb.dob')}</span>
                                            </div> : null}

                                        {!_.isEmpty(this.props.taskData.globaldb.gender) ?
                                            <div className="d-flex flex-column col-4">
                                                <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.globaldb.gender.toLowerCase()}</span>
                                                <span className={styles.subTextLabel}>{t('translation_docVerification:globaldb.gender')}</span>
                                            </div> : null}

                                        {!_.isEmpty(this.props.taskData.globaldb.nationality) ?
                                            <div className="d-flex flex-column col-4">
                                                <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.globaldb.nationality}</span>
                                                <span className={styles.subTextLabel}>{t('translation_docVerification:globaldb.nationality')}</span>
                                            </div> : null}
                                    </React.Fragment>
                                    : null}
                            </div>
                        </div>
                    </div>
                    <hr className={styles.horizontalCardLine} />
                    <CommentsSection
                        seconds={this.props.seconds}
                        taskData={this.props.taskData}
                        cardType={this.props.cardType}
                        searchType={this.props.searchType}
                        searchResult={this.props.searchResult}
                        successNotificationHandler={this.props.successNotificationHandler}
                    />
                </div>
                : <EmptyState cardType={this.props.cardType} />
        )
    };
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
        loadingQueue: state.imageStore.loadingQueue
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(GlobalDb));