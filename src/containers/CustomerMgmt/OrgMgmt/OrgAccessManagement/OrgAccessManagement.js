

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import cx from 'classnames';
import _ from 'lodash';
import styles from './OrgAccessManagement.module.scss';
import accessIcon from '../../../../assets/icons/accessManageIcon.svg';
import arrowDown from '../../../../assets/icons/form.svg';
import arrowUp from '../../../../assets/icons/formChecked.svg';
import { connect } from 'react-redux';
import { Button } from 'react-crux';
import TagSearch from "../../../TagSearch/TagSearchField/TagSearchField";
import * as actions from './Store/action'
import * as actionsOrgMgmt from '../OrgMgmtStore/action';
import Spinnerload from '../../../../components/Atom/Spinner/Spinner';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import deleteIcon from '../../../../assets/icons/deleteIcon.svg';
import img from '../../../../assets/icons/threeDotsActive.svg';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import alert from '../../../../assets/icons/deleteWarning.svg';
import warn from '../../../../assets/icons/warning.svg';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import Prompt from '../../../../components/Organism/Prompt/Prompt';
import { withTranslation } from 'react-i18next'
import themes from '../../../../theme.scss';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import TagIcon from '../../../../components/Atom/TagIcons/TagIcons';
// import { exists } from 'fs';
import Loader from '../../../../components/Organism/Loader/OrgAccessMgmtLoader/OrgAccessMgmtLoader';
import threeDots from '../../../../assets/icons/threeDots.svg';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Checkbox from '../../../../components/Atom/CheckBox/CheckBox';


class OrgAccessManagement extends Component {
    state = {
        currentOrg: null,
        permissionData: [],
        selectedBusinessFunctions: [],
        headerDropDown: false,
        openDrownIndex: -1,
        newTag: null,
        selectedTag: null,
        tagToBeSelected: null,
        selectedOrg: null,
        enableSubmit: false,
        showSaveButton: false,
        submitSuccess: false,
        selectedTagName: '',
        searchParam: '',
        orgList: [],
        dropdown: false,
        orgDropdown: false,
        cardIndex: -1,
        orgCardIndex: -1,
        handleMenuCard: false,
        handleOrgMenuCard: false,
        showOrgDeletePopUp: false,
        deleteOrgId: '',
        isEdited: false,
        deleteTagId: null,
        showTagDeletePopUp: false,
        showThreeDots: false,
        showOrgSearchList: false
    };

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        if (this.props.user.userGroup === "SUPER_ADMIN") {
            this.props.onGetPermissions();
        } else {
            this.props.onGetPermissions("ORG");
        }
        this.props.getEnabledPlatformServices(orgId);
        this.props.onGetOrgDetails(orgId);
        let arrOrgId = [];
        arrOrgId.push(orgId);
        this.props.onGetTagWithPolicy(orgId);

        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate = (prevProps, prevState) => {

        if (prevProps.getPolicyState !== this.props.getPolicyState) {
            if (this.props.getPolicyState === 'SUCCESS' && !_.isEmpty(this.state.selectedOrg)) {
                let policy = null;
                const selectedOrg = this.state.selectedOrg;
                let updatedOrgList = _.cloneDeep(this.state.orgList);
                let orgsWithPolicy = [];
                const thisRef = this;
                _.forEach(this.props.policyData, function (policyData) {
                    if (policyData.tagId === thisRef.state.selectedTag.uuid) {
                        _.forEach(policyData.org, function (orgs) {
                            if (_.isEqual(orgs.orgId, selectedOrg.uuid)) {
                                policy = orgs;
                            }
                            if (orgs.orgId && thisRef.state.currentOrg.uuid !== orgs.orgId) {
                                orgsWithPolicy.push(orgs.orgId);
                            }
                        })
                    }
                })
                if (policy)
                    this.handlePolicyToState(policy);
                if (orgsWithPolicy.length > 0) {
                    this.props.onGetListOfOrgs(orgsWithPolicy);
                }
                else {
                    if (updatedOrgList.length === 0) {
                        updatedOrgList = [this.state.currentOrg];
                    }
                }


                this.setState({
                    openDrownIndex: -1,
                    orgList: updatedOrgList
                })
            }
        }

        if (prevProps.updatePolicyByTagIdState !== this.props.updatePolicyByTagIdState) {
            if (this.props.updatePolicyByTagIdState === 'SUCCESS') {
                this.setState({
                    submitSuccess: true,
                    showSaveButton: true,
                    isEdited: false
                })
                setTimeout(() => {
                    this.setState({ submitSuccess: false })
                }, 2000);
                setTimeout(() => {
                    this.setState({ showSaveButton: false })
                }, 2000);
            }
        }
        if (prevProps.getOrgListState !== this.props.getOrgListState) {
            if (this.props.getOrgListState === 'SUCCESS') {
                const thisRef = this;
                let updatedOrgList = [this.state.currentOrg, ...this.props.orgList];
                _.forEach(thisRef.state.orgList, function (prevOrg) {
                    let newOrg = false;
                    _.forEach(updatedOrgList, function (org) {
                        if (prevOrg.uuid === org.uuid) {
                            newOrg = true;
                        }
                    })
                    if (!newOrg) {
                        updatedOrgList.push(prevOrg);
                    }
                })
                this.setState({
                    orgList: updatedOrgList
                })
            }
        }
        if (prevProps.getOrgDetailsState !== this.props.getOrgDetailsState) {
            if (this.props.getOrgDetailsState === 'SUCCESS') {
                this.setState({
                    currentOrg: this.props.orgDetails
                })
            }
        }
        if (prevState.selectedOrg !== this.state.selectedOrg) {
            const { match } = this.props;
            if (!_.isEmpty(this.state.selectedOrg) && !_.isEmpty(this.state.selectedTag)) {
                if (_.isEmpty(this.state.newTag) || this.state.newTag.uuid !== this.state.selectedTag.uuid) {
                    this.props.onGetPolicy(this.state.selectedTag.uuid, match.params.uuid);
                }
                this.props.getEnabledPlatformServices(this.state.selectedOrg.uuid);
                this.setState({
                    selectedBusinessFunctions: []
                })
            }
        }
        if (prevState.selectedTag !== this.state.selectedTag) {
            const { match } = this.props;
            if (_.isEmpty(this.state.newTag) || this.state.newTag.uuid !== this.state.selectedTag.uuid) {
                if (this.state.selectedTag !== null) {
                    this.props.onGetPolicy(this.state.selectedTag.uuid, match.params.uuid)
                    this.setState({
                        selectedOrg: this.state.currentOrg,
                        orgList: [],
                        isEdited: false,
                        searchParam: ''
                    })
                }
                this.props.onClearSearch();
            }
        }
        if (prevState.newTag !== this.state.newTag) {
            if (!_.isEmpty(this.state.newTag)) {
                let updatedOrgList = [this.props.orgDetails];

                this.setState({
                    orgList: updatedOrgList,
                    selectedOrg: this.props.orgDetails,
                    selectedBusinessFunctions: []
                })
            }
        }
        if (this.props.postPolicyState !== prevProps.postPolicyState) {
            if (this.props.postPolicyState === 'SUCCESS') {
                const { match } = this.props;
                const orgId = match.params.uuid;
                let arrOrgId = [];
                arrOrgId.push(orgId);
                this.props.onGetTagWithPolicy(orgId);
                this.setState({
                    newTag: null,
                    submitSuccess: true,
                    showSaveButton: true,
                    isEdited: false
                })
                setTimeout(() => {
                    this.setState({ submitSuccess: false })
                }, 2000);
                setTimeout(() => {
                    this.setState({ showSaveButton: false })
                }, 2000);
            }
        }

        if (prevProps.deletePolicyState !== this.props.deletePolicyState) {
            if (this.props.deletePolicyState === 'SUCCESS') {
                this.setState({
                    submitSuccess: true,
                    showSaveButton: true,
                })
                setTimeout(() => {
                    this.setState({ submitSuccess: false })
                }, 2000);
                setTimeout(() => {
                    this.setState({ showSaveButton: false })
                }, 2000);


            }
        }

        if (prevProps.deleteOrgPolicyState !== this.props.deleteOrgPolicyState) {
            if (this.props.deleteOrgPolicyState === 'SUCCESS') {
                let updatedOrgList = this.state.orgList.filter(org => {
                    if (org.uuid === this.props.deletedOrgId) return null;
                    else return org;
                })

                this.setState({
                    orgList: updatedOrgList
                })
            }
        }
        if (prevProps.updateTagAccessState !== this.props.updateTagAccessState) {
            if (this.props.updateTagAccessState === 'SUCCESS') {
                const { match } = this.props;
                const orgId = match.params.uuid;
                let arrOrgId = [];
                arrOrgId.push(orgId);
                this.props.onGetTagWithPolicy(orgId);
            }
        }
        if (prevProps.searchListState !== this.props.searchListState && this.props.searchListState === "SUCCESS") {
            if (!_.isEmpty(this.props.searchList)) {
                this.setState({ showOrgSearchList: true })
            }
        }
    }

    handleOrgSearchInput = (event) => {
        const updatedSearchParam = _.trimStart(event.target.value);
        if (!_.isEmpty(this.props.searchList)) {
            document.addEventListener('click', this.handleOutsideClick, false);
        }
        else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        if (updatedSearchParam.length > 0) {
            this.props.onSearchOrgList(event.target.value);
        }
        else if (updatedSearchParam.length === 0) {
            this.props.onClearSearch();
        }
        this.setState({
            searchParam: updatedSearchParam,
        });
    }

    handleOutsideClick = (e) => {
        if (!_.isEmpty(this.node)) {
            if (this.node.contains(e.target)) {
                return;
            }
            if (this.state.showOrgSearchList)
                this.setState({ showOrgSearchList: false })
        }
    }

    handlePolicyToState = (policyData) => {
        let selectedBusinessFunctions = [...policyData.businessFunctions];
        this.setState({
            selectedBusinessFunctions: selectedBusinessFunctions
        })
    }

    // handleApplyBusinessRules = (updatedBusinessFunctions, targetFunction) => {
    //     if (_.includes(updatedBusinessFunctions, "ORG:LIST") || _.includes(updatedBusinessFunctions, "OPS:TASK")) {
    //         if (targetFunction === "ORG_PROFILE:VIEW") {
    //             updatedBusinessFunctions = updatedBusinessFunctions.filter(businessFunction => {
    //                 if (businessFunction === "ORG:LIST" || businessFunction === "OPS:TASK") return null;
    //                 else return businessFunction;
    //             })
    //         }
    //         else {
    //             updatedBusinessFunctions = updatedBusinessFunctions.filter(businessFunction => {
    //                 if (businessFunction === "ORG_PROFILE:VIEW") return null;
    //                 else return businessFunction;
    //             })
    //         }
    //     }
    //     else if (_.includes(updatedBusinessFunctions, "ORG_PROFILE:VIEW")) {
    //         if (targetFunction === "ORG:LIST" || targetFunction === "OPS:TASK") {
    //             updatedBusinessFunctions = updatedBusinessFunctions.filter(businessFunction => {
    //                 if (businessFunction === "ORG_PROFILE:VIEW") return null;
    //                 else return businessFunction;
    //             })
    //         }
    //         else {
    //             updatedBusinessFunctions = updatedBusinessFunctions.filter(businessFunction => {
    //                 if (businessFunction === "ORG:LIST" || businessFunction === "OPS:TASK") return null;
    //                 else return businessFunction;
    //             })
    //         }
    //     }
    //     return updatedBusinessFunctions;
    // }

