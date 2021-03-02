import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import styles from "./TabsDocProcedure.module.scss";
import { withTranslation } from 'react-i18next';
import TopNavUrl from '../../../../../../components/Molecule/TopNavUrl/TopNavUrl';
import cx from 'classnames';
class TabsDocProcedure extends Component {

    state = {
        fillDetailsTab: 'next',
        generateAndDownloadTab: 'next',
        uploadSignedDocsTab: 'next',
    }
    // componentDidMount() {
    //     const { match } = this.props;
    //     console.log("match ", match);

    // }
    // componentDidUpdate(prevProps) {
    //     // if(prevProps.fillDetailsTabConfigured !== this.props.fillDetailsTabConfigured 
    //     //     || prevProps.generateAndDownloadTabConfigured !== this.props.generateAndDownloadTabConfigured
    //     //     || prevProps.uploadSignedDocsTabConfigured !== this.props.uploadSignedDocsTabConfigured){
    //     //         this.handleConfigState();
    //     // }
    // }



    clickHandler = (tabDocument) => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const empId = match.params.empId;
        let redirectFlag = false;
        if (tabDocument === "fill-details") {
            redirectFlag = true;
        }
        else if (tabDocument === "generate-and-download") {
            if (this.props.fillDetailsTabConfigured) {
                redirectFlag = true;
            }
        }
        else if (tabDocument === "upload-signed-docs") {
            if (this.props.fillDetailsTabConfigured && this.props.generateAndDownloadTabConfigured) {
                redirectFlag = true
            }
        }
        let url = `/customer-mgmt/org/` + orgId + `/employee/onboard/` + empId + `/companyDocument/` + tabDocument;
        if (redirectFlag) {
            this.props.history.push(url)
        }
    }

    render() {
        // const { t } = this.props;
        

        return (
            // <div className={styles.container}>

            //     <div className={styles.margin}>
            
            <React.Fragment>
                    <div className={cx(this.props.detailsTab ? styles.Hover : undefined,styles.margin)}>
                        {this.props.tabPosition === "first" ?
                            <TopNavUrl
                                imageState={this.props.detailsTab}
                                label={this.props.label}
                                first configured={this.props.configuredTab ? true : false} 
                                classNameVerticalLine = {styles.tabsDocVerticalLine}
                                classNameCircle = {styles.circleZindex}
                                currentSection = {this.props.currentSection}
                                widthOflabel = {styles.widthOflabel}/> :

                            this.props.tabPosition === "last" ?

                                <TopNavUrl
                                    imageState={this.props.detailsTab}
                                    label={this.props.label}
                                    last configured={this.props.configuredTab ? true : false} 
                                    classNameVerticalLine = {styles.tabsDocVerticalLine}
                                    classNameCircle = {styles.circleZindex}
                                    currentSection = {this.props.currentSection}
                                    widthOflabel = {styles.widthOflabel}/> :

                                <TopNavUrl
                                    imageState={this.props.detailsTab}
                                    label={this.props.label}
                                    configured={this.props.configuredTab ? true : false} 
                                    classNameVerticalLine = {styles.tabsDocVerticalLine}
                                    classNameCircle = {styles.circleZindex}
                                    currentSection = {this.props.currentSection}
                                    widthOflabel = {styles.widthOflabel}/>
                        }

                    



                    {/* <br /> */}
                    {/* <div className={cx("mt-3")}>
                        <div className={cx(this.props.currentSection ? styles.arrow_up : undefined)}/>
                        <div className={cx(this.props.currentSection ? styles.svg : undefined)}/>    
                    </div> */}
                    
                </div>
                
            </React.Fragment>


        )
    }

}
const mapStateToProps = state => {
    return {
        fillDetailsTabConfigured: state.orgMgmt.orgBgvConfig.statusMgmt.fillDetailsTabConfigured,
        generateAndDownloadTabConfigured: state.orgMgmt.orgBgvConfig.statusMgmt.generateAndDownloadTabConfigured,
        uploadSignedDocsTabConfigured: state.orgMgmt.orgBgvConfig.statusMgmt.uploadSignedDocsTabConfigured,
    };
};




export default withTranslation()(withRouter(connect(mapStateToProps)(TabsDocProcedure)));