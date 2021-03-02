import React, { Component } from "react";
import cx from 'classnames';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import _ from "lodash";

import * as actions from '../../Store/action';
import styles from './OnboardInsight.module.scss';
import OnboardInsightChart from "./OnboardInsightChart/OnboardInsightChart";
import DropDownSmall from "../../../../../../components/Atom/SmallDropDown/SmallDropDown";
import OnboardFilters from "../OnboardFilters/OnboardFilters";
import filter from "../../../../../../assets/icons/filterCupIcon.svg";
import OnboardInsightLineChart from "./OnboardInsightLineChart/OnboardInsightLineChart";


class OnboardInsight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category: 'time',
            groupBy: 'MONTH',
            showFilter: false,
            filters: {},
            filterCount: 0,
            insightVsType: 'ONBOARDING',
            sortBy: ''
        };
    }

    componentDidMount() {
        this.handleApiCall();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search) {
            this.handleApiCall();
        }
        if (prevState.groupBy !== this.state.groupBy) {
            this.handleApiCall();
        }
        if (!_.isEqual(prevState.filters, this.state.filters)) {
            this.handleApiCall();
        }
    }

    handleApiCall = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const category = this.state.category;

        let query = this.handleGetDuration();
        query['groupBy'] = this.state.groupBy;
        if (!_.isEmpty(this.state.filters)) {
            _.forEach(this.state.filters, function (value, filter) {
                switch (filter) {
                    case ("roleTags"):
                        if (!_.isEmpty(value)) {
                            query['role'] = '';
                            _.forEach(value, function (tag) {
                                query['role'] = query['role'] + tag.uuid + ','
                            })
                            query['role'] = query['role'].slice(0, -1)
                        }
                        break;
                    case ("geoTags"):
                        if (!_.isEmpty(value)) {
                            query['location'] = '';
                            _.forEach(value, function (tag) {
                                query['location'] = query['location'] + tag.uuid + ','
                            })
                            query['location'] = query['location'].slice(0, -1)
                        }
                        break;
                    case ("ageGroup"):
                        if (!_.isEmpty(value)) {
                            query['ageFrom'] = value.split('-')[0];
                            query['ageTo'] = value.split('-')[1];
                        }
                        break;
                    default:
                        if (!_.isEmpty(value)) {
                            query[filter] = value
                        }
                }
            })
        }

        this.props.onGetInsightData(orgId, category, query);
    }

    handleGetDuration = () => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let durationType = urlSearchParams.get("duration");

        let newDate = new Date();
        let today = new Date();
        let lastWeek = null;

        let duration = {};

        switch (durationType) {
            case 'last_week':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'last_day':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'last_month':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'last_year':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'custom':
                duration = {
                    from: urlSearchParams.get("from"),
                    to: urlSearchParams.get("to")
                };
                return duration;

            default:
                return duration;

        }
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

    handleSelectCategory = (value) => {
        let groupBy = 'MONTH';
        if (value === 'location') groupBy = 'CITY';
        else if (value === 'role') groupBy = 'FUNCTION';
        this.setState({
            category: value,
            groupBy: groupBy,
            sortBy: ''
        })
    }

    handleSelectVsType = (value) => {
        this.setState({
            insightVsType: value,
            sortBy: ''
        })
    }

    handleSelectGroupBy = (value) => {
        this.setState({
            groupBy: value,
            sortBy: ''
        })
    }

    handleSelectSortBy = value => {
        this.setState({
            sortBy: value,
        })
    }

    handleApplyFilter = (filters) => {
        let filterCount = 0;
        _.forEach(filters, function (filter) {
            if (!_.isEmpty(filter)) {
                if (typeof (filter) === 'object') filterCount = filterCount + filter.length;
                else filterCount = filterCount + 1
            }
        })
        this.setState({
            filters: _.cloneDeep(filters),
            showFilter: false,
            filterCount: filterCount
        })
    }

    handleGetAttartion = (ter, on) => {
        if (on !== 0) {
            let att = (ter / on)

            if (isNaN(att)) {
                return 0
            } else return att * 100
        } else {
            return 0
        }
    }

    handleGetLabel = (value) => {
        let date = new Date(value);
        if (!isNaN(date.getTime())) {
            switch (value.split('-').length) {
                case 1:
                    return date.getFullYear();
                case 2:
                    return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
                default:
                    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ', ' + date.getFullYear();
            }
        } else {
            return value
        }
    }

    handleGetData = () => {
        const insightData = _.cloneDeep(this.props.insightData);
        let result = [];
        if (!_.isEmpty(insightData)) {
            let dataArray = [];
            _.forOwn(insightData, (name, key) => {
                let obj = {
                    "TIME": this.handleGetLabel(key),
                    "ONBOARDED": name["onboarded"],
                    "ATTRITION": this.handleGetAttartion(name["terminated"], name["onboarded"]),
                    "TERMINATED": name["terminated"],
                    "KEY": key,
                }
                dataArray.push(obj)
            })
            if (!_.isEmpty(dataArray)) {
                if (!_.isEmpty(this.state.sortBy)) {
                    dataArray = _.orderBy(dataArray, [this.state.sortBy], ['desc']);
                } else if (this.state.category === 'time') {
                    dataArray = _.orderBy(dataArray, ['KEY'], ['desc']);
                } else {
                    dataArray = _.orderBy(dataArray, ['TIME'], ['asc']);
                }
                _.forEach(dataArray, function (data, index) {
                    result.push({
                        ...data,
                        'index': index
                    })
                })
            }
        }
        return result;
    }

    render() {
        const { match } = this.props;
        const orgId = match.params.uuid;

        return (
            <div className={styles.card}>
                <div className={styles.chartTopNav}>
                    <div className="row mx-0 px-0">
                        <div className={styles.dropdownWidth}>
                            <DropDownSmall
                                Options={[
                                    { "option": "time", "optionLabel": "time" },
                                    { "option": "location", "optionLabel": "location" },
                                    { "option": "role", "optionLabel": "job roles" }
                                ]}
                                changed={(value) => this.handleSelectCategory(value)}
                                value={this.state.category}
                                defaultColor={styles.dropdownColor}
                                dropdownMenu={styles.dropdownMenu}
                            />
                        </div>
                        <div className={styles.topNavText}>
                            vs
                            </div>
                        <div className={cx(styles.vsDropdown, "ml-2")}>
                            <DropDownSmall
                                Options={[
                                    { "option": "ONBOARDING", "optionLabel": "onboarding" },
                                    { "option": "ATTRITION", "optionLabel": "attrition rate" },
                                ]}
                                changed={(value) => this.handleSelectVsType(value)}
                                value={this.state.insightVsType}
                                defaultColor={styles.dropdownColor}
                                dropdownMenu={styles.vsDropdown}
                            />
                        </div>
                    </div>



                    <div className="d-flex px-0 ml-auto mr-4">
                        {
                            this.state.category !== 'time' ?
                                <React.Fragment>
                                    <div className={cx(styles.topNavText, "mr-2")}>
                                        sort by
                                    </div>

                                    <DropDownSmall
                                        Options={[
                                            { "option": "ONBOARDED", "optionLabel": "onboarded" },
                                            { "option": "TERMINATED", "optionLabel": "terminated" },
                                            { "option": "ATTRITION", "optionLabel": "attrition" }
                                        ]}
                                        changed={(value) => this.handleSelectSortBy(value)}
                                        value={this.state.sortBy}
                                        defaultColor={this.state.sortBy === "" ? styles.dropdownDefaultColor : styles.sortDropdownColor}
                                        dropdownMenu={styles.sortDropdownMenu}
                                        placeholder="sort by"
                                    />
                                </React.Fragment>
                            :
                                null
                        }
                        <div className={cx(styles.topNavText, " ml-2 mr-2")}>
                            group by
                        </div>
                        <div className={cx(styles.dropdownWidth, "mr-2")}>
                            <DropDownSmall
                                Options={[
                                    { "option": "YEAR", "optionLabel": "yearly", "category": "time" },
                                    { "option": "MONTH", "optionLabel": "monthly", "category": "time" },
                                    { "option": "DAY", "optionLabel": "daily", "category": "time" },
                                    { "option": "FUNCTION", "optionLabel": "functions", "category": "role" },
                                    { "option": "ROLE", "optionLabel": "roles", "category": "role" },
                                    { "option": "STATE", "optionLabel": "states", "category": "location" },
                                    { "option": "CITY", "optionLabel": "cities", "category": "location" }
                                ]}
                                filterOptionsBy={{ 'category': [this.state.category] }}
                                changed={(value) => this.handleSelectGroupBy(value)}
                                value={this.state.groupBy}
                                defaultColor={styles.dropdownColor}
                                dropdownMenu={styles.groupBydropdownMenu}
                            />
                        </div>
                        <div onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                            <div className={this.state.showFilter ? styles.filterIconBgActive : styles.filterIconBg}>
                                <div className={styles.filterCount}>{this.state.filterCount}</div>
                                <span className={this.state.filterCount > 0 || this.state.showFilter ? styles.filterActive : null}>
                                    <img src={filter} alt="filter" />
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
                {
                    this.state.showFilter ?
                        <OnboardFilters
                            orgId={orgId}
                            filters={this.state.filters}
                            onChange={(filters) => this.handleApplyFilter(filters)}
                            closeFilters={() => this.setState({ showFilter: !this.state.showFilter })}
                        />
                        : null
                }
                <div className={cx("d-flex", styles.alignSortBy)}>
                    <div className={cx(styles.legends)}>
                        <div className="ml-auto d-flex mr-4">
                            {
                                this.state.insightVsType === 'ONBOARDING' ?
                                    <React.Fragment>
                                        <div className="d-flex mr-4"><div className={styles.initiated} /><div className={styles.contentTab}>onboarded</div></div>
                                        <div className="d-flex"><div className={styles.inprogress} /><div className={styles.contentTab}>terminated</div></div>
                                    </React.Fragment>
                                    :
                                    <div className="d-flex"><div className={styles.green} /><div className={styles.contentTab}>attrition rate</div></div>
                            }
                        </div>
                    </div>

                </div>

                {
                    !_.isEmpty(this.props.insightData) ?
                        this.state.insightVsType === "ONBOARDING" ?
                            <OnboardInsightChart
                                data={this.handleGetData()}
                                state={this.props.getInsightDataState}
                                xLabel={this.state.category}
                            />
                            :
                            <OnboardInsightLineChart
                                data={this.handleGetData()}
                                state={this.props.getInsightDataState}
                            />
                        :
                        <div className={cx(styles.noDataTab, "mx-auto")}>
                            no data available
                        </div>
                }

            </div>
        )
    }

}



const mapStateToProps = state => {
    return {
        insightData: state.orgMgmt.orgOnboardDashboard.onboardInsights,
        getInsightDataState: state.orgMgmt.orgOnboardDashboard.getOrgOnboardInsightsState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInsightData: (orgId, category, query) => dispatch(actions.getInsightData(orgId, category, query))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OnboardInsight));