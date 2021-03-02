import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './OrgOnboarding.module.scss';
import Modal from '../../../../components/Atom/Modal/Modal';
import closePage from '../../../../assets/icons/closePage.svg';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Button } from 'react-crux';
import panCard from '../../../../assets/icons/panCard.svg';
import cinCard from '../../../../assets/icons/cinCard.svg';
import tinCard from '../../../../assets/icons/tinCard.svg';
import llpinCard from '../../../../assets/icons/llpinCard.svg';
import gstCard from '../../../../assets/icons/gstCard.svg';
import idCard from '../../../../assets/icons/idCard.svg';
import * as actions from './Store/action';
import { withRouter } from "react-router";
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import Loader from '../../../../components/Organism/Loader/Loader';

class OrgOnboard extends Component {
    state = {
        idValue: '',
        idState: null,
        idImage: idCard,
        showModal: false,
        enableNext: false,
        focus: false
    }

    componentDidMount() {
        let idImage = idCard;
        if (this.props.idImage) {
            idImage = this.props.idImage
        }
        this.setState({
            idImage: idImage,
            showModal: this.props.showModal,
            idValue: this.props.idNo,
            idState: this.props.idState,
            enableNext: true
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.orgCheckState !== prevProps.orgCheckState && this.props.orgCheckState === 'SUCCESS') {
            let redirectUrl = '';
            if (_.isEmpty(this.props.orgData)) {
                redirectUrl = '/customer-mgmt/org/add';
            }
            else {
                redirectUrl = '/customer-mgmt/org/' + this.props.orgData.uuid + '/orgInfo'
            }
            this.props.history.push(redirectUrl)


        }

        if (prevState.showModal !== this.state.showModal) {
            if (!this.state.showModal) {
                this.props.initState();
            }
        }
        let idImage = idCard;
        if (prevProps.idNo !== this.props.idNo) {
            if (this.props.idImage) {
                idImage = this.props.idImage
            }
            this.setState({
                idImage: idImage,
                idValue: this.props.idNo,
                idState: this.props.idState,
                enableNext: true
            })
        }
    }

    handleButtonNext = (event) => {
        event.preventDefault();
        this.props.setId(this.state.idValue, this.state.idState, this.state.idImage)
        this.props.checkOrg(this.state.idValue);
    }

    onFocus = () => {
        this.setState({ focus: true })
    }

    onBlur = () => {
        this.setState({ focus: false })
    }


    handleInput = (event) => {
        let idState = null;
        let idImage = idCard;

        let pan = /^[a-zA-Z]{3}[PHABCGJLFT]{1}[a-zA-Z]{1}\d{4}[a-zA-Z]{1}$/;
        let gstin = /^\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}\d{1}[a-zA-Z]{1}\d{1}$/;
        let cin = /^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
        let llpin = /^[a-zA-Z]{3}\d{4}$/;
        let tan = /^[a-zA-Z]{4}\d{5}[a-zA-Z]{1}$/;

        let enableNext = false;
        if (pan.test(event.target.value)) {
            idState = 'PAN';
            idImage = panCard;
            enableNext = true;
        }
        else if (gstin.test(event.target.value)) {
            idState = 'GST';
            enableNext = true;
            idImage = gstCard;
        }
        else if (cin.test(event.target.value)) {
            idState = 'CIN';
            enableNext = true;
            idImage = cinCard;
        }
        else if (llpin.test(event.target.value)) {
            idState = 'LLPIN';
            enableNext = true;
            idImage = llpinCard;
        }
        else if (tan.test(event.target.value)) {
            idState = 'TAN';
            enableNext = true;
            idImage = tinCard;
        }

        this.setState({
            idValue: event.target.value.toUpperCase(),
            idState: idState,
            idImage: idImage,
            enableNext: enableNext,
            existMessage: ''
        });

    }

    toggleForm = () => {
        this.setState({
            showModal: !this.state.showModal,
            idValue: '',
            idImage: idCard,
            idState: null,
            enableNext: false,
            existMessage: ''
        });
    }

    render() {
        const { t } = this.props;
        return (
            <React.Fragment>
                <Modal show={this.state.showModal} className={styles.ModalPage} >
                    <div className={styles.ModalForm}>
                        <img onClick={this.toggleForm}
                            src={closePage} alt='' style={{ cursor: 'pointer' }}>
                        </img>
                        <br />

                        <img src={this.state.idImage} alt={t('translation_orgOnboarding:image_alt_orgOnboarding.IdImage')} className={styles.marginTop} />

                        <h4 className={"pt-4 mb-0"}>{t('translation_orgOnboarding:text.t1')}</h4>
                        <span><small></small>{t('translation_orgOnboarding:text.t2')}</span>
                        <form>
                            <div>
                                <div className={cx(this.state.focus ? styles.InputPlace : styles.InputPlaceBlur, "row col-5 mx-auto my-4")}>
                                    <input
                                        type='text'
                                        placeholder={t('translation_orgOnboarding:input_orgOnboarding.placeholder.enter')}
                                        value={this.state.idValue}
                                        onChange={(event) => this.handleInput(event)}
                                        className={cx(styles.InputText, "ml-1 px-6 row")}
                                        onFocus={this.onFocus}
                                        onBlur={this.onBlur}
                                    />
                                    <span className={this.state.idState ? cx(styles.InputId, "offset-10 mt-1") : null}>
                                        {this.state.idState}
                                    </span>

                                </div>
                                {/* {!_.isEmpty(this.state.existMessage)?
                                <div className='d-inline-block row'>
                                    <img src={warning} alt=''></img>
                                    <label className={styles.warningLabel}>{this.state.existMessage}</label>
                                </div> :''} */}
                                {/* <Link
                                    to={`org/add`} className={cx(styles.Headings)}>
                                        <div>
                                    <small onClick={() => this.props.initState()}><u>{t('translation_orgOnboarding:text.t3')}</u></small></div>
                                </Link> */}
                                {/* <br /> */}

                                {this.props.orgCheckState === 'LOADING' ?
                                    <React.Fragment>
                                        <div style={{ marginTop: '3rem', marginBottom: '0.5rem' }}>
                                            <Loader type='buttonLoader' />
                                        </div>
                                        <small className={cx(styles.Headings, "mt-1")}>{t('translation_orgOnboarding:text.t4')}<u> {t('translation_orgOnboarding:text.t5')}</u></small>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <Link
                                            to={this.state.enableNext ? `org/add` : '#'}
                                            onClick={e => e.preventDefault()}
                                        >
                                            <Button
                                                className='mt-4 mb-2'
                                                isDisabled={!this.state.enableNext}
                                                label={t('translation_orgOnboarding:button_orgOnboarding.next')}
                                                clickHandler={(event) => this.handleButtonNext(event)}
                                                type='largeWithArrow'>
                                            </Button>
                                        </Link>
                                        <br />
                                        <small className={cx(styles.Headings, "mt-1")}>{t('translation_orgOnboarding:text.t4')}<u> {t('translation_orgOnboarding:text.t5')}</u></small>
                                    </React.Fragment>
                                }


                            </div>
                        </form>

                    </div>
                </Modal>
                <Button clickHandler={this.toggleForm} type='add' label={this.props.buttonLabel} className={styles.Button} />

            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        idNo: state.orgMgmt.orgOnboard.idNo,
        idState: state.orgMgmt.orgOnboard.cardtype,
        idImage: state.orgMgmt.orgOnboard.idImage,
        orgCheckState: state.orgMgmt.orgOnboard.orgCheckState,
        orgData: state.orgMgmt.orgOnboard.orgData
    }
}
const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        setId: (idValue, idState, idImage) => dispatch(actions.orgSetId(idValue, idState, idImage)),
        checkOrg: (docNumber) => dispatch(actions.orgDuplicateCheck(docNumber)),

    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(withRouter(OrgOnboard)));
