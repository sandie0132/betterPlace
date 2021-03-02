import React, { Component } from "react";
import styles from './AssignTags.module.scss';
import img from '../../../../../../assets/icons/closeNotification.svg';
import up from '../../../../../../assets/icons/arrowUp.svg';
import down from '../../../../../../assets/icons/arrowDown.svg';
import cx from "classnames";
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
import _ from 'lodash';
import { Button } from 'react-crux';
import * as actions from "../../Store/action";
import { connect } from "react-redux";
import TagTraverse from "../../../../../TagSearch/TagTraverse/TagTraverse";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import HasAccess from  '../../../../../../services/HasAccess/HasAccess';

class AssignTags extends Component {

    state = {
        viewFuncSearchBar: false,
        viewGeoSearchBar: false,
        viewCustSearchBar: false,
        category: null,
        tags: [],
        placeholder: '',
        selectedTagsUuid: []
    }

    showSearch = (category) => {
        if (category === 'functional') {
            this.setState({
                viewFuncSearchBar: !this.state.viewFuncSearchBar,
                viewGeoSearchBar: false,
                viewCustSearchBar: false,
                category: category,
                placeholder: 'role'
            })
        } else if (category === 'geographical') {
            this.setState({
                viewGeoSearchBar: !this.state.viewGeoSearchBar,
                viewFuncSearchBar: false,
                viewCustSearchBar: false,
                category: category,
                placeholder: 'location'
            })
        }
        else if (category === 'custom') {
            this.setState({
                viewCustSearchBar: !this.state.viewCustSearchBar,
                viewFuncSearchBar: false,
                viewGeoSearchBar: false,
                category: category,
                placeholder: 'custom'
            })
        }
    }

    handleInsertInTags = (tagList, tag) => {
        return [
            ...tagList.slice(0),
            tag,
        ]
    }

    handleDeleteInTags = (tagList, targetTag) => {
        return (
            tagList.filter(tag => tag.uuid !== targetTag.uuid)
        )
    }

    handleTagChange = (event, inputIdentifier, action) => {
        let updatedTags = _.cloneDeep(this.state.tags);
        let updatedTagUuid = _.cloneDeep(this.state.selectedTagsUuid)

        if (inputIdentifier === 'tags') {
            if (action === 'add') {
                updatedTags = this.handleInsertInTags(updatedTags, event.value)
                updatedTagUuid.push(event.value.uuid)
            }
            if (action === 'delete') {
                updatedTags = this.handleDeleteInTags(updatedTags, event.value);
                updatedTagUuid = _.remove(updatedTagUuid, function (tag) {
                    return tag !== event.value.uuid
                });
            }
        }
        this.setState({ tags: updatedTags, selectedTagsUuid: updatedTagUuid });
    };

    handleSubmit = () => {
        let tagArray = [];
        let empId = [];
        let searchParams = new URLSearchParams(this.props.location.search.toString());
        searchParams.delete("pageNumber");
        searchParams = searchParams.toString();

        _.forEach(this.state.tags, function (tag) {
            tagArray.push(tag.uuid)
        })
        this.props.selectedEmployees.forEach(function (id) {
            empId.push(id)
        })

        const {match} = this.props;
        const orgId = match.params.uuid;

        let payload ={
            "product": "ONBOARD",
            "data":{
                "empIds": _.cloneDeep(empId),
                "tagList": _.cloneDeep(tagArray)
            },
            
        }
        
        this.props.onPostBulkActions(orgId, "EMPLOYEE_ASSIGN_TAGS", "PROCESS_DATA", searchParams, payload, this.props.selectAll);
        this.props.closeFooter();
    }


    render() {
        const { t } = this.props;
        const {match} = this.props;
        const orgId = match.params.uuid;

        return (
            <React.Fragment >
                <div className={styles.Footer}>
                    <span className={styles.Number}>
                        {this.props.selectAll ? this.props.totalEmployeeCount : this.props.selectedEmployees.length}
                    </span>
                    &nbsp; employee(s) selected
                    <span className={cx(styles.verticalLine)}></span>
                    <span className="ml-4 pl-1">
                        &nbsp;assign employee{this.props.selectedEmployees.length > 1 ? <span>s</span> : null} to
                        <HasAccess
                            permission={["ORG_FUNC_ROLE:VIEW"]}
                            orgId={orgId}
                            yes={() =>
                                <button className={this.state.viewFuncSearchBar ? styles.FooterButton : styles.FooterButtonInactive} onClick={() => this.showSearch('functional')}>{t('translation_empList:assignTags.function')}
                                    <img src={this.state.viewFuncSearchBar ? down : up} alt={t('translation_empList:assignTags.updown')} className="pl-5" />
                                </button>
                            }
                        />
                        <HasAccess
                            permission={["ORG_LOC_SITE:VIEW"]}
                            orgId={orgId}
                            yes={() =>
                                <button className={this.state.viewGeoSearchBar ? styles.FooterButton : styles.FooterButtonInactive} onClick={() => this.showSearch('geographical')}>{t('translation_empList:assignTags.location')}
                                    <img src={this.state.viewGeoSearchBar ? down : up} alt={t('translation_empList:assignTags.updown')} className="pl-5" />
                                </button>
                            }
                        />
                        <HasAccess
                            permission={["ORG_CUST_TAG:VIEW"]}
                            orgId={orgId}
                            yes={() =>
                                <button className={this.state.viewCustSearchBar ? styles.FooterButton : styles.FooterButtonInactive} onClick={() => this.showSearch('custom')}>{t('translation_empList:assignTags.custom')}
                                    <img src={this.state.viewCustSearchBar ? down : up} alt={t('translation_empList:assignTags.updown')} className="pl-5" />
                                </button>
                            }
                        />
                    </span>
                    <span className={styles.AlignRight}>
                        <Button label={t('translation_empList:assignTags.assign')} type="medium" clickHandler={() => this.handleSubmit()} isDisabled={this.state.tags.length > 0 ? false : true} />
                    </span>

                    {
                        this.state.viewFuncSearchBar || this.state.viewGeoSearchBar || this.state.viewCustSearchBar ?
                            <React.Fragment>
                                <span className={cx(styles.BottomSearch)}>

                                    <TagSearchField
                                        noBorder
                                        placeholder={'select or search ' + this.state.placeholder}
                                        orgId={sessionStorage.getItem('orgId')}
                                        category={this.state.category}
                                        tags={this.state.tags}
                                        dropdownMenu={styles.dropdownMenu}
                                        disableTags={this.state.selectedTagsUuid}
                                        BarStyle={styles.tagSearch}
                                        updateTag={(value, action) => this.handleTagChange(value, 'tags', action)}
                                        className={styles.placeholderText}
                                    />
                                    <span onClick={() => this.props.closeFooter()}><img src={img} alt={t('translation_empList:assignTags.img')} className={styles.closeImg} /></span>
                                    <TagTraverse assign
                                        orgId={sessionStorage.getItem('orgId')}
                                        category={this.state.category}
                                        tags={this.state.tags}
                                        updateTag={(value, action) => this.handleTagChange(value, 'tags', action)}
                                        ActiveClass={styles.ActiveClass}
                                    />
                                </span>
                            </React.Fragment> : null
                    }
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        assignEmpToTagState: state.empMgmt.empList.assignEmpToTagState,
        error: state.empMgmt.empList.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onPostBulkActions: (orgId, action, reqType, query, payload,selectAll) => dispatch(actions.employeeBulkActions(orgId, action, reqType, query, payload,selectAll)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AssignTags)));