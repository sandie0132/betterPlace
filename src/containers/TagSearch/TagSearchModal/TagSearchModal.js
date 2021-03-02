/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';
import Modal from '../../../components/Atom/Modal/Modal';
import TagSearch from '../TagSearchField/TagSearchField';
import styles from './TagSearchModal.module.scss';
import TagTraverse from '../TagTraverse/TagTraverse';
import closePage from '../../../assets/icons/closePage.svg';
import HasAccess from '../../../services/HasAccess/HasAccess';

class TagSearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: [],
      disabledTags: [],
      clearPropsTags: false,
      enableSubmit: false,
      category: 'geographical',
    };
  }

    handleInsertInTags = (tagList, tag) => [
      ...tagList.slice(0),
      tag,
    ]

    handleDeleteInTags = (tagList, targetTag) => (
      tagList.filter((tag) => tag.uuid !== targetTag.uuid)
    )

    handleTagSelect = (event, action) => {
      let updatedSelectedTag = [];
      let updatedDisabledTag = [];
      if (!this.state.clearPropsTags) {
        updatedSelectedTag = _.cloneDeep(this.props.tags);
        if (this.props.updatedDisabledTag !== undefined) {
          updatedDisabledTag = _.cloneDeep(this.props.disableTags);
        }
      } else {
        updatedSelectedTag = _.cloneDeep(this.state.selectedTags);
        updatedDisabledTag = _.cloneDeep(this.state.disabledTags);
      }
      if (action === 'add') {
        if (this.props.singleTagSelection) {
          updatedSelectedTag = [event.value];
          updatedDisabledTag = [event.value.uuid];
        } else {
          updatedSelectedTag = this.handleInsertInTags(updatedSelectedTag, event.value);
          updatedDisabledTag.push(event.value.uuid);
        }
      }
      if (action === 'delete') {
        updatedSelectedTag = this.handleDeleteInTags(updatedSelectedTag, event.value);
        updatedDisabledTag = _.remove(updatedDisabledTag, (tag) => tag !== event.value.uuid);
      }
      this.setState({
        selectedTags: updatedSelectedTag,
        disabledTags: updatedDisabledTag,
        clearPropsTags: true,
        enableSubmit: true,
      });
    };

    handleAllTagSelect = (tagList) => {
      let updatedSelectedTag = [];
      let updatedDisabledTags = [];
      if (!this.state.clearPropsTags) {
        updatedSelectedTag = _.cloneDeep(this.props.tags);
        if (this.props.updatedDisabledTag !== undefined) {
          updatedDisabledTags = _.cloneDeep(this.props.disableTags);
        }
      } else {
        updatedSelectedTag = _.cloneDeep(this.state.selectedTags);
        updatedDisabledTags = _.cloneDeep(this.state.disabledTags);
      }
      _.forEach(tagList, ((tag) => {
        let tagSelected = false;
        _.forEach(updatedSelectedTag, ((selectedTag) => {
          if (selectedTag.uuid === tag.uuid) {
            tagSelected = true;
          }
        }));
        if (!tagSelected) {
          updatedSelectedTag = this.handleInsertInTags(updatedSelectedTag, tag);
          updatedDisabledTags.push(tag.uuid);
        }
      }));
      this.setState({
        selectedTags: updatedSelectedTag,
        disabledTags: updatedDisabledTags,
        clearPropsTags: true,
        enableSubmit: true,
      });
    }

    handleTagSubmit = () => {
      this.props.selectTags({ value: this.state.selectedTags });
      this.setState({
        selectedTags: [],
        clearPropsTags: false,
        enableSubmit: false,
        category: 'geographical',
      });
    }

    handleCloseSearchModal = () => {
      this.setState({
        selectedTags: [],
        clearPropsTags: false,
        enableSubmit: false,
        category: 'geographical',
      });
      this.props.closeModal();
    }

    setcategory=(category) => {
      this.setState({
        category,
      });
    }

    render() {
      const { t } = this.props;
      const displayTags = this.state.clearPropsTags
        ? [...this.state.selectedTags] : [...this.props.tags];
      const disableTags = this.state.clearPropsTags
        ? [...this.state.disabledTags] : this.props.disableTags !== undefined
          ? [...this.props.disableTags] : [];
      return (
        <>
          <Modal show={this.props.showModal} className={styles.ModalStyle}>
            <div className={cx('mx-0 col-9 ', styles.modalAlign)}>

              <div className={styles.closeAlign}>
                <div
                  className={styles.closeIcon}
                  onClick={() => this.handleCloseSearchModal()}
                  aria-hidden
                >
                  <img src={closePage} alt={t('translation_tagSearch:image_alt_tagSearch.close')} />
                </div>
                <span className={styles.closeText}>{this.props.tagType}</span>
              </div>
              <div className={cx(styles.ModalCardLayout)}>
                <div className={cx('card-body px-5')}>
                  <TagSearch
                    orgId={this.props.orgId}
                    vendorId={this.props.vendorId ? this.props.vendorId : null}
                    clientId={this.props.clientId ? this.props.clientId : null}
                    tags={displayTags}
                    disableTags={disableTags}
                    noBorder
                    placeholder={_.get(this.props, 'placeholder', t('translation_tagSearch:placeholder'))}
                    BarStyle={styles.barStyle}
                    className={styles.searchBar}
                    updateTag={(value, action) => this.handleTagSelect(value, action)}
                    category={this.props.category}
                    type={this.props.type}
                    hideTagsInInput={this.props.hideTagsInInput}
                    disabled={this.props.disabled}
                  />
                  <br />
                  {this.props.category === undefined
                    ? (
                      <div className="mb-3">
                        <HasAccess
                          permission={['ORG_LOC_SITE:VIEW']}
                          orgId={this.props.orgId}
                          yes={() => (
                            <button
                              className={cx(styles.TagTypeButton, this.state.category === 'geographical' ? styles.ActiveMode : null)}
                              onClick={() => this.setcategory('geographical')}
                              type="button"
                            >
                              {t('translation_tagSearch:location')}
                            </button>
                          )}
                        />
                        <HasAccess
                          permission={['ORG_FUNC_ROLE:VIEW']}
                          orgId={this.props.orgId}
                          yes={() => (
                            <button
                              className={cx(styles.TagTypeButton, this.state.category === 'functional' ? styles.ActiveMode : null)}
                              onClick={() => this.setcategory('functional')}
                              type="button"
                            >
                              {t('translation_tagSearch:function')}
                            </button>
                          )}
                        />
                        <HasAccess
                          permission={['ORG_CUST_TAG:VIEW']}
                          orgId={this.props.orgId}
                          yes={() => (
                            <button
                              className={cx(styles.TagTypeButton, this.state.category === 'custom' ? styles.ActiveMode : null)}
                              onClick={() => this.setcategory('custom')}
                              type="button"
                            >
                              {t('translation_tagSearch:custom')}
                            </button>
                          )}
                        />
                      </div>
                    )
                    : null}
                  <TagTraverse
                    orgId={this.props.orgId}
                    category={(this.props.category === undefined) || (this.props.category === '')
                      ? this.state.category : this.props.category}
                    type={this.props.type}
                    tags={displayTags}
                    disableTags={this.props.disableTags}
                    updateTag={(value, action) => this.handleTagSelect(value, action)}
                    SectionStyle={styles.Traverse}
                    cardStyle={styles.card}
                    ActiveClass={styles.ActiveClass}
                    SectionHead={styles.sectionHead}
                    singleTagSelection={this.props.singleTagSelection}
                    showSelectAll
                    selectAllTags={(tagList, action) => this.handleAllTagSelect(tagList, action)}
                    disabled={this.props.disabled}
                    sharedTagQuery={this.props.sharedTagQuery}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex flex-row justify-content-end">
                <Button className={styles.CancelButton} label={t('translation_tagSearch:button_tagSearchModal.cancel')} clickHandler={this.handleCloseSearchModal} />
                <Button label={t('translation_tagSearch:button_tagSearchModal.done')} isDisabled={!this.state.enableSubmit} clickHandler={this.handleTagSubmit} />
              </div>
            </div>
          </Modal>
        </>
      );
    }
}
export default withTranslation()(TagSearchModal);
