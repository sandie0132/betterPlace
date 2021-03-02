import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import styles from './TagTypeFilter.module.scss';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import close from '../../../../../../assets/icons/closeNotification.svg';
import addressTag from '../../../../../../assets/icons/locationTags.svg';// addressTag.svg';
import profile from '../../../../../../assets/icons/functionTags.svg';// vendorProfile.svg';
import custom from '../../../../../../assets/icons/customTags.svg';
import locationKey from '../../../../../../assets/icons/locationTagsKey.svg';
import functionalKey from '../../../../../../assets/icons/functionTagsKey.svg';
import customKey from '../../../../../../assets/icons/customTagsKey.svg';

import TagSearch from '../../../../../TagSearch/TagSearchField/TagSearchField';
import * as actions from '../../Store/action';

class TagTypeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocationTags: [],
      selectedFunctionTags: [],
      selectedCustomTags: [],
      selectedTagsUUID: [],
      // tagsCount: 0
    };
  }

    componentDidMount = () => {
      const currentUrl = window.location.href;
      if (currentUrl.split('?')[1]) {
        this.handleFilterCard();
      }
    }

    componentDidUpdate = (prevProps, prevState) => {
      const {
        getTagInfoState, onGetTagList, selectedTags, location,
      } = this.props;

      const { selectedTagsUUID } = this.state;

      if (prevProps.getTagInfoState !== getTagInfoState) {
        if (getTagInfoState === 'SUCCESS') {
          this.handleFilteredTags();
        }
      }
      if (!_.isEmpty(selectedTagsUUID)
      && prevState.selectedTagsUUID !== selectedTagsUUID) {
        onGetTagList(selectedTagsUUID);
      }

      if (prevProps.location.search !== location.search) {
        if (_.isEmpty(location.search)) {
          selectedTags(0);
          this.handleEmptyState();
        }
      }
    }

    // did update function written below
    handleEmptyState = () => {
      this.setState({
        selectedCustomTags: [],
        selectedFunctionTags: [],
        selectedLocationTags: [],
        selectedTagsUUID: [],
      });
    }

    // map filtered tags uuid with tag object.
    handleFilteredTags = () => {
      const { TagInfoData } = this.props;
      const filteredTags = TagInfoData;
      const { selectedCustomTags, selectedFunctionTags, selectedLocationTags } = this.state;

      _.forEach(filteredTags, (targetTag) => {
        if (targetTag.category === 'functional') {
          selectedFunctionTags.push(targetTag);
        } else if (targetTag.category === 'geographical') {
          selectedLocationTags.push(targetTag);
        } else if (targetTag.category === 'custom') {
          selectedCustomTags.push(targetTag);
        }
      });

      this.setState({ selectedLocationTags, selectedFunctionTags, selectedCustomTags });
    }

    // get the uuids of filtered tags from url.
    handleFilterCard = () => {
      const urlSearchParams = new URLSearchParams(window.location.search.toString());
      const filters = {
        location: [],
        function: [],
        custom: [],
        selectedTagsUUID: [],
      };

      Object.keys(filters).forEach((key) => {
        if (urlSearchParams.has(key)) {
          filters.selectedTagsUUID.push(...urlSearchParams.getAll(key)[0].split(','));
        }
      });
      this.setState({ selectedTagsUUID: filters.selectedTagsUUID });
    }

    // select or remove filter tags.
    handleSelectedFilterTag = (targetTag, actionType) => {
      const { selectedLocationTags, selectedFunctionTags, selectedCustomTags } = this.state;
      const location = selectedLocationTags;
      const functions = selectedFunctionTags;
      const customTag = selectedCustomTags;

      if (targetTag.category === 'geographical') {
        const index = location.findIndex((tag) => tag.uuid === targetTag.uuid);
        if (index > -1) {
          if (actionType === 'remove') {
            location.splice(index, 1);
          } else {
            location[index] = targetTag;
          }
        } else {
          location.push(targetTag);
        }
      } else if (targetTag.category === 'functional') {
        const index = functions.findIndex((tag) => tag.uuid === targetTag.uuid);
        if (index > -1) {
          if (actionType === 'remove') {
            functions.splice(index, 1);
          } else {
            functions[index] = targetTag;
          }
        } else {
          functions.push(targetTag);
        }
      } else if (targetTag.category === 'custom') {
        const index = customTag.findIndex((tag) => tag.uuid === targetTag.uuid);
        if (index > -1) {
          if (actionType === 'remove') {
            customTag.splice(index, 1);
          } else {
            customTag[index] = targetTag;
          }
        } else {
          customTag.push(targetTag);
        }
      }

      this.handleSelectedTagsUUID(location, functions, customTag);
      this.setState({
        selectedCustomTags: customTag,
        selectedFunctionTags: functions,
        selectedLocationTags: location,
      });
    }

    // map the selected filter tags uuids.
    handleSelectedTagsUUID = (location, functions, customTag) => {
      const locationTags = location ? location.map((tag) => tag.uuid) : null;
      const functionTags = functions ? functions.map((tag) => tag.uuid) : null;
      const customTags = customTag ? customTag.map((tag) => tag.uuid) : null;
      this.createFilterUrl(locationTags, functionTags, customTags);
    }

    // redirecting to the filtered url.
    createFilterUrl = (locationTags, functionTags, customTags) => {
      const { match, selectedTags, history } = this.props;
      const orgId = match.params.uuid;
      let filterUrl = `/customer-mgmt/org/${orgId}/employee?`;
      const filters = {
        location: locationTags,
        function: functionTags,
        custom: customTags,
      };
      let urlSearchParams = new URLSearchParams(window.location.search);

      if (_.includes(urlSearchParams.toString(), 'pageNumber')) {
        const regex = /(?:pageNumber=)([0-9]+)/;
        const newSearchParam = urlSearchParams.toString().replace(regex, '');
        urlSearchParams = new URLSearchParams(newSearchParam);
      }

      Object.keys(filters).forEach((key) => {
        if (filters[key].length > 0) {
          urlSearchParams.set(key, filters[key]);
        } else {
          urlSearchParams.delete(key);
        }
      });
      selectedTags(locationTags.length + functionTags.length + customTags.length);
      filterUrl += urlSearchParams.toString();
      history.push(filterUrl);
    }

    // clear all filters
    handleClearFilter = () => {
      this.createFilterUrl([], [], []);
      this.setState({
        selectedCustomTags: [],
        selectedFunctionTags: [],
        selectedLocationTags: [],
      }); // tagsCount: 0
    }

    render() {
      const { t, match } = this.props;
      const orgId = match.params.uuid;

      const { selectedCustomTags, selectedLocationTags, selectedFunctionTags } = this.state;
      return (
        <>
          <div className={cx(styles.tagContainer, scrollStyle.scrollbar)}>
            <div className={cx('d-flex flex-row', styles.SearchHead)}>
              <div className="col-8 px-0 ml-1">
                <TagSearch
                  className={cx(styles.TagSearch, 'col-9')}
                  name="role"
                  noBorder
                  placeholder={t('translation_empList:empFilters.searchTagPlaceholder')}
                  orgId={orgId}
                  updateTag={(value) => this.handleSelectedFilterTag(value.value)}
                  dropdownMenu={styles.dropdownMenu}
                  imgSize={styles.imgSize}
                />
              </div>
              <div className="col-4" style={{ textAlign: 'end', paddingTop: '0.9rem' }}>
                <label aria-hidden className={cx(styles.ClearFilter)} onClick={() => this.handleClearFilter()} id="clear" htmlFor="clear">{t('translation_empList:empFilters.clear')}</label>
              </div>

            </div>
            <hr className={cx('mt-0 mb-2 mt-2', styles.HorizontalLine)} />
            {_.isEmpty(selectedCustomTags) && _.isEmpty(selectedLocationTags)
            && _.isEmpty(selectedFunctionTags)
              ? (
                <div className={cx(styles.EmptyTag)}>
                  <i>{t('translation_empList:empFilters.l1')}</i>
                  {' '}
                  <br />
                  {' '}
                  <i>{t('translation_empList:empFilters.l2')}</i>
                </div>
              )
              : (
                <div>
                  {selectedLocationTags.length
                    ? (
                      <>
                        <div className="ml-0 mb-3">
                          <label className={cx('col-3 pl-3', styles.Headings)} htmlFor="location">{t('translation_empList:empFilters.location')}</label>
                          <br />
                          <div className="row no-gutters flex-wrap">
                            {selectedLocationTags.map((locationTag) => (
                              <div className={cx('mb-1', styles.selectedTags)} key={locationTag.uuid}>
                                <img src={locationTag.hasAccess ? locationKey : addressTag} className="pr-2 ml-1" height="12px" alt={t('translation_empList:empFilters.addressTag')} />
                                {locationTag.name}
                                <img src={close} aria-hidden className={cx('px-2', styles.Cross)} alt={t('translation_empList:empFilters.close')} onClick={() => this.handleSelectedFilterTag(locationTag, 'remove')} />
                              </div>
                            ))}
                          </div>

                        </div>
                        <hr className={cx('mt-0 mb-2 mt-2', styles.HorizontalLine)} />
                      </>
                    )
                    : null}

                  {selectedFunctionTags.length
                    ? (
                      <>
                        <div className="ml-0 mb-3">
                          <label className={cx('col-3 pl-3', styles.Headings)} htmlFor="function">{t('translation_empList:empFilters.function')}</label>
                          <br />
                          <div className="row no-gutters flex-wrap">
                            {selectedFunctionTags.map((functionTag) => (
                              <div className={cx('mb-1', styles.selectedTags)} key={functionTag.uuid}>
                                <img src={functionTag.hasAccess ? functionalKey : profile} className="pr-2 ml-1" height="12px" alt={t('translation_empList:empFilters.profile')} />
                                {functionTag.name}
                                <img src={close} aria-hidden className={cx('px-2', styles.Cross)} alt={t('translation_empList:empFilters.close')} onClick={() => this.handleSelectedFilterTag(functionTag, 'remove')} />
                              </div>
                            ))}
                          </div>

                        </div>
                        <hr className={cx('mt-0 mb-2 mt-2', styles.HorizontalLine)} />
                      </>
                    )
                    : null}

                  {selectedCustomTags.length
                    ? (
                      <div className="ml-0">
                        <label className={cx('col-3 pl-3', styles.Headings)} htmlFor="custom">{t('translation_empList:empFilters.custom')}</label>
                        <br />
                        <div className="row no-gutters flex-wrap">
                          {selectedCustomTags.map((customTag) => (
                            <div className={cx('mr-1 mb-1', styles.selectedTags)} key={customTag.uuid}>
                              <img src={customTag.hasAccess ? customKey : custom} className="pr-2 ml-1" height="12px" alt={t('translation_empList:empFilters.profile')} />
                              {customTag.name}
                              <img src={close} aria-hidden className={cx('px-2', styles.Cross)} alt={t('translation_empList:empFilters.close')} onClick={() => this.handleSelectedFilterTag(customTag, 'remove')} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                    : null}
                </div>
              )}
          </div>
        </>
      );
    }
}

const mapStateToProps = (state) => ({
  getTagInfoState: state.empMgmt.empList.getFilterTagState,
  TagInfoData: state.empMgmt.empList.TagInfoData,
});

const mapDispatchToProps = (dispatch) => ({
  onGetTagList: (tagIdList) => dispatch(actions.getTagName(tagIdList)),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TagTypeFilter),
));