    handleSelectAll = (permissionIndex, selectAll) => {
        let updatedBusinessFunctions = _.cloneDeep(this.state.selectedBusinessFunctions);
        const thisRef = this;
        _.forEach(thisRef.props.permissionData[permissionIndex].modules, function (policymodule) {
            _.forEach(policymodule.businessFunctions, function (businessFunction) {
                if (selectAll && _.includes(thisRef.state.selectedBusinessFunctions, businessFunction.businessFunction)) {
                    updatedBusinessFunctions = updatedBusinessFunctions.filter(selectedFunction => {
                        if (selectedFunction === businessFunction.businessFunction) return null;
                        else return selectedFunction
                    })
                }
                else if (!_.includes(thisRef.state.selectedBusinessFunctions, businessFunction.businessFunction)) {
                    updatedBusinessFunctions = [businessFunction.businessFunction, ...updatedBusinessFunctions]
                }
            })
        })
        // updatedBusinessFunctions = this.handleApplyBusinessRules(updatedBusinessFunctions);
        let enableSubmit = this.state.selectedTag !== null;
        if (updatedBusinessFunctions.length === 0) {
            enableSubmit = false;
        }
        this.setState({
            selectedBusinessFunctions: updatedBusinessFunctions,
            isEdited: true,
            enableSubmit: enableSubmit
        })
    }

    handleToggleCheckBox = (permissionIndex, businessFunction, selectAll) => {
        if (!businessFunction) {
            this.handleSelectAll(permissionIndex, selectAll)
        }
        else {
            let updatedBusinessFunctions = _.cloneDeep(this.state.selectedBusinessFunctions);
            if (_.includes(updatedBusinessFunctions, businessFunction)) {
                updatedBusinessFunctions = updatedBusinessFunctions.filter(selectedFunction => {
                    if (selectedFunction === businessFunction) return null;
                    else return selectedFunction
                })
            }
            else {
                updatedBusinessFunctions = [businessFunction, ...updatedBusinessFunctions]
            }

            // updatedBusinessFunctions = this.handleApplyBusinessRules(updatedBusinessFunctions, businessFunction);
            let enableSubmit = this.state.selectedTag !== null;
            if (updatedBusinessFunctions.length === 0) {
                enableSubmit = false;
            }

            this.setState({
                selectedBusinessFunctions: updatedBusinessFunctions,
                isEdited: true,
                enableSubmit: enableSubmit
            })
        }
    }

    handleShowSelectAll = (permissionIndex) => {
        let selectAll = false;
        let selectedBusinessFunctions = 0;
        let totalBusinessFunctions = 0;
        const thisRef = this;
        _.forEach(thisRef.props.permissionData[permissionIndex].modules, function (policymodule) {
            totalBusinessFunctions = totalBusinessFunctions + policymodule.businessFunctions.length
            _.forEach(policymodule.businessFunctions, function (businessFunction) {
                if (_.includes(thisRef.state.selectedBusinessFunctions, businessFunction.businessFunction)) {
                    selectedBusinessFunctions = selectedBusinessFunctions + 1;
                }
            })
        })
        if (selectedBusinessFunctions === totalBusinessFunctions) {
            selectAll = true;
        }
        return selectAll;
    }

    handleDropDown = (index, bool) => {
        this.setState({
            headerDropDown: bool,
            openDrownIndex: index
        })
    }

    handleDeleteDropdownTag = (showCard, index) => {
        this.setState({ dropdown: showCard, cardIndex: index, handleMenuCard: true })
    }
    handleDeleteDropdown = (showCard, index) => {
        this.setState({ orgDropdown: showCard, orgCardIndex: index })
    }
    handleFormSubmit = () => {
        const thisRef = this;
        let exists = false;
        _.forEach(this.props.configuredTags, function (item) {

            if (_.isEqual(item.uuid, thisRef.state.selectedTag.uuid)) {
                exists = true;
            }
        });
        if (_.isEqual(exists, true)) {
            // const { match } = this.props;
            // const orgId = match.params.uuid;
            let orgExists = false;
            let payload = null;
            _.forEach(this.props.policyData, function (item, index) {
                if (_.isEqual(item.tagId, thisRef.state.selectedTag.uuid)) {
                    payload = _.cloneDeep(thisRef.props.policyData[index]);

                }
            })
            _.forEach(payload.org, function (item, index) {
                if (_.isEqual(item.orgId, thisRef.state.selectedOrg.uuid)) {
                    orgExists = true;
                    payload.org[index] = { orgId: thisRef.state.selectedOrg.uuid, businessFunctions: thisRef.state.selectedBusinessFunctions };
                }

            })
            if (!orgExists) {
                let newPolicyData = {
                    "orgId": this.state.selectedOrg.uuid,
                    "businessFunctions": this.state.selectedBusinessFunctions
                };
                payload.org.push(newPolicyData);

            }
            this.props.onPutPolicyByTagId(payload, payload._id);
        }
        else {
            const { match } = this.props;
            const orgId = match.params.uuid;
            let payload = {
                tagId: this.state.selectedTag.uuid,
                org: [{ orgId: this.state.selectedOrg.uuid, businessFunctions: this.state.selectedBusinessFunctions }],
                scope: 'org',
                orgId: orgId
            }
            // const thisRef = this;

            this.props.onPostPolicy(payload, this.state.selectedTag, orgId, this.state.newTag.category);
        }

    }

    handleCloseSuccessNotification = () => {
        this.setState({ submitSuccess: false });
    };

    handleDisplayPolicies = () => {
        const thisRef = this;
        let selectedTag = _.cloneDeep(this.state.tagToBeSelected);
        let newTag = _.cloneDeep(this.state.tagToBeSelected);
        _.forEach(this.props.configuredTags, function (tag) {
            if (newTag !== null && tag.uuid === thisRef.state.tagToBeSelected.uuid) {
                selectedTag = tag;
                newTag = null
            }
        })
        this.setState({
            selectedTag: selectedTag,
            newTag: newTag,
            tagToBeSelected: null,
            showTagChangePopUp: false,
            isEdited: false
        })
    }

