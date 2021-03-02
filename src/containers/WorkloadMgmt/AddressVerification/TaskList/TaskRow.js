import React, { Component } from "react";
import { withRouter } from "react-router";
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import cx from 'classnames';
import styles from './TaskList.module.scss';
import _ from 'lodash';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import Checkbox from '../../../../components/Atom/CheckBox/CheckBox';
import * as imageStoreActions from "../../../Home/Store/action";

import blueArrow from '../../../../assets/icons/blueArrow.svg';
import defaultEmpPic from '../../../../assets/icons/defaultPic.svg';

class TaskRow extends Component {

    componentDidMount = () => {
        if (this.props.profilePicUrl) {
            this.props.onGetProfilePic(this.props._id, this.props.profilePicUrl);
        }
    }

    getCaseStatus = () => {
        let caseStatus = this.props.caseStatus.toLowerCase().replace(/_/g, " ");
        let policies = this.props.policies;
        
            _.forEach(policies, function (policy) {
                if (_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:CLOSE")) {
                    if(caseStatus === 'pending ops review') {
                        caseStatus = "closed"
                    }
                }  
            })
        return caseStatus;
    }

    render() {
        return (
            <React.Fragment>
                <div className={cx('row no-gutters py-0')} style={{ position: 'relative' }}>

                    <Checkbox
                        type="smallCircle"
                        className="mr-2 mt-3"
                        name="task"
                        disabled={false}
                        value={this.props.allTasksSelected ? true : this.props.selectedTasks.includes(this.props._id)}
                        onChange={() => this.props.handleSelectedTasks(this.props._id)}
                    />

                    <span className='my-auto ml-4'>
                        <img
                            src={this.props.profilePicUrl ?
                                (this.props.images[this.props._id] ? this.props.images[this.props._id]['image'] : defaultEmpPic)
                                : defaultEmpPic}
                            className={styles.Profile}
                            alt=''
                        />
                    </span>
                    <span className={cx(styles.EmpName, 'my-auto')}>{this.props.name}</span>
                    <span className={cx(styles.EmpDetails, styles.PincodeWidth, 'my-auto')}>{this.props.pincode}</span>

                    <HasAccess
                        permission={["PHYSICAL_ADDRESS:LIST", "POSTAL_ADDRESS:LIST"]}
                        yes={() => (
                            <span className={cx(styles.EmpDetails, styles.AssignWidth, 'my-auto')}>{this.props.assignedTo ? this.props.assignedTo : 'unassigned'}</span>
                        )}
                    />
                    <HasAccess denySuperAdminAccess
                        permission={["AGENCY_DASHBOARD:VIEW_ASSIGNED", "AGENCY_DASHBOARD:VIEW_ALL"]}
                        yes={() => (
                            <span className={cx(styles.EmpDetails, styles.AssignWidth, 'my-auto')}>{this.props.assignedTo ? (this.props.userProfile.empId === this.props.assigneeEmpId ? 'me' : this.props.assignedTo) : ''}</span>
                        )}
                    />
                    <span className={cx(styles.EmpDetails, styles.StatusWidth, 'my-auto')}>{this.props.caseStatus ? this.getCaseStatus() : '-'}</span>
                    <span className={cx(styles.EmpDetails, styles.TATWidth, 'my-auto')}>{this.props.tatLeft ? this.props.tatLeft : '-'}</span>

                    <span className='ml-2 my-auto'>
                        <NavLink to={{
                            pathname: this.props.location.pathname + `/${this.props._id}`,
                            prevPath: this.props.location.pathname + this.props.location.search
                        }}
                            className={styles.NavLink}>
                            <img src={blueArrow} alt='' className={styles.Cursor} />
                        </NavLink>
                    </span>

                </div>
                <hr style={{ marginLeft: '2rem', marginRight: '1rem' }} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,

        user: state.auth.user,
        policies: state.auth.policies,
        userProfile: state.user.userProfile.profile,

        getStaticDataState: state.workloadMgmt.addressVerification.address.getStaticDataState,
        staticData: state.workloadMgmt.addressVerification.address.staticData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskRow));