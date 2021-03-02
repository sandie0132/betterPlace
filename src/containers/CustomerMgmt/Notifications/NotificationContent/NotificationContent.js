/* eslint-disable max-len */
import React from 'react';
import { isEmpty } from 'lodash';
import EmpAssignTags from './EmpAssignTags';
import EmpListExcelDownload from './EmpListExcelDownload';
import EmpTerminate from './EmpTerminate';
import EmpBgvInitiate from './EmpBgvInitiate';
import EmpBgvMissingInfo from './EmpBgvMissingInfo';
import EmpBgvInsuffInfo from './EmpBgvInsuffInfo';
import EmpBgvNotInitiated from './EmpBgvNotInitiated';
import EmpBgvCheckExpiredApproval from './EmpBgvCheckExpiredApproval';
import EmpBgvCheckUpdatedApproval from './EmpBgvCheckUpdatedApproval';
import EmpListBgvSummaryDownload from './EmpListBgvSummaryDownload';
import EmpListBgvDetailedReportDownload from './EmpListBgvDetailedReportDownload';
import EmpDeployment from './EmpDeployment';
import VendorApprovalNotification from './VendorApprovalNotification';
import ClientContractorTerminate from './ClientContractorTerminate';
import EmpListBgvPdfReportDownload from './EmpListBgvPdfReportDownload';

const NotificationContent = ({ name, dataProp, orgId }) => {
  let notification = null;

  const notificationName = name;

  const getTotal = () => {
    const empId = !isEmpty(dataProp.data.empIds) ? dataProp.data.empIds.length : 0;
    const success = !isEmpty(dataProp.data.success) ? dataProp.data.success.length : 0;
    const error = !isEmpty(dataProp.data.error) ? dataProp.data.error.length : 0;

    const percent = ((success) / (empId + success + error)) * 100;

    const data = {
      total: empId + success + error,
      success,
      percent,
      error,
    };
    return data;
  };

  const getProgressState = () => {
    if (!isEmpty(dataProp.data.error) && isEmpty(dataProp.data.empIds)) {
      return 'error';
    }
    if (!isEmpty(dataProp.data.empIds)) {
      return 'inProgress';
    }

    return 'success';
  };

  switch (notificationName) {
    case 'EMPLOYEE_ASSIGN_TAGS':
      notification = (
        <EmpAssignTags
          orgId={orgId}
          progressData={getTotal()}
          state={getProgressState()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_LIST_EXCEL_DOWNLOAD':
      notification = (
        <EmpListExcelDownload
          orgId={orgId}
          progressData={getTotal()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_TERMINATE':
      notification = (
        <EmpTerminate
          orgId={orgId}
          progressData={getTotal()}
          state={getProgressState()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_BGV_INITIATE':
      notification = (
        <EmpBgvInitiate
          orgId={orgId}
          progressData={getTotal()}
          state={getProgressState()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_BGV_MISSING_INFO':
      notification = (
        <EmpBgvMissingInfo
          orgId={orgId}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_BGV_INSUF_INFO':
      notification = (
        <EmpBgvInsuffInfo
          orgId={orgId}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_BGV_NOT_INITIATED':
      notification = (
        <EmpBgvNotInitiated
          orgId={orgId}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_BGV_CHECK_EXPIRED_APPROVAL':
      notification = (
        <EmpBgvCheckExpiredApproval
          orgId={orgId}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_BGV_CHECK_UPDATED_APPROVAL':
      notification = (
        <EmpBgvCheckUpdatedApproval
          orgId={orgId}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_DOWNLOAD_BGV_SUMMARY_REPORT':
      notification = (
        <EmpListBgvSummaryDownload
          orgId={orgId}
          progressData={getTotal()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_DOWNLOAD_VENDOR_CLIENT_BGV_SUMMARY_REPORT':
      notification = (
        <EmpListBgvSummaryDownload
          orgId={orgId}
          progressData={getTotal()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_DOWNLOAD_BGV_DETAILED_REPORT':
      notification = (
        <EmpListBgvDetailedReportDownload
          orgId={orgId}
          progressData={getTotal()}
          state={getProgressState()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_DOWNLOAD_VENDOR_CLIENT_BGV_DETAILED_REPORT':
      notification = (
        <EmpListBgvDetailedReportDownload
          orgId={orgId}
          progressData={getTotal()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_DOWNLOAD_BGV_PDF_REPORT':
      notification = (
        <EmpListBgvPdfReportDownload
          orgId={orgId}
          progressData={getTotal()}
          data={dataProp}
        />
      );
      break;
    case 'EMPLOYEE_VENDOR_DEPLOY':
      notification = (
        <EmpDeployment
          orgId={orgId}
          progressData={getTotal()}
          state={getProgressState()}
          data={dataProp}
        />
      );
      break;
    case 'CLIENT_CONTRACTOR_TERMINATE':
      notification = (
        <ClientContractorTerminate
          orgId={orgId}
          progressData={getTotal()}
          data={dataProp}
        />
      );
      break;
    case 'VENDOR_CLIENT_REQUEST_APPROVAL':
      notification = (
        <VendorApprovalNotification
          orgId={orgId}
          data={dataProp}
        />
      );
      break;
    default: notification = <div />;
  }

  return (
    <>
      {notification}
    </>
  );
};

export default NotificationContent;
