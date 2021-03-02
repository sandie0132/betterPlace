import React, { Component } from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import styles from './ClientAdminHome.module.scss';
// import crossICon from '../../../assets/icons/cross.svg'; 
import insight from '../../../assets/icons/active.svg';
// import orgIntroBackground from '../../../assets/icons/Home.svg';
import greenIcon from '../../../assets/icons/correctTabIcon.svg';
import deactiveIcon from '../../../assets/icons/deactive.svg';
import onholdIcon from '../../../assets/icons/onhold.svg';
// import cartIcon from '../../../assets/icons/cartIcon.svg';
import * as EmpActions from '../../../containers/CustomerMgmt/EmpMgmt/EmpList/Store/action';
import * as orgProActions from '../../../containers/CustomerMgmt/OrgMgmt/OrgProfile/Store/action';
// import floatHelpIcon from '../../../assets/icons/floatingHelpIcon.svg';
import LeftBackground from '../../../assets/icons/LeftBackground.svg';
// import rightArrowRightBar from '../../../assets/icons/rightArrow.svg';
import plus from '../../../assets/icons/addButtonPlus.svg';
import purplePlus from '../../../assets/icons/purplePlus.svg';
// import rightArrowIcon from '../../../assets/icons/rightArrowDashboard.svg';
import { AuthConsumer } from '../../../services/authContext';
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import EmployeeCard from "../../CustomerMgmt/EmpMgmt/EmpList/EmpCard/EmpCard";
import Insights from './Insights/insights';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import HasAccess from '../../../services/HasAccess/HasAccess';

class userWelcome extends Component {
    state = {
        greenEmployees: [],
        redEmployees: [],
        yellowEmployees: [],
        isBgvConfigured: false,
        areEmployeesAdded: false
    }

