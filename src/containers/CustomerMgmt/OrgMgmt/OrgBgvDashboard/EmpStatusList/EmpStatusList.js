import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from './Store/action';
import EmployeeCard from "../../../../CustomerMgmt/EmpMgmt/EmpList/EmpCard/EmpCard";
import _ from 'lodash';
import EmptyPage from '../../../../../components/Organism/EmptyPage/EmptyPage';
import TileLoader from '../../../../../components/Organism/Loader/Loader';

class EmpStatusList extends Component {

    componentDidMount = () => {
        this.handleApiCalls("getCount");
    }

    componentDidUpdate = (prevProps) => {
        let pageSize = 18;

        if (prevProps.location.search !== this.props.location.search) {
            let currentUrlSearchParams = new URLSearchParams(this.props.location.search);
            let prevUrlSearchParams = new URLSearchParams(prevProps.location.search);
            if (currentUrlSearchParams.toString() !== prevUrlSearchParams.toString()) {
                if (!(currentUrlSearchParams.get("pageNumber") && prevUrlSearchParams.get("pageNumber")
                    && (currentUrlSearchParams.get("pageNumber") !== prevUrlSearchParams.get("pageNumber")))) {
                    this.handleApiCalls("getCount");
                }
                else {
                    this.handleApiCalls();
                }
            }
            else {
                this.handleApiCalls();
            }
        }

        if (prevProps.empListState !== this.props.empListState && this.props.empListState === 'SUCCESS') {
            let tagArray = [];

            this.props.empList.map(employee => {
                if (!_.isEmpty(employee.defaultRole) && !tagArray.includes(employee.defaultRole))
                    tagArray.push(employee.defaultRole)
                return null
            })
            if (tagArray.length > 0) this.props.onGetTagInfo(tagArray);
        }

        if (prevProps.empListPageCountState !== this.props.empListPageCountState && this.props.empListPageCountState === "SUCCESS") {
            let urlSearchParams = new URLSearchParams(window.location.search);
            let url = this.props.location.pathname;

            if (this.props.empListPageCount > pageSize) {
                if (urlSearchParams.get("pageNumber")) {
                    this.handleApiCalls();
                } else {
                    urlSearchParams.set("pageNumber", 1);
                }
            }
            else {
                this.handleApiCalls();
            }
            url = url + "?" + urlSearchParams.toString();
            this.props.history.push(url);
        }
    }

    componentWillUnmount = () => {
        this.props.getInitState();
    }

    handleApiCalls = (getCount) => {
        let orgId = this.props.orgId;

        let duration = this.handleDateFilter();
        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let tagId = urlSearchParams.get("tagId");
        let filter = urlSearchParams.get("filter");
        let pageNumber = urlSearchParams.get("pageNumber");

        let url = '&verificationStatus=' + filter;

        if (tagId) {
            url = url + '&location=' + tagId
        }
        if (duration) {
            url = url + '&from=' + duration.dateFrom + "&to=" + duration.dateTo
        }
        if (pageNumber) {
            url = url + '&pageNumber=' + pageNumber
        }

        if (getCount) {
            this.props.getEmpListPageCount(orgId, url);
        } else this.props.getEmpList(orgId, url);
    }

    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handleDateFilter = () => {
        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let dateType = urlSearchParams.get("duration");
        let newDate = new Date();
        let today = new Date();
        let lastWeek = null;
        let duration = {};

        switch (dateType) {
            case 'last_week':

                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;


            case 'last_day':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;


            case 'last_month':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;

            case 'last_year':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate
                };
                return duration;

            case 'custom_date_range':
                duration = {
                    dateFrom: urlSearchParams.get("from"),
                    dateTo: urlSearchParams.get("to")
                };
                return duration;

            default:
                return null;

        }

    }

    render() {
        const { t } = this.props;
        let empList = this.props.empList;
        const orgId = this.props.orgId;
        if (!_.isEmpty(empList)) {
            empList = empList.map((employee, index) => {
                let employeeUrl = "/customer-mgmt/org/" + orgId + "/employee/" + employee.uuid + "/report";
                let role = null;
                if (!_.isEmpty(this.props.tagList)) {
                    _.forEach(this.props.tagList, function (tag) {
                        if (tag.uuid === employee.defaultRole) {
                            role = tag.name
                        }
                    })
                }
                return (
                    <React.Fragment key={index}>
                        <EmployeeCard
                            id={index}
                            index={employee.uuid}
                            empId={employee.uuid}
                            profilePicUrl={employee.profilePicUrl}
                            url={employeeUrl}
                            handleSelectedEmployees={() => this.handleEmployeeLists(employee.uuid)}
                            // value={_.includes(this.state.selectedEmployees, employee.uuid)}
                            tag={role ? role : null}
                            name={employee.firstName + (!_.isEmpty(employee.lastName) ? ' ' + employee.lastName : '')}
                            employeeId={employee.employeeId}
                            serviceStatus={employee.bgv}
                            isActive={employee.isActive}
                        />

                    </React.Fragment>
                )
            })
        }
        return (
            <React.Fragment>

                {
                    this.props.empListState === "LOADING" || this.props.getProfilePictureState === 'LOADING' ?
                        <div className="row-fluid px-auto">
                            <TileLoader type="empList" />
                        </div>
                        :
                        !_.isEmpty(this.props.empList) ?
                            <React.Fragment>
                                {empList}
                            </React.Fragment>
                            : this.props.empListState === "SUCCESS" ?
                                <EmptyPage
                                    empList
                                    text={t('translation_orgBgvStatus:dashboard.l3') + ' ' + (this.props.filter.toLowerCase()) + ' ' + t('translation_orgBgvStatus:dashboard.l4')}
                                /> : null
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        empList: state.orgMgmt.orgBgvDashboard.empStatusList.empStatusList,
        empListState: state.orgMgmt.orgBgvDashboard.empStatusList.getEmpStatusListState,
        empListPageCount: state.orgMgmt.orgBgvDashboard.empStatusList.empListPageCount,
        empListPageCountState: state.orgMgmt.orgBgvDashboard.empStatusList.empListPageCountState,
        tagList: state.empMgmt.empList.tagList,
        getProfilePictureState: state.imageStore.getProfilePictureState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getEmpList: (orgId, url) => dispatch(actions.getEmpList(orgId, url)),
        getEmpListPageCount: (orgId, url) => dispatch(actions.getEmpListPageCount(orgId, url)),
        onGetTagInfo: (tags) => dispatch(actions.getTagInfo(tags)),
        getInitState: () => dispatch(actions.getInitState())
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(EmpStatusList)));
