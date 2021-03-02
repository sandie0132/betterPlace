import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// import { NavLink, Link } from 'react-router-dom';
import _ from 'lodash';
import cx from 'classnames';
import styles from './OpsHome.module.scss';
// import floatHelpIcon from '../../../assets/icons/floatingHelpIcon.svg';
// import insight from '../../../assets/icons/active.svg';
// import greenIcon from '../../../assets/icons/correctTabIcon.svg';
// import deactiveIcon from '../../../assets/icons/deactive.svg';
// import onholdIcon from '../../../assets/icons/onhold.svg';
// import rightArrowRightBar from '../../../assets/icons/rightArrow.svg';
// import purplePlus from '../../../assets/icons/purplePlus.svg';
// import todo_inactive from '../../../assets/icons/todoInactive.svg';
// import rightArrowIcon from '../../../assets/icons/rightArrowDashboard.svg';
import thumbsup from '../../../assets/icons/thumbsup.svg';
import sunRiseIcon from '../../../assets/icons/sunRiseIcon.svg';
import AfterNoonIcon from '../../../assets/icons/sunRiseIcon.svg';
import EveningIcon from '../../../assets/icons/sunRiseIcon.svg';

import * as actions from './Store/action';
// import * as serviceVerificationActions from '../../WorkloadMgmt/ServiceVerification/Store/action';
import ToDoTaskCard from './ToDoTaskCard/ToDoTaskCard';
import HasAccess from '../../../services/HasAccess/HasAccess';
// import TimeLine from "../../../components/Organism/TimeLine/TimeLine";
import Loader from '../../../components/Organism/Loader/Loader';
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';

const permissions = {
    "pan": ["PAN:CLOSE", "PAN:REVIEW"],
    "aadhaar": ["AADHAAR:CLOSE", "AADHAAR:REVIEW"],
    "voter": ["VOTER:CLOSE", "VOTER:REVIEW"],
    "dl": ["DL:CLOSE", "DL:REVIEW"],
    "rc": ["RC:CLOSE", "RC:REVIEW"],

    "address_review": ["ADDRESS:CLOSE", "ADDRESS:REVIEW"],
    "globaldb": ["GLOBALDB:CLOSE", "GLOBALDB:REVIEW"],

    "crc": ["CRC:CLOSE", "CRC:REVIEW"],
    "pvc": ["POLICE_VERIFICATION:CLOSE", "POLICE_VERIFICATION:REVIEW", "POLICE_VERIFICATION:DOWNLOAD", "POLICE_VERIFICATION:UPLOAD"],

    "employment": ["EMP_CHECK:CLOSE", "EMP_CHECK:REVIEW"],
    "education": ["EDU_CHECK:CLOSE", "EDU_CHECK:REVIEW"],

    "reference": ["REF_CHECK:CLOSE", "REF_CHECK:REVIEW"],
    "health": ["HEALTH:CLOSE", "HEALTH:REVIEW"],

    "physical_address": ["PHYSICAL_ADDRESS:CLOSE", "PHYSICAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:REVIEW",
        "PHYSICAL_ADDRESS:DOWNLOAD", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "AGENCY_DASHBOARD:VIEW_ALL"],
    "postal_address": ["POSTAL_ADDRESS:CLOSE", "POSTAL_ADDRESS:LIST", "POSTAL_ADDRESS:REVIEW", "POSTAL_ADDRESS:DOWNLOAD", "POSTAL_ADDRESS:UPLOAD"]
}

class OpsHome extends Component {
    state = {
        greeting: '',
        greetingImg: ''
    }