    componentDidMount = () => {
        let orgId = this.props.clientOrgId;
        if (orgId) {
            this.props.getEmpList("");
            this.props.getConfiguredProducts(orgId);
        }
        let filter = this.props.location.search;
        this.setState({ filter: filter })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.empListState !== this.props.empListState) {
            if (this.props.empListState === "SUCCESS") {
                let updatedAllEmpList = _.cloneDeep(this.props.empList);
                let updatedGreenEmployees = [];
                let updatedRedEmployees = [];
                let updatedYellowEmployees = [];
                let areEmployeesAdded = false;
                if (!_.isEmpty(updatedAllEmpList)) {
                    areEmployeesAdded = true
                    _.forEach(updatedAllEmpList, function (employee) {
                        let status = (employee.bgv && employee.bgv.profile) ? employee.bgv.profile.clientStatus : "";
                        if (status === "GREEN")
                            updatedGreenEmployees.push(employee)
                        else if (status === "RED")
                            updatedRedEmployees.push(employee)
                        else if (status === "YELLOW")
                            updatedYellowEmployees.push(employee)
                    })
                }
                this.setState({
                    greenEmployees: updatedGreenEmployees,
                    redEmployees: updatedRedEmployees,
                    yellowEmployees: updatedYellowEmployees,
                    areEmployeesAdded: areEmployeesAdded
                })
            }
        }
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
    }

    getFilter() {
        if (this.props.location.search === 'insights') {
            return 'insights';
        } else if (this.props.location.search === '?filter=red') {
            return 'red';
        } else if (this.props.location.search === '?filter=green') {
            return 'green';
        } else if (this.props.location.search === '?filter=yellow') {
            return 'yellow';
        }
    }

    render() {
        const { t } = this.props;
        let employees = [];
        let filter = "";
        if (this.props.location.search === '?filter=insights') {
            filter = "insights"
        }
        else if (this.props.location.search === '?filter=red') {
            filter = "red"
            employees = _.cloneDeep(this.state.redEmployees);
        }
        else if (this.props.location.search === '?filter=green') {
            filter = "green"
            employees = _.cloneDeep(this.state.greenEmployees);
        }
        else if (this.props.location.search === '?filter=yellow') {
            filter = "yellow"
            employees = _.cloneDeep(this.state.yellowEmployees);
        }
        let empList = employees.map((employee, index) => {
            let employeeUrl = "/customer-mgmt/employee/view/" + employee.uuid + "/profile";
            return (
                <EmployeeCard
                    key={index}
                    id={index}
                    index={employee.uuid}
                    icon={employee.profilePicUrl}
                    url={employeeUrl}
                    handleSelectedEmployees={() => this.handleEmployeeLists(employee.uuid)}
                    // value={_.includes(this.state.selectedEmployees, employee.uuid)}
                    name={employee.firstName + ' ' + employee.lastName}
                    empId={employee.employeeId}
                    serviceStatus={employee.bgv}
                    isActive={employee.isActive}
                />
            )
        })
        return (
            <div className={cx('row col-12 mx-0 px-0')}>
                <div className={cx('col-9 no-gutters', styles.MarginBottom)}>
                    <div className={cx('row ml-4 mr-4', styles.ContainerPadding64)}>
                        <span className={cx('col-6 mx-0 px-0', styles.OrgName)}>
                            <AuthConsumer>
                                {({ user }) => (
                                    <span className='mr-1'>{user.firstName}</span>
                                )}
                            </AuthConsumer>
                            {/* <img className='ml-1' src={orgNameIcon1} alt='icon'/>
                        <img className='ml-1' src={orgNameIcon2} alt='icon'/> */}
                        </span>
                        {/* <div className='col-6 px-0 d-flex justify-content-end'>
                        <span className={cx('ml-3 pr-0 d-flex  justify-content-end align-self-end',styles.CustomSelectText)}>
                            <span className='text-justify'>all locations</span>
                            <img className='ml-3' src={rightArrowRightBar} alt='rightArrow'/>
                        </span>
                        <span className={cx('ml-3 pr-0 d-flex justify-content-end align-self-end',styles.CustomSelectText)}>
                            <span className='text-justify'> all time</span>
                            <img className='ml-3' src={rightArrowRightBar} alt='rightArrow'/>
                        </span>
                    </div> */}
                    </div>
                    {/* <div className='row ml-4 mr-4 position-relative'>
                    <div className={cx('mx-0 px-0 pb-4',styles.OrgIntroCard)}>
                        <span className={cx('row mt-2 d-flex  justify-content-end col-12 no-gutters')}><img src={crossICon} alt='icon'/></span>
                        <div className={cx('ml-5 my-4 col-5')}> 
                            <AuthConsumer>
                                {( {user} ) => (
                                    <span className={cx('row',styles.OrgIntroHeading)}>{t('translation_clientAdminHome:span.s6')} {user.firstName}</span>
                                )}
                            </AuthConsumer>
                            <span className={cx('row mt-3',styles.OrgIntroText)}>
                            {t('translation_clientAdminHome:span.s7')}
                            </span>
                            <span className='row mt-4'>
                                <img src={cartIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.icon')}/>
                                <span className={cx('ml-2 pl-1 mr-4',styles.OrgIntroText)}>
                                {t('translation_clientAdminHome:span.s1')}</span>
                                <img src={rightArrowIcon} alt='icon'/>
                            </span>
                        </div>
                    </div>
                    <div className={cx('mt-5 col-5 position-absolute',styles.OrgIntroImage)}>
                        <img className='img-fluid float-right' src={orgIntroBackground} alt=''/>
                    </div>
                </div> */}
                    {(!this.state.isBgvConfigured && this.props.getconfiguredProductsState === "SUCCESS")
                        ?
                        <div className={cx(styles.marginTop, 'row d-flex')}>
                            <span className='ml-5 mt-5 col-3'><img src={LeftBackground} alt='background' /></span>
                            <div className='col-5 ml-5 mt-5 d-flex align-items-center px-0'>
                                <div>
                                    <span className={cx('row justify-content-start no-gutters', styles.UploadEmployeeText)}>
                                        <span>verify-the service offered by betterplace for almost instant and</span>
                                        <span>accurate background verification for your employees.enable </span>
                                        <span>background verification by configuring the bgv</span>
                                    </span>
                                    <span className={cx('row mt-4 no-gutters')}>
                                        <NavLink to={"/customer-mgmt/employee"} className={cx('px-2 py-2', styles.UploadEmpButton)}>
                                            <span>
                                                <img className={'ml-1 mr-1'} src={plus} alt="add employee" />
                                            &nbsp; configure bgv
                                        </span>
                                        </NavLink>
                                    </span>
                                </div>
                            </div>
                        </div>
                        : (this.state.isBgvConfigured && (!this.state.areEmployeesAdded && this.props.empListState === "SUCCESS"))
                            ?
                            <div className={cx(styles.marginTop, 'row d-flex')}>
                                <span className='ml-5 mt-5 col-3'><img src={LeftBackground} alt='background' /></span>
                                <div className='col-5 ml-5 mt-5 d-flex align-items-center px-0'>
                                    <div>
                                        <span className={cx('row justify-content-start no-gutters', styles.UploadEmployeeText)}>
                                            <span>there are no employees added yet to inititate bgv and view</span>
                                            <span>dashboard analytics.please access employees to access</span>
                                            <span>dashboard</span>
                                        </span>
                                        <span className={cx('row mt-4 no-gutters')}>
                                            <NavLink to={"/customer-mgmt/employee"} className={cx('px-2 py-2', styles.UploadEmpButton)}>
                                                <span>
                                                    <img className={'ml-1 mr-1'} src={plus} alt="add employee" />
                                                &nbsp; add employee
                                            </span>
                                            </NavLink>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='row-fluid ml-4 mr-4'>
                                <ul>
                                    <li className={cx('pl-0 mr-4')}>
                                        <NavLink to={{ pathname: "/dashboard", search: "?filter=insights" }}
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
                                    </li>
                                    <li className={cx('pl-2 mr-4')}>
                                        <NavLink to={{ pathname: "/dashboard", search: "?filter=red" }}
                                            activeClassName={cx(styles.NavLinkfontActive)}
                                            isActive={(match, location) => {
                                                if (!match) {
                                                    return false;
                                                }
                                                const searchParams = new URLSearchParams(location.search);
                                                return match.isExact && searchParams.get('filter') === 'red';
                                            }}>
                                            <button className={styles.NavLinkfont} >
                                                <span className={styles.svgRed}>
                                                    <img src={deactiveIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.red')} />
                                                    <span>&nbsp; {t('translation_clientAdminHome:span.s3')}</span>
                                                </span>
                                            </button>
                                        </NavLink>
                                    </li>
                                    <li className={cx('pl-2 mr-4')}>
                                        <NavLink to={{ pathname: "/dashboard", search: "?filter=yellow" }}
                                            activeClassName={cx(styles.NavLinkfontActive)}
                                            isActive={(match, location) => {
                                                if (!match) {
                                                    return false;
                                                }
                                                const searchParams = new URLSearchParams(location.search);
                                                return match.isExact && searchParams.get('filter') === 'yellow';
                                            }}>
                                            <button className={styles.NavLinkfont} >
                                                <span className={styles.svgYellow}>
                                                    <img src={onholdIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.yellow')} />
                                                    <span>&nbsp; {t('translation_clientAdminHome:span.s4')}</span>
                                                </span>
                                            </button>
                                        </NavLink>
                                    </li>
                                    <li className={cx('pl-2 mr-4')}>
                                        <NavLink to={{ pathname: "/dashboard", search: "?filter=green" }}
                                            activeClassName={cx(styles.NavLinkfontActive)}
                                            isActive={(match, location) => {
                                                if (!match) {
                                                    return false;
                                                }
                                                const searchParams = new URLSearchParams(location.search);
                                                return match.isExact && searchParams.get('filter') === 'green';
                                            }}>
                                            <button className={styles.NavLinkfont} >
                                                <span className={styles.svgGreen}>
                                                    <img src={greenIcon} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.green')} />
                                                    <span>&nbsp; {t('translation_clientAdminHome:span.s5')}</span>
                                                </span>
                                            </button>
                                        </NavLink>
                                    </li>
                                </ul>
                                <hr className={cx(styles.hr1)} />
                                <div className="d-flex flex-wrap">
                                    {filter === "insights"
                                        ? <Insights />
                                        : <React.Fragment>
                                            {empList}
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                    }
                    {/* <div className='row d-flex mt-5'>
                    <span className='ml-5 mt-5 col-3'><img src={LeftBackground} alt='background'/></span>
                    <div className='col-5 ml-4 mt-5 d-flex align-items-center px-0'>
                        <div>
                            <span className={cx('row justify-content-start no-gutters',styles.UploadEmployeeText)}>
                                <span>You need to upload employee to initiate BGV.</span>
                                <span>Lorem epsum is simply dummy text of printing and typesetting industry </span>
                            </span>
                            <span className={cx('row mt-4 no-gutters')}>
                                <NavLink  to={"/customer-mgmt/employee"} className={cx('px-2 py-1',styles.UploadEmpButton)}>
                                    <span>
                                        <img src={plus} alt="add employee"/> 
                                        &nbsp; add employee
                                    </span>
                                </NavLink>
                            </span>
                        </div>
                    </div>
                </div> */}
                </div>

                <div className='col-3'>
                    <div className={cx('row mr-2 d-flex justify-content-end', styles.ContainerPadding64)}>
                        <NavLink to={"/customer-mgmt/employee"} className={styles.LinkButton}>
                            <span>
                                <img className={styles.PlusColor} src={purplePlus} alt={t('translation_clientAdminHome:image_alt_clientAdminHome.addEmployee')} />
                                <span className='text-nowrap'>&nbsp; {t('translation_clientAdminHome:span.s8')} </span>
                            </span>
                        </NavLink>
                    </div>
                    {/* <div className={cx('mr-2 mt-4 pt-3 pb-4')}>
                    <ul className='d-flex flex-column align-items-end'>
                        <li className={cx('pb-3 d-flex flex-nowrap',styles.ListRightBar)}>
                            <span className={styles.Width}>&nbsp; dashboard tour &nbsp;</span>
                            <span><img src={rightArrowRightBar} alt='' className={cx('ml-3',styles.smallRightArrow)}/></span>
                        </li>
                        <li className={cx('pb-3 d-flex flex-nowrap',styles.ListRightBar)}>
                            <span className={styles.Width}>&nbsp; missing data &nbsp;</span>
                            <span><img src={rightArrowRightBar} alt='' className={cx('ml-3 ',styles.smallRightArrow)}/></span>
                        </li>
                        <li className={cx('pb-3 d-flex flex-nowrap',styles.ListRightBar)}>
                            <span className={styles.Width}>&nbsp; navigation #1 &nbsp;</span>
                            <span><img src={rightArrowRightBar} alt='' className={cx('ml-3 ',styles.smallRightArrow)}/></span>
                        </li>
                        <li className={cx('pb-3 d-flex flex-nowrap',styles.ListRightBar)}>
                            <span className={styles.Width}>&nbsp; navigation #2 &nbsp;</span>
                            <span><img src={rightArrowRightBar} alt='' className={cx('ml-3 ',styles.smallRightArrow)}/></span>
                        </li>
                    </ul>
                </div>
                <hr className={cx('row mr-2 mt-5 pb-0 mb-0',styles.hr1)} />
                <div className={cx('row ml-5',styles.Height)}>
                    <div className={cx('col-8 pl-0 pr-2 d-flex',styles.RightBorder)}>
                        <div className='col-4'></div>
                        <div className='col-8 px-0 mb-4 d-flex align-self-end'>
                            <div className='d-flex flex-row'>
                                <span className={cx('mr-1',styles.OnboardText)}>zomato onboarded</span>
                                <div className={cx(styles.PurpleTag)}/>
                            </div>
                        </div>
                    </div>
                    <div className={cx('row d-flex mt-4 pt-2',styles.smallUserIcon)}>
                        <div className='row d-flex flex-column'>
                            <img src={orgNameIcon1} alt='icon'/>
                            <span className={cx('d-flex align-self-center',styles.greenOval)}/> 
                            <img  src={orgNameIcon2} alt='icon'/>
                            <span className={cx('d-flex align-self-center',styles.greenOval)}/>
                            <span className={cx('d-flex align-self-center',styles.purpleLine)}/>
                            <span className={cx('d-flex align-self-center',styles.purpleOval)}/>
                        </div>
                    </div>
                    <div className='col-4 px-0 mx-0 d-flex'>
                        <div className='ml-2 mb-4 pb-1 d-flex align-self-end'>
                            <div className='d-flex flex-row'>
                                <span className={cx('mb-0 pb-0',styles.WhiteOval)}/>
                                <span className={cx('ml-2 text-nowrap',styles.OnboardText)}>1,apr</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={cx('row mr-2 pb-0 mb-0',styles.hr1)} />
                <div className={cx('ml-5 pl-5 col-9 d-flex justify-content-end mt-2')}>
                    <img className='' src={floatHelpIcon} alt='floatHelpIcon'/>
                </div> */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        configuredProducts: state.orgMgmt.orgProfile.EnabledProducts,
        getconfiguredProductsState: state.orgMgmt.orgProfile.getEnabledPlatformServicesState,
        clientOrgId: state.auth.policies[0].orgId,
        empList: state.empMgmt.empList.employeeList,
        empListState: state.empMgmt.empList.getEmployeeListState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getEmpList: (targetUrl) => dispatch(EmpActions.getEmployeeList(targetUrl)),
        getConfiguredProducts: (orgId) => dispatch(orgProActions.getEnabledPlatformServices(orgId))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(userWelcome));