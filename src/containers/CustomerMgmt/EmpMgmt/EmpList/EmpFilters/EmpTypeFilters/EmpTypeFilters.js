/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Datepicker } from 'react-crux';
import styles from './EmpTypeFilters.module.scss';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import search from '../../../../../../assets/icons/search.svg';
import close from '../../../../../../assets/icons/closeNotification.svg';
import arrowDown from '../../../../../../assets/icons/form.svg';
import arrowUp from '../../../../../../assets/icons/formChecked.svg';

import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import { initFilterElements, filterURLValue } from './InitEmpFilterData';

const initState = {
  entityType: new Set(),
  isActive: new Set(),
  employeeType: new Set(),
  status: new Set(),
  verificationStatus: new Set(),
  onboardFrom: '',
  onboardTo: '',
  gender: new Set(),
  terminationReason: new Set(),
  reportsTo: new Set(),
  tagAssigned: new Set(),
  migrationStatus: new Set(),
  isBasicDetailsFilled: new Set(),
  isAdditionalDetailsFilled: new Set(),
  isEmpDetailsFilled: new Set(),
  isCompanyDocGenerated: new Set(),
  isGovDocGenerated: new Set(),
  createdFrom: '',
  createdTo: '',
  terminatedFromDate: '',
  terminatedToDate: '',
};
class EmpTypeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: { ...initState },
      filterElements: [...initFilterElements],
      searchResult: [...initFilterElements],
      queryString: '',
      openBgvFilter: false,
      openProfileFilter: false,
      openOnboardService: false,
      showTerminationReason: false,
    };
  }

  componentDidMount = () => {
    const currentUrl = window.location.href;
    if (currentUrl.split('?')[1]) {
      this.handleFilterCard();
    }
  }

  componentDidUpdate = (prevProps) => {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      this.handleFilterCard();
    }
  }

  // get selected filters from url to show in filter card.
  handleFilterCard = () => {
    const { selectedFilters } = this.props;
    const { filterType } = this.state;
    const urlSearchParams = new URLSearchParams(window.location.search.toString());
    const filters = filterType;
    let count = 0;
    Object.keys(filters).forEach((key) => {
      filters[key] = urlSearchParams.has(key) ? new Set(urlSearchParams.getAll(key)[0].split(',')) : new Set();
      count += filters[key].size;
    });

    filters.onboardFrom = Array.from(filters.onboardFrom).join('-');
    filters.onboardTo = Array.from(filters.onboardTo).join('-');
    filters.createdFrom = Array.from(filters.createdFrom).join('-');
    filters.createdTo = Array.from(filters.createdTo).join('-');
    filters.terminatedFromDate = Array.from(filters.terminatedFromDate).join('-');
    filters.terminatedToDate = Array.from(filters.terminatedToDate).join('-');

    selectedFilters(count);

    // if termination date is entered, isActive = false
    if (filters.terminatedFromDate) {
      filters.isActive.add('false');
    }

    let showTerminationReason = false;
    if (filters.status.has('TERMINATED')) { showTerminationReason = true; }
    this.setState({ filterType: filters, showTerminationReason });
  }

  formatDate = () => {
    const d = new Date();
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
  }

  // create url for selected filters.
  handleFilterUrl = (filterType) => {
    const { match, history, selectedFilters } = this.props;
    const orgId = match.params.uuid;
    const date = this.formatDate();

    const filters = {
      gender: Array.from(filterType.gender).join(','),
      entityType: Array.from(filterType.entityType).join(','),
      isActive: Array.from(filterType.isActive).join(','),
      employeeType: Array.from(filterType.employeeType).join(','),
      status: Array.from(filterType.status).join(','),
      verificationStatus: Array.from(filterType.verificationStatus).join(','),
      terminationReason: Array.from(filterType.terminationReason).join(','),
      onboardFrom: filterType.onboardFrom,
      onboardTo: !_.isEmpty(filterType.onboardFrom) ? !_.isEmpty(filterType.onboardTo) ? filterType.onboardTo : date : '',
      reportsTo: Array.from(filterType.reportsTo).join(','),
      tagAssigned: Array.from(filterType.tagAssigned).join(','),
      createdFrom: filterType.createdFrom,
      createdTo: !_.isEmpty(filterType.createdFrom) ? !_.isEmpty(filterType.createdTo) ? filterType.createdTo : date : '',
      migrationStatus: Array.from(filterType.migrationStatus).join(','),
      isBasicDetailsFilled: Array.from(filterType.isBasicDetailsFilled).join(','),
      isAdditionalDetailsFilled: Array.from(filterType.isAdditionalDetailsFilled).join(','),
      isEmpDetailsFilled: Array.from(filterType.isEmpDetailsFilled).join(','),
      isCompanyDocGenerated: Array.from(filterType.isCompanyDocGenerated).join(','),
      isGovDocGenerated: Array.from(filterType.isGovDocGenerated).join(','),
      terminatedFromDate: filterType.terminatedFromDate,
      terminatedToDate: !_.isEmpty(filterType.terminatedFromDate) ? !_.isEmpty(filterType.terminatedToDate) ? filterType.terminatedToDate : date : '',
    };

    let filterUrl = `/customer-mgmt/org/${orgId}/employee?`;
    let count = 0;
    let urlSearchParams = new URLSearchParams(window.location.search);
    if (_.includes(urlSearchParams.toString(), 'pageNumber')) {
      const regex = /(?:pageNumber=)([0-9]+)/;
      const newSearchParam = urlSearchParams.toString().replace(regex, '');
      urlSearchParams = new URLSearchParams(newSearchParam);
    }
    Object.keys(filters).forEach((key) => {
      if (filters[key].length > 0) {
        urlSearchParams.set(key, filters[key]);
        count += urlSearchParams.getAll(key)[0].split(',').length;
      } else {
        urlSearchParams.delete(key);
      }
    });
    filterUrl += urlSearchParams.toString();
    selectedFilters(count);
    history.push(filterUrl);
  }

  handleAction = (updatedFilterType, isSelected, category, value) => {
    if (isSelected) {
      return updatedFilterType[category].add(value);
    }
    return updatedFilterType[category].delete(value);
  }

  handleCheckbox = (e, name) => {
    const { filterType } = this.state;
    const updatedFilterType = _.cloneDeep(filterType);
    const filterCategories = ['gender', 'entityType', 'employeeType', 'status', 'migrationStatus',
      'reportsTo', 'verificationStatus',
    ];

    if (filterCategories.includes(name)) {
      this.handleAction(updatedFilterType, e.target.checked, name, filterURLValue[e.target.name]);
      if (name === 'status' && e.target.name === 'terminated') {
        this.setState({ showTerminationReason: e.target.checked });
      }
    } else if (name === 'profileStatus') {
      this.handleAction(updatedFilterType, e.target.checked, 'isActive', filterURLValue[e.target.name]);
    } else if (name === 'terminated') {
      this.handleAction(updatedFilterType, e.target.checked, 'terminationReason', filterURLValue[e.target.name]);
    } else if (name === 'tags') {
      this.handleAction(updatedFilterType, e.target.checked, 'tagAssigned', filterURLValue[e.target.name]);
    } else if (name === 'profileState') {
      if (e.target.name === 'basic registration completed') {
        this.handleAction(updatedFilterType, e.target.checked, 'isBasicDetailsFilled', 'true');
      } else if (e.target.name === 'additional data added') {
        this.handleAction(updatedFilterType, e.target.checked, 'isAdditionalDetailsFilled', 'true');
      } else if (e.target.name === 'employment details added') {
        this.handleAction(updatedFilterType, e.target.checked, 'isEmpDetailsFilled', 'true');
      } else if (e.target.name === 'company documents generated') {
        this.handleAction(updatedFilterType, e.target.checked, 'isCompanyDocGenerated', 'true');
      } else if (e.target.name === 'government documents generated') {
        this.handleAction(updatedFilterType, e.target.checked, 'isGovDocGenerated', 'true');
      }
    } else if (name === 'pendingProfile') {
      if (e.target.name === 'additional details') {
        this.handleAction(updatedFilterType, e.target.checked, 'isAdditionalDetailsFilled', 'false');
      } else if (e.target.name === 'employment details') {
        this.handleAction(updatedFilterType, e.target.checked, 'isEmpDetailsFilled', 'false');
      } else if (e.target.name === 'company documents') {
        this.handleAction(updatedFilterType, e.target.checked, 'isCompanyDocGenerated', 'false');
      } else if (e.target.name === 'government documents') {
        this.handleAction(updatedFilterType, e.target.checked, 'isGovDocGenerated', 'false');
      }
    }
    this.handleFilterUrl(updatedFilterType);
    this.setState({
      filterType: updatedFilterType,
    });
  }

  handleDateInput = (value, name) => {
    const { filterType } = this.state;
    const updatedFilterType = _.cloneDeep(filterType);
    updatedFilterType[name] = (value !== null) ? value : '';

    if (value !== null && value.length === 10) {
      if (name === 'terminatedFromDate') {
        updatedFilterType.isActive.add('false');
      }
      this.handleFilterUrl(updatedFilterType);
    } else if (filterType.name !== null && (value === null || value === '')) {
      this.handleFilterUrl(updatedFilterType);
    }
    this.setState({ filterType: updatedFilterType });
  }

  handleInputChange = (event) => {
    const { filterElements } = this.state;
    this.setState({ queryString: event.target.value });
    const allFilterElements = _.cloneDeep(filterElements);
    const searchResult = allFilterElements.filter(
      (element) => element.indexOf(event.target.value) > -1,
    );
    this.setState({ searchResult });
  }

  handleClearFilter = () => {
    this.handleFilterUrl(initState);
    this.setState({ filterType: initState, showTerminationReason: false });
  }

  handleDateInput = (event, name) => {
    const filterType = _.cloneDeep(this.state.filterType);
    if (name === 'onboardFrom') {
      filterType.onboardFrom = event.value; // this.setState({ onboardFrom: event.value})
    } else if (name === 'onboardTo') {
      filterType.onboardTo = event.value; // this.setState({ onboardTo: event.value})
    } else if (name === 'createdFrom') {
      filterType.createdFrom = event.value; // this.setState({ createdFrom: event.value})
    } else if (name === 'createdTo') {
      filterType.createdTo = event.value; // this.setState({ createdTo: event.value})
    }
    this.handleFilterUrl(filterType);
    this.setState({ filterType });
  }

  render() {
    const { t, servicesEnabled } = this.props;
    const {
      searchResult, openProfileFilter, openOnboardService, openBgvFilter, queryString, filterType,
      showTerminationReason,
    } = this.state;

    let isBgvEnabled = false;
    if (!_.isEmpty(servicesEnabled)) {
      const products = _.cloneDeep(servicesEnabled.products);

      _.forEach(products, (prod) => {
        if (prod.product === 'BGV') {
          isBgvEnabled = true;
        }
      });
    }

    return (
      <>
        <div className={cx(styles.filterContainer, scrollStyle.scrollbar)}>
          <div className={cx('d-flex flex-row', styles.SearchHead)}>
            <div className="col-8 d-flex flex-row px-0 mx-0">
              <img src={search} alt={t('translation_empList:empFilters.searchIcon')} className={cx('pb-1 mr-1', styles.imgSize)} />
              <input
                name="FilterSearch"
                className={cx(styles.FilterSearch, 'col-10 px-0')}
                type="text"
                value={queryString}
                placeholder={t('translation_empList:empFilters.searchPlaceholder')}
                onChange={(event) => this.handleInputChange(event)}
                autoComplete="off"
              />

            </div>
            <div className="col-4" style={{ textAlign: 'end', paddingTop: '0.9rem', paddingRight: '0.7rem' }}>
              {queryString.length === 0
                ? <label className={cx(styles.ClearFilter)} aria-hidden htmlFor="clear" onClick={() => this.handleClearFilter()}>{t('translation_empList:empFilters.clear')}</label>
                : (
                  <img
                    src={close}
                    className={cx(styles.ClearFilter)}
                    alt={t('translation_empList:empFilters.close')}
                    height="16px"
                    width="16px"
                    onClick={() => this.setState({ queryString: '', searchResult: initFilterElements })}
                    aria-hidden
                  />
                )}
            </div>

          </div>
          <hr className={cx('mb-2 mt-2', styles.HorizontalLine)} />
          <div className={cx(styles.FilterBox)}>

            {searchResult.includes('male') || searchResult.includes('female') || searchResult.includes('other') || searchResult.includes('employee') || searchResult.includes('tenant') || searchResult.includes('business associate')
              || searchResult.includes('full-time') || searchResult.includes('part-time') || searchResult.includes('contractor') || searchResult.includes('assigned') || searchResult.includes('not assigned')
              || searchResult.includes('from') || searchResult.includes('to') || searchResult.includes('createdFrom') || searchResult.includes('createdTo') || searchResult.includes('direct reportee')
              || searchResult.includes('migrated') || searchResult.includes('local') || searchResult.includes('active') || searchResult.includes('inactive terminated')
              || searchResult.includes('terminatedFromDate') || searchResult.includes('terminatedToDate')
              ? (
                <>
                  <div className="pb-1">
                    <label className={cx('col-7 pl-3', styles.FilterHeadings)}>
                      <img
                        src={openProfileFilter ? arrowUp : arrowDown}
                        alt="profile filter expand"
                        onClick={() => this.setState(
                          { openProfileFilter: !openProfileFilter },
                        )}
                        height="16px"
                        width="16px"
                        className="mr-2"
                        aria-hidden
                      />
                      profile filters
                    </label>
                    <br />

                  </div>
                  {openProfileFilter
                    ? (
                      <div>
                        {searchResult.includes('male') || searchResult.includes('female') || searchResult.includes('other')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="col-12 pl-0">
                                  <label className={cx('pl-3', styles.Headings)} htmlFor="clear">gender</label>
                                  <br />
                                  <div className="row pl-3 mx-0">
                                    {searchResult.includes('male')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.male')}
                                          name="male"
                                          className="col-3 mr-4"
                                          value={filterType.gender.has('MALE')}
                                          onChange={(e) => this.handleCheckbox(e, 'gender')}
                                          checkBoxStyle={styles.checkBoxStyle}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('female')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.female')}
                                          name="female"
                                          className="col-3 mr-3"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.gender.has('FEMALE')}
                                          onChange={(e) => this.handleCheckbox(e, 'gender')}
                                        />
                                      )
                                      : null}
                                    {_.includes(searchResult, 'other')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.other')}
                                          name="other"
                                          className="col-3"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.gender.has('OTHER')}
                                          onChange={(e) => this.handleCheckbox(e, 'gender')}
                                        />
                                      )
                                      : null}

                                  </div>
                                </div>
                              </div>

                            </>
                          ) : null}
                        {searchResult.includes('employee') || searchResult.includes('tenant') || searchResult.includes('business associate')
                          ? (
                            <>

                              <div className="row ml-0">
                                <div className="col-12 pl-0">
                                  <label className={cx('pl-3', styles.Headings)}>entity type</label>
                                  <br />
                                  <div className="row pl-3 mx-0">
                                    {searchResult.includes('employee')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.emp')}
                                          name="employee"
                                          className="col-4"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.entityType.has('EMPLOYEE')}
                                          onChange={(e) => this.handleCheckbox(e, 'entityType')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('tenant')

                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.tenant')}
                                          name="tenant"
                                          className="col-3"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.entityType.has('TENANT')}
                                          onChange={(e) => this.handleCheckbox(e, 'entityType')}
                                        />
                                      )
                                      : null}

                                  </div>
                                  <div className="row pl-3 mx-0">
                                    {searchResult.includes('business associate')

                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.businessAssociate')}
                                          name="business associate"
                                          className="col-8"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.entityType.has('BUSINESS_ASSOCIATE')}
                                          onChange={(e) => this.handleCheckbox(e, 'entityType')}
                                        />
                                      )
                                      : null}

                                  </div>

                                </div>
                              </div>

                            </>
                          ) : null}

                        {searchResult.includes('active') || searchResult.includes('inactive terminated')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="col-12 pl-0">
                                  <label className={cx('pl-3', styles.Headings)}>current profile status</label>
                                  <br />
                                  <div className="row pl-3 mx-0">
                                    {searchResult.includes('active')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label="active"
                                          name="active"
                                          className="col-4 pr-0 mr-1"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.isActive.has('true')}
                                          onChange={(e) => this.handleCheckbox(e, 'profileStatus')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('inactive terminated')

                                      ? (
                                        <CheckBox
                                          type="small"
                                          label="inactive (terminated)"
                                          name="inactive"
                                          className="col-6 pr-0 mr-1"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.isActive.has('false')}
                                          onChange={(e) => this.handleCheckbox(e, 'profileStatus')}
                                        />
                                      )
                                      : null}

                                  </div>
                                </div>
                              </div>

                            </>
                          )
                          : null}

                        {searchResult.includes('full-time') || searchResult.includes('part-time') || searchResult.includes('contractor')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="col-11 px-0">
                                  <label className={cx('pl-3', styles.Headings)}>employment type</label>
                                  <br />
                                  <div className="row pl-3 mx-0">
                                    {searchResult.includes('full-time')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.fullTime')}
                                          name="fullTime"
                                          className="col-4 pr-0 mr-1"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.employeeType.has('FULL_TIME')}
                                          onChange={(e) => this.handleCheckbox(e, 'employeeType')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('part-time')

                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.partTime')}
                                          name="partTime"
                                          className="col-4 pr-0 mr-1"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.employeeType.has('PART_TIME')}
                                          onChange={(e) => this.handleCheckbox(e, 'employeeType')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('contractor')

                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.contractor')}
                                          name="contractor"
                                          className="col-4 mx-0 px-0"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.employeeType.has('CONTRACTOR')}
                                          onChange={(e) => this.handleCheckbox(e, 'employeeType')}
                                        />
                                      )
                                      : null}

                                  </div>
                                </div>
                              </div>

                            </>
                          )
                          : null}

                        {searchResult.includes('assigned') || searchResult.includes('not assigned')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="col-12 pl-0">
                                  <label className={cx('pl-3', styles.Headings)}>tags</label>
                                  <br />
                                  <div className="row pl-3 mx-0">
                                    {searchResult.includes('assigned')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.assigned')}
                                          name="assigned"
                                          className="col-3 mr-3"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.tagAssigned.has('true')}
                                          onChange={(e) => this.handleCheckbox(e, 'tags')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('not assigned')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label={t('translation_empList:empFilters.notAssigned')}
                                          name="notAssigned"
                                          className="col-7"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.tagAssigned.has('false')}
                                          onChange={(e) => this.handleCheckbox(e, 'tags')}
                                        />
                                      )
                                      : null}
                                  </div>
                                </div>
                              </div>

                            </>
                          )
                          : null}
                        {searchResult.includes('from') || searchResult.includes('to')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="pl-0">
                                  <label className={cx('pl-3', styles.Headings)}>{t('translation_empList:empFilters.date')}</label>
                                  <br />
                                  <div className="row mx-0 ml-3 ">
                                    {searchResult.includes('from')
                                      ? (
                                        <Datepicker
                                          name="from"
                                          className={cx('p-0 mb-0', styles.DateInput)}
                                          label=""
                                          type="text"
                                          value={filterType.onboardFrom}
                                          onChange={(value) => this.handleDateInput(value, 'onboardFrom')}
                                        // onError={(error) => this.setState({ error })}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('to')
                                      ? (
                                        <>
                                          <span className={cx('p-1', styles.ToText)}>{t('translation_empList:empFilters.to')}</span>
                                          <Datepicker
                                            name="to"
                                            className={cx('p-0 mb-0', styles.DateInput)}
                                            label=""
                                            type="text"
                                            disabled={filterType.onboardFrom == null
                                              || filterType.onboardFrom.length !== 10}
                                            value={filterType.onboardTo}
                                            onChange={(event) => this.handleDateInput(event, 'onboardTo')}
                                          //   onError={(error) => this.setState({ error })}
                                          />
                                        </>
                                      )
                                      : null}
                                  </div>
                                </div>
                              </div>

                            </>
                          )
                          : null}

                        {searchResult.includes('createdFrom') || searchResult.includes('createdTo')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="pl-0">
                                  <label className={cx('pl-3', styles.Headings)}>created date range</label>
                                  <br />
                                  <div className="row mx-0 ml-3">
                                    {searchResult.includes('createdFrom')
                                      ? (
                                        <Datepicker
                                          name="createdFrom"
                                          className={cx('p-0 mb-0', styles.DateInput)}
                                          label=""
                                          type="text"
                                          value={filterType.createdFrom}
                                          onChange={(event) => this.handleDateInput(event, 'createdFrom')}
                                        // onError={(error) => this.setState({ error })}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('createdTo')
                                      ? (
                                        <>
                                          <span className={cx('p-1', styles.ToText)}>{t('translation_empList:empFilters.to')}</span>
                                          <Datepicker
                                            name="createdTo"
                                            className={cx('p-0 mb-0', styles.DateInput)}
                                            label=""
                                            type="text"
                                            value={filterType.createdTo}
                                            disabled={filterType.createdFrom == null
                                              || filterType.createdFrom.length !== 10}
                                            onChange={(event) => this.handleDateInput(event, 'createdTo')}
                                          //   onError={(error) => this.setState({ error })}
                                          />
                                        </>
                                      )
                                      : null}
                                  </div>
                                </div>
                              </div>

                            </>
                          )
                          : null}

                        {searchResult.includes('terminatedFromDate') || searchResult.includes('terminatedToDate')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="pl-0">
                                  <label className={cx('pl-3', styles.Headings)}>{t('translation_empList:empFilters.terminatedDateRange')}</label>
                                  <br />
                                  <div className="row mx-0 ml-3">
                                    {searchResult.includes('terminatedFromDate')
                                      ? (
                                        <Datepicker
                                          name="terminatedFromDate"
                                          className={cx('p-0 mb-0', styles.DateInput)}
                                          label=""
                                          type="text"
                                          value={filterType.terminatedFromDate}
                                          onChange={(event) => this.handleDateInput(event, 'terminatedFromDate')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('terminatedToDate')
                                      ? (
                                        <>
                                          <span className={cx('p-1', styles.ToText)}>{t('translation_empList:empFilters.to')}</span>
                                          <Datepicker
                                            name="terminatedToDate"
                                            className={cx('p-0 mb-0', styles.DateInput)}
                                            label=""
                                            type="text"
                                            value={filterType.terminatedToDate}
                                            disabled={filterType.terminatedFromDate == null
                                              || filterType.terminatedFromDate.length !== 10}
                                            onChange={(event) => this.handleDateInput(event, 'terminatedToDate')}
                                          />
                                        </>
                                      ) : null}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        {searchResult.includes('direct reportee')
                          ? (
                            <>

                              <div className="pb-1">
                                <label className={cx('col-12 pl-3', styles.Headings)}>{t('translation_empList:empFilters.report')}</label>
                                <br />
                                <div className="row pl-3 mx-0">
                                  {searchResult.includes('direct reportee')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label={t('translation_empList:empFilters.direct')}
                                        name="directReportee"
                                        className="col-12"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.reportsTo.has('me')}
                                        onChange={(e) => this.handleCheckbox(e, 'reportsTo')}
                                      />
                                    )
                                    : null}
                                  {/* <input className={cx(styles.RadioButton)}
                                    type="radio" name="directReportee" value="directReportee"
                                    onChange={(e) => this.handleCheckbox(e, "reportsTo")}/>
                    <label className={cx('ml-2 mr-4', styles.smallLabel)}>
                    direct reportee</label>
                                    <input className={cx(styles.RadioButton)}
                                    type="radio" name="all" value="all"
                                    onChange={(e) => this.handleCheckbox(e, "reportsTo")}/>
                    <label className={cx('ml-2 mr-4', styles.smallLabel)}>all</label> */}
                                </div>
                              </div>
                              {/* <hr className={cx('mt-2', styles.HorizontalLine)} /> */}
                            </>
                          )

                          : null}

                        {searchResult.includes('migrated') || searchResult.includes('local')
                          ? (
                            <>
                              <div className="row ml-0">
                                <div className="pl-0 col-10">
                                  <label className={cx('pl-3', styles.Headings)}>migration status</label>
                                  <br />
                                  <div className="row mx-0 pl-3">
                                    {searchResult.includes('migrated')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label="migrated"
                                          name="migrated"
                                          className="col-5 mr-1"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.migrationStatus.has('MIGRATED')}
                                          onChange={(e) => this.handleCheckbox(e, 'migrationStatus')}
                                        />
                                      )
                                      : null}
                                    {searchResult.includes('local')
                                      ? (
                                        <CheckBox
                                          type="small"
                                          label="local"
                                          name="local"
                                          className="col-4"
                                          checkBoxStyle={styles.checkBoxStyle}
                                          value={filterType.migrationStatus.has('LOCAL')}
                                          onChange={(e) => this.handleCheckbox(e, 'migrationStatus')}
                                        />
                                      )
                                      : null}
                                  </div>
                                </div>
                              </div>

                            </>
                          )
                          : null}

                      </div>
                    ) : null}
                  <hr className={cx('my-2', styles.HorizontalLine)} />
                </>
              ) : null}

            {searchResult.includes('basic registration completed') || searchResult.includes('additional data added') || searchResult.includes('employment details added')
              || searchResult.includes('company documents generated') || searchResult.includes('government documents generated') || searchResult.includes('hired') || searchResult.includes('pre-hired') || searchResult.includes('terminated')
              || searchResult.includes('notified superiors') || searchResult.includes('absconded') || searchResult.includes('terminated') || searchResult.includes('additional details') || searchResult.includes('employment details')
              || searchResult.includes('company documents') || searchResult.includes('government documents')
              ? (
                <>
                  <div className="pb-1">
                    <label className={cx('col-7 pl-3', styles.FilterHeadings)}>
                      <img
                        src={openOnboardService ? arrowUp : arrowDown}
                        alt="onboard service arrow"
                        onClick={() => this.setState(
                          { openOnboardService: !openOnboardService },
                        )}
                        height="16px"
                        width="16px"
                        className="mr-2"
                        aria-hidden
                      />
                      onboard service
                    </label>
                    <br />
                    {openOnboardService

                      ? (
                        <div className="d-flex flex-column">
                          {searchResult.includes('basic registration completed') || searchResult.includes('additional data added') || searchResult.includes('employment details added')
                            || searchResult.includes('company documents generated') || searchResult.includes('government documents generated')
                            ? (
                              <>
                                <label className={cx('col-7 pl-3', styles.Headings)}>profile state</label>
                                <div className="d-flex flex-column" style={{ paddingLeft: '1rem' }}>
                                  {searchResult.includes('basic registration completed')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="basic registration completed"
                                        name="basic registration completed"
                                        className="col-12 pr-0 mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isBasicDetailsFilled.has('true')}
                                        onChange={(e) => this.handleCheckbox(e, 'profileState')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('additional data added')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="additional data added"
                                        name="additional data added"
                                        className="col-12 pr-0 mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isAdditionalDetailsFilled.has('true')}
                                        onChange={(e) => this.handleCheckbox(e, 'profileState')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('employment details added')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="employment details added"
                                        name="employment details added"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isEmpDetailsFilled.has('true')}
                                        onChange={(e) => this.handleCheckbox(e, 'profileState')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('company documents generated')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="company documents generated"
                                        name="company documents generated"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isCompanyDocGenerated.has('true')}
                                        onChange={(e) => this.handleCheckbox(e, 'profileState')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('government documents generated')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="government documents generated"
                                        name="government documents generated"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isGovDocGenerated.has('true')}
                                        onChange={(e) => this.handleCheckbox(e, 'profileState')}
                                      />
                                    )
                                    : null}

                                </div>
                              </>
                            ) : null}

                          {searchResult.includes('hired') || searchResult.includes('pre-hired') || searchResult.includes('terminated')
                            ? (
                              <>
                                <div className="row ml-0">
                                  <div className="col-11 pl-0">
                                    <label className={cx('pl-3', styles.Headings)}>employment status</label>
                                    <br />
                                    <div className="row ml-3 mx-0">
                                      {searchResult.includes('hired')
                                        ? (
                                          <CheckBox
                                            type="small"
                                            label={t('translation_empList:empFilters.hired')}
                                            name="hired"
                                            className="col-3 mr-2"
                                            checkBoxStyle={styles.checkBoxStyle}
                                            value={filterType.status.has('HIRED')}
                                            onChange={(e) => this.handleCheckbox(e, 'status')}
                                          />
                                        )
                                        : null}
                                      {searchResult.includes('pre-hired')
                                        ? (
                                          <CheckBox
                                            type="small"
                                            label={t('translation_empList:empFilters.preHired')}
                                            name="preHired"
                                            className="col-4 pr-0  mr-2"
                                            checkBoxStyle={styles.checkBoxStyle}
                                            value={filterType.status.has('PRE_HIRED')}
                                            onChange={(e) => this.handleCheckbox(e, 'status')}
                                          />
                                        )
                                        : null}
                                      {searchResult.includes('terminated')
                                        ? (
                                          <CheckBox
                                            type="small"
                                            label={t('translation_empList:empFilters.terminated')}
                                            name="terminated"
                                            className="col-4 "
                                            checkBoxStyle={styles.checkBoxStyle}
                                            value={showTerminationReason}
                                            onChange={(e) => this.handleCheckbox(e, 'status')}
                                          />
                                        )
                                        : null}
                                    </div>

                                  </div>
                                </div>

                              </>
                            )
                            : null}

                          {showTerminationReason

                            ? searchResult.includes('notified superiors') || searchResult.includes('absconded') || searchResult.includes('terminated')

                              ? (
                                <>

                                  <div className="row ml-0">
                                    <div className="col-12 pl-0">
                                      <label className={cx('pl-3', styles.Headings)}>termination reason</label>
                                      <br />
                                      <div className="row ml-3 mx-0">
                                        {searchResult.includes('notified superiors')
                                          ? (
                                            <CheckBox
                                              type="small"
                                              label={t('translation_empList:empFilters.notifiedSup')}
                                              name="notifiedSuperiors"
                                              className="col-5  mr-3"
                                              checkBoxStyle={styles.checkBoxStyle}
                                              value={filterType.terminationReason.has('NOTIFIED_SUPERIORS')}
                                              onChange={(e) => this.handleCheckbox(e, 'terminated')}
                                            />
                                          )
                                          : null}
                                        {searchResult.includes('absconded')
                                          ? (
                                            <CheckBox
                                              type="small"
                                              label={t('translation_empList:empFilters.abs')}
                                              name="absconded"
                                              className="col-4  mr-3"
                                              checkBoxStyle={styles.checkBoxStyle}
                                              value={filterType.terminationReason.has('ABSCONDED')}
                                              onChange={(e) => this.handleCheckbox(e, 'terminated')}
                                            />
                                          )
                                          : null}
                                        {searchResult.includes('terminated')
                                          ? (
                                            <CheckBox
                                              type="small"
                                              label={t('translation_empList:empFilters.terminated')}
                                              name="gotTerminated"
                                              className="col-4 "
                                              checkBoxStyle={styles.checkBoxStyle}
                                              value={filterType.terminationReason.has('TERMINATED')}
                                              onChange={(e) => this.handleCheckbox(e, 'terminated')}
                                            />
                                          )
                                          : null}

                                      </div>
                                    </div>
                                  </div>

                                </>
                              ) : null
                            : null}

                          {(searchResult.includes('additional details') || searchResult.includes('employment details')
                            || searchResult.includes('company documents') || searchResult.includes('government documents'))
                            ? (
                              <>
                                <label className={cx('col-7 pl-3', styles.Headings)}>pending profiles for</label>
                                <div className="d-flex flex-column" style={{ paddingLeft: '1rem' }}>

                                  {searchResult.includes('additional details')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="additional details"
                                        name="additional details"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isAdditionalDetailsFilled.has('false')}
                                        onChange={(e) => this.handleCheckbox(e, 'pendingProfile')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('employment details')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="employment details"
                                        name="employment details"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isEmpDetailsFilled.has('false')}
                                        onChange={(e) => this.handleCheckbox(e, 'pendingProfile')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('company documents generated')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="company documents"
                                        name="company documents"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isCompanyDocGenerated.has('false')}
                                        onChange={(e) => this.handleCheckbox(e, 'pendingProfile')}
                                      />
                                    )
                                    : null}

                                  {searchResult.includes('government documents')
                                    ? (
                                      <CheckBox
                                        type="small"
                                        label="government documents"
                                        name="government documents"
                                        className="col-12  mr-3 mt-1"
                                        checkBoxStyle={styles.checkBoxStyle}
                                        value={filterType.isGovDocGenerated.has('false')}
                                        onChange={(e) => this.handleCheckbox(e, 'pendingProfile')}
                                      />
                                    )
                                    : null}

                                </div>
                              </>
                            ) : null}

                        </div>
                      ) : null}

                  </div>

                  <hr className={cx('my-2', styles.HorizontalLine)} />
                </>
              ) : null}

            {isBgvEnabled

              ? (
                <>

                  {searchResult.includes('red') || searchResult.includes('yellow') || searchResult.includes('green') || searchResult.includes('not initiated')
                    || searchResult.includes('in progress') || searchResult.includes('missing information') || searchResult.includes('insufficient information')
                    ? (
                      <div className="pb-1">
                        <label className={cx('col-7 pl-3', styles.FilterHeadings)}>
                          <img
                            src={openBgvFilter ? arrowUp : arrowDown}
                            alt={t('translation_empList:empFilters.arrow')}
                            onClick={() => this.setState(
                              { openBgvFilter: !openBgvFilter },
                            )}
                            height="16px"
                            width="16px"
                            className="mr-2"
                            aria-hidden
                          />
                          {t('translation_empList:empFilters.service')}
                        </label>
                        <br />
                        {openBgvFilter
                          ? (
                            <>
                              <label className={cx('col-7 pl-3', styles.Headings)}>{t('translation_empList:empFilters.verify')}</label>
                              <br />

                              <div className="row mx-0 ml-3">
                                {searchResult.includes('red')
                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.red')}
                                      name="red"
                                      className="col-3  mr-3 mt-1"
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('RED')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                                {searchResult.includes('yellow')

                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.yellow')}
                                      name="yellow"
                                      className="col-3  mr-3 mt-1"
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('YELLOW')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                                {searchResult.includes('green')

                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.green')}
                                      name="green"
                                      className="col-3 mt-1 "
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('GREEN')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                                {searchResult.includes('not initiated')

                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.notInitiated')}
                                      name="notInitiated"
                                      className="col-5  mt-1"
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('NOT_INITIATED')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                                {searchResult.includes('in progress')
                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.inProgress')}
                                      name="inProgress"
                                      className="col-5  mt-1"
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('inProgress')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                                {searchResult.includes('missing information')
                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.missingInfo')}
                                      name="missing_info"
                                      className="col-9  mt-1"
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('missing_info')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                                {searchResult.includes('insufficient information')
                                  ? (
                                    <CheckBox
                                      type="small"
                                      label={t('translation_empList:empFilters.insuffInfo')}
                                      name="insufficient_info"
                                      className="col-9  mt-1"
                                      checkBoxStyle={styles.checkBoxStyle}
                                      value={filterType.verificationStatus.has('insufficient_info')}
                                      onChange={(e) => this.handleCheckbox(e, 'verificationStatus')}
                                    />
                                  )
                                  : null}
                              </div>
                            </>
                          )
                          : null}
                      </div>
                    )

                    : null}
                </>
              )

              : null}
          </div>
        </div>

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getVendorListState: state.empMgmt.empList.getVendorListState,
  vendorList: state.empMgmt.empList.vendorList,
  getClientListState: state.empMgmt.empList.getClientListState,
  clientList: state.empMgmt.empList.clientList,
  servicesEnabled: state.empMgmt.staticData.servicesEnabled,
});

export default withTranslation()(withRouter(connect(mapStateToProps)(EmpTypeFilter)));
