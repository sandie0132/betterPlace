import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import RightNavUrls from './RightNavUrls/RightNavUrls';

import styles from './OrgOnboardRightNav.module.scss';
import cx from 'classnames';
import RightNavBar from '../../../../../components/Organism/Navigation/RightNavBar/RightNavBar';

import { Button } from 'react-crux';
import _ from 'lodash';

import * as actionsOrgMgmt from '../../OrgMgmtStore/action';
import * as actions from '../Store/action';


class OrgOnboardRightNav extends Component {

    state = {
        orgName: "",
        orgBrandColor: "",
        govSection: [],
        companySection: []
    }

    componentDidMount() {
        this.props.onGetDocumentList();
        this.handleSectionData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.orgData !== this.props.orgData) {
            let orgName = this.props.orgData ? this.props.orgData.name : "";
            let brandColor = this.props.orgData && this.props.orgData.brandColor != null ? this.props.orgData.brandColor : '#8697A8';

            this.setState({ orgName: orgName, orgBrandColor: brandColor })
        }
        if (prevProps.sectionStatus !== this.props.sectionStatus) {
            this.handleSectionData();
        }

    }

    handleHeadingState = (value) => {

        if (this.props.location.pathname.includes(value)) {
            return "active"
        } else return "done"

    }

    urlHandler = (value) => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        let url

        url = "/customer-mgmt/org/" + orgId + "/onboardconfig/" + value;
        this.props.history.push(url)

    }

    docSubUrlHandler = (category,linkValue)=> {
        const { match } = this.props;
        let orgId = match.params.uuid;
        let url;
        url = "/customer-mgmt/org/" + orgId + "/onboardconfig/" + category + "/"+ linkValue;
        this.props.history.push(url)
    }

    handleUrlIcon = (value, url) => {
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

    handleSectionData = () => {
        const sectionData = this.props.sectionStatus;
        let companySubSection = [];
        let govSubSection = [];
        if (!_.isEmpty(sectionData)) {
            if (!_.isEmpty(sectionData["companyDocuments"]["subSectionStatus"])) {
                const companySection = sectionData["companyDocuments"]["subSectionStatus"];

                Object.keys(companySection).forEach(key => {
                    companySubSection.push({
                        "name": key,
                        "status": companySection[key]["status"]
                    })
                });
            }
            if (!_.isEmpty(sectionData["governmentDocuments"]["subSectionStatus"])) {
                const companySection = sectionData["governmentDocuments"]["subSectionStatus"];

                Object.keys(companySection).forEach(key => {
                    govSubSection.push({
                        "name": key,
                        "status": companySection[key]["status"]
                    })
                });
            }
        }
        this.setState({
            govSection: _.cloneDeep(govSubSection),
            companySection: _.cloneDeep(companySubSection)
        })
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

    handleSubUrlIcon = (value, sectionName) => {
        if (!_.isEmpty(this.props.sectionStatus[sectionName])) {
            if(this.props.location.pathname.includes(value.toLowerCase())){
                return "current"
            }else{
                const details = this.props.sectionStatus[sectionName]["subSectionStatus"]
                if (details !== null) {
                    if (details[value]) {
                        return details[value]
                    }
                }
            }

        }
    }

    redirectUrl = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        this.props.history.push('/customer-mgmt/org/' + orgId + '/profile');
    }

    handleSubsectionLabel = (docName, category) =>{
        const docList = _.cloneDeep(this.props.documentList);
        let label;
        if(!_.isEmpty(docList)){
            if( !_.isEmpty(docList[category])){
                docList[category].filter((doc)=>{
                    if(doc["documentType"] === docName){
                        label =  doc["documentLabel"]
                    }
                    return label
                    
                })
            }
        }
        return label;
    }

    render() {
        let RightNavContent =
            <div className={styles.rightNavPosition}>
                {
                    this.props.orgData ?
                        <React.Fragment>
                            <div style={{ backgroundColor: this.state.orgBrandColor, height: '12rem', width: '21rem' }} className='d-flex flex-row no-gutters'>
                                <div className=' align-self-end  pl-4 ' > <span className={cx(styles.OrgRightNavLabel, 'pt-4 pb-3')}>{this.state.orgName} </span></div>
                            </div>
                        </React.Fragment> :
                        null
                }
                <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                    <span className={styles.navHeading}>onboard configuration</span>
                </div>

                <div className={cx(" pl-5 ", styles.Hover)}>
                    {
                        !_.isEmpty(this.props.sectionStatus) ?
                            <RightNavUrls
                                headingState={this.handleHeadingState("select-documents")}
                                label='select documents'
                                linkTo={() => this.urlHandler('select-documents')}
                                iconState={this.handleUrlIcon("selectDocuments", "select-documents")}
                            />
                            : null
                    }
                    {
                        !_.isEmpty(this.state.govSection) ?
                            <React.Fragment>
                                <RightNavUrls
                                    headingState={this.handleHeadingState("government-documents")}
                                    label='government documents'
                                    linkTo={() => this.urlHandler('government-documents/' + this.state.govSection[0].name.toLowerCase())}
                                    iconState={this.handleUrlIcon("governmentDocuments", "government-documents")}
                                />
                                <div className="ml-4">
                                {!_.isEmpty(this.state.govSection) ? this.state.govSection.map((doc, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <RightNavUrls
                                                label={this.handleSubsectionLabel(doc.name,"government_documents")}
                                                headingState={this.subHeadingHandler(doc.name.toLowerCase())}
                                                type="subSection"
                                                linkTo={() => this.docSubUrlHandler("government-documents", doc.name.toLowerCase())}
                                                iconStatus={this.handleSubUrlIcon(doc.name, "governmentDocuments")} />
                                        </React.Fragment>
                                    )
                                })
                                : null }
                                </div>
                            </React.Fragment>
                            : null
                    }
                    {
                        !_.isEmpty(this.state.companySection) ?
                            <React.Fragment>
                                <RightNavUrls
                                    headingState={this.handleHeadingState("company-documents")}
                                    label='company documents'
                                    linkTo={() => this.urlHandler('company-documents/' + this.state.companySection[0].name.toLowerCase())}
                                    iconState={this.handleUrlIcon("companyDocuments", "company-documents")}
                                />
                                <div className="ml-4">
                                {!_.isEmpty(this.state.companySection) ? this.state.companySection.map((doc, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <RightNavUrls
                                                label={this.handleSubsectionLabel(doc.name,"company_documents")}
                                                headingState={this.subHeadingHandler(doc.name.toLowerCase())}
                                                type="subSection"
                                                linkTo={() => this.docSubUrlHandler("company-documents", doc.name.toLowerCase())}
                                                iconStatus={this.handleSubUrlIcon(doc.name, "companyDocuments")} />
                                        </React.Fragment>
                                    )
                                })
                                : null }
                                </div>
                            </React.Fragment>

                            : null
                    }
                </div>
                <div className={styles.LargeButtonAlign}>
                <Button
                    label={'proceed'}
                    type='largeWithArrow'
                    className={cx("ml-3", styles.LargeButtonWidth)}
                    clickHandler={() => this.redirectUrl()}
                />
                </div>
            </div>
        return (
            <RightNavBar content={RightNavContent} className={styles.show} />
        )
    }

}



const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.staticData.orgData,
        orgOnboardConfigData: state.orgMgmt.orgOnboardConfig.onboardConfig.orgOnboardConfig,
        sectionStatus: state.orgMgmt.orgOnboardConfig.onboardConfig.sectionStatus,
        documentList: state.orgMgmt.orgOnboardConfig.onboardConfig.documentList,
        currentDoc: state.orgMgmt.orgOnboardConfig.documents.currentDocumentType
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetDocumentList: () => dispatch(actions.getDocumentList()),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    }
}

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgOnboardRightNav)));
