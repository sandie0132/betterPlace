import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Modal from '../../../../components/Atom/Modal/Modal';
import * as actions from '../TagMgmtStore/action';
import styles from './TagInfoForm.module.scss';
import Forms from './Forms/Forms';

class TagInfoForm extends Component {
    state = {
        currentTag : {
            name: '',
            code: '',
        },
        addTag: false,
        addSubTag: false,
        editTag: false,
        enableSubmit: false,
        showModal:true,
        isSelected:false,
        duplicateTag: ''
    }

    componentDidMount(){
        const {match} = this.props;
        const orgId = match.params.uuid;
        if(this.props.editTagId){
            this.props.onGetTagDetails(this.props.editTagId, orgId, this.props.category);
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.currentTag !== prevProps.currentTag)
        {
            if(this.props.currentTag)
            {   
                const updatedCurrentTag = {
                    type: this.props.currentTag['type'],
                    name: this.props.currentTag['name'],
                    code: this.props.currentTag['code']
                }
                this.setState({
                    currentTag: updatedCurrentTag,
                });
            }
        }

        if(this.props.tagPutState !== prevProps.tagPutState && this.props.tagPutState === "SUCCESS"){
            this.props.onHandleCloseForm();
        }
        if(this.props.tagPutState !== prevProps.tagPutState && this.props.tagPutState === "ERROR"){
            let tagName = {...this.state.currentTag}.name
            let errorText = `tagname '${tagName}' already exists`
            this.setState({duplicateTag: errorText})
        }

        if(this.props.subTagPostState !== prevProps.subTagPostState && this.props.subTagPostState === "ERROR"){
            let tagName = {...this.state.currentTag}.name
            let errorText = `tagname '${tagName}' already exists`
            this.setState({duplicateTag: errorText})
        }

        if(this.props.tagPostState !== prevProps.tagPostState && this.props.tagPostState === "ERROR"){
            let tagName = {...this.state.currentTag}.name
            let errorText = `tagname '${tagName}' already exists`
            this.setState({duplicateTag: errorText})
        }

        if(this.props.subTagPostState !== prevProps.subTagPostState && this.props.subTagPostState === "SUCCESS"){
            this.props.onHandleCloseForm();
        }
        if(this.props.tagPostState !== prevProps.tagPostState && this.props.tagPostState === "SUCCESS"){
            this.props.onHandleCloseForm();
        }
    }

    handleInputChange(event, inputIdentifier){
        let enableSubmit = false;
        let updatedCurrentTag = {
            ...this.state.currentTag
        };
        updatedCurrentTag[inputIdentifier] = event;
        if(updatedCurrentTag['name']!==''){
            enableSubmit = true;
        }

        this.setState({
            currentTag: updatedCurrentTag,
            enableSubmit: enableSubmit,
            isSelected: event,
            duplicateTag: ''
        });
    }

    

    formSubmitHandler = (event) => {
        const {match} = this.props;
        const orgId = match.params.uuid;
        event.preventDefault()
        let tag = {
            ...this.state.currentTag
        }
        tag['type'] = this.props.tagType;
        tag['category'] = this.props.category;
        if(this.props.editTagId){
            this.props.onEditTagInfo(this.props.arrayIndex, this.props.editTagId, tag, orgId, this.props.category);
        }
        else{
            if(this.props.isTag){
                this.props.onPostTagInfo(this.props.orgId, this.props.category, tag);
            }
            else{
                this.props.onPostSubTagInfo(this.props.arrayIndex, this.props.tagId, tag, orgId, this.props.category);
            }
        }
        // this.props.onHandleCloseForm();
    }

    removeModal = (event) =>{
        event.preventDefault();
        this.props.onHandleCloseForm();

    }
    checkDefaultTagType = (category,tagType) => {
        if( category === 'geographical')
        {
            if(tagType === 'country' || tagType==='state')
                return true;
            else return false;
        }
        else return true;
    }
    render(){
        return(
            <Modal  show={true} handleClose={this.props.onHandleCloseForm} 
                    className={this.checkDefaultTagType(this.props.category,this.props.tagType) === true 
                    ? styles.ModalForm : styles.customColumnModalForm}>
                <Forms  category = {this.props.category} 
                        tagType = {this.props.tagType}
                        currentTag = {this.state.currentTag}
                        enableSubmit = {this.state.enableSubmit}
                        changeHandler = {(event,identifier,code)=>this.handleInputChange(event,identifier,code)}
                        saveHandler = {(event)=>this.formSubmitHandler(event)}
                        closeForm = {(event)=>this.removeModal(event)}
                        isSelected = {this.state.isSelected}
                        selectedTag = {this.props.selectedTag}
                        duplicateTag = {this.state.duplicateTag !== '' ? this.state.duplicateTag : null }
                />
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        orgId: state.tagMgmt.orgId,
        category: state.tagMgmt.category,
        categoryUrlName: state.tagMgmt.categoryUrlName,
        currentTag: state.tagMgmt.currentTag,
        tagPostState: state.tagMgmt.tagPostState,
        tagPutState: state.tagMgmt.tagPutState,
        subTagPostState: state.tagMgmt.subTagPostState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetTagDetails: (tagId, orgId, category) => dispatch(actions.getTagDetails(tagId, orgId, category)),
        onPostTagInfo: (orgId, category, tag) => dispatch(actions.postTag(orgId, category, tag)),
        onPostSubTagInfo: (arrayIndex, tagId, subTag, orgId, category) => dispatch(actions.postSubTag(arrayIndex, tagId, subTag, orgId, category)),
        onEditTagInfo: (arrayIndex, tagId, tag, orgId, category) => dispatch(actions.putTag(arrayIndex, tagId, tag, orgId, category)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TagInfoForm));