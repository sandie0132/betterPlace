import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";

import * as actions from "../Store/action";
import DownloadPage from '../DownloadPage/DownloadPage';

const EmpBgvReports = (props) => {

    const { match } = props;
    const orgId = match.params.orgId;
    const empId = match.params.empId;

    return (
        <DownloadPage
            product={"verify"}
            fileType={"pdf"}
            label={"download report here"}
            handleDownload={() => props.downloadEmpBgvPdf(orgId, empId)}
        />
    )
}

const mapDispatchToProps = dispatch => {
    return {
        downloadEmpBgvPdf: (orgId, empId) => dispatch(actions.downloadEmpBgvPdf(orgId, empId)),
    }
}

export default withRouter(connect(null, mapDispatchToProps)(EmpBgvReports));