import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TagInfoForm from '../TagInfoForm/TagInfoForm';
import styles from './TagColumn.module.scss';
import NewTagTypeForm from '../NewTagTypeForm/NewTagTypeForm';
import TagCard from '../TagCard/TagCard';
import add from '../../../../assets/icons/addMore.svg';
import cx from 'classnames';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';


class TagColumn extends Component {
    state = {
        showForm: false,
        editTagId: null
    }

    handleAddTag = () => {
        this.setState({
            showForm: true,
        })
    }

    handleEditTag = (targetId) => {
        this.setState({
            showForm: true,
            editTagId: targetId
        })
    }

    handleCloseForm = () => {
        this.setState({
            showForm: false,
            editTagId: null
        });
    }

    render(){
        const { match , t } = this.props;
        let orgId = match.params.uuid;

        let tagListCard = !_.isEmpty(this.props.tagList) ? this.props.tagList.map((tag, index) => {
                return(
                    <TagCard 
                        key = {index}
                        name = {tag.name}
                        id = {tag.uuid}
                        arrayIndex = {this.props.arrayIndex}
                        isTag = {this.props.isTagColumn}
                        isSelected = {this.props.selectedId === tag.uuid}
                        onHandleEditTag = {this.handleEditTag}
                        tag={tag}
                        useAsSelectTag = {this.props.useAsSelectTag}
                        addedTags = {this.props.addedTags}
                        updateTag = {this.props.updateTag}
                        category={tag.category}
                        type={tag.type}
                    />
                )
            }) : '';

        return(
            <React.Fragment>
                {
                    (this.props.tagType) ?
                        <div className={cx(styles.SectionStyle)}>
                            <HasAccess
                                permission = {[this.props.businessFunction+":CREATE"]}
                                orgId = {orgId}
                                yes = { () => 
                                    <button className={styles.AddButtonStyle} onClick={() => this.handleAddTag()}>
                                        <img src={add} alt={t('translation_tagColumn:image_alt_tagColumn.add')}  /> {t('translation_tagColumn:button_tagColumn.add')} {this.props.tagType}
                                    </button>
                                }
                                no = { () => 
                                    <button className={cx(styles.AddButtonStyle, 'ml-1')} >
                                        {this.props.tagType}
                                    </button>
                                }
                            />
                            
                            {
                                this.state.showForm ? 
                                <TagInfoForm 
                                    isTag = {this.props.isTagColumn}
                                    tagType = {this.props.tagType} 
                                    onHandleCloseForm = {this.handleCloseForm}
                                    arrayIndex = {this.props.arrayIndex}
                                    tagId = {this.props.tagId}
                                    editTagId = {this.state.editTagId}
                                    selectedTag = {this.props.selectedTag}
                                /> 
                                : 
                                null
                            }
                            <br></br>
                            <span>
                                {tagListCard}
                            </span>
                        </div>
                    :
                    <HasAccess 
                        permission = {[this.props.businessFunction+":CREATE"]}
                        orgId = {orgId}
                        yes = { () => 
                            <NewTagTypeForm tagId = {this.props.tagId} isTagColumn = {this.props.isTagColumn}/>
                        }
                    />
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        orgId: state.tagMgmt.orgId,
        categoryUrlName: state.tagMgmt.categoryUrlName,
        businessFunction: state.tagMgmt.businessFunction,
        tagListState: state.tagMgmt.tagListState,
        errors: state.tagMgmt.error
    };
};

export default withTranslation() (withRouter(connect(mapStateToProps)(TagColumn)));