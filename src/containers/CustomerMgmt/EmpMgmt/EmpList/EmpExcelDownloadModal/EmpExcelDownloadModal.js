/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'react-crux';
import styles from './EmpExcelDownloadModal.module.scss';
import closePage from '../../../../../assets/icons/closePage.svg';
import profile from '../../../../../assets/icons/profilePurpleBackground.svg';
import bgvSummaryReport from '../../../../../assets/icons/bgvSummaryReport.svg';
import detailedReport from '../../../../../assets/icons/detailedReport.svg';
import pdfDownload from '../../../../../assets/icons/pdfDownload.svg';
import warning from '../../../../../assets/icons/warningIcon.svg';
import arrowDown from '../../../../../assets/icons/form.svg';
import arrowUp from '../../../../../assets/icons/formChecked.svg';
import defaultPic from '../../../../../assets/icons/defaultPic.svg';
import DownloadButton from '../../../../../components/Atom/DownloadButton/DownloadButton';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import * as empListActions from '../Store/action';
import HasAccess from '../../../../../services/HasAccess/HasAccess';

class EmpExcelDownlaodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openProfileSection: false,
      openSummaryReportSection: false,
      openDetailedReportSection: false,
      openZipFileSection: false,
    };
  }

    handleExcelDownload = (type, orgType) => {
      const {
        match, location, selectedEmployees, selectAll, onPostBulkActions, orgName,
      } = this.props;
      const orgId = match.params.uuid;

      let searchParams = new URLSearchParams(location.search.toString());
      searchParams.delete('pageNumber');
      searchParams = searchParams.toString();

      const payload = {
        data: { empIds: _.cloneDeep(selectedEmployees) },
        product: 'ONBOARD',
      };
      if (orgType === 'vendor') { payload.orgName = orgName; }

      let action = 'EMPLOYEE_LIST_EXCEL_DOWNLOAD';

      if (type === 'verify summary excel') {
        payload.product = 'BGV';
        action = orgType === 'org' ? 'EMPLOYEE_DOWNLOAD_BGV_SUMMARY_REPORT' : 'EMPLOYEE_DOWNLOAD_VENDOR_CLIENT_BGV_SUMMARY_REPORT';
      }
      if (type === 'verify detailed excel') {
        payload.product = 'BGV';
        action = orgType === 'org' ? 'EMPLOYEE_DOWNLOAD_BGV_DETAILED_REPORT' : 'EMPLOYEE_DOWNLOAD_VENDOR_CLIENT_BGV_DETAILED_REPORT';
      }
      if (type === 'BGV pdf summary report') {
        payload.product = 'BGV';
        action = 'EMPLOYEE_DOWNLOAD_BGV_PDF_REPORT';
      }
      onPostBulkActions(orgId, action, 'DOWNLOAD_DATA', searchParams, payload, selectAll);
    }

    toggleSection = (sectionName) => {
      const {
        openProfileSection, openSummaryReportSection, openDetailedReportSection, openZipFileSection,
      } = this.state;
      if (sectionName === 'profiles excel') {
        this.setState({ openProfileSection: !openProfileSection });
      }
      if (sectionName === 'verify summary excel') {
        this.setState({ openSummaryReportSection: !openSummaryReportSection });
      }
      if (sectionName === 'verify detailed excel') {
        this.setState({ openDetailedReportSection: !openDetailedReportSection });
      }
      if (sectionName === 'BGV pdf summary report') {
        this.setState({ openZipFileSection: !openZipFileSection });
      }
    }

    displayEachField = (sectionIcon, sectionHeading, stateValue, postBulkActionName,
      postBulkActionState, showVendorOption, selectedEmployees, totalEmployeeCount, selectAll) => (
        <div className={styles.Border}>
          <div className={cx('row no-gutters justify-content-between')}>
            <span className={styles.Heading}>
              <span><img src={sectionIcon} alt="icon" className="mr-2" /></span>
              {sectionHeading}
            </span>
            <img className={cx('my-auto', styles.sectionIcon)} src={stateValue ? arrowUp : arrowDown} aria-hidden alt="down" onClick={() => this.toggleSection(sectionHeading)} />
          </div>
          {stateValue
            ? (
              <>
                <div className={cx('row no-gutters', styles.padding, styles.Heading, sectionHeading === 'BGV pdf summary report' ? 'justify-content-center' : 'justify-content-between')}>
                  {sectionHeading === 'BGV pdf summary report' ? null : <span className="my-auto">standard</span>}
                  <DownloadButton
                    type={sectionHeading === 'BGV pdf summary report' ? 'zipDownload' : 'excelDownload'}
                    downloadState={
                      sectionHeading === 'profiles excel' && postBulkActionName === 'EMPLOYEE_LIST_EXCEL_DOWNLOAD'
                      && postBulkActionState === 'LOADING' ? 'LOADING'
                        : sectionHeading === 'verify summary excel' && postBulkActionName === 'EMPLOYEE_DOWNLOAD_BGV_SUMMARY_REPORT'
                          && postBulkActionState === 'LOADING' ? 'LOADING'
                          : sectionHeading === 'verify detailed excel' && postBulkActionName === 'EMPLOYEE_DOWNLOAD_BGV_DETAILED_REPORT'
                            && postBulkActionState === 'LOADING' ? 'LOADING'
                            : sectionHeading === 'BGV pdf summary report' && postBulkActionName === 'EMPLOYEE_DOWNLOAD_BGV_PDF_REPORT'
                              && postBulkActionState === 'LOADING' ? 'LOADING' : 'INIT'
                    }
                    clickHandler={postBulkActionState === 'LOADING' ? null : () => this.handleExcelDownload(sectionHeading, 'org')}
                    dataCount={selectedEmployees.length}
                    totalEmployeeCount={totalEmployeeCount}
                    selectAll={selectAll}
                  />
                </div>
                {(sectionHeading === 'verify summary excel' || sectionHeading === 'verify detailed excel')
                && showVendorOption ? (
                  <div className={cx('row no-gutters justify-content-between', styles.padding, styles.Heading)}>
                    <span className="my-auto">
                      vendor enabled
                    </span>
                    <DownloadButton
                      type="excelDownload"
                      downloadState={
                        sectionHeading === 'verify summary excel' && postBulkActionName === 'EMPLOYEE_DOWNLOAD_VENDOR_CLIENT_BGV_SUMMARY_REPORT'
                            && postBulkActionState === 'LOADING' ? 'LOADING'
                          : sectionHeading === 'verify detailed excel' && postBulkActionName === 'EMPLOYEE_DOWNLOAD_VENDOR_CLIENT_BGV_DETAILED_REPORT'
                              && postBulkActionState === 'LOADING' ? 'LOADING' : 'INIT'
                      }
                      clickHandler={postBulkActionState === 'LOADING' ? null : () => this.handleExcelDownload(sectionHeading, 'vendor')}
                    />
                  </div>
                  ) : null}
              </>
            ) : null}
        </div>
    )

    render() {
      const {
        t, match, servicesEnabled, toggle, selectAll, totalEmployeeCount, selectedEmployees,
        postBulkActionName, postBulkActionState, employeeList, images,
      } = this.props;
      const orgId = match.params.uuid;

      const {
        openProfileSection, openSummaryReportSection, openDetailedReportSection, openZipFileSection,
      } = this.state;

      let isBgvEnabled = false;
      const products = _.cloneDeep(servicesEnabled.products);
      _.forEach(products, (prod) => {
        if (prod.product === 'BGV') {
          isBgvEnabled = true;
        }
      });

      let showVendorOption = false;
      const pServices = _.cloneDeep(servicesEnabled.platformServices);
      if (!_.isEmpty(pServices)) {
        _.forEach(pServices, (service) => {
          if (service.platformService === 'VENDOR') {
            showVendorOption = true;
          }
        });
      }

      const empCount = selectAll ? totalEmployeeCount : selectedEmployees.length;
      const empHeading = selectAll
        ? totalEmployeeCount + t('translation_empList:empExcelDownloadModal.allSelected')
        : selectedEmployees.length + t('translation_empList:empExcelDownloadModal.fewSelected');
      const profilePics = []; const empIds = [];
      employeeList.forEach((emp) => {
        if (selectedEmployees.includes(emp.uuid)) {
          profilePics.push(emp.profilePicUrl);
          empIds.push(emp.uuid);
        }
      });
      return (
        <div className={cx(scrollStyle.scrollbar, styles.backdrop)}>
          <div>
            <img className={styles.closeStyle} aria-hidden src={closePage} onKeyDown={toggle} onClick={toggle} alt={t('translation_empList:empExcelDownloadModal.close')} />
          </div>
          <div className={styles.MainHeading}>{t('translation_empList:empExcelDownloadModal.heading')}</div>
          <div className={cx(styles.Container, scrollStyle.scrollbar)}>
            <div className={cx(styles.CardPadding)}>
              <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-center">
                  {profilePics.map((pic, index) => {
                    if (index < 5) {
                      return (
                        <span key={empIds[index]}>
                          <img
                            src={pic ? (images[empIds[index]]
                              ? images[empIds[index]].image : defaultPic) : defaultPic}
                            alt=""
                            className={cx('mr-2', styles.profilePicUrl)}
                          />
                        </span>
                      );
                    } return null;
                  })}
                  {/* {employeeList.map((emp, index) => (
                    selectedEmployees.includes(emp.uuid) && index < 5 ? (
                      <span key={emp.uuid}>
                        <img
                          src={emp.profilePicUrl ? (images[emp.uuid]
                            ? images[emp.uuid].image : defaultPic) : defaultPic}
                          alt=""
                          className={cx('mr-2', styles.profilePicUrl)}
                        />
                      </span>
                    ) : null
                  ))} */}
                  {empCount > 5
                    ? (
                      <span className={cx('align-self-center', styles.countcircle)}>
                        +
                        {empCount - 5}
                      </span>
                    ) : null}
                </div>
                <span className={cx('mt-2 mb-1', styles.mediumText)}>
                  {empHeading}
                </span>
              </div>
              <hr className={cx(styles.HorizontalLine)} />

              <HasAccess
                permission={['EMP_MGMT:EXCEL_DOWNLOAD']}
                orgId={orgId}
                yes={() => (
                  this.displayEachField(profile, t('translation_empList:empExcelDownloadModal.profiles'), openProfileSection, postBulkActionName, postBulkActionState, showVendorOption, selectedEmployees, totalEmployeeCount, selectAll)
                )}
              />

              {isBgvEnabled
                ? (
                  <HasAccess
                    permission={['BGV:DOWNLOAD_REPORT']}
                    orgId={orgId}
                    yes={() => (
                      this.displayEachField(bgvSummaryReport, t('translation_empList:empExcelDownloadModal.summaryReport'), openSummaryReportSection, postBulkActionName, postBulkActionState, showVendorOption, selectedEmployees, totalEmployeeCount, selectAll)
                    )}
                  />
                ) : null}

              {isBgvEnabled
                ? (
                  <HasAccess
                    permission={['BGV:DOWNLOAD_REPORT']}
                    orgId={orgId}
                    yes={() => (
                      this.displayEachField(detailedReport, t('translation_empList:empExcelDownloadModal.detailedReport'), openDetailedReportSection, postBulkActionName, postBulkActionState, showVendorOption, selectedEmployees, totalEmployeeCount, selectAll)
                    )}
                  />
                ) : null}

              {isBgvEnabled
                ? (
                  <HasAccess
                    permission={['BGV:DOWNLOAD_REPORT']}
                    orgId={orgId}
                    yes={() => (
                      this.displayEachField(pdfDownload, t('translation_empList:empExcelDownloadModal.pdfReport'), openZipFileSection, postBulkActionName, postBulkActionState, false, selectedEmployees, totalEmployeeCount, selectAll)
                    )}
                  />
                ) : null}

              <hr className={cx(styles.BottomLine)} />
              {postBulkActionState === 'SUCCESS'
                ? (
                  <div className="d-flex flex-row">
                    <img src={warning} style={{ height: '24px' }} alt={t('translation_empList:empExcelDownloadModal.img')} />
&nbsp;
                    <span className={styles.SelectAll}>
                      <i>
                        {t('translation_empList:empExcelDownloadModal.helpText')}
                      </i>
                    </span>
                  </div>
                ) : null}

              <div className="d-flex flex-row justify-content-center mt-2">
                <Button
                  type="save"
                  label={t('translation_empList:empExcelDownloadModal.done')}
                  isDisabled={postBulkActionState !== 'SUCCESS'}
                  clickHandler={toggle}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  servicesEnabled: state.empMgmt.staticData.servicesEnabled,
  postBulkActionState: state.empMgmt.empList.postBulkActionState,
  postBulkActionName: state.empMgmt.empList.actionName,
  images: state.imageStore.images,
});

const mapDispatchToProps = (dispatch) => ({
  onPostBulkActions: (orgId, action, reqType, query, payload, selectAll) => dispatch(
    empListActions.employeeBulkActions(orgId, action, reqType, query, payload, selectAll),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmpExcelDownlaodModal),
));
