import React,{Component} from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-crux';
import cx from 'classnames';
import _ from 'lodash';
import styles from './CrcBasicInfo.module.scss';

import CaseList from '../CaseList/CaseList';
import EmptyState from '../../../../../../../components/Atom/EmptyState/EmptyState';

import profile from '../../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../../assets/icons/profilepicLoader.svg';

import * as imageStoreActions from '../../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';


class CrcBasicInfo extends Component {
    state = {
        caseListPopup: false,
    }

    componentDidMount = () => {
        if(this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.seconds !== prevProps.seconds && this.props.seconds === 0)
        {
            this.setState({caseListPopup: false})
        }
    }

    toggleCaseListPopup = () => {
        let updatedPopup = this.state.caseListPopup;
        this.setState({ caseListPopup: !updatedPopup });
    }

    render () {
        const { t } = this.props;
        const empId = this.props.taskData.empId;

        let { crc } = this.props.taskData;
        let cases = !_.isEmpty(this.props.taskData.apiResponse) ? this.props.taskData.apiResponse.matched_case_details : [];
        let caseList;

        if (!_.isEmpty(cases) && cases.length > 2) {
            caseList = cases[0].case_category + ', ' + cases[1].case_category + ', ' + (parseInt(cases.length)-2).toString() + ' more';
        }
        else if (!_.isEmpty(cases) && cases.length === 2) {
            caseList = cases[0].case_category + ', ' + cases[1].case_category;
        }
        else if (!_.isEmpty(cases) && cases.length === 1) {
            caseList = cases[0].case_category;
        }
        else {
            caseList = 'no cases found'
        }
        return(
            !_.isEmpty(this.props.taskData) ? 
                <div className={this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                    <div className="d-flex">
                        {_.includes(this.props.loadingQueue, empId) ?
                            <span className={styles.loaderBackground}>
                                <img className={styles.loader} src={loader} alt='' />
                            </span>
                        :    <span>
                                <img
                                    src={this.props.taskData.profilePicUrl ? 
                                            (this.props.images[empId] ? 
                                                this.props.images[empId]['image'] 
                                            : profile)
                                        : profile}
                                    className={styles.Profile}
                                    alt=""
                                />
                            </span>
                        }
                        <div className="d-flex flex-column">
                            {!_.isEmpty(this.props.taskData.fullName) ? 
                                <label className={cx(this.props.disabled ? styles.fullNameInactive : styles.fullNameActive,"mb-1")}>
                                    {this.props.taskData.fullName}
                                </label> 
                            : null}
                            <label className={this.props.disabled ? styles.commentSmallLabelInactive : styles.commentSmallLabel}>
                                {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''} 
                                {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | " : ''}
                                {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ''}
                            </label>
                        </div>
                    </div>
                    {!_.isEmpty(crc) && crc.fullName ? 
                        <div className='d-flex flex-column mt-3'>
                            <span className={cx(this.props.seconds !== 0 && !this.state.caseListPopup && !this.props.disabled? styles.NameFont : styles.NameFontInactive)}>{crc.fullName}</span>
                            <span className={cx(this.props.seconds !== 0 && !this.state.caseListPopup && !this.props.disabled? styles.commentSmallLabel : styles.commentSmallLabelInactive)}>{t('translation_docVerification:crc.name')}</span>
                        </div> : null}

                    <div className='row no-gutters mt-3'>
                        {!_.isEmpty(crc) && crc.pincode ?
                            <div className='col-4 d-flex flex-column'>
                                <span className={this.props.seconds !== 0 && !this.state.caseListPopup && !this.props.disabled? styles.idValue : styles.idValueInactive}>{ crc.pincode}</span>
                                <span className={this.props.seconds !== 0 && !this.state.caseListPopup && !this.props.disabled? styles.commentSmallLabel : styles.commentSmallLabelInactive}>{t('translation_docVerification:crc.pincode')}</span>
                            </div> : null }
                    </div>
                    <div className='row no-gutters mt-3'>
                        <div className='d-flex flex-column'>
                            <span className={this.props.seconds !== 0 && !this.state.caseListPopup && !this.props.disabled? styles.idValue : styles.idValueInactive}>{caseList}</span>
                            <span className={this.props.seconds !== 0 && !this.state.caseListPopup && !this.props.disabled? styles.commentSmallLabel : styles.commentSmallLabelInactive}>{t('translation_docVerification:crc.match')}</span>
                        </div>
                        {!_.isEmpty(caseList) && caseList !== 'no cases found'
                        ?   <div className='ml-auto mb-0 mt-3'>
                                <Button isDisabled={this.props.seconds === 0 && !this.props.disabled? true : false} label={t('translation_docVerification:crc.review')} type='smallWithArrow' clickHandler={this.toggleCaseListPopup} />
                            </div>
                        : null}
                    </div>
                    {this.state.caseListPopup === true && this.props.seconds !== 0 ?
                        <CaseList
                            toggle={this.toggleCaseListPopup}
                            data={this.props.taskData}
                            seconds={this.props.seconds}
                            successNotificationHandler={this.props.successNotificationHandler}
                            handleSubmit={this.handleSubmit}
                            searchType={this.props.searchType}
                            searchResult={this.props.searchResult}
                            defaultRole={this.props.defaultRole ? this.props.defaultRole : ''}
                        />
                        : null
                    }
                </div>
            :
                <EmptyState cardType={this.props.cardType}/>
        )
    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
        loadingQueue:  state.imageStore.loadingQueue
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrcBasicInfo));