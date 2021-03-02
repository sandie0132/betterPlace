import React, { Component } from 'react';
import styles from './SpocCard.module.scss';
import cx from 'classnames';
import cross from '../../../../../../assets/icons/closeNotification.svg';
import spocClose from '../../../../../../assets/icons/redCross.svg';
import spocAdd from '../../../../../../assets/icons/bluePlus.svg';
import role from '../../../../../../assets/icons/defaultRole.svg';
import locTag from '../../../../../../assets/icons/defaultLocation.svg';
import spocBackground from '../../../../../../assets/icons/spocBackground.svg';
import vendorPhone from '../../../../../../assets/icons/vendorPhone.svg';
import vendorMail from '../../../../../../assets/icons/vendorMail.svg';
import * as imageStoreActions from '../../../../../Home/Store/action';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class SpocCard extends Component {

    componentDidMount() {
        if (this.props.profilePicUrl) {
            this.props.onGetProfilePic(this.props.empId, this.props.profilePicUrl);
        }
    }

    render() {

        return (
            <div className={cx('pl-3 pr-2 mb-3', styles.SpocCard)}>
                <div className='row no-gutters d-flex'>

                    <div className='col-2'>
                        <img
                            className={cx(styles.Image)}
                            src={this.props.profilePicUrl ?
                                (this.props.images[this.props.empId] ? this.props.images[this.props.empId]['image'] : null)
                                : spocBackground}
                            alt=''
                        />
                    </div>

                    <div className={cx('pl-3 col-10', this.props.className)}>
                        <div className="d-flex flex-row justify-content-between">
                            <span className={cx(styles.Name)}>{this.props.name}</span>
                            <span>
                                {this.props.reportingManager ? null :
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        onChange={this.props.changed}
                                        disabled={this.props.isDisabled} />
                                }
                                {this.props.isDisabled ? null :
                                <img
                                    className={styles.Cross}
                                    src={this.props.reportingManager && this.props.isChecked ? cross : this.props.isChecked ? spocClose : spocAdd}
                                    alt=''
                                    onClick={this.props.changed}
                                />}
                            </span>
                        </div>

                        {this.props.reportingManager ?
                            <span className='row d-flex no-gutters'>
                                <span className={cx(styles.Details)}>
                                    {this.props.orgName}
                                    {this.props.employeeId ? (" | " + this.props.employeeId) : ''}
                                </span>
                            </span>
                            :
                            <span className='row d-flex no-gutters'>
                                <span className={cx(styles.Details)}>{this.props.designation}</span>
                            </span>
                        }

                        {this.props.reportingManager ?
                            <span className='row no-gutters justify-content-space-around'>
                                <span className='row no-gutters'>
                                    <img src={role} alt='' />
                                    <span className={cx('pl-1 pr-2', styles.Details)}>{this.props.designation}</span>
                                </span>
                                <span className='row no-gutters'>
                                    <img src={locTag} alt='' />
                                    <span className={cx('pl-1', styles.Details)}>{this.props.locationTag}</span>
                                </span>
                            </span>
                            : null}

                        {this.props.phoneNumber ?
                            <span className='row d-flex no-gutters'>
                                <img src={vendorPhone} className='pr-2' alt='' />
                                <span className={cx('pl-1', styles.Details)}>{this.props.phoneNumber}</span>
                            </span> : null}

                        {this.props.emailId ?
                            <span className='row d-flex no-gutters'>
                                <img src={vendorMail} className={cx('pr-2 mt-1', styles.emailSize)} alt='' />
                                <span className={cx(styles.Details)}>{this.props.emailId}</span>
                            </span> : null}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
    }
}

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(SpocCard)));