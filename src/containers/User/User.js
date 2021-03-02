import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";
import styles from './User.module.scss';
import cx from 'classnames';
import userEmail from '../../assets/icons/userEmail.svg';
import userMobile from '../../assets/icons/userMobile.svg';
import ArrowLink from '../../components/Atom/ArrowLink/ArrowLink';
import defaultPic from '../../assets/icons/defaultPic.svg';
import resetKey from '../../assets/icons/resetKey.svg';
import dots from '../../assets/icons/dots.svg';
import * as actions from "./Store/action";
import * as imageStoreActions from "../Home/Store/action";

class User extends Component {

    state = {
        showModal: false
    }

    toggleForm = () => {
        this.setState({ showModal: !this.state.showModal })
    }

    componentDidMount(){
        this.props.onGetUserDetails();
    }

    componentDidUpdate(prevProps){
        if(prevProps.userAccountProfile !== this.props.userAccountProfile){
            if(this.props.getUserProfileDataState === 'SUCCESS'){
                if(this.props.userAccountProfile.empId && this.props.userAccountProfile.profilePicUrl){
                    this.props.onGetProfilePic(this.props.userAccountProfile.empId, 
                        this.props.userAccountProfile.profilePicUrl)
                }
            }
        }
    }

    render() {
        const { match } = this.props;
        const userId = match.params.userId;

        return (
            <React.Fragment>
                <div className={cx(styles.alignCenter)}>
                    <ArrowLink
                        label="home"
                        url={`/`}
                    />
                    <div className={cx(styles.CardLayout, 'col-8')}>
                        <div className='row no-gutters'>

                            <div className={cx('col-3', styles.ProfilePic)}>
                                <img className={styles.ImageContainer} 
                                src={this.props.userAccountProfile.profilePicUrl ? (this.props.images[this.props.userAccountProfile.empId] ? 
                                        this.props.images[this.props.userAccountProfile.empId]['image']: defaultPic) 
                                        : defaultPic
                                    }
                                alt='' />
                            </div>

                            <div className='col-7'>
                                <label className={cx(styles.Name)}>
                                    {this.props.userAccountProfile.nameInLowerCase}
                                </label> <br />

                                {this.props.userAccountProfile.primaryRole ?
                                    <label className={cx(styles.Designation)}>
                                        {this.props.userAccountProfile.primaryRole}&nbsp;{this.props.userAccountProfile.employeeId ? '| ' + this.props.userAccountProfile.employeeId : null}
                                    </label> : null}

                                {this.props.userAccountProfile.email ?
                                    <div>
                                        <img src={userEmail} alt='' />&emsp;
                                    <label className={cx(styles.Subheading)}> {this.props.userAccountProfile.email} </label>
                                    </div> : null}

                                {this.props.userAccountProfile.mobile ?
                                    <div>
                                        <img src={userMobile} alt='' />&emsp;
                                    <label className={cx(styles.Subheading)}> {this.props.userAccountProfile.mobile} </label>
                                    </div> : null}

                                <div>
                                    <img src={resetKey} alt='' />&emsp;
                                    <NavLink to={"/user/" + userId + "/reset-password"} >
                                        <label className={cx(styles.ResetPassword)}><u>reset password</u></label>
                                    </NavLink>
                                </div>
                            </div>

                            <div className='col-2'>
                                <img src={dots} alt='' style={{ marginTop: '2rem' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
};

const mapStateToProps = state => {
    return {
        userAccountProfile: state.user.userProfile.profile,
        getUserProfileDataState: state.user.userProfile.getUserProfileDataState,
        images: state.imageStore.images
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        onGetUserDetails: () => dispatch(actions.getUserDetails()),
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath))
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps,mapDispatchToProps)(User)));