    componentDidMount() {
        const thisRef = this;
        _.forEach(thisRef.props.policies, function (policy) {
            if (_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:VIEW_ASSIGNED")
                || _.includes(policy.businessFunctions, "AGENCY_DASHBOARD:VIEW_ALL")
                || _.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:LIST")) {
                thisRef.props.onGetPhysicalTaskCount();
            }
            if (_.includes(policy.businessFunctions, "OPS:TASK")) {
                thisRef.props.onGetDocuments();
            }
            if (_.includes(policy.businessFunctions, "POSTAL_ADDRESS:LIST")) {
                thisRef.props.onGetPostalTaskCount();
            }
        })
        if (this.props.user.userGroup === 'SUPER_ADMIN') {
            this.props.onGetDocuments();
            this.props.onGetPostalTaskCount();
            this.props.onGetPhysicalTaskCount();
        }
        this.handleGreeting();
    }

    handleGreeting() {
        let n = new Date().getHours();
        const { t } = this.props
        if (n < 12) {
            this.setState({
                greeting: t('translation_opsHome:gMorning'),
                greetingImg: sunRiseIcon
            })
        }
        else if (n >= 12 && n < 18) {
            this.setState({
                greeting: t('translation_opsHome:gAfternoon'),
                greetingImg: AfterNoonIcon
            })
        }
        else if (n > 17) {
            this.setState({
                greeting: t('translation_opsHome:gEvening'),
                greetingImg: EveningIcon
            })
        }
    }

