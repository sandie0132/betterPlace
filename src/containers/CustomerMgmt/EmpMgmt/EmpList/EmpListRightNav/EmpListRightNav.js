import React, { Component } from 'react';
import EmpOnboarding from '../../EmpAddNewModal/EmpAddNewModal';
import EmpFilters from "../EmpFilters/EmpFilters";
import styles from "./EmpListRightNav.module.scss";
import ExcelWidget from '../../ExcelOnboarding/ExcelWidget/ExcelWidget';
import HasAccess from '../../../../../services/HasAccess/HasAccess';

class EmpListRightNav extends Component {

    render() {

        const { match } = this.props;
        const orgId = match.params.uuid;

        return (

            <div className={styles.RightNavAlign}>
                <div className={styles.TabAlign}>
                    <EmpOnboarding />
                </div>

                <div >
                    <EmpFilters />
                </div>

                <HasAccess
                    permission={["EMP_MGMT:EXCEL_UPLOAD"]}
                    orgId={orgId}
                    yes={() => <ExcelWidget />}
                />
            </div>
        )
    }
}



export default EmpListRightNav;