    handleChangeTagPopup = (event, show, targetTag) => {
        if (event) {
            event.preventDefault();
        }
        if (this.state.isEdited) {
            this.setState({
                showTagChangePopUp: show,
                tagToBeSelected: (targetTag ? (targetTag.value ? targetTag.value : targetTag) : null)
            })
        }
        else {
            if (targetTag.value) {
                let selectedTag = null;
                let newTag = null;
                let enableSubmit = this.state.selectedBusinessFunctions.length !== 0;
                newTag = targetTag.value;
                selectedTag = targetTag.value;
                _.forEach(this.props.configuredTags, function (tag) {
                    if (newTag !== null && tag.uuid === newTag.uuid) {
                        selectedTag = tag;
                        newTag = null
                    }
                })
                this.setState({
                    newTag: newTag,
                    selectedTag: selectedTag,
                    enableSubmit: enableSubmit
                })
            }
            else {
                this.setState({
                    selectedTag: targetTag,
                    newTag: null
                })
            }
        }
    }

    handleOrgAdd = (org) => {
        let updatedOrgList = _.cloneDeep(this.state.orgList);
        updatedOrgList.push(org);

        this.setState({
            selectedOrg: org,
            orgList: updatedOrgList,
            searchParam: ''
        })
        this.props.onClearSearch();
    }

    handleOrgSelect = (targetIndex) => {
        const selectedOrg = _.cloneDeep(this.state.orgList[targetIndex]);
        this.setState({
            selectedOrg: selectedOrg,
            isEdited: false
        })
    }
    handleDeleteTag = () => {
        let deleteTagId = this.state.deleteTagId;
        const { match } = this.props;
        let orgId = match.params.uuid;
        this.props.deletePolicy(deleteTagId, orgId);
        this.setState({ showTagDeletePopUp: !this.state.showTagDeletePopUp })
    }
    handleDeleteOrg = () => {
        let thisRef = this;
        let updatedOrgList = _.cloneDeep(this.state.orgList);
        let deleteOrgId = this.state.deleteOrgId;
        let callApi = false;
        // let deleteIndex = null;
        // let policyId = null;
        let payload = null;
        _.forEach(this.props.policyData, function (item, index) {
            if (_.isEqual(item.tagId, thisRef.state.selectedTag.uuid)) {
                payload = _.cloneDeep(thisRef.props.policyData[index]);
                _.forEach(item.org, function (orgs, indexDelete) {

                    if (_.isEqual(orgs.orgId, deleteOrgId)) {
                        payload.org.splice(indexDelete, 1);
                        callApi = true;
                    }
                })
            }
        })
        if (callApi) {
            this.props.onPutPolicyByTagId(payload, payload._id);
        }
        updatedOrgList = updatedOrgList.filter(function (item) {
            return deleteOrgId !== item.uuid;
        })

        this.setState({
            orgList: updatedOrgList,
            showOrgDeletePopUp: false,
            deleteOrgId: null
        })

    }
    handleTogglePopUpTag = (event, tagId) => {
        event.preventDefault();
        this.setState({
            showTagDeletePopUp: !this.state.showTagDeletePopUp,
            deleteTagId: tagId
        })
    }
    handleTogglePopUp = (event, orgId) => {
        event.preventDefault();
        this.setState({
            showOrgDeletePopUp: !this.state.showOrgDeletePopUp,
            deleteOrgId: orgId
        })
    }

    componentWillUnmount() {
        this.props.onInitState();
    }

    shortenTagName = (tagName, label) => {
        if (label) {
            if (tagName.length > 18) {
                const updatedTagName = tagName.substring(0, 18) + '...';
                return (updatedTagName);
            }
            return (tagName);
        }
        else {
            if (tagName.length > 8) {
                const updatedTagName = tagName.substring(0, 8) + '...';
                return (updatedTagName);
            }
            return (tagName);
        }

    }

    toggleDots = (boolean, index) => {
        this.setState({ showThreeDots: boolean, cardIndex: index })
    }

