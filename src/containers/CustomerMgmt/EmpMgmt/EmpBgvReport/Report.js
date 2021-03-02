/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './Report.module.scss';

import * as actions from './Store/action';

import ReportBasicInfo from './ReportBasicInfo/ReportBasicInfo';
import ReportDocuments from './ReportDocuments/ReportDocuments';
import ReportLegal from './ReportLegal/ReportLegal';
import ReportCareer from './ReportCareer/ReportCareer';
import ReportHealth from './ReportHealth/ReportHealth';
import ReportReference from './ReportReference/ReportReference';
import ReportAddress from './ReportAddress/ReportAddress';
import SingleModal from './ReportModal/SingleModal';
import MultipleModal from './ReportModal/MultipleModal';

import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgvData: '',
      finalResult: '',
      showVerificationModal: false,
      modalData: {},
    };
  }

  componentDidMount() {
    const { match, onGetEmpData } = this.props;
    onGetEmpData(match.params.empId, match.params.uuid);
  }

  componentDidUpdate = (prevProps) => {
    const { empData, getEmpDataState, match } = this.props;
    if (empData !== prevProps.empData && getEmpDataState === 'SUCCESS') {
      const verificationData = _.cloneDeep(empData.verifications);
      const currentOrgId = empData.orgId;
      let bgvData = ''; let finalResult = '';
      _.forEach(verificationData, (verify) => {
        // for original org BGV data
        if (_.isEmpty(verify.org_from) && match.params.uuid === currentOrgId) {
          bgvData = verify.bgv;
          finalResult = verify.status;
        }
      });
      // _.forEach(verificationData, (value) => {
      //   if (currentOrgId === value.orgId) {
      //     bgvData = value.bgv;
      //     if (value.status === 'done') {
      //       finalResult = value.result;
      //     } else {
      //       finalResult = value.status;
      //     }
      //   }
      // });
      this.setState({
        bgvData,
        orgId: currentOrgId,
        finalResult,
      });
    }
  }

  toggleModal = (verificationData) => {
    const { showVerificationModal } = this.state;
    this.setState({ showVerificationModal: !showVerificationModal, modalData: verificationData });
  }

  handleDownloadAttachment = (attachment, verificationPreference) => {
    const { onDownloadAttachment } = this.props;
    onDownloadAttachment(attachment, verificationPreference);
  }

  render() {
    const {
      empData, orgData, downloadPdfState, error, getEmpDataState, getImageState,
      images, defaultRole, downloadAttachmentState,
    } = this.props;
    const {
      bgvData, orgId, finalResult, showVerificationModal, modalData,
    } = this.state;

    const NotificationPan = downloadPdfState === 'ERROR'
      ? (
        <div className={cx(styles.ShowErrorNotificationCard, 'flex align-items-center row no-gutters w-100')}>
          <ErrorNotification error={error} />
        </div>
      )
      : <div className={cx('row no-gutters w-100', styles.emptyNotification)} />;
    return (
      <>
        <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
          {getEmpDataState === 'LOADING' || getImageState === 'LOADING'
            ? <div className="ml-4 mr-5"><Loader type="empProfile" /></div>
            : (
              <>
                <div>
                  {!_.isEmpty(orgId)
                    ? (
                      <ArrowLink
                        url={{ pathname: `/customer-mgmt/org/${orgId}/dashboard/verify`, search: '?filter=insights&duration=all_time' }}
                        label="dashboard"
                      />
                    )
                    : null}
                </div>
                {!_.isEmpty(bgvData)
                  ? (
                    <div className={cx(styles.Card, 'd-flex mt-4')}>
                      <div className="row no-gutters w-100">
                        {NotificationPan}
                        <ReportBasicInfo
                          bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                          empData={!_.isEmpty(empData) ? empData : ''}
                          orgData={!_.isEmpty(orgData) ? orgData : ''}
                          finalResult={!_.isEmpty(finalResult) ? finalResult : ''}
                        />
                      </div>
                    </div>
                  ) : null}

                {!_.isEmpty(bgvData)
                  && (!_.isEmpty(bgvData.idcards) || !_.isEmpty(bgvData.address)
                    || !_.isEmpty(bgvData.legal) || !_.isEmpty(bgvData.career)
                    || !_.isEmpty(bgvData.health) || !_.isEmpty(bgvData.reference))
                  ? (
                    <div className={cx('my-4', styles.container)}>
                      {!_.isEmpty(bgvData.idcards)
                        ? (
                          <ReportDocuments
                            bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                            empData={!_.isEmpty(empData) ? empData : ''}
                            toggleModal={this.toggleModal}
                          />
                        ) : null}

                      {!_.isEmpty(bgvData.address)
                        ? (
                          <ReportAddress
                            bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                            empData={!_.isEmpty(empData) ? empData : ''}
                            toggleModal={this.toggleModal}
                          />
                        ) : null}
                      {!_.isEmpty(bgvData.legal)
                        ? (
                          <ReportLegal
                            bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                            empData={!_.isEmpty(empData) ? empData : ''}
                            toggleModal={this.toggleModal}
                          />
                        ) : null}
                      {!_.isEmpty(bgvData.career)
                        ? (
                          <ReportCareer
                            bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                            empData={!_.isEmpty(empData) ? empData : ''}
                            toggleModal={this.toggleModal}
                          />
                        ) : null}
                      {!_.isEmpty(bgvData.health)
                        ? (
                          <ReportHealth
                            bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                            empData={!_.isEmpty(empData) ? empData : ''}
                            toggleModal={this.toggleModal}
                          />
                        ) : null}
                      {!_.isEmpty(bgvData.reference)
                        ? (
                          <ReportReference
                            bgvData={!_.isEmpty(bgvData) ? bgvData : ''}
                            empData={!_.isEmpty(empData) ? empData : ''}
                            toggleModal={this.toggleModal}
                          />
                        ) : null}
                    </div>
                  ) : null}

                {showVerificationModal
                  ? (
                    ['EDUCATION', 'EMPLOYMENT', 'REFERENCE'].includes(modalData.service)
                      ? (
                        <MultipleModal
                          verificationData={modalData}
                          empData={empData}
                          bgvData={bgvData}
                          images={images}
                          toggleModal={this.toggleModal}
                          defaultRole={defaultRole}
                          handleDownloadAttachment={this.handleDownloadAttachment}
                          downloadState={downloadAttachmentState}
                        />
                      )
                      : (
                        <SingleModal
                          verificationData={modalData}
                          empData={empData}
                          bgvData={bgvData}
                          images={images}
                          toggleModal={this.toggleModal}
                          defaultRole={defaultRole}
                          handleDownloadAttachment={this.handleDownloadAttachment}
                          downloadState={downloadAttachmentState}
                        />
                      )
                  ) : null}
              </>
            )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  empData: state.empMgmt.empReport.empData,
  getEmpDataState: state.empMgmt.empReport.getEmpDataState,
  orgData: state.empMgmt.empReport.orgData,
  currentOrgId: state.empMgmt.empReport.currentOrgId,
  downloadPdfState: state.empMgmt.empReport.downloadPdfState,
  error: state.empMgmt.empReport.error,
  getImageState: state.imageStore.getProfilePictureState,

  images: state.imageStore.images,
  downloadAttachmentState: state.empMgmt.empReport.downloadAttachmentState,
  defaultRole: state.empMgmt.empReport.roleTag,
});

const mapDispatchToProps = (dispatch) => ({
  onInitState: () => dispatch(actions.initState()),
  onGetEmpData: (empId, orgId) => dispatch(actions.getEmpData(empId, orgId)),
  onDownloadAttachment: (url, verificationPreference) => dispatch(
    actions.downloadAttachment(url, verificationPreference),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
