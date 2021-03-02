import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import _ from 'lodash';
import * as actions from "./Store/action";
import styles from "./ResetPassword.module.scss";
import cx from "classnames";
import arrow from "../../../assets/icons/arrowRightBig.svg";
import closePage from "../../../assets/icons/closePage.svg";
import text from "../../../assets/icons/text.svg";
import warning from "../../../assets/icons/warningCircleSmall.svg";

class ResetPassword extends Component {

    state = {
        formData: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        enableNext: false,
        enableInput: false,
        regExMatch: false,
        samePassword: false,
        errorMessage: '',
        showError: false,
        userId: ""
    }

    componentDidMount() {
        const { match } = this.props;
        const userId = match.params.userId;
        this.setState({ userId: userId })

    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevState.formData, this.state.formData)) {
            const regEx = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            const formData = _.cloneDeep(this.state.formData);
            let enableInput = false;
            let errorMessage = '';
            let showError = false;
            let enableNext = false;
            let samePassword = false;
            if (formData.oldPassword.length !== 0) {
                enableInput = true;
                if (_.isEqual(formData.oldPassword, formData.newPassword)) {
                    errorMessage = "new password can not be same as old.";
                }
                else {
                    showError = false;
                    if ((!regEx.test(formData.newPassword) && (formData.newPassword.length !== 0))) {
                        errorMessage = "password doesn't match the required pattern.";
                    } else {
                        showError = false;
                        if ((formData.newPassword !== formData.confirmPassword) && (formData.confirmPassword.length !== 0)
                            && (formData.newPassword.length !== 0)) {
                            errorMessage = "new password and confirm password doesn't match.";
                            samePassword = true;
                        }
                        else if ((formData.newPassword === formData.confirmPassword) && (formData.confirmPassword.length !== 0)) {
                            enableNext = true;
                            samePassword = false;
                        }
                        else {
                            showError = false;
                        }
                    }
                }
            }
            this.setState({
                enableInput: enableInput,
                errorMessage: errorMessage,
                showError: showError,
                enableNext: enableNext,
                samePassword: samePassword
            })
        }

        if (prevProps.postResetDataState !== this.props.postResetDataState) {
            if (this.props.postResetDataState === "ERROR") {
                this.setState({
                    showError: true
                })
            }
            if (this.props.postResetDataState === "SUCCESS") {
                let redirectUrl = '/user/' + this.state.userId;
                this.props.history.push(redirectUrl);
            }
        }

    }

    handleInputChange = (event, inputIdentifier) => {

        let updatedFormData = {
            ...this.state.formData,
        }
        updatedFormData[inputIdentifier] = event.target ? event.target.value : event.value;
        this.setState({
            formData: updatedFormData,
        });
    }

    handleShowError = () => {
        this.setState({
            showError: true
        })
    }

    handleNext = (event) => {
        event.preventDefault();
        let data = {
            "oldPassword": this.state.formData.oldPassword,
            "newPassword": this.state.formData.newPassword
        }
        this.props.onPostData(data);
    }

    checkPassword = () => {

        if (this.state.regExMatch) {
            if (this.state.formData.newPassword === this.state.formData.confirmPassword) {
                this.setState({
                    enableNext: true,
                })
            } else {
                this.setState({
                    showError: true,
                    enableNext: false,
                    errorMessage: 'password not matched'
                })
            }
        }
    }

    render() {
        return (
            <div className={('col-12', styles.formBackground)}>
                <div className={cx(styles.Container)}>
                    <Link to={`/user/${this.state.userId}`}>
                        <div className={styles.Close}><img src={closePage} alt="img" /></div>
                    </Link>
                    <div className={styles.Heading}>change your password</div>
                    <form>
                        <div className={cx(styles.inputs, "mt-3")}>
                            <span className={styles.label}>current password</span><br />
                            <input
                                name="oldPassword"
                                className={cx(styles.inputField)}
                                type="password"
                                placeholder="enter current password"
                                onChange={(event) => this.handleInputChange(event, 'oldPassword')}
                                value={this.state.formData.oldPassword}
                            />
                            <br />
                            {/* <Link to={"/forgot-password"} className={styles.labelRight}>forgot current password?</Link><br /> */}
                        </div>
                        <hr className={styles.hr} />
                        <div className="d-flex">
                            <div>
                            <img src={text} alt="text" />
                            </div>
                            <div className={styles.infoText}>Password should have minimum 8 characters and must include 1 upper case,
                            <br/> 1 lower case, 1 digit and a special character from '!@#$%^&*'</div>
                        </div>
                        {this.state.showError && this.state.errorMessage !== '' ?
                            <React.Fragment>
                                <img src={warning} alt="warn" style={{height:"16px"}}/>
                                <span className={styles.infoText}>{this.state.errorMessage}</span>
                            </React.Fragment> : <br />}

                        <div className={cx(styles.inputs)}>
                            <span className={styles.label}>new password</span><br />
                            <input
                                name="newPassword"
                                className={cx(styles.inputField, this.state.showError && this.state.errorMessage !== '' ? styles.warning : null,!this.state.enableInput ? styles.disableInput : null )}
                                type="password"
                                placeholder="enter new password"
                                onChange={(event) => this.handleInputChange(event, 'newPassword')}
                                value={this.state.formData.newPassword}
                                disabled={!this.state.enableInput}
                                onBlur={() => this.handleShowError()}
                            />
                        </div>
                        <div className={cx(styles.inputs, "mt-3")}>
                            <span className={styles.label}>confirm password</span><br />
                            <input
                                name="confirmPassword"
                                className={cx(styles.inputField, this.state.samePassword && this.state.showError ? styles.warning : null,!this.state.enableInput ? styles.disableInput : null)}
                                type="password"
                                placeholder="re-enter password"
                                onChange={(event) => this.handleInputChange(event, 'confirmPassword')}
                                value={this.state.formData.confirmPassword}
                                disabled={!this.state.enableInput}
                                onBlur={() => this.handleShowError()}
                            />

                        </div>
                        <div className={styles.AlignButton}>
                            <button
                                onClick={(event) => this.handleNext(event)}
                                disabled={!this.state.enableNext}
                                className={cx(this.state.enableNext ? styles.buttonNextEnable : styles.buttonNextDisable,
                                    styles.buttonNext)}>
                                <span className={styles.nextText}>change password</span>
                                <img src={arrow} alt="arrow" className={styles.arrow} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        postResetDataState: state.user.resetPassword.postResetDataState,
        responseData: state.user.resetPassword.responseData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onPostData: (data) => dispatch(actions.postData(data)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));