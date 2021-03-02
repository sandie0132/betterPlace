import React from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './EmpFilters.module.scss';

import tagFilterIcon from '../../../../../assets/icons/tagFilterIcon.svg';
import activeTagFilter from '../../../../../assets/icons/activeTagFilter.svg';
import activeFilter from '../../../../../assets/icons/activeFilter.svg';
import filterIcon from '../../../../../assets/icons/filter.svg';
import vendorIcon from '../../../../../assets/icons/vendor.svg';
import activeVendor from '../../../../../assets/icons/activeVendor.svg';

import TagTypeFilter from './TagTypeFilter/TagTypeFilter';
import EmpTypeFilters from './EmpTypeFilters/EmpTypeFilters';
import VendorTypeFilters from './VendorTypeFilters/VendorTypeFilters';

class EmpFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: 'filters',
      selectedTagsCount: 0,
      selectedFiltersCount: 0,
      selectedVendorsCount: 0,
      vendorFilters: {},
    };
  }

  componentDidMount = () => {
    const currentUrl = window.location.href;
    if (currentUrl.split('?')[1]) {
      this.handleTagNumbers();
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      if (_.isEmpty(location.search)) {
        this.handleEmptyState();
        // this.setState({ selectedTagsCount: 0, selectedFiltersCount: 0 });
      }
    }
  }

  handleEmptyState = () => {
    this.setState({ selectedTagsCount: 0, selectedFiltersCount: 0 });
  }

  handleTagNumbers = () => {
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
    this.setState({ selectedTagsCount: filters.selectedTagsUUID.length });
  }

  handleSelectedTags = (count) => {
    this.setState({ selectedTagsCount: count });
  }

  handleSelectedFilters = (count) => {
    this.setState({ selectedFiltersCount: count });
  }

  handleSelectedVendors = (count) => {
    this.setState({ selectedVendorsCount: count });
  }

  handleSelectedVendorTags = (stateValues) => {
    const values = _.cloneDeep(stateValues);
    this.setState({ vendorFilters: values });
  }

  render() {
    const { t, enabledServicesData } = this.props;
    const {
      filterType, selectedFiltersCount, selectedTagsCount, selectedVendorsCount, vendorFilters,
    } = this.state;
    let vendorExists = false;

    if (!_.isEmpty(enabledServicesData) && !_.isEmpty(enabledServicesData.platformServices)) {
      enabledServicesData.platformServices.forEach((service) => {
        if (service.platformService === 'VENDOR') vendorExists = true;
      });
    }

    let FilterContainer = null;
    if (filterType === 'filters') {
      FilterContainer = (
        <EmpTypeFilters
          selectedFilters={(count) => this.handleSelectedFilters(count)}
        />
      );
    } else if (filterType === 'tags') {
      FilterContainer = (
        <TagTypeFilter
          selectedTags={(count) => this.handleSelectedTags(count)}
        />
      );
    } else if (filterType === 'vendors') {
      FilterContainer = (
        <VendorTypeFilters
          selectedTags={(count) => this.handleSelectedVendors(count)}
          selectedTagsToParent={this.handleSelectedVendorTags}
          vendorFilters={vendorFilters}
        />
      );
    }

    return (
      <>
        <div className={cx(styles.dropdownContent)}>
          {/* <EmpOnboarding
                  showModal={this.props.showModal}
                  idNo={this.props.idNo}
                  idState={this.props.idState}
                  idImage={this.props.idImage}
                /> */}
          <div>
            <div className={styles.TagHeading}>{t('translation_empList:empFilters.heading')}</div>
            <hr className={cx('mt-0', styles.HeaderHorizontalLine)} />
          </div>
          <div className={cx(styles.CardLayout)}>
            <div className={cx('row mx-0', styles.Filter)}>
              <div role="button" aria-hidden onClick={() => this.setState({ filterType: 'tags' })} className={cx((vendorExists ? 'col-4 mx-0 px-0' : 'col-6 mx-0 px-0'), filterType === 'tags' ? styles.TagTypeActive : styles.TagType)}>
                <img className={styles.filterIcon} src={filterType === 'tags' ? activeTagFilter : tagFilterIcon} alt={t('translation_empList:empFilters.icon')} />
                <span>{t('translation_empList:empFilters.tags')}</span>
                <label className={filterType === 'tags' ? styles.ActiveNumber : styles.Number} htmlFor={filterType}>
                  {selectedTagsCount}
                </label>
              </div>
              <div role="button" aria-hidden onClick={() => this.setState({ filterType: 'filters' })} className={cx((vendorExists ? 'col-4 mx-0 px-0' : 'col-6 mx-0 px-0'), filterType === 'filters' ? styles.FilterTypeActive : styles.FilterType)}>
                <img className={styles.filterIcon} src={filterType === 'filters' ? activeFilter : filterIcon} alt={t('translation_empList:empFilters.icon')} />
                <span>{t('translation_empList:empFilters.filters')}</span>
                <label className={filterType === 'filters' ? styles.ActiveNumber : styles.Number} htmlFor={filterType}>
                  {selectedFiltersCount}
                </label>
              </div>

              {vendorExists
                ? (
                  <div role="button" aria-hidden onClick={() => this.setState({ filterType: 'vendors' })} className={cx('col-4 mx-0 px-0', filterType === 'vendors' ? styles.FilterTypeActive : styles.FilterType)}>
                    <img className={cx('px-1', styles.VendorIcon)} src={filterType === 'vendors' ? activeVendor : vendorIcon} alt={t('translation_empList:empFilters.icon')} />
                    <span>{t('translation_empList:empFilters.vendors')}</span>
                    <label className={cx('ml-2', filterType === 'vendors' ? styles.ActiveNumber : styles.Number)} htmlFor={filterType}>
                      {selectedVendorsCount}
                    </label>
                  </div>
                )
                : null}
            </div>
            {FilterContainer}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  enabledServicesData: state.empMgmt.staticData.servicesEnabled,
});

export default withTranslation()(withRouter(connect(mapStateToProps, null)(EmpFilters)));
