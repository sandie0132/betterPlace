import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../TagMgmtStore/action';
import styles from './TagSheet.module.scss';
import cx from 'classnames';
import TagColumn from '../TagColumn/TagColumn';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';


class TagSheet extends Component {
   
    state = {
        addTagType: false,
    };

    componentDidUpdate(prevProps){
        if(this.props.orgId !== prevProps.orgId || this.props.category !== prevProps.category){
            this.props.onGetTagList(this.props.orgId, this.props.category)
        }
    }

    handleAddTagType = () => {
        this.setState({
            addTagType: true
        })
    }

    // componentWillUnmount = () => {
    //     this.props.getTagsInitState();
    // }

    render (){
        let tagColumns = this.props.tagsArray.map((tagColumn, index) => {
            return(
                <TagColumn
                    key = {index}
                    tagList = {tagColumn.tagList} 
                    tagType = {tagColumn.tagType}
                    tagId = {tagColumn.tagId}
                    selectedId = {tagColumn.selectedId}
                    selectedTag = {tagColumn.selectedTag}
                    arrayIndex = {index}
                    isTagColumn = {index === 0}
                    useAsSelectTag = {this.props.useAsSelectTag}
                    addedTags = {this.props.addedTags}
                    updateTag = {this.props.updateTag}
                />
            )
        });
        return (
            <React.Fragment >
                <div className={cx(styles.scroll, scrollStyle.scrollbar)}> 
                    <div className={styles.SectionAli} >    
                        {tagColumns}
                    </div> 
                </div>
                
            </React.Fragment>
        )
    }  
}


const mapStateToProps = state => {
    return {
        orgId: state.tagMgmt.orgId,
        category: state.tagMgmt.category,
        tagsArray: state.tagMgmt.tagsArray,
        tagListState: state.tagMgmt.tagListState,
        errors: state.tagMgmt.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetTagList: (orgId, category) => dispatch(actions.getTagList(orgId, category)),
        getTagsInitState: () => dispatch(actions.getInitState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TagSheet));