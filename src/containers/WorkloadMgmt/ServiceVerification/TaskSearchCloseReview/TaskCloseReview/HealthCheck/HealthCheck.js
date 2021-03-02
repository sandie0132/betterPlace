import React,{Component} from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './HealthCheck.module.scss';

import profile from '../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';


class HealthCheck extends Component{

    componentDidMount(){
        if(this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }
    
    render(){
    const empId = this.props.taskData.empId;
    const { t } = this.props;
    return (
        !_.isEmpty(this.props.taskData) ?
            <div className={this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                <div>
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
                        <div>
                            {!_.isEmpty(this.props.taskData.fullName) ?  
                                <label className={styles.SubHeading}>{this.props.taskData.fullName}</label>
                            : null }<br />
                            <label className={styles.OptionWithHeading}>
                                {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''} 
                                {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | ": ''}
                                {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ''}
                            </label>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                            {this.props.taskData.fullName ? 
                                <div className="d-flex flex-column col-8">
                                    <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.fullName}</span>
                                    <span className={styles.subTextLabel}>{t('translation_docVerification:health.name')}</span>
                                </div> : null}
                            {!_.isEmpty(this.props.taskData.health) && this.props.taskData.health.bloodGroup ? 
                                <div className="d-flex flex-column col-4">
                                    <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.health.bloodGroup}</span>
                                    <span className={styles.subTextLabel}>{t('translation_docVerification:health.bloodGroup')}</span>
                                </div> : null}
                        </div>
                    </div>
                </div>
                <hr className={styles.horizontalCardLine} />
                <CommentsSection 
                    seconds={this.props.seconds}
                    taskData={this.props.taskData}
                    cardType={this.props.cardType}
                    searchType={this.props.searchType}
                    searchResult={this.props.searchResult}
                    successNotificationHandler={this.props.successNotificationHandler}
                />
            </div>
        : <EmptyState cardType={this.props.cardType}/>
    )};
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(HealthCheck));