import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import EmpBgvReports from './Files/EmpBgvReports';

const DownloadFiles = (props) => {

    const { match } = props;
    return (
        <Switch>
            <Route path={`${match.path}/bgv-pdf-report/org/:orgId/employee/:empId`} component={EmpBgvReports} />
        </Switch>
    );
}

export default withRouter(DownloadFiles);