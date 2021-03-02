/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import * as actions from '../Store/action';
import styles from './TagSearchField.module.scss';
import TagIcon from '../../../../../components/Atom/TagIcons/TagIcons';
import EmptyState from '../../../../../components/Atom/EmptyState/EmptyState';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import search from '../../../../../assets/icons/search.svg';
import close from '../../../../../assets/icons/closeNotification.svg';
import right from '../../../../../assets/icons/right.svg';
import location from '../../../../../assets/icons/locationTags.svg';
import functional from '../../../../../assets/icons/functionTags.svg';
import custom from '../../../../../assets/icons/customTags.svg';
import locationKey from '../../../../../assets/icons/locationTagsKey.svg';
import functionalKey from '../../../../../assets/icons/functionTagsKey.svg';
import customKey from '../../../../../assets/icons/customTagsKey.svg';

class TagSearchField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryString: '',
      data: {},
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
    this.props.onInitState();
  }

  handleInputChange = (event) => {
    const { name } = this.props;
    const data = {};
    const key = event.target.value;
    if (!_.isEmpty(key)) {
      let updatedData = [];
      this.props.tagData.forEach((eachTag, tagArrayIndex) => {
        if (!_.isEmpty(eachTag.tagList)) {
          eachTag.tagList.forEach((tag) => {
            if (new RegExp(key.toLocaleLowerCase()).test(tag.name.toLowerCase())) {
              let updatedTags = [tag];
              const ind = tagArrayIndex - 1;
              const { parent } = tag;
              updatedTags = this.getTagArray(ind, this.props.tagData, updatedTags, parent);
              updatedData = [...updatedData, updatedTags];
            }
          });
        }
      });
      data[name] = updatedData;
    }
    this.setState({ queryString: event.target.value, data });
  };

  getTagArray = (ind, tagData, eachArray, parent) => {
    if (ind < 0) return eachArray;

    let tagList = _.cloneDeep(this.props.tagData[ind].tagList);
    tagList = tagList.filter((t) => t.uuid === parent);
    const updatedParent = tagList[0].parent;
    return this.getTagArray(ind - 1, tagData, tagList.concat(eachArray), updatedParent);
  }

  handleSelectTag = (targetIndex) => {
    const selecteTag = _.cloneDeep(this.state.data[this.props.name][targetIndex]).pop();

    this.props.updateTag({ value: selecteTag }, 'add');
    this.props.onInitState();
    this.setState({ queryString: '', data: {} });
  }

  handleClose = () => {
    this.props.onInitState();
  }

  handleClick = (event) => {
    if (this.dropDownDiv) {
      if (!this.dropDownDiv.contains(event.target)) {
        this.handleClose();
      }
    }
  }

  render() {
    const { t } = this.props;
    const { name } = this.props;
    return (
      <>
        {this.props.label ? (
          <span className={cx(styles.labelText, this.props.labelText, 'mt-3')}>
            {this.props.label}
          </span>
        ) : null}
        <div className={cx(this.props.BarStyle, this.props.noBorder ? null : styles.tagBar)}>
          <img src={search} alt={t('translation_tagSearch:image_alt_tagSearch.search')} className={cx('pb-1 pl-1 mr-1', this.props.imgSize)} />
          {
            this.props.tags && !this.props.hideTagsInInput ? this.props.tags.map((tag, index) => (
              <div key={index} className={styles.tagButtons}>
                <img
                  src={tag.category === 'functional' ? (tag.hasAccess ? functionalKey : functional)
                    : tag.category === 'geographical' ? (tag.hasAccess ? locationKey : location)
                      : (tag.hasAccess ? customKey : custom)}
                  className="pr-2 ml-1"
                  height="12px"
                  alt=""
                />
                {tag.name}
                &nbsp;
                <img
                  src={close}
                  alt={t('translation_tagSearch:image_alt_tagSearch.close')}
                  onClick={
                    !this.props.disabled ? () => this.props.updateTag({ value: tag }, 'delete')
                      : undefined
                  }
                  className={!this.props.disabled ? cx(styles.close, 'ml-2') : cx(styles.closeDisable, 'ml-2')}
                />
              </div>
            )) : null
          }
          <input
            name={this.props.name}
            className={cx(' ml-1 px-0 ', styles.searchBar, this.props.className)}
            type="text"
            value={this.state.queryString}
            placeholder={this.props.placeholder}
            onChange={(event) => this.handleInputChange(event)}
            disabled={this.props.disabled}
            autoComplete="off"
          />
          {!_.isEmpty(this.state.data[name])
            ? (
              <div className={cx(styles.dropdownMenu, scrollStyle.scrollbar, this.props.dropdownMenu)}>

                {this.state.data[name].map((searchArr, index) => {
                  const searchLength = searchArr.length;
                  if (this.props.disableTags !== undefined && _.includes(this.props.disableTags, searchArr[searchLength - 1].uuid)) {
                    return null;
                  }
                  return (

                    <div
                      key={index}
                      className={styles.tagDropDown}
                      onClick={(() => this.handleSelectTag(index))}
                      ref={(dropDownDiv) => this.dropDownDiv = dropDownDiv}
                    >
                      {searchArr.map((ser, index) => (

                        <div key={index} className={cx(styles.iconStyle)}>
                          <TagIcon
                            hasAccess={ser.hasAccess}
                            category={ser.category}
                            className={styles.iconSize}
                          />
                          <span className="pl-2">
                            {index !== (searchArr.length - 1)
                              ? (
                                <span>
                                  {ser.name}
                                  <img src={right} alt={t('translation_tagSearch:image_alt_tagSearch.right')} className="mx-3" />
                                </span>
                              )
                              : <span className={styles.searchText}>{ser.name}</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )
            : !_.isEmpty(this.state.queryString)
              ? <EmptyState type="noResultFound" searchKey={this.state.queryString} className={styles.emptySearch} />
              : null}

        </div>

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getDataState: state.tagSearch.getDataState,
  data: state.tagSearch.data,

  tagData: state.vendorMgmt.vendorTagTraverse.tagData,
  vendorTagsState: state.vendorMgmt.vendorTags.vendorTagsState,
  vendorTags: state.vendorMgmt.vendorTags.vendorTags,
});

const mapDispatchToProps = (dispatch) => ({
  onInitState: () => dispatch(actions.initState()),
  onGetTagList: (orgId, category, type, key, name, clientId, isSelected, vendorId) => dispatch(actions.getTagList(orgId, category, type, key, name, clientId, isSelected, vendorId)),
});

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagSearchField)));
