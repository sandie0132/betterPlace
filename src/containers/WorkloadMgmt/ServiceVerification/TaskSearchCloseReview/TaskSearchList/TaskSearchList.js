import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './TaskSearchList.module.scss';

import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import defaultProfile from '../../../../../assets/icons/opsProfile.svg';
import loader from '../../../../../assets/icons/profilepicLoader.svg';

class TaskSearchList extends Component{

    render () {
        let searchResults = this.props.searchResults;
        return (
            !_.isEmpty(searchResults) ?
                <div className={cx(styles.SearchResult,scrollStyle.scrollbar, "d-flex flex-column col-12 position-absolute")}>
                    {searchResults.map((data, index) => {
                        return (
                            <div key={index} onClick={() => this.props.handleSelectedTask(data)} className={styles.hover}>
                                <div className={cx("d-flex flex-wrap", styles.Text)}>
                                    {this.props.getProfilePictureState === "SUCCESS" 
                                        ?   data && data.profilePicUrl ?
                                                <span>
                                                    <img className={styles.Profile} 
                                                        src={this.props.images[data.empId] ? 
                                                                this.props.images[data.empId]['image'] 
                                                        : defaultProfile} 
                                                        alt=""
                                                    />
                                                </span>
                                                : <span>
                                                    <img className={styles.Profile} src={defaultProfile} alt="img" />
                                                </span>
                                        :   this.props.getProfilePictureState === "LOADING" 
                                                ?   <span className={styles.loaderBackground}>
                                                        <img className={styles.loader} src={loader} alt='' />
                                                    </span>
                                                :   <span>
                                                        <img className={styles.Profile} src={defaultProfile} alt="img" />
                                                    </span>
                                    } 
                                    &nbsp;&bull;&nbsp;
                                   
                                    {data && data.fullName ? <span>{data.fullName}</span> :  ""}
                                    
                                    {this.props.verificationType === "employment" ?
                                        <span>
                                            &nbsp;&nbsp;&bull;&nbsp;
                                            {data.employment && data.employment.designation ? 
                                                <span>(ex-{data.employment.designation} {(data.employment && data.employment.organisation) ? ", "+data.employment.organisation+")" : ")" }</span>
                                                : <span>{data.employment && data.employment.organization ? ("(" + data.employment.organization +")") : ""} </span>
                                            }
                                        </span>
                                        : this.props.verificationType === "education" ?
                                            <span>
                                                &nbsp;&nbsp;&bull;&nbsp;
                                                {data.education && data.education.school_college ? 
                                                    <span>({data.education.school_college} {data.education && data.education.board_university ? ","+data.education.board_university+")" :")"}</span>
                                                    : <span>{data.education && data.education.board_university ? "(" + data.education.board_university + ")" : ""}</span>
                                                }
                                            </span>
                                            : this.props.verificationType === "reference" ?
                                                <span>
                                                    &nbsp;&nbsp;&bull;&nbsp;
                                                    {data.reference && data.reference.relationship ? 
                                                        <span>({data.reference.relationship} {data.reference && data.reference.name ? ", "+data.reference.name+")" :")"}</span>
                                                        : <span>{data.reference && data.reference.name ? "(" + data.reference.name +")" : ""}</span>
                                                    }
                                                </span>
                                                : ["court","physicalAddress", "postalAddress", "addressReview"].includes(this.props.verificationType) ?
                                                    <span>
                                                        &nbsp;&nbsp;&bull;&nbsp;
                                                        <span>{data.service.toLowerCase().replace(/_/g," ")}</span>
                                                    </span>
                                                : null
                                            }
                                    {data && !_.isEmpty(data.primaryRole) && data.primaryRole.name ? <span>&nbsp;&bull;&nbsp;{data.primaryRole.name}</span> : ""}
                                    {data && !_.isEmpty(data.orgName) ? <span>&nbsp;&bull;&nbsp;{data.orgName}</span> : ""}
                                    {data && !_.isEmpty(data.current_employeeId) ? <span>&nbsp;&bull;&nbsp;{data.current_employeeId}</span> : ""}
                                    {data && !_.isEmpty(data.contact) ? <span>&nbsp;&bull;&nbsp;{data.contact}</span> : ""}
                                </div>
                                
                                {index === searchResults.length - 1 ? null :
                                    <hr className={styles.Line} />
                                }
                            </div>
                        )
                    })}
                </div>
            : null 
        )
    }
}

const mapStateToProps = state => {
    return {
        getProfilePictureState : state.imageStore.getProfilePictureState,
        images: state.imageStore.images,
    }
}

export default connect(mapStateToProps, null)(TaskSearchList);