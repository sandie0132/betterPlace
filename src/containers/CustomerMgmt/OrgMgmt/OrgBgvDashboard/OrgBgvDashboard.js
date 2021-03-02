import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import * as orgProActions from '../OrgProfile/Store/action';
import * as actions from './Store/action';

import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgBgvDashboard.module.scss';

import Paginator from '../../../../components/Organism/Paginator/Paginator';
import InsightDays from "./Insights/InsightsDays";
import InsightsAllTime from './Insights/InsightsAllTime';
import EmpStatusList from './EmpStatusList/EmpStatusList';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import EmptyPage from "../../../../components/Organism/EmptyPage/EmptyPage";
import insight from '../../../../assets/icons/active.svg';
import greenIcon from '../../../../assets/icons/correctTabIcon.svg';
import deactiveIcon from '../../../../assets/icons/deactive.svg';
import onholdIcon from '../../../../assets/icons/onhold.svg';
import inprogress from '../../../../assets/icons/inprogress.svg';
import plus from '../../../../assets/icons/addButtonPlus.svg';
import access from '../../../../assets/icons/access.svg';
import arrowDown from '../../../../assets/icons/greyDropdown.svg';
import downArrow from '../../../../assets/icons/downArrow.svg';
import greyDownload from '../../../../assets/icons/greyDownload.svg';
import SingleTagSearchField from '../../../TagSearch/SingleTagSearch/SingleTagSearch';
import Notifications, {NotificationIcon} from '../../Notifications/Notifications';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import DropDownSmall from "../../../../components/Atom/SmallDropDown/SmallDropDown";
import Loader from '../../../../components/Organism/Loader/Loader';
import DateRangeModal from '../../../../components/Molecule/DateRangeModal/DateRangeModal';

const customDateRange = 'custom_date_range';

const optionsInitState = [
    { "option": "all_time", "optionLabel": "all time" },
    { "option": "last_day", "optionLabel": "last day" },
    { "option": "last_week", "optionLabel": "last week" },
    { "option": "last_month", "optionLabel": "last month" },
    { "option": "last_year", "optionLabel": "last year" },
    { "option": customDateRange, "optionLabel": "custom date range" },
];

class OrgBgvDashboard extends Component {
    state = {
        isBgvConfigured: false,
        selectedTag: null,
        showNotifications: false,
        selectTime: '',
        showDownloadMenu: false,
        empFilter: '',
        duration: null,
        toggleDateRange: false,
        options: optionsInitState
    }


    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        let currentUrl = window.location.href;

        if (currentUrl.split('?')[1]) {
            this.handleFilterCard()
        }

        this.handleEmpFilter();
        this.props.getConfiguredProducts(orgId);
        this.props.onGetOrgDetailsById(orgId);
        this.props.onGetAllEmployees("", orgId);

        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let dateType = urlSearchParams.get("duration");
        let durationType = this.handleDateFilter(dateType);
        
        let optionsState = optionsInitState;

        if (dateType === customDateRange) {
            optionsState = this.getOptionsState(urlSearchParams.get('from'), urlSearchParams.get('from'));
        }
        