    render() {
        const { t } = this.props;

        let idCards = [], legalCards = [], careerCards = [], healthRefCards = [], phyAddressCards = []
        //, addressReviewCards = [];

        if (this.props.getDocumentsState === 'SUCCESS' && !_.isEmpty(this.props.documentsList)) {
            //adding obj fields in diff categories
            Object.keys(this.props.documentsList).forEach((document, index) => {
                if (document === 'pan' || document === 'aadhaar' || document === 'rc' || document === 'voter' || document === 'dl') {
                    idCards = idCards.concat(<HasAccess
                        key={index}
                        permission={permissions[document]}
                        yes={() => (
                            <ToDoTaskCard
                                key={index}
                                name={document}
                                count={this.props.documentsList[document]}
                            />
                        )}
                    />
                    )
                }
                else if (document === 'address_review') {
                    phyAddressCards = phyAddressCards.concat(<HasAccess
                        key={index}
                        permission={permissions[document]}
                        yes={() => (
                            <ToDoTaskCard
                                key={index}
                                name={document}
                                count={this.props.documentsList[document]}
                            />
                        )}
                    />
                    )
                }
                else if (document === 'crc' || document === 'pvc' || document === 'globaldb') {
                    legalCards = legalCards.concat(<HasAccess
                        key={index}
                        permission={permissions[document]}
                        yes={() => (
                            <ToDoTaskCard
                                key={index}
                                name={document}
                                count={this.props.documentsList[document]}
                            />
                        )}
                    />
                    )
                }
                else if (document === 'employment' || document === 'education') {
                    careerCards = careerCards.concat(<HasAccess
                        key={index}
                        permission={permissions[document]}
                        yes={() => (
                            <ToDoTaskCard
                                key={index}
                                name={document}
                                count={this.props.documentsList[document]}
                            />
                        )}
                    />
                    )
                }
                else if (document === 'health' || document === 'reference') {
                    healthRefCards = healthRefCards.concat(<HasAccess
                        key={index}
                        permission={permissions[document]}
                        yes={() => (
                            <ToDoTaskCard
                                key={index}
                                name={document}
                                count={this.props.documentsList[document]}
                            />
                        )}
                    />
                    )
                }
                else return null
            });
        }

        // if (this.props.postalTasksCountState === 'SUCCESS' && !_.isEmpty(this.props.postalTasksCount)) {
        if (this.props.postalCountState === 'SUCCESS' && !_.isEmpty(this.props.postalCount)) {
            phyAddressCards = phyAddressCards.concat(<HasAccess
                permission={permissions["postal_address"]}
                key={this.props.postalCount["agencyTotalTask"]}
                yes={() => (
                    <ToDoTaskCard
                        name={"postal_address"}
                        count={this.props.postalCount["agencyTaskWithStatus"]}
                    />
                )}
            />
            )
        }
        if (this.props.physicalCountState === 'SUCCESS' && !_.isEmpty(this.props.physicalCount)) {
            phyAddressCards = phyAddressCards.concat(<HasAccess
                permission={permissions["physical_address"]}
                key={this.props.physicalCount["agencyTotalTask"]}
                yes={() => (
                    <ToDoTaskCard
                        name={"physical_address"}
                        count={this.props.physicalCount["agencyTaskWithStatus"]}
                    />
                )}
            />
            )
        }

        return (
            <div className={cx(styles.centerContent, scrollStyle.scrollbar)} >
                <div className={cx('mx-0 px-0')}>
                    <div className={cx('no-gutters', styles.alignCenter)}>
                        {this.props.getDocumentsState === 'LOADING' || this.props.postalTasksCountState === 'LOADING' || this.props.tasksCountState === 'LOADING' ?
                            <Loader type='opsHome' />
                            :
                            <React.Fragment>
                                <div className={cx('row mr-4', styles.ContainerPadding64)}>
                                    <span className={cx('col-6 mr-0 px-0', styles.OrgName)}>
                                        <span className='mr-1'>{t('translation_opsHome:todo')}</span>
                                    </span>
                                </div>

                                <div className={cx('row ml-0', styles.MarginBottom)}>
                                    <span><img src={!_.isEmpty(this.state.greetingImg) ? this.state.greetingImg : null} alt={t('translation_opsHome:image_alt_opsHome.sunriseIcon')} /></span>
                                    <div className='col-8 ml-0 d-flex flex-column'>
                                        <span className={styles.welcomeText}>
                                            {this.state.greeting + this.props.userAccountProfile.nameInLowerCase}!</span>
                                        <span className={cx('justify-content-start', styles.welcomeMessage)}>
                                            <span>{t('translation_opsHome:line1')}</span>
                                            <span className='mx-1'><img src={thumbsup} alt={t('translation_opsHome:image_alt_opsHome.thumbsup')} /></span>
                                            <span className='my-1'>{t('translation_opsHome:line2')}</span>
                                        </span>
                                    </div>
                                </div>
                                {/*<div className='row-fluid mr-4 mt-2'>
                        <ul>
                             <li className={cx('pl-0')}>
                                <NavLink to={{ pathname: "/", search: "?filter=todos" }}
                                    activeClassName={cx(styles.NavLinkfontActive)}
                                    isActive={(match, location) => {
                                        if (!match) {
                                            return false;
                                        }
                                        const searchParams = new URLSearchParams(location.search);
                                        return match.isExact && searchParams.get('filter') === 'todos';
                                    }}>
                                    <button className={cx(styles.NavLinkfont)}>
                                        <span className={styles.svg}>
                                            <img src={todo_inactive} alt="todos" />
                                            <span className={styles.NavHead}>
                                                &nbsp; todo's &nbsp;
                                                    </span>
                                        </span>
                                    </button>
                                </NavLink>
                            </li>
                           <li className={cx('pl-0')}>
                                <NavLink    to={{  pathname: "/" , search: "?filter=insight"}}
                                            activeClassName={styles.NavLinkfontActive}
                                            isActive={(match, location) => {
                                                if (!match) {
                                                    return false;
                                                }
                                                const searchParams = new URLSearchParams(location.search);
                                                return match.isExact && searchParams.get('filter') === 'insight';
                                            }}
                                >
                                            <button className={styles.NavLinkfont}>
                                                <span className={styles.svg}>
                                                    <img src={insight} alt="insight" />
                                                    <span className={styles.NavHead}>
                                                        &nbsp; insight &nbsp;
                                                    </span>
                                                </span>
                                            </button>
                                </NavLink> 
                            </li> 
                            <li className={cx('pl-0')}>
                                <NavLink to={"/"}>
                                <button className={styles.NavLinkfont}>
                                                <span className={styles.svg}>
                                                    <img src={deactiveIcon} alt="deactiveIcon" />
                                                    <span className={styles.NavHead}>
                                                        &nbsp; red &nbsp;
                                                    </span>
                                                </span>

                                    </button>
                                </NavLink> 
                            </li>
                            <li className={cx('pl-0')}>
                                <NavLink to={"/"}>
                                <button className={styles.NavLinkfont}>
                                                <span className={styles.svg}>
                                                    <img src={onholdIcon} alt="insight" />
                                                    <span className={styles.NavHead}>
                                                        &nbsp; yellow &nbsp;
                                                    </span>
                                                </span>

                                    </button>
                                </NavLink> 
                            </li>
                            <li className={cx('pl-0',)}>
                                <NavLink to={"/"}>
                                <button className={styles.NavLinkfont}>
                                                <span className={styles.svg}>
                                                    <img src={greenIcon} alt="insight" />
                                                    <span className={styles.NavHead}>
                                                        &nbsp; green &nbsp;
                                                    </span>
                                                </span>

                                    </button>
                                </NavLink> 
                            </li>
                        </ul>
                        <hr className={cx(styles.hr1)} />
                    </div> */}

                                {!_.isEmpty(idCards) ?
                                    <HasAccess
                                        permission={["PAN:CLOSE", "PAN:REVIEW", "AADHAAR:CLOSE", "AADHAAR:REVIEW", "VOTER:CLOSE", "VOTER:REVIEW", "DL:CLOSE", "DL:REVIEW", "RC:CLOSE", "RC:REVIEW"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div>
                                                    <label className={styles.DocType}>{t('translation_opsHome:idVerification')}</label>
                                                    <div className='d-flex flex-wrap'>{idCards}</div>
                                                </div>
                                                <hr className={styles.HorizontalLine} />
                                            </React.Fragment>
                                        )}
                                    />
                                    : null}

                                {/* removing this because "manual address review" is under "address" section now
                                {!_.isEmpty(addressReviewCards) ?
                                    <HasAccess
                                        permission={["ADDRESS:CLOSE", "ADDRESS:REVIEW"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div>
                                                    <label className={styles.DocType}>{t('translation_opsHome:manual')}</label>
                                                    <div className='d-flex flex-wrap'>{addressReviewCards}</div>
                                                </div>
                                                <hr className={styles.HorizontalLine} />
                                            </React.Fragment>
                                        )} />
                                    : null} */}

                                {!_.isEmpty(phyAddressCards) ?
                                    <HasAccess
                                        permission={["ADDRESS:CLOSE", "ADDRESS:REVIEW",
                                            "PHYSICAL_ADDRESS:CLOSE", "PHYSICAL_ADDRESS:LIST",
                                            "PHYSICAL_ADDRESS:REVIEW", "PHYSICAL_ADDRESS:DOWNLOAD",
                                            "POSTAL_ADDRESS:CLOSE", "POSTAL_ADDRESS:LIST",
                                            "POSTAL_ADDRESS:REVIEW", "POSTAL_ADDRESS:DOWNLOAD", "POSTAL_ADDRESS:UPLOAD",
                                            "AGENCY_DASHBOARD:VIEW_ASSIGNED", "AGENCY_DASHBOARD:VIEW_ALL"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div>
                                                    <label className={styles.DocType}>{t('translation_opsHome:addressVerification')}</label>
                                                    <div className='d-flex flex-wrap'>{phyAddressCards}</div>
                                                </div>
                                                <HasAccess
                                                    permission={["PHYSICAL_ADDRESS:LIST", "POSTAL_ADDRESS:LIST", "ADDRESS:CLOSE", "ADDRESS:REVIEW"]}
                                                    yes={() => (
                                                        <hr className={styles.HorizontalLine} />
                                                    )}
                                                />
                                            </React.Fragment>
                                        )} />
                                    : null}

                                {!_.isEmpty(legalCards) ?
                                    <HasAccess
                                        permission={["CRC:CLOSE", "CRC:REVIEW",
                                            "GLOBALDB:CLOSE", "GLOBALDB:REVIEW",
                                            "POLICE_VERIFICATION:CLOSE", "POLICE_VERIFICATION:REVIEW",
                                            "POLICE_VERIFICATION:DOWNLOAD", "POLICE_VERIFICATION:UPLOAD"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div>
                                                    <label className={styles.DocType}>{t('translation_opsHome:legalVerification')}</label>
                                                    <div className='d-flex flex-wrap'>{legalCards}</div>
                                                </div>
                                                <hr className={styles.HorizontalLine} />
                                            </React.Fragment>
                                        )}
                                    />
                                    : null}

                                {!_.isEmpty(careerCards) ?
                                    <HasAccess
                                        permission={["EMP_CHECK:CLOSE", "EMP_CHECK:REVIEW", "EDU_CHECK:CLOSE", "EDU_CHECK:REVIEW"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div>
                                                    <label className={styles.DocType}>{t('translation_opsHome:careerVerification')}</label>
                                                    <div className='d-flex flex-wrap'>{careerCards}</div>
                                                </div>
                                                <hr className={styles.HorizontalLine} />
                                            </React.Fragment>
                                        )} />
                                    : null}

                                {!_.isEmpty(healthRefCards) ?
                                    <HasAccess
                                        permission={["REF_CHECK:REVIEW", "REF_CHECK:CLOSE", "HEALTH:CLOSE", "HEALTH:REVIEW"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div>
                                                    <label className={styles.DocType}>{t('translation_opsHome:healthRef')}</label>
                                                    <div className='d-flex flex-wrap mb-2'>{healthRefCards}</div>
                                                </div>
                                            </React.Fragment>
                                        )} />
                                    : null}


                                {/* {!_.isEmpty(this.props.tasksCount) ?
                                    <div>
                                        <label className={styles.DocType}>{t('translation_opsHome:agency')}</label>
                                        <div className='d-flex flex-wrap'>
                                            <HasAccess
                                                permission={["AGENCY_DASHBOARD:VIEW_ALL"]}
                                                yes={() => (
                                                    <ToDoTaskCard
                                                        name='agency_physical_address'
                                                        count={this.props.tasksCount.unassigned}
                                                    />
                                                )}
                                            />
                                            <HasAccess
                                                permission={["AGENCY_DASHBOARD:VIEW_ASSIGNED"]}
                                                yes={() => (
                                                    <ToDoTaskCard
                                                        name='agency_physical_address'
                                                        count={this.props.tasksCount.paginationCount}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    : null} */}
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        documentsList: state.opsHome.DocumentsList,
        getDocumentsState: state.opsHome.getDocumentsState,
        // postalTasksCountState: state.workloadMgmt.DocVerification.excelPostalTasksCountState,
        // postalTasksCount: state.workloadMgmt.DocVerification.postalTasksCount,
        physicalCount: state.opsHome.physicalCount,
        physicalCountState: state.opsHome.physicalCountState,
        postalCount: state.opsHome.postalCount,
        postalCountState: state.opsHome.postalCountState,

        policies: state.auth.policies,
        user: state.auth.user,
        userAccountProfile: state.user.userProfile.profile,
        // tasksCountState: state.opsHome.getAgencyTasksCountState,
        // tasksCount: state.opsHome.getAgencyTasksCount
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // onGetAgencyTasksCount: (cardType) => dispatch(actions.getAgencyTasksCount(cardType)),
        onGetDocuments: () => dispatch(actions.getDocuments()),
        onGetPostalTaskCount: () => dispatch(actions.getPostalCount()),
        onGetPhysicalTaskCount: () => dispatch(actions.getPhysicalCount()),
        // onGetPostalCount: (type, agencyName) => dispatch(serviceVerificationActions.excelTasksCount(type, agencyName))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(OpsHome));