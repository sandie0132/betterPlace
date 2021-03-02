import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../TagMgmtStore/action';
import styles from './NewTagTypeForm.module.scss';
import area from '../../../../assets/icons/area.svg';
import site from '../../../../assets/icons/site.svg';
import building from '../../../../assets/icons/building.svg';
import group from '../../../../assets/icons/group.svg';
import { withTranslation } from 'react-i18next'
class NewTagTypeForm extends Component {

    state = {
        sectionName: ''
    }
    handleInput = (event) => {
        this.setState({ sectionName: event.target.value });
    }

    handleTagTypeSubmit = (type) => {
        if(type){
            this.props.handleNewTagTypeAdd(type, this.props.tagId);
        }
        else{
            this.props.handleNewTagTypeAdd(this.state.sectionName, this.props.tagId);
        }
    }

    render() {
        const {t} = this.props ;
        return (
            <React.Fragment>
                {this.props.isTagColumn ? 
                <span className={styles.Section} >
                    <span className={styles.verticalLineDefault} />
                    <form >
                        <div >
                            <input
                                className={styles.TagInputDefault}
                                placeholder={t('translation_tagNewTagTypeForm:placeholder')}
                                onChange={(event) => this.handleInput(event)}
                                value={this.state.sectionName}>
                            </input>
                            {this.state.sectionName ?
                                <button className={styles.DoneButtonDefault} onClick={() => this.handleTagTypeSubmit()}>
                                    {t('translation_tagNewTagTypeForm:button_tagNewTagTypeForm.done')}
                                </button>
                                :
                                null
                            }
                        </div>
                       
                    </form>
                </span> :
                    <span className={styles.Section} >
                        <span className={styles.verticalLine} />
                        <form >
                            <div >
                                <input
                                    className={styles.TagInput}
                                    placeholder={t('translation_tagNewTagTypeForm:placeholder')}
                                    onChange={(event) => this.handleInput(event)}
                                    value={this.state.sectionName}>
                                </input>
                                
                                {this.state.sectionName ?
                                    <button className={styles.DoneButton} onClick={() => this.handleTagTypeSubmit()}>
                                        {t('translation_tagNewTagTypeForm:button_tagNewTagTypeForm.done')}
                                    </button>
                                    :
                                    null
                                }    
                            </div>
                            
                            {this.props.category === 'geographical' ?
                                <div className={styles.SectionInput} >
                                    <ul >
                                        <li className={styles.SectionPlaceholder}>
                                            {t('translation_tagNewTagTypeForm:li.l1')}</li>
                                        <li  className={styles.List} onClick={() => this.handleTagTypeSubmit('group')}>
                                            &nbsp;<img src={group} alt={t('translation_tagNewTagTypeForm:image_alt_tagNewTagTypeForm.img')} /> 
                                            {t('translation_tagNewTagTypeForm:li.l2')}
                                        </li> 
                                        <li  className={styles.List} onClick={() => this.handleTagTypeSubmit('area')}> 
                                            &nbsp;<img src={area} alt={t('translation_tagNewTagTypeForm:image_alt_tagNewTagTypeForm.img')} />
                                             {t('translation_tagNewTagTypeForm:li.l3')}
                                        </li>
                                        <li  className={styles.List} onClick={() => this.handleTagTypeSubmit('building')}>
                                            &nbsp;<img src={building} alt={t('translation_tagNewTagTypeForm:image_alt_tagNewTagTypeForm.img')} />
                                            {t('translation_tagNewTagTypeForm:li.l4')}
                                        </li> 
                                        <li  className={styles.List} onClick={() => this.handleTagTypeSubmit('site')}> 
                                            &nbsp;<img src={site} alt={t('translation_tagNewTagTypeForm:image_alt_tagNewTagTypeForm.img')} /> 
                                            {t('translation_tagNewTagTypeForm:li.l5')}
                                        </li> 
                                        {/* <li  className={styles.List} onClick={() => this.handleTagTypeSubmit('floor')}>
                                            &nbsp;<img src={floor} alt='img' /> &nbsp;&nbsp;add floor
                                        </li>  */}
                                             
                                    </ul>
                                
                                </div> 
                                :
                                null
                        }
                    </form>

                    </span>}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        category: state.tagMgmt.category
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleNewTagTypeAdd: (tagType, tagId) => dispatch(actions.newTagType(tagType, tagId))
    };
};

export default withTranslation() (withRouter(connect(mapStateToProps, mapDispatchToProps)(NewTagTypeForm)));