    render() {
        let thisRef = this;
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        let userPolicy = null;
        let userGroup = null;
        if (!_.isEmpty(this.props.user.userGroup))
            userGroup = this.props.user.userGroup;

        if ((_.isEmpty(userGroup) || (!_.isEmpty(userGroup && userGroup !== "SUPER_ADMIN")))
            && !_.isEmpty(this.props.userPolicies) && this.props.userPolicies.length > 0) {
            this.props.userPolicies.forEach(function (eachPolicy, index) {
                if (_.isEqual(eachPolicy.orgId, orgId)) {
                    userPolicy = eachPolicy.businessFunctions;
                }
            });
        }



        let enabledServices = [];
        let enabledProducts = [];
        let enabledPlatformServices = [];
        let permissionCheckSaveUpdate = false;

        if (this.props.enabledServices !== undefined) {
            if (this.props.enabledServices.products !== undefined) {
                enabledProducts = this.props.enabledServices.products.map((product, index) => {
                    return product.product
                })
            }

            
            if (this.props.enabledServices.services !== undefined) {
                enabledServices = this.props.enabledServices.services.map((service, index) => {
                    return service.service
                })
            }
            if (this.props.enabledServices.platformServices !== undefined) {
                enabledPlatformServices = this.props.enabledServices.platformServices.map((service, index) => {
                    return service.platformService
                })
            }
        }
        const enabledServiceArray = [...enabledServices, ...enabledProducts, ...enabledPlatformServices, 'PLATFORM', 'ONBOARD']

        let NotificationPan =
            (this.props.error) ?
                <div className={(this.props.error) ?
                    cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                    <ErrorNotification error={this.props.error} />
                </div>
                :
                (this.state.submitSuccess) ?
                    <div className={this.state.submitSuccess ? cx(styles.ShowSuccessNotificationCard, 'flex align-items-center') : cx(styles.HideSuccessNotificationCard)}>
                        <SuccessNotification clicked={this.handleCloseSuccessNotification} />
                    </div>
                    :
                    <div className={styles.emptyNotification}></div>

        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                    navigate={path => this.props.history.push(path)}
                />

                {this.props.getPermissionState === 'LOADING' || this.props.getOrgDetailsState === 'LOADING' ?
                    <div className={cx("mt-5", styles.alignCenter, scrollStyle.scrollbar)}><Loader /></div>
                    :
                    <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
                        {!_.isEmpty(this.props.orgData) ?
                            <ArrowLink
                                label={this.props.orgData.name.toLowerCase()}
                                url={`/customer-mgmt/org/${this.props.orgData.uuid}/profile`}

                            />
                            : null
                        }
                        <div className='d-flex'>
                            <div className={cx("col-12 px-0 mb-3")}>

                                <CardHeader label={t('translation_orgAccessManagement:cardHeader')} iconSrc={accessIcon} />

                                <div className={cx(styles.SearchBar, 'card ')}>
                                    {NotificationPan}
                                    <HasAccess
                                        permission={["ORG_ACCESS_MGMT:CREATE"]}
                                        orgId={orgId}
                                        yes={() => <div className={cx(styles.CardPadding, 'ml-0')}>

                                            <TagSearch
                                                name="role"
                                                noBorder
                                                placeholder={t('translation_orgAccessManagement:tag_orgAccessManagement.placeholder.role')}
                                                orgId={orgId}
                                                updateTag={(value) => this.handleChangeTagPopup(null, true, value)}
                                            />
                                            <div className={cx(styles.HorizontalLine, 'mt-1')} />
                                        </div>
                                        }
                                    />


                                    <div className='row no-gutters col-12 px-0'>
                                        <div className={cx(styles.VerticalDivider, scrollStyle.scrollbar, 'col-3')}>

                                            <div className={cx('ml-4 mt-1 pb-2')}>
                                                {this.state.newTag ?

                                                    <React.Fragment>
                                                        <span className={cx(styles.TagListHeading)}>{t('translation_orgAccessManagement:newTags')}</span>
                                                        <div className={cx(styles.SearchCard, styles.Selected, 'mt-0 mb-1')}
                                                        >
                                                            <TagIcon
                                                                hasAccess={this.state.newTag.hasAccess}
                                                                category={this.state.newTag.category}
                                                            />
                                                            <div className={styles.animContainer}
                                                            >
                                                                <span className={cx(styles.searchCardLabel, 'text-nowrap pl-2')}>{this.state.newTag.name}</span></div>
                                                        </div>
                                                        <div className={cx(styles.HorizontalLine, 'mt-3')} />

                                                    </React.Fragment>
                                                    : null
                                                }
                                                <span className={cx(styles.TagListHeading)}>{t('translation_orgAccessManagement:tagList')}</span>
                                                {this.props.configuredTags ? this.props.configuredTags.map((tags, index) => {
                                                    return (
                                                        <div className={cx(this.state.selectedTag ? (tags.uuid === this.state.selectedTag.uuid ? styles.Selected : null) : null, styles.SearchCard)} key={index}
                                                            onClick={(event) => this.handleChangeTagPopup(event, true, tags)}
                                                            onMouseEnter={() => this.toggleDots(true, index)}
                                                            onMouseLeave={() => this.toggleDots(false, index)}
                                                        >
                                                            <TagIcon
                                                                hasAccess={tags.hasAccess}
                                                                category={tags.category}
                                                            />
                                                            <div className={(tags.name.length > 11) ? styles.animContainer : ""}>
                                                                <span className={cx(styles.searchCardLabel, 'text-nowrap pl-2')}>{tags.name}</span>
                                                            </div>




                                                            <HasAccess
                                                                permission={["ORG_ACCESS_MGMT:DELETE"]}
                                                                orgId={orgId}
                                                                yes={() => (
                                                                    <React.Fragment>
                                                                        {this.state.showThreeDots && this.state.cardIndex === index ?
                                                                            <div className={styles.ImgDiv}
                                                                                onMouseEnter={() => this.handleDeleteDropdownTag(true, index)}
                                                                                onMouseLeave={() => this.setState({ dropdown: false, cardIndex: -1, handleMenuCard: false })}
                                                                            >
                                                                                <img className={styles.threeDots} src={threeDots} alt='' />
                                                                            </div>
                                                                            : null}

                                                                        {this.state.handleMenuCard && index === this.state.cardIndex ?
                                                                            <div className={styles.tagDropDown}
                                                                                onMouseEnter={() => this.handleDeleteDropdownTag(true, index)}
                                                                                onMouseLeave={() => this.setState({ dropdown: false, cardIndex: -1, handleMenuCard: false })}>
                                                                                <ul className={styles.UnorderedList}>
                                                                                    <li
                                                                                        onClick={(event) => this.handleTogglePopUpTag(event, tags.uuid)}
                                                                                        className={styles.List}>
                                                                                        <img src={deleteIcon} alt={t('translation_orgAccessManagement:image_alt_orgAccessManagement.delete')} /> &nbsp;delete
                                                                                </li>
                                                                                </ul>
                                                                            </div>
                                                                            : null}
                                                                    </React.Fragment>
                                                                )}
                                                            />

                                                        </div>
                                                    )

                                                })
                                                    : null}

                                            </div>
                                        </div>

                                        {this.state.selectedTag !== null ?
                                            <React.Fragment>
                                                <div className={cx('col-9 pr-2')}>
                                                    <div className={styles.AlignHeading}>
                                                        <span className={styles.tagAccessHead}>{this.state.selectedTag ? this.state.selectedTag.name : null} {t('translation_orgAccessManagement:access')}</span>
                                                        {this.state.showSaveButton === true ?
                                                            <div className={cx(styles.SaveButtonAlign)}><Spinnerload type='success' /></div>
                                                            :
                                                            <React.Fragment>
                                                                {this.props.configuredTags.map(tag => {
                                                                    return (
                                                                        tag.uuid === thisRef.state.selectedTag.uuid ? permissionCheckSaveUpdate = true : null
                                                                    )

                                                                })

                                                                }
                                                                {
                                                                    permissionCheckSaveUpdate ?

                                                                        <HasAccess
                                                                            permission={["ORG_ACCESS_MGMT:EDIT"]}
                                                                            orgId={orgId}
                                                                            yes={() =>

                                                                                <Button
                                                                                    label={t('translation_orgAccessManagement:button_orgAccessManagement.Save')}
                                                                                    clickHandler={this.handleFormSubmit}
                                                                                    isDisabled={!(this.state.enableSubmit && this.state.isEdited)}
                                                                                    save
                                                                                    className={cx(styles.SaveButtonAlign, "mb-2")}
                                                                                />
                                                                            }
                                                                        />
                                                                        :
                                                                        <Button
                                                                            label={t('translation_orgAccessManagement:button_orgAccessManagement.Save')}
                                                                            clickHandler={this.handleFormSubmit}
                                                                            isDisabled={!(this.state.enableSubmit && this.state.isEdited)}
                                                                            save
                                                                            className={cx(styles.SaveButtonAlign, "mb-2")}
                                                                        />

                                                                }


                                                            </React.Fragment>


                                                        }
                                                    </div>
                                                    <HasAccess
                                                        permission='*'
                                                        orgId={orgId}
                                                        yes={() =>
                                                            <div className="ml-4" >
                                                                <div className={styles.searchBox} ref={node => { this.node = node; }}>
                                                                    <input type="text"
                                                                        placeholder={t('translation_orgAccessManagement:input_orgAccessManagement.placeholder.addOrg')}
                                                                        value={this.state.searchParam}
                                                                        className={cx(styles.searchBar)}
                                                                        onChange={(event) => this.handleOrgSearchInput(event)}
                                                                    />


                                                                    {!_.isEmpty(this.props.searchList) && this.state.showOrgSearchList ?
                                                                        <div className={cx(styles.orgSearchDrop, scrollStyle.scrollbar)}>
                                                                            {this.props.searchList.map((org, index) => {
                                                                                let showOrg = true;
                                                                                _.forEach(this.state.orgList, function (addedOrg) {
                                                                                    if (addedOrg.uuid === org.uuid) {
                                                                                        showOrg = false;
                                                                                    }
                                                                                })
                                                                                if (showOrg) {
                                                                                    return (
                                                                                        <div key={index} className={styles.OrgOption} onClick={() => this.handleOrgAdd(org)}>{org.legalName}

                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                return null;
                                                                            })}
                                                                        </div> : null}

                                                                </div> <br />
                                                                {this.state.orgList !== null ?
                                                                    this.state.orgList.map((org, index) => {
                                                                        return (
                                                                            <div className={cx(styles.FlagCard, this.state.selectedOrg.uuid === org.uuid ? styles.ActiveOrg : null)}
                                                                                onMouseEnter={() => this.handleDeleteDropdown(true, index)}
                                                                                onMouseLeave={() => this.setState({ orgDropdown: false, orgCardIndex: -1 })}
                                                                                onClick={() => this.handleOrgSelect(index)}
                                                                                key={index}
                                                                            >
                                                                                <span className={cx('ml-2', styles.TagText)}>{org.name}</span>
                                                                                {this.state.orgCardIndex === index && this.state.currentOrg.uuid !== org.uuid ?
                                                                                    <span className={cx(styles.EditButton)}
                                                                                        onMouseEnter={() => this.setState({ handleOrgMenuCard: true })}
                                                                                        onMouseLeave={() => this.setState({ handleOrgMenuCard: false })}
                                                                                    >
                                                                                        <img src={img} alt={t('translation_orgAccessManagement:image_alt_orgAccessManagement.img')} className={cx(styles.image)}
                                                                                        />
                                                                                        {
                                                                                            this.state.handleOrgMenuCard ?
                                                                                                <div className={styles.dropdown} >
                                                                                                    <ul className={styles.UnorderedList} >
                                                                                                        <li
                                                                                                            onClick={(event) => this.handleTogglePopUp(event, org.uuid)}
                                                                                                            className={styles.List}>
                                                                                                            <img src={deleteIcon} alt={t('translation_orgAccessManagement:image_alt_orgAccessManagement.delete')} /> &nbsp;delete
                                                                                                        </li>
                                                                                                    </ul>
                                                                                                </div>
                                                                                                :
                                                                                                null
                                                                                        }
                                                                                    </span>
                                                                                    :
                                                                                    <span style={{ paddingRight: '22px' }} />
                                                                                }
                                                                            </div>
                                                                        )
                                                                    })

                                                                    : null}
                                                                {this.state.orgList !== null ? <div className={styles.horizontalLine}></div> : null}
                                                            </div>
                                                        }
                                                    />
                                                    <div className={cx(styles.CardScroll, scrollStyle.scrollbar, "col-12")}>

                                                        <br />
                                                        {this.props.permissionData.map((permission, permissionIndex) => {
                                                            let userDefineModuleBusinessFunctions = [];
                                                            let hasServiceAccess = false;
                                                            if (enabledServiceArray.includes(permission.service)) {
                                                                permission.modules.forEach(function (eachModule, moduleIndex) {
                                                                    let moduleArray = [];
                                                                    eachModule.businessFunctions.forEach(function (eachBusinessFunction) {
                                                                        if (!_.isEmpty(userGroup) && userGroup === "SUPER_ADMIN") {
                                                                            moduleArray.push(eachBusinessFunction)
                                                                            hasServiceAccess = true;
                                                                        }
                                                                        else {
                                                                            if (_.includes(userPolicy, eachBusinessFunction.businessFunction)) {
                                                                                hasServiceAccess = true;
                                                                                moduleArray.push(eachBusinessFunction)
                                                                            }
                                                                        }

                                                                    })
                                                                    if (moduleArray.length > 0) {
                                                                        let moduleObj = {};
                                                                        moduleObj[eachModule.moduleLabel] = moduleArray;
                                                                        userDefineModuleBusinessFunctions.push(moduleObj);
                                                                    }
                                                                })
                                                            }
                                                            if (enabledServiceArray.includes(permission.service) && hasServiceAccess === true) {
                                                                const selectAll = this.handleShowSelectAll(permissionIndex);
                                                                return (
                                                                    <React.Fragment key={permissionIndex}>
                                                                        <div className={cx("mt-3")}>
                                                                            <div className='d-flex flex-row row ml-2' >
                                                                                <div className={permission.dropDown ? cx(styles.group7, "pr-0") : cx(styles.group8, "pr-0")}>
                                                                                    {this.state.headerDropDown && this.state.openDrownIndex === permissionIndex ?
                                                                                        <React.Fragment><img src={arrowUp} alt={t('translation_orgAccessManagement:image_alt_orgAccessManagement:upArrow')} onClick={() => this.handleDropDown(permissionIndex, false)} className={cx('mr-3 mb-1', styles.hoverPoint)} />
                                                                                            &nbsp;&nbsp;<span style={{ "color": themes.primaryLabel }}>{permission.serviceLabel}</span>
                                                                                        </React.Fragment>
                                                                                        :
                                                                                        <React.Fragment><img src={arrowDown} alt={t('translation_orgAccessManagement:image_alt_orgAccessManagement:downArrow')} onClick={() => this.handleDropDown(permissionIndex, true)} className={cx('mr-3 mb-1', styles.hoverPoint)} />
                                                                                            &nbsp;&nbsp;{permission.serviceLabel}
                                                                                        </React.Fragment>}

                                                                                </div>
                                                                                <div className={cx(styles.optionsContainer, "d-flex mt-1 mb-3")}>

                                                                                    <div className={cx(styles.options, styles.OptionsPadding)} style={{ position: "relative" }}>
                                                                                        {this.props.configuredTags.map(tag => {
                                                                                            return (
                                                                                                tag.uuid === thisRef.state.selectedTag.uuid ? permissionCheckSaveUpdate = true : null
                                                                                            )

                                                                                        })

                                                                                        }
                                                                                        {permissionCheckSaveUpdate ?
                                                                                            <HasAccess
                                                                                                permission={["ORG_ACCESS_MGMT:EDIT"]}
                                                                                                orgId={orgId}
                                                                                                yes={() => <Checkbox
                                                                                                    type='small'
                                                                                                    onChange={() => this.handleToggleCheckBox(permissionIndex, null, selectAll)}
                                                                                                    value={selectAll}
                                                                                                    className={cx(styles.hoverPoint)}
                                                                                                    label="all"
                                                                                                    checkMarkStyle={styles.checkMarkStyleAll}
                                                                                                />}
                                                                                                no={() => <Checkbox
                                                                                                    type='small'
                                                                                                    disabled
                                                                                                    onChange={() => this.handleToggleCheckBox(permissionIndex, null, selectAll)}
                                                                                                    value={selectAll}
                                                                                                    className={cx(styles.hoverPoint)}
                                                                                                    label="all"
                                                                                                    checkMarkStyle={styles.checkMarkStyleAll}
                                                                                                />
                                                                                                }
                                                                                            />
                                                                                            :
                                                                                            <Checkbox
                                                                                                type="small"
                                                                                                onChange={() => this.handleToggleCheckBox(permissionIndex, null, selectAll)}
                                                                                                value={selectAll}
                                                                                                className={cx(styles.hoverPoint)}
                                                                                                label="all"
                                                                                                checkMarkStyle={styles.checkMarkStyleAll}
                                                                                            />}
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            {this.state.headerDropDown && this.state.openDrownIndex === permissionIndex
                                                                                && !_.isEmpty(userDefineModuleBusinessFunctions) && userDefineModuleBusinessFunctions.length > 0 ?
                                                                                userDefineModuleBusinessFunctions.map((moduleData, serviceIndex) => {
                                                                                    let moduleKeyArray = Object.keys(moduleData);
                                                                                    let moduleKey = moduleKeyArray[0];
                                                                                    return (


                                                                                        <div key={serviceIndex} className=' row ml-2' id='toggle'>
                                                                                            {!_.isEmpty(moduleData) && moduleData[moduleKey].length > 0 ?
                                                                                                <React.Fragment>
                                                                                                    <div className={cx(styles.onCheck)}>
                                                                                                        <ol className={styles.a}><li className={cx(styles.toggleText, "text-nowrap")}> <span> • &nbsp;</span>
                                                                                                            <div className={cx(styles.tooltip, "ml-4")} >
                                                                                                                {this.shortenTagName(moduleKey, "label")}
                                                                                                                <span className={cx(styles.tooltiptext)}>{moduleKey}</span>
                                                                                                            </div></li></ol>
                                                                                                    </div>


                                                                                                    <div className={cx(styles.optionsContainer, "col-8 row mb-2")}>
                                                                                                        {moduleData[moduleKey].map((businessFunction, businessIndex) => {


                                                                                                            const isSelected = _.includes(this.state.selectedBusinessFunctions, businessFunction.businessFunction);
                                                                                                            return (
                                                                                                                <React.Fragment key={businessIndex}>

                                                                                                                    <span className={cx("col-3 mt-2 pr-0 text-nowrap")}>
                                                                                                                        {this.props.configuredTags.map(tag => {
                                                                                                                            return (
                                                                                                                                tag.uuid === thisRef.state.selectedTag.uuid ? permissionCheckSaveUpdate = true : null
                                                                                                                            )

                                                                                                                        })

                                                                                                                        }
                                                                                                                        {
                                                                                                                            permissionCheckSaveUpdate ?
                                                                                                                                <HasAccess
                                                                                                                                    permission={["ORG_ACCESS_MGMT:EDIT"]}
                                                                                                                                    orgId={orgId}
                                                                                                                                    yes={() =>
                                                                                                                                        <Checkbox
                                                                                                                                            type="small"
                                                                                                                                            onChange={() => this.handleToggleCheckBox(null, businessFunction.businessFunction)}
                                                                                                                                            value={isSelected}
                                                                                                                                            className={cx(styles.hoverPoint)}
                                                                                                                                            checkMarkStyle={styles.checkMarkStyle}
                                                                                                                                        />
                                                                                                                                        
                                                                                                                                    }
                                                                                                                                    no={() =>
                                                                                                                                        <Checkbox
                                                                                                                                            type="small"
                                                                                                                                            disabled
                                                                                                                                            onChange={() => this.handleToggleCheckBox(null, businessFunction.businessFunction)}
                                                                                                                                            value={isSelected}
                                                                                                                                            className={cx(styles.hoverPoint)}
                                                                                                                                            checkMarkStyle={styles.checkMarkStyle}
                                                                                                                                        />
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                :

                                                                                                                                <Checkbox
                                                                                                                                    type="small"
                                                                                                                                    onChange={() => this.handleToggleCheckBox(null, businessFunction.businessFunction)}
                                                                                                                                    value={isSelected}
                                                                                                                                    className={cx(styles.hoverPoint)}
                                                                                                                                    checkMarkStyle={styles.checkMarkStyle}
                                                                                                                                />
                                                                                                                        }
                                                                                                                        <div className={cx(styles.tooltip, "ml-4 ")} style={isSelected ? { "color": themes.primaryLabel } : null}>
                                                                                                                            {this.shortenTagName(businessFunction.functionLabel)}
                                                                                                                            <span className={cx(styles.tooltiptext)}>{businessFunction.functionLabel}</span>
                                                                                                                        </div>

                                                                                                                    </span>

                                                                                                                </React.Fragment>
                                                                                                            )
                                                                                                        })
                                                                                                        }

                                                                                                    </div>
                                                                                                </React.Fragment>
                                                                                                :
                                                                                                null
                                                                                            }

                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                : null}
                                                                            <div className={cx(styles.HorizontalLine, 'mt-3 mb-3')} />
                                                                        </div>
                                                                    </React.Fragment>
                                                                )
                                                            }
                                                            return null;
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </React.Fragment> : _.isEmpty(this.props.configuredTags) ? <div className={cx(styles.TagListHeading, "ml-4 mt-2")}>{t('translation_orgAccessManagement:select')}</div> : null}
                                    </div>
                                </div>
                            </div>

                            {this.state.showTagDeletePopUp ?
                                <WarningPopUp
                                    text={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.text')}
                                    para={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.para')}
                                    confirmText={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.confirmText')}
                                    cancelText={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.cancelText')}
                                    icon={warn}
                                    warningPopUp={() => this.handleDeleteTag()}
                                    closePopup={(event) => this.handleTogglePopUpTag(event)}
                                />
                                : null}
                            {this.state.showOrgDeletePopUp ?
                                <WarningPopUp
                                    text={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.text')}
                                    para={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.para')}
                                    confirmText={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.confirmText')}
                                    cancelText={t('translation_orgAccessManagement:warning_orgAccessManagement_delete.cancelText')}
                                    icon={warn}
                                    warningPopUp={() => this.handleDeleteOrg()}
                                    closePopup={(event) => this.handleTogglePopUp(event)}
                                />
                                : null}
                            {this.state.showTagChangePopUp ?
                                <WarningPopUp
                                    isAlert
                                    text={t('translation_orgAccessManagement:warning_orgAccessManagement_change.text')}
                                    para={t('translation_orgAccessManagement:warning_orgAccessManagement_change.para')}
                                    confirmText={t('translation_orgAccessManagement:warning_orgAccessManagement_change.confirmText')}
                                    cancelText={t('translation_orgAccessManagement:warning_orgAccessManagement_change.cancelText')}
                                    icon={alert}
                                    warningPopUp={() => this.handleDisplayPolicies()}
                                    closePopup={(event) => this.handleChangeTagPopup(event, false, null)}
                                />
                                : null}
                        </div>
                    </div>}

            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.auth.user,
        userPolicies: state.auth.policies,
        getOrgListState: state.orgMgmt.orgAccessData.getOrgListState,
        getOrgDetailsState: state.orgMgmt.orgAccessData.orgDetailsState,
        getPermissionState: state.orgMgmt.orgAccessData.getPermissionState,
        getPolicyState: state.orgMgmt.orgAccessData.getPolicyState,
        postPolicyState: state.orgMgmt.orgAccessData.postPolicyState,
        updatePolicyByTagIdState: state.orgMgmt.orgAccessData.updatePolicyByTagIdState,
        putPolicyState: state.orgMgmt.orgAccessData.putPolicyState,
        deleteOrgPolicyState: state.orgMgmt.orgAccessData.deleteOrgPolicyState,
        deletePolicyState: state.orgMgmt.orgAccessData.deletePolicyState,
        updateTagAccessState: state.orgMgmt.orgAccessData.updateTagAccessState,
        error: state.orgMgmt.orgAccessData.error,
        orgData: state.orgMgmt.staticData.orgData,
        orgList: state.orgMgmt.orgAccessData.orgList,
        orgDetails: state.orgMgmt.orgAccessData.orgDetails,
        permissionData: state.orgMgmt.orgAccessData.permissionData,
        policyData: state.orgMgmt.orgAccessData.policyData,
        enabledServices: state.orgMgmt.orgAccessData.enabledServices,
        selectedTags: state.orgMgmt.orgAccessData.selectedTags,
        TagPolicyData: state.orgMgmt.orgAccessData.TagPolicyData,
        configuredTags: state.orgMgmt.orgAccessData.configuredTags,
        searchList: state.orgMgmt.orgAccessData.searchList,
        searchListState: state.orgMgmt.orgAccessData.searchListState,
        deletedOrgId: state.orgMgmt.orgAccessData.deletedOrgId,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitState: () => dispatch(actions.initAccessMgmtState()),
        onGetListOfOrgs: (orgIdsList) => dispatch(actions.getListOfOrgs(orgIdsList)),
        onGetOrgDetails: (orgId) => dispatch(actions.getOrgDetails(orgId)),
        onGetPermissions: (scope) => dispatch(actions.getPermissions(scope)),
        onGetPolicy: (tagId, orgId) => dispatch(actions.getPolicy(tagId, orgId)),
        onPostPolicy: (permissionData, tag, orgId, category) => dispatch(actions.postPolicy(permissionData, tag, orgId, category)),
        onPutPolicyByTagId: (payload, policyId) => dispatch(actions.updatePolicyByTagId(payload, policyId)),
        getEnabledPlatformServices: (orgId) => dispatch(actions.getEnabledPlatformServices(orgId)),
        onGetTagWithPolicy: (orgId) => dispatch(actions.getTagWithPolicy(orgId)),
        onSearchOrgList: (searchParam) => dispatch(actions.searchOrgList(searchParam)),
        onClearSearch: () => dispatch(actions.clearSearch()),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        deletePolicy: (tagId, orgId) => dispatch(actions.deletePolicy(tagId, orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgAccessManagement)));