        this.setState({ 
            options: optionsState,
            duration: durationType 
        })
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.getconfiguredProductsState !== prevProps.getconfiguredProductsState) {
            if (this.props.getconfiguredProductsState === "SUCCESS") {
                let isBgvConfigured = false;
                _.forEach(this.props.configuredProducts, function (product) {
                    if (product.product === "BGV") {
                        isBgvConfigured = true;
                    }
                })
                if (isBgvConfigured)
                    this.setState({ isBgvConfigured: true })
            }
        }

        if (this.props.tagData !== prevProps.tagData) {
            if (this.props.tagDataState === "SUCCESS") {
                this.setState({
                    selectedTag: this.props.tagData[0]
                })
            }
        }

        if (prevProps.location.search !== this.props.location.search) {
            let urlSearchParams = new URLSearchParams(window.location.search);
            const filterType = urlSearchParams.get("filter");
            if (filterType === "insights") {
                this.handleFilterCard()
            }
            this.setState({
                empFilter: filterType
            })
        }
    }

    componentWillUnmount() {
        this.props.getInitState();
    }

    handleCloseNotificationCard = () => {
        this.setState({ showNotifications: !this.state.showNotifications })
    }

    downloadCustomReport = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        let duration = _.cloneDeep(this.state.duration);
        this.props.downloadCustomReportPdf(orgId, duration.type, duration.dateFrom, duration.dateTo)
    }

    //get the uuids of filtered tags from url.
    handleFilterCard = () => {
        let urlSearchParams = new URLSearchParams(window.location.search.toString());
        let tagId = urlSearchParams.get("tagId");
        if (tagId) {
            this.props.onGetTagIdInfo(tagId)
        }
        let selectTime = urlSearchParams.get("duration");
        this.setState({
            selectTime: selectTime
        })
    }

    //select or remove filter tags.
    handleSelectedFilterTag = (event, action) => {
        let tag = _.cloneDeep(this.state.selectedTag)
        if (action === 'add') {
            tag = event;
            this.handleLocationFilter(tag.uuid, action);
        }
        if (action === 'delete') {
            tag = null;
            this.handleLocationFilter(null, action);
        }
        this.setState({ selectedTag: tag })
    }

    handleSelectDuration = (value) => {
        if (value === 'custom_date_range') {
            this.toggleDateRange();
        } else {
            let urlSearchParams = new URLSearchParams(window.location.search);
            let url = this.props.location.pathname;
            urlSearchParams.set("duration", value);
            urlSearchParams.delete("pageNumber");
            if (urlSearchParams.has('from')) urlSearchParams.delete('from');
            if (urlSearchParams.has('to')) urlSearchParams.delete('to');
            url = url + "?" + urlSearchParams.toString();
            this.props.history.push(url);
            let durationType = this.handleDateFilter(value);
            this.setState({
                options: optionsInitState,
                selectTime: value,
                duration: durationType
            })
        }
    }

    getCustomDate = (value) => {
        let optionsState = this.getOptionsState(value.from, value.to);

        let duration = {
            dateFrom: value.from,
            dateTo: value.to,
            type: 'custom'
        };

        let urlSearchParams = new URLSearchParams(window.location.search);
        let url = this.props.location.pathname;
        urlSearchParams.set("duration", customDateRange);
        urlSearchParams.set("from", value.from);
        urlSearchParams.set("to", value.to);
        urlSearchParams.delete("pageNumber");
        url = url + "?" + urlSearchParams.toString();
        this.props.history.push(url);
        
        this.setState({ 
            options: optionsState,
            selectTime: customDateRange,
            duration: duration 
        });
    }

    getDateRange = (from, to) => {
        let fromDate = from.split("-").reverse().join(".")
        let toDate = to.split("-").reverse().join(".")
        let dateRange = fromDate + "-" + toDate;
        return dateRange;
    } 

    getOptionsState = (from, to) => {
        let optionsState = [];
        let dateRange = this.getDateRange(from, to);
        let option = {option: customDateRange, optionLabel: dateRange}
        _.each(this.state.options, (val, key) => {
            if (val.option === customDateRange) {
                optionsState.push(option);
            } else {
                optionsState.push(val);
            }
          });
        return optionsState;
    }
    
    toggleDateRange = (event) => {
        if (event) event.preventDefault();
        this.setState({ toggleDateRange: !this.state.toggleDateRange });
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


    handleDateFilter = (value) => {
        let dateType = value
        let newDate = new Date();
        let today = new Date();
        let lastWeek = null;
        let duration = {};
        let urlSearchParams = new URLSearchParams(window.location.search.toString());

        switch (dateType) {
            case 'last_week':

                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'weekly'
                };
                return duration;


            case 'last_day':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'daily'
                };
                return duration;


            case 'last_month':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'monthly'
                };
                return duration;

            case 'last_year':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'yearly'
                };
                return duration;

            case 'all_time':
                duration = {
                    type: 'overall'
                };
                return duration;

            case 'custom_date_range':
                duration = {
                    dateFrom: urlSearchParams.get("from"),
                    dateTo: urlSearchParams.get("to"),
                    type: 'custom'
                };
                return duration;                

            default:
                return null;

        }

    }

    handleFilterChange = (type) => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let url = this.props.location.pathname;
        urlSearchParams.set("filter", type);
        urlSearchParams.delete("pageNumber");
        url = url + "?" + urlSearchParams.toString();

        return url;
    }

    handleLocationFilter = (tagId, action) => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let url = this.props.location.pathname;
        if (action === 'add') {
            urlSearchParams.set("tagId", tagId);
        }
        else if (action === 'delete') {
            urlSearchParams.delete("tagId");
        }

        urlSearchParams.delete("pageNumber");
        url = url + "?" + urlSearchParams.toString();
        this.props.history.push(url);
    }

    // toggleDownloadMenu = () => {
    //     this.setState({ showDownloadMenu: !this.state.showDownloadMenu })
    // }

    handleEmpFilter = () => {
        const location = this.props.location.search;
        let filter = "";
        if (location.includes('?filter=insights')) {
            filter = 'insights';
        } else if (location.includes('?filter=RED')) {
            filter = 'RED';
        } else if (location.includes('?filter=GREEN')) {
            filter = 'GREEN';
        } else if (location.includes('?filter=YELLOW')) {
            filter = 'YELLOW';
        } else if (location.includes('?filter=inProgress')) {
            filter = 'inProgress';
        }
        this.setState({
            empFilter: filter
        })
    }

    handleOutsideClick = (e) => {
        if (!_.isEmpty(this.node)) {
            if (this.node.contains(e.target)) {
                return;
            }
            this.handleClick();
        }
    }

    handleClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (!this.state.showDownloadMenu) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            showDownloadMenu: !prevState.showDownloadMenu
        }));
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;

        
        return (

            <div className={cx(styles.alignCenter)}>
                <div style={{ width: 'max-content' }}>
                    <ArrowLink
                        label={t('translation_orgBgvStatus:profile')}
                        url={`/customer-mgmt/org/${orgId}/profile`}
                    />
                </div>

                <div className={cx('mx-0 px-0 row no-gutters mt-2')}>
                    <div className={cx(' px-0', styles.column5, styles.OrgName, styles.wordBreak)}>{this.props.orgName ? this.props.orgName.toLowerCase() : ''}</div>
                    <div className="ml-auto d-flex mr-1">
                        <div style={{ zIndex: "1" }}>

                            <SingleTagSearchField
                                placeholder="search location "
                                orgId={orgId}
                                category='geographical'
                                tags={this.state.selectedTag}
                                updateTag={(value, action) => this.handleSelectedFilterTag(value, action)}
                                dropdownMenu={styles.dropdown}

                            />
                        </div>
                        <DropDownSmall
                                Options={this.state.options}
                                changed={(value) => this.handleSelectDuration(value)}
                                value={this.state.selectTime}
                                defaultColor={this.state.selectTime === "all_time" ? styles.defaultColor : null}
                                className={styles.smallDropdown}
                                dropdownMenu={styles.smallDropdownMenu}
                            />

                        <HasAccess
                            permission={["NOTIFICATIONS:VIEW"]}
                            orgId={orgId}
                            yes={() =>
                                <NotificationIcon
                                    showNotifications={this.state.showNotifications}
                                    orgId={orgId}
                                    handleShowHideNotifications = {(showNotifications) => this.setState({ showNotifications: showNotifications })}
                                    // bellIconContent={styles.alignBellIcon}
                                />
                            }
                        />

                    </div>
                </div>
                {
                    this.state.showNotifications ?
                    
                        <div className={styles.width} >
                            <Notifications 
                                showNotifications={this.state.showNotifications}
                                orgId={orgId}
                                style={{ width: 'inherit' }}
                            />
                        </div>
                         :
                        null
                }

                {(!this.state.isBgvConfigured && this.props.getconfiguredProductsState === "SUCCESS")
                    ?
                    <EmptyPage
                        className={cx('row justify-content-start no-gutters')}
                        text={t('translation_orgBgvStatus:dashboard.l1')}
                        buttonLink={"/customer-mgmt/org/" + orgId + "/profile"}
                        buttonText={t('translation_orgBgvStatus:btConfigure')}
                        buttonIcon={access}
                    />
                    : (this.state.isBgvConfigured && (_.isEmpty(this.props.empList) && this.props.empListState === "SUCCESS"))
                        ?
                        <EmptyPage
                            className={cx('row justify-content-start no-gutters')}
                            text={t('translation_orgBgvStatus:dashboard.l2')}
                            buttonLink={"/customer-mgmt/org/" + orgId + "/employee"}
                            buttonText={t('translation_orgBgvStatus:btAddEmp')}
                            buttonIcon={plus}
                        />
                        :

                        <React.Fragment>
                            <div className="row  mt-4 px-3">
                                <div className={cx('pl-0 mr-5 ')}>
                                    <NavLink to={this.handleFilterChange('insights')}
                                        activeClassName={cx(styles.NavLinkfontActive)}
                                        isActive={(match, location) => {
                                            if (!match) {
                                                return false;
                                            }
                                            const searchParams = new URLSearchParams(location.search);
                                            return match.isExact && searchParams.get('filter') === 'insights';
                                        }}>
                                        <button className={styles.NavLinkfont}>
                                            <span className={styles.svg}>
                                                <img src={insight} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.insight')} />
                                                <span>&nbsp; {t('translation_clientAdminHome:span.s2')}</span>
                                            </span>
                                        </button>
                                    </NavLink>
                                </div>
                                <div className={cx('pl-2 mr-5')}>
                                    <NavLink to={this.handleFilterChange('RED')}
                                        activeClassName={cx(styles.svgRed)}
                                        isActive={(match, location) => {
                                            if (!match) {
                                                return false;
                                            }
                                            const searchParams = new URLSearchParams(location.search);
                                            return match.isExact && searchParams.get('filter') === 'RED';
                                        }}>
                                        <button className={styles.NavLinkfont} >
                                            <span className={styles.svgRedHover}>
                                                <img src={deactiveIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.red')} />
                                                <span>&nbsp; {t('translation_clientAdminHome:span.s3')}</span>
                                            </span>
                                        </button>
                                    </NavLink>
                                </div>
                                <div className={cx('pl-2 mr-5')}>
                                    <NavLink to={this.handleFilterChange('YELLOW')}
                                        activeClassName={cx(styles.svgYellow)}
                                        isActive={(match, location) => {
                                            if (!match) {
                                                return false;
                                            }
                                            const searchParams = new URLSearchParams(location.search);
                                            return match.isExact && searchParams.get('filter') === 'YELLOW';
                                        }}>
                                        <button className={styles.NavLinkfont} >
                                            <span className={styles.svgYellowHover}>
                                                <img src={onholdIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.yellow')} />
                                                <span>&nbsp; {t('translation_clientAdminHome:span.s4')}</span>
                                            </span>
                                        </button>
                                    </NavLink>
                                </div>
                                <div className={cx('pl-2 mr-5')}>
                                    <NavLink to={this.handleFilterChange('GREEN')}
                                        activeClassName={cx(styles.svgGreen)}
                                        isActive={(match, location) => {
                                            if (!match) {
                                                return false;
                                            }
                                            const searchParams = new URLSearchParams(location.search);
                                            return match.isExact && searchParams.get('filter') === 'GREEN';
                                        }}>
                                        <button className={styles.NavLinkfont} >
                                            <span className={styles.svgGreenHover}>
                                                <img src={greenIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.green')} />
                                                <span>&nbsp; {t('translation_clientAdminHome:span.s5')}</span>
                                            </span>
                                        </button>
                                    </NavLink>
                                </div>
                                <div className={cx('pl-2 ')}>
                                    <NavLink to={this.handleFilterChange('inProgress')}
                                        activeClassName={cx(styles.NavLinkfontActive)}
                                        isActive={(match, location) => {
                                            if (!match) {
                                                return false;
                                            }
                                            const searchParams = new URLSearchParams(location.search);
                                            return match.isExact && searchParams.get('filter') === 'inProgress';
                                        }}>
                                        <button className={styles.NavLinkfont} >
                                            <span className={styles.svgProgress}>
                                                <img src={inprogress} alt={"inprogress"} style={{ height: "18px" }} />
                                                <span>&nbsp; in progress</span>
                                            </span>
                                        </button>
                                    </NavLink>
                                </div>
                                {/* DO NOT DELETE */}
                                {this.state.empFilter === 'insights' ?
                                    <div className={cx('pl-2 ml-auto mr-2')}>
                                        <div style={{ position: "relative" }}>
                                            <div className={this.state.showDownloadMenu ? styles.donwloadTabOpen : styles.donwloadTab} onClick={this.handleClick}>
                                                download report <img src={this.state.showDownloadMenu ? downArrow : arrowDown} alt="arrow" className="pl-5 ml-3" />
                                            </div>
                                            <div ref={node => { this.node = node; }}>
                                                {this.state.showDownloadMenu ?
                                                    <div className={styles.downloadMenu} >
                                                        {/* <div className={styles.downloadOption}>
                                                    <span className={styles.over}><img src={greyDownload} alt="download" className={"pr-2 py-2"} />verification summary.xlsx </span></div> */}
                                                        <div className={styles.downloadOption} onClick={this.props.downloadCustomReportPdfState !== 'LOADING' ? this.downloadCustomReport : null}>
                                                            <span className={cx(styles.over, "row no-gutters")}>
                                                                {this.props.downloadCustomReportPdfState === 'LOADING' ?
                                                                    <div className='mr-4'><Loader type='stepLoaderGrey' /></div>
                                                                    : <img src={greyDownload} alt="download" className="pr-2" />}
                                                                    verification summary.pdf
                                                            </span>
                                                        </div>
                                                        {/* <div className={styles.downloadOption}>
                                                    <span className={styles.over}><img src={greyDownload} alt="download" className={"pr-2 py-2"} />verification result.xlsx</span></div> */}
                                                    </div>
                                                    : null}
                                            </div>

                                        </div>
                                    </div>
                                    :

                                    this.props.empListPageCountState === 'LOADING' ? null :

                                        this.props.empListPageCount > 18 ?

                                            <div className="ml-auto mr-2">
                                                <Paginator
                                                    dataCount={this.props.empListPageCount}
                                                    pageSize={18}
                                                    baseUrl={'/customer-mgmt/org/' + orgId + '/dashboard/verify'}
                                                />
                                            </div>
                                            : null
                                }
                                {/* DO NOT DELETE */}
                            </div>

                            <hr className={cx(styles.hr1)} />
                            <div className="d-flex flex-wrap">
                                {this.props.getconfiguredProductsState === 'LOADING' ?
                                    <Loader type='orgDashboard' />
                                    :
                                    (this.state.empFilter === "insights" && this.props.getconfiguredProductsState === 'SUCCESS')
                                        ?
                                        this.state.selectTime === "all_time" ?
                                            <InsightsAllTime />
                                            : <InsightDays />
                                        :
                                        <EmpStatusList
                                            orgId={orgId}
                                            filter={this.state.empFilter}
                                            empList
                                        />
                                }
                            </div>
                            {this.state.toggleDateRange ?
                                <DateRangeModal taskFilters
                                    toggle={this.toggleDateRange}
                                    onChange={this.getCustomDate}
                                    value={this.state.selectTime}
                                />
                            : null
                            }                                
                        </React.Fragment>
                }
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        configuredProducts: state.orgMgmt.orgProfile.EnabledProducts,
        getconfiguredProductsState: state.orgMgmt.orgProfile.getEnabledPlatformServicesState,
        orgName: state.orgMgmt.orgBgvDashboard.orgBgvDashboard.orgName,
        empList: state.orgMgmt.orgBgvDashboard.orgBgvDashboard.empListAll,
        empListState: state.orgMgmt.orgBgvDashboard.orgBgvDashboard.getAllEmpListState,
        notificationList: state.empMgmt.empList.notificationList,
        tagData: state.orgMgmt.orgBgvDashboard.orgBgvDashboard.tagData,
        tagDataState: state.orgMgmt.orgBgvDashboard.orgBgvDashboard.getTagIdInfoState,
        downloadCustomReportPdfState: state.orgMgmt.orgBgvDashboard.orgBgvDashboard.downloadCustomReportState,
        empListPageCount: state.orgMgmt.orgBgvDashboard.empStatusList.empListPageCount,
        empListPageCountState: state.orgMgmt.orgBgvDashboard.empStatusList.empListPageCountState

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getConfiguredProducts: (orgId) => dispatch(orgProActions.getEnabledPlatformServices(orgId)),
        onGetOrgDetailsById: (orgId) => dispatch(actions.getDataById(orgId)),
        onGetAllEmployees: (all, orgId) => dispatch(actions.getEmpList(all, orgId)),
        getInitState: () => dispatch(actions.getInitState()),
        onGetTagIdInfo: (tagId) => dispatch(actions.getTagIdInfo(tagId)),
        downloadCustomReportPdf: (orgId, type, from, to) => dispatch(actions.customPdfReportDownload(orgId, type, from, to))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(OrgBgvDashboard));