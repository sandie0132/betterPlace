import React, { Component } from 'react';
import styles from './EmpTermination.module.scss';
import cx from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actionsOnBoarding from '../EmpAddNewModal/Store/action';
import * as actions from '../EmpTermination/Store/action'
import InfoCard from '../EmpTermination/InfoCard/InfoCard';
import Loader from '../../../../components/Organism/Loader/Loader';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import BigNotification from '../../../../components/Molecule/BigNotification/BigNotification';
import { withTranslation } from 'react-i18next';

class EmpTermination extends Component {

    state = {
        notificationType: 'warning',
        notificationHeader: '',
        notificationMessage: '',
        roleTag: '',
        orgName: '',
        company: 'same',
        data: '',

    }

    componentDidMount = () => {
        if (!_.isEmpty(this.props.entityData)) {
            let updatedData = _.cloneDeep(this.props.entityData);
            let entityData = updatedData[0];

            _.forEach(updatedData, function (value, key) {

                if (!_.isEmpty(value.orgId) && value.isActive === true) {
                    entityData = value;
                    return false;
                }
                else if (!_.isEmpty(value.orgId)) {
                    entityData = value;
                }
            })

            this.setState({
                data: entityData,
            })
        }
        else {
            let redirectPath = '/customer-mgmt/employee';
            this.props.history.push(redirectPath);
        }


    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.data !== prevState.data) {

        }

        if (this.props.getRoleState !== prevProps.getRoleState && this.props.getRoleState === 'SUCCESS') {

            let updatedData = _.cloneDeep(this.state.data);
            updatedData.tags = this.props.tagData;
            this.setState({ data: updatedData })
        }

        if (this.props.getOrgDataState !== prevProps.getOrgDataState && this.props.getOrgDataState === 'SUCCESS') {

            let updatedData = _.cloneDeep(this.state.data);
            updatedData.orgName = this.props.orgName;
            this.setState({ data: updatedData, orgName: this.props.orgName })
        }


        if (this.props.terminationState !== prevProps.terminationState && this.props.terminationState === 'SUCCESS') {
            let notificationType = 'success';
            let notificationHeader = 'employee terminated successfully';
            let notificationMessage = this.state.data.firstName + (!_.isEmpty(this.state.data.lastName) ? ' ' + this.state.data.lastName : '') + ' has been successfully terminated. you can onboard him now.';

            this.setState({
                notificationType: notificationType,
                notificationHeader: notificationHeader,
                notificationMessage: notificationMessage
            })
        }


    }

    handleBack = () => {
        if (this.props.showModal) {
            this.props.initStateonBoard();
        }
        this.props.entityDataReset();
    }


    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;

        let notificationHeader = this.props.cardType.toLowerCase() + ' number already exists';
        let notificationMessage = 'user with this ' + this.props.cardType.toLowerCase() + ' number ' + this.props.cardNo + ' already exists in other organisation. please review it below before onboarding ';

        if (!_.isEmpty(this.state.data.orgId)) {
            notificationMessage = 'user with this ' + this.props.cardType.toLowerCase() + ' number ' + this.props.cardNo + ' already exists in ' + this.state.orgName.toLowerCase() + '. please review it below before onboarding ';
        }

        return (
            <React.Fragment>
                {this.props.getRoleState === "LOADING" || this.props.getOrgDataState === "LOADING" ?
                    <div className={styles.FormBackGround}>
                        <div className='col-9 px-0'>
                            <div className={styles.Loader}>
                                <Loader type='empProfile' UpperCard/>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles.FormBackGround}>
                        <div className='col-12 mx-0'>
                            <div className={styles.AlignLeft}>
                                <div className={cx(styles.CardLayout, 'row')}>
                                    <div className={cx(styles.CardPadding, 'col-12')}>
                                        <div className='d-flex flex-column col-9'>
                                            <div
                                                onClick={() => this.handleBack()}
                                            >
                                                <ArrowLink
                                                    label={t('translation_empTermination:label_empTermination.addEmployee')}
                                                    url={`/customer-mgmt/org/` + orgId + `/employee`}
                                                    className={styles.PaddingLeftArrow}
                                                /></div>
                                            <BigNotification
                                                type={this.state.notificationType}
                                                heading={_.isEmpty(this.state.notificationHeader) ? notificationHeader : this.state.notificationHeader}
                                                message={_.isEmpty(this.state.notificationMessage) ? notificationMessage : this.state.notificationMessage} />
                                            <InfoCard
                                                data={this.state.data}

                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </React.Fragment>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        entityData: state.empMgmt.empAddNew.entityData,
        cardType: state.empMgmt.empAddNew.cardtype,
        cardNo: state.empMgmt.empAddNew.idNo,
        showModal: state.empMgmt.empAddNew.showModal,
        getOrgDataState: state.empMgmt.empAddNew.getDataState,
        orgName: state.empMgmt.empAddNew.orgName,
        getRoleState: state.empMgmt.empAddNew.getTagState,
        tagData: state.empMgmt.empAddNew.tagData,
        terminationState: state.empMgmt.empTermination.entityTerminateState,
        terminateResponseData: state.empMgmt.empTermination.terminationResponseData
    }

}

const mapDispatchToProps = dispatch => {
    return {
        entityTerminate: (orgId, data) => dispatch(actions.terminateEntity(orgId, data)),
        initStateonBoard: () => dispatch(actionsOnBoarding.initState()),
        entityDataReset: () => dispatch(actions.entityDataReset())
    }

}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EmpTermination));