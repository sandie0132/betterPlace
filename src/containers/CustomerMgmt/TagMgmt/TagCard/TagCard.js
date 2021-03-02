import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import * as actions from '../TagMgmtStore/action';
import img from '../../../../assets/icons/threeDots.svg';
import edit from '../../../../assets/icons/editIcon.svg';
import styles from './TagCard.module.scss';
import cx from 'classnames';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../../assets/icons/warning.svg';
import deleteWarning from '../../../../assets/icons/deleteWarning.svg';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import { withTranslation } from 'react-i18next'
import TagIcons from '../../../../components/Atom/TagIcons/TagIcons';

class TagCard extends Component {
    state = {
        showEditButton: false,
        dropdown: false,
        showDeletePopUp: false,
        showWarningPopUp: false,
        isAdded: false,
        showAddIcon: false
    }

    componentDidMount() {
        this.handleShowAdded();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.error !== this.props.error) {
            if (this.props.error === 406 && this.props.id === this.props.deleteTagId) {
                this.setState({ showWarningPopUp: true });
            }
        }
        if (prevProps.addedTags !== this.props.addedTags || this.props.tag !== prevProps.tag) {
            this.handleShowAdded();
        }
    }

    handleShowAdded = () => {
        let isAdded = false;
        const id = this.props.id;
        _.forEach(this.props.addedTags, function (addedtag) {
            if (addedtag.uuid === id) {
                isAdded = true;
            }
        })
        this.setState({ isAdded: isAdded })
    }

    handleSelectTag = (event) => {
        if (this.props.useAsSelectTag) {
            event.stopPropagation();
            if (!this.props.isDisabled) {
                if (this.state.isAdded) this.props.updateTag({ value: this.props.tag }, 'delete');
                else this.props.updateTag({ value: this.props.tag }, 'add');
            }
        }
    }

    handleEditTagDetails = (event) => {
        event.stopPropagation();
        this.props.onHandleEditTag(this.props.id);
    };

    handleGetSubTagsList = () => {
        const {match} = this.props;
        const orgId = match.params.uuid;
        this.props.onGetSubTagList(this.props.arrayIndex, this.props.id, this.props.name, orgId, this.props.category);
    }
    handleDeleteTag = () => {
        const {match} = this.props;
        const orgId = match.params.uuid;
        this.props.onDeleteTag(this.props.arrayIndex, this.props.id, orgId);
        this.setState({ showDeletePopUp: false })
    }
    handleWarningPopUp = (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ showDeletePopUp: true });
    }

    handleCardMenu = (show) => {
        if (this.props.useAsSelectTag) {
            this.setState({
                showEditButton: show,
                showAddIcon: show
            })
        }
        else {
            this.setState({
                showEditButton: show,
                showAddIcon: false
            })
        }
    }

    handleShortenTagName = (tagName) => {
        const maxLength = 24;
        if (tagName.length > maxLength) {
            const updatedName = tagName.substring(0, maxLength) + '...';
            return (updatedName);
        }
        return (tagName);
    }


    render() {
        const { match, t } = this.props;
        let orgId = match.params.uuid;
        return (
            <React.Fragment>
                <span onMouseEnter={() => this.handleCardMenu(true)}
                    onMouseLeave={() => this.handleCardMenu(false)} >
                    <div className={cx(styles.FolderAlign,
                        this.props.isSelected ? styles.FolderActive :
                            this.state.isAdded ? styles.FolderSelected : null)}
                        onClick={this.handleGetSubTagsList} >
                        <div onClick={(event) => this.handleSelectTag(event)}
                            className={this.props.isDisabled ? styles.disableSelection : null}

                        >
                            <TagIcons
                                category={this.props.category}
                                hasAccess={this.props.tag.hasAccess}
                            />
                            &nbsp; &nbsp;
                        </div>

                        <div >
                            {this.handleShortenTagName(this.props.name)}
                        </div>
                        {this.state.showEditButton ?
                            <div onMouseEnter={() => this.setState({ dropdown: true })}
                                onMouseLeave={() => this.setState({ dropdown: false })} className={cx(styles.EditButton, "ml-auto")} >
                                <img src={img} alt={t('translation_tagCard:image_alt_tagCard.img')} />
                                {
                                    this.state.dropdown ?

                                        <HasAccess
                                            permission={[this.props.businessFunction + ":EDIT"]}
                                            orgId={orgId}
                                            yes={() =>
                                                <div className={styles.dropdown} >

                                                    <ul className={styles.UnorderedList} >
                                                        <li onClick={(event) => { this.handleEditTagDetails(event) }} className={styles.List}>
                                                            <img src={edit} alt={t('translation_tagCard:image_alt_tagCard.img')} />
                                                            {t('translation_tagCard:li.l1')}
                                                        </li>
                                                    </ul>

                                                    {/* <HasAccess
                                                    permission={[this.props.businessFunction+":DELETE"]}
                                                    orgId = {orgId}
                                                    yes={() =>
                                                        <li onClick={(event) => { this.handleWarningPopUp(event) }} className={styles.List}>
                                                            <img src={deleteIcon} alt={t('translation_tagCard:image_alt_tagCard.img')} />
                                                            {t('translation_tagCard:li.l2')}
                                                </li>
                                                    }
                                                /> */}
                                                </div>

                                            }
                                        />


                                        :
                                        null
                                }
                            </div> : null
                        }
                    </div>
                    {this.state.showDeletePopUp ?
                        <WarningPopUp
                            text={t('translation_tagCard:warning_tagCardDelete.text')}
                            para={'do you want to delete ' + this.props.name + '?'}
                            confirmText={t('translation_tagCard:warning_tagCardDelete.confirmText')}
                            cancelText={t('translation_tagCard:warning_tagCardDelete.cancelText')}
                            icon={warn}
                            warningPopUp={this.handleDeleteTag}
                            closePopup={() => this.setState({ showDeletePopUp: false, dropdown: false })}
                        />
                        : null
                    }
                    {this.state.showWarningPopUp ?
                        <WarningPopUp
                            text={"You can't delete " + this.props.name + '.'}
                            para={this.props.name + " has sub tags."}
                            cancelText={t('translation_tagCard:warning_tagCardCannotDelete.cancelText')}
                            icon={deleteWarning}
                            closePopup={() => this.setState({ showWarningPopUp: false })}

                        />
                        : null
                    }

                </span>
                <br />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        orgId: state.tagMgmt.orgId,
        categoryUrlName: state.tagMgmt.categoryUrlName,
        businessFunction: state.tagMgmt.businessFunction,
        error: state.tagMgmt.error,
        deleteTagId: state.tagMgmt.deleteTagId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetSubTagList: (arrayIndex, tagId, tagName, orgId, category) => dispatch(actions.getSubTagList(arrayIndex, tagId, tagName, orgId, category)),
        onDeleteTag: (arrayIndex, tagId, orgId) => dispatch(actions.deleteTag(arrayIndex, tagId, orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagCard)));