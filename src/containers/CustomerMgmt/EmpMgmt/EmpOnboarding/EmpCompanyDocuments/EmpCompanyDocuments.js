import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import * as onboardActions from '../Store/action';

import styles from "./EmpCompanyDocuments.module.scss";
import _ from 'lodash';
import cx from 'classnames';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import docGenerate from '../../../../../assets/icons/documentManagement.svg';

// import DigitalSignature from "./DigitalSignature/DigitalSignature";
import CompanyDocuments from './CompanyDocuments/CompanyDocuments';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';


class EmpCompanyDocuments extends Component {

    componentDidMount() {
        this._isMounted = true;
        const { match } = this.props;
        const orgId = match.params.uuid;
        const empId = match.params.empId;

        if (_.isEmpty(this.props.empData)) {
            this.props.onGetData(orgId, empId);
        }

    }

    getSubHeadingForDoc = () =>{
        let heading = "document generation - "

        if(!_.isEmpty(this.props.orgOnboardConfigData)){
            const configData = this.props.orgOnboardConfigData.documents
            const thisRef = this
            let document =  _.filter(configData, function(doc){
                if(doc.documentType.toLowerCase() === thisRef.props.location.pathname.split('/').reverse()[0]){
                    return doc
                }
            })

            if(!_.isEmpty(document)){
                heading = heading + document[0].documentLabel
            }
            else heading = heading + "digital signature"    
        }

        return heading;
    }

    render() {
        const { match } = this.props;

        const orgId = this.props.match.params.uuid;
        const empId = this.props.match.params.empId ? this.props.match.params.empId : '';

        let empName = !_.isEmpty(this.props.empData) ?
        !_.isEmpty(this.props.empData.firstName) && !_.isEmpty(this.props.empData.lastName) ? this.props.empData.firstName.toLowerCase() + ' ' + this.props.empData.lastName.toLowerCase()
            : !_.isEmpty(this.props.empData.firstName) && _.isEmpty(this.props.empData.lastName) ? this.props.empData.firstName.toLowerCase()
                : 'person' : ''

        return (
            <div className={cx(styles.form,scrollStyle.scrollbar)}>
                <div className={styles.fixedHeader} >
                    <ArrowLink
                        label={empName + "'s profile"}
                        url={`/customer-mgmt/org/` + orgId + `/employee/` + empId + `/profile`}
                    />
                    <CardHeader label={this.getSubHeadingForDoc()} iconSrc={docGenerate} />
                </div>
            <div>
                <Switch>
                    {/* <Route path={`${match.path}/digital-signature`} exact component={DigitalSignature} /> */}
                    <Route path={`${match.path}/:docType`} component={CompanyDocuments} />
                </Switch>
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        empData: state.empMgmt.empOnboard.onboard.empData,
        orgOnboardConfigData: state.empMgmt.staticData.orgOnboardConfig

    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetData: (orgId, empId) => dispatch(onboardActions.getEmpData(orgId, empId))
    }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmpCompanyDocuments));