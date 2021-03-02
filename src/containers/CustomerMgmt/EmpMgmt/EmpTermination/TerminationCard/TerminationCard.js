/* eslint-disable no-lonely-if */
/* eslint-disable padded-blocks */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable eol-last */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-spaces */
/* eslint-disable react/no-unused-state */
/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable brace-style */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable space-before-blocks */
/* eslint-disable keyword-spacing */
/* eslint-disable prefer-const */
/* eslint-disable no-trailing-spaces */
/* eslint-disable lines-between-class-members */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable indent */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Datepicker } from 'react-crux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import cx from 'classnames';
import styles from './TerminationCard.module.scss';
import * as fieldData from './TerminationCardInitData';
import FormConfig from './TerminationCardFormConfig';
import { validation, message } from './TerminationCardValidations';

import * as actions from '../Store/action';

import RadioButtonGroup from '../../../../../components/Organism/RadioButtonGroup/RadioButtonGroup';
import BoxRadioButton from '../../../../../components/Molecule/BoxRadioButton/BoxRadioButton';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import defaultPic from '../../../../../assets/icons/defaultPic.svg';
import warningIcon from '../../../../../assets/icons/warningRedTriangle.svg';
import closePage from '../../../../../assets/icons/closePage.svg';

class TerminationCard extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            formData: _.cloneDeep(fieldData.InitData),
            selectedReason: _.cloneDeep(FormConfig.notifiedSuperiors.options),
            terminateToggleState: false,
            enableSubmit: false,
            orgId: '',
            errors: {},
            deployedOrgsList: [],
            // deployedOrgsIds: [],
        }
    }
    componentDidMount = () => {
        let updatedFormData = _.cloneDeep(this.state.formData);

        if(this.props.bulkAction){
            updatedFormData.empIds = _.cloneDeep(this.props.selectedEmployees);
        }else{
            updatedFormData.entityList = [this.props.entityData.uuid];
        }

        const { match, entityData } = this.props;
        const orgId = match.params.uuid;

        // get deployed org_names list
        let deployedOrgsList = [];
        // let deployedOrgsIds = [];
        if (!_.isEmpty(this.props.employeeList) && !_.isEmpty(this.props.selectedEmployees)) {
            this.props.employeeList.forEach((eachEmp) => {
                if (!_.isEmpty(eachEmp) && this.props.selectedEmployees.includes(eachEmp.uuid)
                    && eachEmp.deployedTo && !_.isEmpty(eachEmp.deployedTo[0])) {
                    if (eachEmp.deployedTo[0].clientName && !deployedOrgsList.includes(eachEmp.deployedTo[0].clientName)) {
                        deployedOrgsList.push(eachEmp.deployedTo[0].clientName);
                    }
                    if (eachEmp.deployedTo[0].superClientName && !deployedOrgsList.includes(eachEmp.deployedTo[0].superClientName)) {
                        deployedOrgsList.push(eachEmp.deployedTo[0].superClientName);
                    }
                    // if (eachEmp.deployedTo[0].client && !deployedOrgsIds.includes(eachEmp.deployedTo[0].client)) {
                    //     deployedOrgsIds.push(eachEmp.deployedTo[0].client);
                    // }
                    // if (eachEmp.deployedTo[0].superClient && !deployedOrgsIds.includes(eachEmp.deployedTo[0].superClient)) {
                    //     deployedOrgsIds.push(eachEmp.deployedTo[0].superClient);
                    // }
                }
            })
        } else if (!_.isEmpty(entityData)) {
            if (entityData.deployedTo && !_.isEmpty(entityData.deployedTo[0])) {
                if (entityData.deployedTo[0].clientName) {
                    deployedOrgsList.push(entityData.deployedTo[0].clientName);
                }
                if (entityData.deployedTo[0].superClientName) {
                    deployedOrgsList.push(entityData.deployedTo[0].superClientName);
                }
                // if (entityData.deployedTo[0].client) {
                //     deployedOrgsIds.push(entityData.deployedTo[0].client);
                // }
                // if (entityData.deployedTo[0].superClient) {
                //     deployedOrgsIds.push(entityData.deployedTo[0].superClient);
                // }
            }
        }

        this.setState({
            formData: updatedFormData,
            orgId: orgId,
            deployedOrgsList,
            // deployedOrgsIds,
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.formData.terminationType !== prevState.formData.terminationType) {

            let updatedSelectOptions = '';
            if (this.state.formData.terminationType === 'NOTIFIED_SUPERIORS') {
                updatedSelectOptions = _.cloneDeep(FormConfig.notifiedSuperiors.options);
            }
            else if (this.state.formData.terminationType === 'ABSCONDED') {
                updatedSelectOptions = _.cloneDeep(FormConfig.absconded.options);
            }
            else if (this.state.formData.terminationType === 'TERMINATED') {
                updatedSelectOptions = _.cloneDeep(FormConfig.terminated.options)
            }
            this.setState({ selectedReason: updatedSelectOptions })
        }
        if (!_.isEqual(this.state.formData, prevState.formData) || !_.isEqual(this.state.errors, prevState.errors)) {
            let enableSubmit = this.handleEnableSubmit(this.state.formData);
            this.setState({ enableSubmit: enableSubmit })
        }
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true;
        let fieldExist = true;
        const requiredFields = fieldData.RequiredFields;
        _.forEach(formData, function (value, key) {
            if (requiredFields.includes(key)) {
                if (_.isEmpty(value)) {
                    fieldExist = false;
                }
            }
            enableSubmit = fieldExist && enableSubmit;
        })

        return (enableSubmit && _.isEmpty(this.state.errors));
    }

    handleYesButton = () => {
        const {
            entityData, location, bulkAction, bulkEntityTerminate, selectAll,
            entityTerminate, toggle, contractorData,
        } = this.props;
        const { formData, orgId } = this.state;

        if (bulkAction) {
            let searchParams = new URLSearchParams(location.search.toString());
            searchParams.delete("pageNumber");
            searchParams = searchParams.toString();
            const updatedPayload = { ...formData, clientIds: [] };
            bulkEntityTerminate(orgId, searchParams, selectAll, updatedPayload);
        } else if (!_.isEmpty(entityData)) {
            const ids = !_.isEmpty(contractorData) ? [contractorData.orgId] : [];
            const updatedPayload = { ...formData, clientIds: ids };
            entityTerminate(orgId, updatedPayload);
        }
        toggle(false);
    }

    handleInputChange = (event, inputIdentifier, optionIndex = null) => {
        let toggle = this.state.terminateToggleState;

        let updatedFormData = _.cloneDeep(this.state.formData);
        let updatedSelectedReason = _.cloneDeep(this.state.selectedReason);
        if (inputIdentifier === 'terminationReason') {
            _.forEach(updatedSelectedReason, function (value, index) {
                if (optionIndex === index) {
                    value.isSelected = true;

                    updatedFormData[inputIdentifier] = value.value
                }
                else {
                    value.isSelected = false
                }
            })
        }

        if (inputIdentifier === 'terminationDate') {
            updatedFormData[inputIdentifier] = event;
        }

        if (inputIdentifier === 'terminationType') {
            updatedFormData['terminationType'] = event;
            updatedFormData['terminationReason'] = '';
        }
        if (toggle === true) {
            toggle = false
        }
        const enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({
            formData: updatedFormData,
            selectedReason: updatedSelectedReason,
            noEdit: false,
            terminateToggleState: toggle,
            enableSubmit: enableSubmit
        });
    };

    terminatePopToggle = () => {
        let currentToggleState = this.state.terminateToggleState;
        this.setState({ terminateToggleState: !currentToggleState });
    }

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        } else {
            delete updatedErrors[inputField]
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };

    render() {
        const {
            t, entityData, deployedEmpCount, images,
        } = this.props;
        const { deployedOrgsList } = this.state;

        let empName = this.props.bulkAction ? 
            this.props.selectAll ? this.props.totalEmployeeCount + ' employee(s)' : this.props.selectedEmployees.length + ' employee(s)'
            :
            !_.isEmpty(entityData) ? (entityData.firstName + " " + (!_.isEmpty(entityData.lastName) ?  entityData.lastName : ''))
            :  null

        let terminateConfirm =
            <div className={styles.terminationPopup}>
                <label className={styles.terminatePopLabel}>
                    {t('translation_empTermination:terminationCardTexts_empTermination.terminateConfirm')}
                    {' '}
                    {empName}
                    {' '}
                    {t('translation_empTermination:terminationCardTexts_empTermination.from')}
                    {' '}
                    <span className={styles.boldText}>
                        my org
                        {!_.isEmpty(deployedOrgsList) ? ', ' + deployedOrgsList.join(', ') : null}
                    </span>
                    ?
                </label>
                <div className='row no-gutters'>
                    <Button
                        type='noButton'
                        label={t('translation_empTermination:terminateCardButtons.no')}
                        clickHandler={this.terminatePopToggle}
                    //  isDisabled={_.isEmpty(this.state.errors)}
                    />
                    <Button
                        type='yesButton'
                        label={t('translation_empTermination:terminateCardButtons.yes')}
                        clickHandler={this.handleYesButton}
                    // isDisabled={_.isEmpty(this.state.errors)}
                    />
                </div>
            </div>

const empCount = this.props.selectAll ? this.props.totalEmployeeCount : this.props.selectedEmployees ? this.props.selectedEmployees.length : 0;
const profilePics = []; const empIds = [];
if(!_.isEmpty(this.props.employeeList)) {
this.props.employeeList.forEach((emp) => {
  if (this.props.selectedEmployees.includes(emp.uuid)) {
    profilePics.push(emp.profilePicUrl);
    empIds.push(emp.uuid);
  }
});
}

        return (
            <div className={cx('d-flex flex-column', styles.backdrop)} onClick={(event) => { event.stopPropagation(); }}>
                <div>
                    <img className={styles.closeStyle} src={closePage} onClick={() => this.props.toggle(true)} alt={t('translation_empTermination:image_alt_empTermination.close')} />
                </div>
                <div className={cx(styles.Container, styles.Label)}>
                    <div className={cx(styles.CardPadding, scrollStyle.scrollbar)}>
                        {!_.isEmpty(entityData) && !this.props.bulkAction ?
                                <div className={styles.EntityInfo}>
                                    <div className="d-flex flex-column pt-2">
              <div className="d-flex flex-row justify-content-center">
              <img className={styles.profilePicUrl} alt={t('translation_empTermination:image_alt_empTermination.img')}
                                            src={ 
                                                !_.isEmpty(this.props.entityProfilePic) ?
                                                this.props.entityProfilePic : defaultPic
                                            }
              />
              </div>

              <span className={cx('mt-3 mb-1', styles.mediumText)}>
                {t('translation_empTermination:terminationCardTexts_empTermination.terminating')}
                {empName} <br />
                <span className={cx('mb-1', styles.greyText)}>
                {t('translation_empTermination:terminationCardTexts_empTermination.info')}
              </span>
              </span>
            </div>
                                {!_.isEmpty(deployedOrgsList) ?
                                    <div className={cx('d-flex flex-row', styles.redBg)}>
                                        <img src={warningIcon} alt="" />
                                    &nbsp;
                                    &nbsp;
                                    <span className={styles.redWarning}>
                                        {empName} has already been deployed to organisations
                                        {' '}
                                        <span className={styles.redBoldText}>{deployedOrgsList.join(', ')}</span>
                                        {' '}
                                        terminating here would end deployment in those organisations also.
                                    </span>
                                    </div>
                                    : null}
                                    <div className={cx(styles.HorizontalLine)} />
                                </div>
                                
                            :
                            <div className={styles.EntityInfo}>
                                <div className="d-flex flex-column pt-2">
              <div className="d-flex flex-row justify-content-center">
                {profilePics.map((pic, index) => {
                  if (index < 5) {
                    return (
                      <span key={empIds[index]}>
                        <img
                          src={pic ? (images[empIds[index]]
                            ? images[empIds[index]].image : defaultPic) : defaultPic}
                          alt=""
                          className={cx('mr-2', styles.profilePicUrl)}
                        />
                      </span>
                    );
                  } return null;
                })}
                {empCount > 5
                  ? (
                    <span className={cx('align-self-center', styles.countcircle)}>
                      +
                      {empCount - 5}
                    </span>
                  ) : null}
              </div>
              <span className={cx('mt-3 mb-1', styles.mediumText)}>
                {t('translation_empTermination:terminationCardTexts_empTermination.terminating')}
                {empCount}
                &nbsp;{t('translation_empTermination:terminationCardTexts_empTermination.employees')} <br />
                <span className={cx('mb-1', styles.greyText)}>
                {t('translation_empTermination:terminationCardTexts_empTermination.info')}
              </span>
              </span>
            </div>
                                {!_.isEmpty(deployedOrgsList) ?
                                    <div className={cx('d-flex flex-row', styles.redBg)}>
                                        <img src={warningIcon} alt="" />
                                    &nbsp;
                                    &nbsp;
                                    <span className={styles.redWarning}>
                                            {this.props.selectAll ? (deployedEmpCount || 0) : this.props.selectedEmployees.length}
                                        {' '}
                                        employee(s) has already been deployed to different organisations.
                                        terminating here would end deployment in those organisations also.
                                    </span>
                                    </div>
                                    : null}
                                <div className={cx(styles.HorizontalLine)} />
                            </div>
                        }
                        <form>
                            <div className='row pl-1'>
                                <Datepicker
                                    name='terminationDate'
                                    label={t('translation_empTermination:label_terminationCard_empTermination.dateInput')}
                                    className='col-4'
                                    value={this.state.formData.terminationDate}
                                    onChange={(event) => this.handleInputChange(event, 'terminationDate')}
                                    required
                                    onError={(error) => this.handleError(error, 'terminationDate')}
                                    validation={validation['terminationDate']}
                                    message={message['terminationDate']}
                                    errors={this.state.errors['terminationDate']}
                                // onErrorCheck={(errorCheck) => this.handleCheckError(errorCheck)}
                                />
                            </div>
                            <div className='row pl-3 pt-3'>
                                <RadioButtonGroup
                                    className={cx("pl-2", styles.radioBtn)}
                                    label={t('translation_empTermination:label_terminationCard_empTermination.radioButton')}
                                    selectItems={this.props.staticTerminationData}
                                    value={this.state.formData.terminationType}
                                    disabled={false}
                                    required
                                    onSelectOption={(event) => this.handleInputChange(event, 'terminationType')}
                                    labelColor={styles.Label}
                                />

                            </div>
                            <div className='pt-3'>
                                {!_.isEmpty(this.state.formData.terminationType) ? <label className={styles.Label}>
                                    {t('translation_empTermination:terminationCardTexts_empTermination.reason')}&nbsp;
                                    <span className={styles.requiredStar}>*</span>
                                </label> : ''}
                                <div className={cx('d-flex flex-row flex-wrap justify-content-start')}>
                                    {(!_.isEmpty(this.state.selectedReason)) ?
                                        this.state.selectedReason.map((value, index) => {
                                            return (
                                                <BoxRadioButton
                                                    key={index}
                                                    label={value.value}
                                                    isSelected={value.isSelected}
                                                    value={value.value}
                                                    className={cx('mr-3 mb-3', styles.hoverDiv)}
                                                    changed={(event) => this.handleInputChange(event, 'terminationReason', index)}

                                                />

                                            );

                                        })
                                        : null}
                                </div>
                            </div>

                        </form>
                    </div>
                    {this.state.terminateToggleState ?
                        terminateConfirm
                        :
                        <div className={cx('d-flex flex-column-reverse', styles.terminatePadding)}>
                            <Button
                                type='medium'
                                label={t('translation_empTermination:infoCardButtons_empTermination.yesContinue')}
                                className={this.state.enableSubmit ? styles.terminateButtonActive : styles.terminateButtonDisable}
                                disabled={!this.state.enableSubmit}
                                clickHandler={this.state.enableSubmit ? this.terminatePopToggle : null}
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        terminationState: state.empMgmt.empTermination.entityTerminateState,
        terminateResponseData: state.empMgmt.empTermination.terminateResponseData,
        staticTerminationData: state.empMgmt.staticData.empMgmtStaticData["EMP_TERMINATION_OPTIONS"],
        images: state.imageStore.images,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        entityTerminate: (orgId, data) => dispatch(actions.terminateEntity(orgId, data)),
        bulkEntityTerminate: (orgId, targetUrl, selectAll, data) => dispatch(actions.bulkTerminateEntity(orgId, targetUrl, selectAll, data))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TerminationCard)));