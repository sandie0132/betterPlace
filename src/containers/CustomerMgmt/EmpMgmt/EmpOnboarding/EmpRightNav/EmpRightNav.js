import React, { Component } from 'react';
import _ from "lodash";
import { withRouter } from "react-router";
import { goToAnchor } from 'react-scrollable-anchor';
import { connect } from 'react-redux';
import cx from 'classnames';

import styles from './EmpRightNav.module.scss';

import RightNavBar from '../../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
import RightNavUrls from './RightNavUrls/RightNavUrls';
import ProfilePicStatus from '../../../../../components/Organism/ProfilePicStatus/ProfilePicStatus';
import Loader from '../../../../../components/Organism/Loader/Loader';

import arrowUp from '../../../../../assets/icons/formChecked.svg';
import arrowDown from '../../../../../assets/icons/form.svg';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import HasAccess from '../../../../../services/HasAccess/HasAccess';

class EmpRightNav extends Component {

    state = {
        additionalDropdown: false,
        govDocDropdown: false,
        companyDocDropdown: false
    }

    componentDidMount() {
        this.handleHeadingState();
        this.subHeadingHandler();

        let orgName = this.props.orgData ? this.props.orgData.name : "";
        let brandColor = this.props.orgData && this.props.orgData.brandColor != null ? this.props.orgData.brandColor : '#8697A8';

        this.setState({ orgName: orgName, orgBrandColor: brandColor })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            this.handleHeadingState();
        }
        if (prevProps.location.hash !== this.props.location.hash) {
            this.subHeadingHandler();
        }
    }

    handleHeadingState = (value) => {
        if (this.props.location.pathname.includes("addnew")) {
            if (value === "basic") {
                return "active"
            } else return "inactive"
        } else {
            if (this.props.location.pathname.includes(value)) {
                return "active"
            } else return "done"
        }
    }

    urlHandler = (value) => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        let empId = match.params.empId;
        let url
        if (!this.props.location.pathname.includes("addnew")) {
            url = "/customer-mgmt/org/" + orgId + "/employee/onboard/" + empId + "/" + value;
            this.props.history.push(url)
        }
    }

    handleUrlIcon = (value, url) => {

        if (this.props.location.pathname.includes("addnew")) {
            if (value === "basicDetails") {
                return "current"
            } else {
                return "inactive"
            }
        }
        else {
            if (this.props.sectionStatus[value]) {
                if (this.props.sectionStatus[value]["status"] === "done") {
                    if (this.props.location.pathname.includes(url)) {
                        return "current"
                    }
                    else return "done"
                }
                else {

                    if (this.props.location.pathname.includes(url)) {
                        return "current"
                    }
                    else return "inactive"
                }
            }
            else return "inactive"
        }
    }

    handleSubUrlIcon = (value, sectionName) => {
        if (!_.isEmpty(this.props.sectionStatus[sectionName])) {
            const details = this.props.sectionStatus[sectionName]["subSectionStatus"]
            if (details !== null) {
                if (details[value]) {
                    return details[value]
                }
            }
        }

    }

    subUrlHandler = (value) => {
        const { match } = this.props;

        if (this.props.location.pathname.includes("additional-details")) {
            goToAnchor(value)
        } else {

            let orgId = match.params.uuid;
            let empId = match.params.empId;
            let url = "/customer-mgmt/org/" + orgId + "/employee/onboard/" + empId + "/additional-details#" + value;
            this.props.history.push(url)
        }
    }

    docSubUrlHandler = (category, value) => {
        let url;
        let orgId = this.props.match.params.uuid;
        let empId = this.props.match.params.empId;
        url = "/customer-mgmt/org/" + orgId + "/employee/onboard/" + empId + "/" + category + "/" + value;
        this.props.history.push(url)
    }

    subHeadingHandler = (value) => {

        const { hash } = this.props.location;
        if (this.props.location.pathname.includes("addnew")) {
            return 'inactive'
        }
        else if (this.props.location.pathname.includes(value)) {
            return 'current'
        }  
        else {
            if (hash.includes(value)) {
                return 'current'
            } else {
                return 'active'
            }
        }
    }

    shortenDisplayName = () => {
        const displayName = this.props.employeeData.empData.firstName + " " + this.props.employeeData.empData.lastName;
        if (displayName.length > 12) {
            const updatedDisplayName = displayName.substring(0, 12) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    handleSubText = () => {
        const empId = this.props.employeeData.empData.employeeId ? this.props.employeeData.empData.employeeId : null;
        const primaryRole = this.props.employeeData.empDefaultRole ? this.props.employeeData.empDefaultRole.name : null
        let subText = '';
        if (!_.isEmpty(primaryRole) && !_.isEmpty(empId)) {
            subText = empId + ' | ' + primaryRole;
        }
        else if (!_.isEmpty(primaryRole) && _.isEmpty(empId)) {
            subText = primaryRole
        }
        else if (_.isEmpty(primaryRole) && !_.isEmpty(empId)) {
            subText = empId
        }
        else {
            subText = ''
        }

        return subText;
    }

    toggleMenu = (value) => {
        if (value === 'addtional-details') {
            this.setState({
                additionalDropdown: !this.state.additionalDropdown
            })
        }
        else if (value === 'company-documents') {
            this.setState({
                companyDocDropdown: !this.state.companyDocDropdown
            })
        }
        else if (value === 'government-documents') {
            this.setState({
                govDocDropdown: !this.state.govDocDropdown
            })
        }
    }

    checkMissingInfo = (value) => {
        const missingInfo = _.cloneDeep(this.props.missingInfo);
        if (!_.isEmpty(missingInfo)) {
            switch (value) {
                case 'ADDRESS':
                    if (missingInfo.hasOwnProperty("CRC_PERMANENT_ADDRESS") || missingInfo.hasOwnProperty("CRC_CURRENT_ADDRESS")
                        || missingInfo.hasOwnProperty("PERMANENT_ADDRESS") || missingInfo.hasOwnProperty("CURRENT_ADDRESS")
                        || missingInfo.hasOwnProperty("CURRENT_ADDRESS_REVIEW") || missingInfo.hasOwnProperty("PERMANENT_ADDRESS_REVIEW")
                        || missingInfo.hasOwnProperty("POLICE_VERIFICATION")) {
                        return true;
                    }
                    break;

                case 'DOCUMENT':
                    if (missingInfo.hasOwnProperty("PAN") || missingInfo.hasOwnProperty("AADHAAR")
                        || missingInfo.hasOwnProperty("DL") || missingInfo.hasOwnProperty("VOTER")
                        || missingInfo.hasOwnProperty("RC") || missingInfo.hasOwnProperty("PASSPORT")) {
                        return true;
                    }
                    break;

                case 'REFERENCE':
                    if (missingInfo.hasOwnProperty("REFERENCE")) {
                        return true;
                    }
                    break;

                case 'EDUCATION':
                    if (missingInfo.hasOwnProperty("EDUCATION")) {
                        return true;
                    }
                    break;

                case 'EMPLOYMENT':
                    if (missingInfo.hasOwnProperty("EMPLOYMENT")) {
                        return true;
                    }
                    break;

                case 'HEALTH':
                    if (missingInfo.hasOwnProperty("HEALTH")) {
                        return true;
                    }
                    break;

                default: return false
            }
        }
    }

    render() {

        const props = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        
        let companyDocsConfigured = [];
        if (!_.isEmpty(this.props.orgOnboardConfigData)) {
            _.forEach(this.props.orgOnboardConfigData.documents, function (doc) {
                if (doc.category === 'COMPANY' && doc.isApproved) companyDocsConfigured.push(doc)
            })
        }

        let govDocsConfigured = [];
        if (!_.isEmpty(this.props.orgOnboardConfigData)) {
            _.forEach(this.props.orgOnboardConfigData.documents, function (doc) {
                if (doc.category === 'GOVERNMENT' && doc.status === 'done') govDocsConfigured.push(doc)
            })
        }

        let RightNavContent = <React.Fragment>
            <div className={styles.rightNavPosition}>
                <div>
                    {match.path === '/customer-mgmt/org/:uuid/employee/onboard/addnew' ?
                        this.props.orgData ?
                            <React.Fragment>
                                <div style={{ backgroundColor: this.state.orgBrandColor, height: '8rem', width: '21rem' }} className='d-flex flex-row no-gutters'>
                                    <div className='col-12 align-self-end  pl-5 ' > <span className={cx(styles.OrgRightNavLabel, 'pt-4 pb-3')}>{this.state.orgName} </span></div>
                                </div>
                                <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                                    <span className={styles.navHeading}>add employee</span>
                                </div>

                            </React.Fragment> :
                            null
                        :
                        <React.Fragment>
                            <div className={styles.profileBackground}>
                                {
                                    props.getEmpDataState === "LOADING" || props.getEmpDefaultRoleState === "LOADING" ||
                                        props.getEmpProfilePicState === "LOADING" || this.props.getBgvDataState === "LOADING" ?
                                        <Loader type='empMgmtRightNav' /> :

                                        <React.Fragment>
                                            <ProfilePicStatus
                                                type="small"
                                                src={this.props.employeeData.empProfilePic}
                                                serviceStatus={this.props.employeeData.bgvData ? this.props.employeeData.bgvData[0]["bgv"] : null}
                                                gray
                                            />
                                            <span className='flex-column pl-2 pt-1'>
                                                <span className={styles.Name}>{this.shortenDisplayName()}</span>
                                                <div className={styles.SecondaryText}> {this.handleSubText()}

                                                </div>
                                            </span>
                                        </React.Fragment>
                                }
                            </div>
                            <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                                <span className={styles.navHeading}>employee profile</span>
                            </div>

                        </React.Fragment>
                    }

                </div>


                <div className={cx(" pl-5 ", styles.Hover,scrollStyle.scrollbar)}>
                    <HasAccess
                        permission={["EMP_PROFILE:CREATE", "EMP_PROFILE:EDIT"]}
                        orgId={orgId}
                        yes={() =>

                            <RightNavUrls
                                headingState={this.handleHeadingState("basic")}
                                label='basic registration'
                                linkTo={() => this.urlHandler('basic-details')}
                                iconState={this.handleUrlIcon("basicDetails", "basic-details")}
                            />

                        } />


                    <HasAccess
                        permission={["EMP_PROFILE:EDIT"]}
                        orgId={orgId}
                        yes={() =>
                            <React.Fragment>
                                <div className="d-flex">
                                    <RightNavUrls
                                        headingState={this.handleHeadingState("additional")}
                                        label='additional data fields'
                                        linkTo={() => this.urlHandler('additional-details#contact-details')}
                                        iconState={this.handleUrlIcon("additionalDetails", "additional-details")}
                                    />
                                    <div onClick={() => this.toggleMenu("addtional-details")}>
                                        <img src={this.state.additionalDropdown ? arrowUp : arrowDown} alt="arrow" className={styles.dropdownIcon} />
                                    </div>
                                </div>

                                {
                                    this.state.additionalDropdown ?
                                        <div className={styles.navSubHeadingNext}>

                                            <RightNavUrls
                                                label="contact details"
                                                headingState={this.subHeadingHandler("contact-details")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("contact-details")}
                                                iconStatus={this.handleSubUrlIcon("contactDetails", "additionalDetails")}
                                            />

                                            <RightNavUrls
                                                label="address"
                                                headingState={this.subHeadingHandler("address")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("address")}
                                                iconStatus={this.handleSubUrlIcon("addresses", "additionalDetails")}
                                                hasMissingInfo={this.checkMissingInfo("ADDRESS")} />

                                            <RightNavUrls
                                                label="government ids"
                                                headingState={this.subHeadingHandler("government-id")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("government-id")}
                                                iconStatus={this.handleSubUrlIcon("governmentIds", "additionalDetails")}
                                                hasMissingInfo={this.checkMissingInfo("DOCUMENT")} />

                                            <RightNavUrls
                                                label="family &amp; references"
                                                headingState={this.subHeadingHandler("family-reference")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("family-reference")}
                                                iconStatus={this.handleSubUrlIcon("familyRefs", "additionalDetails")}
                                                hasMissingInfo={this.checkMissingInfo("REFERENCE")} />

                                            <RightNavUrls
                                                label="education details"
                                                headingState={this.subHeadingHandler("education-details")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("education-details")}
                                                iconStatus={this.handleSubUrlIcon("educationDetails", "additionalDetails")}
                                                hasMissingInfo={this.checkMissingInfo("EDUCATION")} />

                                            <RightNavUrls
                                                label="employment history"
                                                headingState={this.subHeadingHandler("employment-history")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("employment-history")}
                                                iconStatus={this.handleSubUrlIcon("empHistory", "additionalDetails")}
                                                hasMissingInfo={this.checkMissingInfo("EMPLOYMENT")} />

                                            <RightNavUrls
                                                label="health details"
                                                headingState={this.subHeadingHandler("health")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("health")}
                                                iconStatus={this.handleSubUrlIcon("healthDetails", "additionalDetails")}
                                                hasMissingInfo={this.checkMissingInfo("HEALTH")} />

                                            <RightNavUrls
                                                label="skills &amp; preference"
                                                headingState={this.subHeadingHandler("skills-pref")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("skills-pref")}
                                                iconStatus={this.handleSubUrlIcon("skillPref", "additionalDetails")} />

                                            <RightNavUrls
                                                label="social details"
                                                headingState={this.subHeadingHandler("social")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("social")}
                                                iconStatus={this.handleSubUrlIcon("social", "additionalDetails")} />

                                            <RightNavUrls
                                                label="bank details"
                                                headingState={this.subHeadingHandler("bank-details")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("bank-details")}
                                                iconStatus={this.handleSubUrlIcon("bankDetails", "additionalDetails")} />

                                            <RightNavUrls
                                                label="other details"
                                                headingState={this.subHeadingHandler("other-details")}
                                                type="subSection"
                                                linkTo={() => this.subUrlHandler("other-details")}
                                                iconStatus={this.handleSubUrlIcon("otherDetails", "additionalDetails")} />

                                        </div>
                                        : null
                                }
                            </React.Fragment>

                        }
                    />

                    <HasAccess
                        permission={["EMP_PROFILE:EDIT"]}
                        orgId={orgId}
                        yes={
                            () =>
                                <RightNavUrls
                                    headingState={this.handleHeadingState("employee-details")}
                                    label='employee details'
                                    linkTo={() => this.urlHandler('employee-details')}
                                    iconState={this.handleUrlIcon("employeeDetails", "employee-details")}
                                />
                        }
                    />

                    <HasAccess
                        permission={["EMP_MGMT:DOCUMENT_GENERATION"]}
                        orgId={orgId}
                        yes={
                            () =>
                                <React.Fragment>
                                    {
                                        !_.isEmpty(govDocsConfigured) ?
                                            <React.Fragment>
                                                <div className="d-flex">
                                                    <RightNavUrls
                                                        headingState={this.handleHeadingState("government-documents")}
                                                        label='government documents'
                                                        linkTo={() => this.urlHandler('government-documents/'+govDocsConfigured[0].documentType.toLowerCase())}
                                                        iconState={this.handleUrlIcon("governmentDocuments", "government-documents")}
                                                    />
                                                    <div onClick={() => this.toggleMenu("government-documents")}>
                                                        <img src={this.state.govDocDropdown ? arrowUp : arrowDown} alt="arrow" className={styles.dropdownIcon} />
                                                    </div>
                                                </div>

                                                {
                                                    this.state.govDocDropdown ?
                                                        <div className={styles.navSubHeadingNext}>
                                                            {
                                                                govDocsConfigured.map((doc, index) => {
                                                                    return (
                                                                        <React.Fragment key={index}>
                                                                            <RightNavUrls
                                                                                label={doc.documentLabel}
                                                                                headingState={this.subHeadingHandler(doc.documentType.toLowerCase())}
                                                                                type="subSection"
                                                                                linkTo={() => this.docSubUrlHandler("government-documents", doc.documentType.toLowerCase())}
                                                                                iconStatus={this.handleSubUrlIcon(doc.documentType, "governmentDocuments")} />
                                                                        </React.Fragment>)


                                                                })
                                                            }
                                                        </div>
                                                        : null
                                                }
                                            </React.Fragment>
                                            : null
                                    }

                                    <div className="d-flex">
                                        <RightNavUrls
                                            headingState={this.handleHeadingState("company-documents")}
                                            label='company documents'
                                            linkTo={() => this.docSubUrlHandler('company-documents/'+companyDocsConfigured[0].documentType.toLowerCase())}
                                            iconState={this.handleUrlIcon("companyDocuments", "company-documents")}
                                        />
                                        <div onClick={() => this.toggleMenu("company-documents")}>
                                            <img src={this.state.companyDocDropdown ? arrowUp : arrowDown} alt="arrow" className={styles.dropdownIcon} />
                                        </div>
                                    </div>

                                    {

                                        this.state.companyDocDropdown ?
                                            <div className={styles.navSubHeadingNext}>
                                                {/* <RightNavUrls
                                                    label="digital signature"
                                                    headingState={this.subHeadingHandler("digital-signature")}
                                                    type="subSection"
                                                    linkTo={() => this.docSubUrlHandler("company-documents", "digital-signature")}
                                                    iconStatus={this.handleSubUrlIcon("digitalSignature", "companyDocuments")} /> */}
                                                {
                                                    !_.isEmpty(companyDocsConfigured) ?
                                                        companyDocsConfigured.map((doc, index) => {
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    <RightNavUrls
                                                                        label={doc.documentLabel}
                                                                        headingState={this.subHeadingHandler(doc.documentType.toLowerCase())}
                                                                        type="subSection"
                                                                        linkTo={() => this.docSubUrlHandler("company-documents", doc.documentType.toLowerCase())}
                                                                        iconStatus={this.handleSubUrlIcon(doc.documentType, "companyDocuments")} />
                                                                </React.Fragment>)


                                                        })
                                                        : null
                                                }
                                            </div>
                                            : null
                                    }
                                </React.Fragment>
                        } />



                </div>
            </div>
        </React.Fragment>

        return (
            <RightNavBar content={RightNavContent} style={{ backgroundColor: "white", height: '100vh' }} />
        )

    }
}



const mapStateToProps = state => {
    return {
        orgData: state.empMgmt.staticData.orgData,
        employeeData: state.empMgmt.empOnboard.onboard,

        getEmpDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        getEmpProfilePicState: state.empMgmt.empOnboard.onboard.getEmpProfilePicState,
        getEmpDefaultRoleState: state.empMgmt.empOnboard.onboard.getEmpDefaultRoleState,

        serviceStatus: state.empMgmt.empOnboard.onboard.bgvData,
        getBgvDataState: state.empMgmt.empOnboard.onboard.getBgvDataState,

        missingInfo: state.empMgmt.empOnboard.onboard.empMissingInfo,
        sectionStatus: state.empMgmt.empOnboard.onboard.sectionStatus,

        orgOnboardConfigData: state.empMgmt.staticData.orgOnboardConfig
    }
};

export default withRouter((connect(mapStateToProps)(EmpRightNav)));