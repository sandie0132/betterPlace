/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable dot-notation */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import cx from 'classnames';
import moment from 'moment';
import { Tooltip, Notifier, Button } from 'react-crux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './HolidayConfig.module.scss';
import DropDownSmall from '../../../../../components/Atom/SmallDropDown/SmallDropDown';
import holidayConfigIcon from '../../../../../assets/icons/attendenceContainer.svg';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import TagSearchField from '../../../../TagSearch/TagSearchField/TagSearchField';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import blueEdit from '../../../../../assets/icons/blueEdit.svg';
import viewIcon from '../../../../../assets/icons/eyeIconViewMode.svg';
import form from '../../../../../assets/icons/form.svg';
import formChecked from '../../../../../assets/icons/formChecked.svg';
import * as actions from './Store/action';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

class HolidayConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      filterTags: [],
      publicHoliday: [],
      regionalHoliday: [],
      showPublicDropdown: false,
      selectedYear: new Date().getFullYear().toString(),
      getInputTags: false,
      showNotification: true,
    };
    this._isMounted = true;
  }

  componentDidMount = () => {
    const { location } = this.props;
    const query = new URLSearchParams(location.search);
    let year = query.get('year');
    if (isEmpty(year)) {
      year = new Date().getFullYear().toString();
    }
    this.setState({ selectedYear: year });
    this.handleApiCallFromUrl(true);
    this.disableNotification();
  }

  componentDidUpdate = (prevProps) => {
    const { getHolidayConfigListState, getTagListState, location } = this.props;
    const { getInputTags } = this.state;

    if (getHolidayConfigListState !== prevProps.getHolidayConfigListState && getHolidayConfigListState === 'SUCCESS') {
      this.handleHolidaySplit();
    }

    if (location.search !== prevProps.location.search) {
      this.handleApiCallFromUrl(false);
    }

    if (getTagListState !== prevProps.getTagListState && getTagListState === 'SUCCESS' && getInputTags) {
      this.handleSetFilterTags();
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  disableNotification = () => {
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({
          showNotification: false,
        });
      }
    }, 5000);
  }

  handleGetVendorQueryParams = () => {
    const { location } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    if (urlSearchParams.get('vendorId')) {
      return { vendorId: urlSearchParams.get('vendorId') };
    }
    if (urlSearchParams.get('clientId')) {
      return { clientId: urlSearchParams.get('clientId') };
    }
    return {};
  }

  handleApiCallFromUrl = (fetchInputTags) => {
    const { match, location, onGetHolidayConfig } = this.props;
    const query = new URLSearchParams(location.search);
    const orgId = match.params.uuid;
    let year = query.get('year');
    if (isEmpty(year)) {
      year = new Date().getFullYear().toString();
    }
    const tags = query.get('tags');
    const vendorParams = { ...this.handleGetVendorQueryParams() };
    onGetHolidayConfig(orgId, year, tags, fetchInputTags, vendorParams);
    this.setState({ getInputTags: fetchInputTags });
  }

  handleSetFilterTags = () => {
    const { location, tagList } = this.props;
    const query = new URLSearchParams(location.search);
    const tags = query.get('tags');
    const filterTags = [];
    if (!isEmpty(tags)) {
      const inputTags = tags.split(',');
      inputTags.forEach((tag) => {
        const selectedTag = tagList.filter((item) => item.uuid === tag);
        filterTags.push(selectedTag[0]);
      });
    }
    this.setState({ filterTags });
  }

  redirectToAddNew = () => {
    const { match, history, location } = this.props;
    const orgId = match.params.uuid;
    const urlSearchParams = new URLSearchParams(location.search);
    history.push(`/customer-mgmt/org/${orgId}/attendconfig/holiday-config/holiday-config-detail/add?${urlSearchParams.toString()}`);
  }

  handleHolidaySplit = () => {
    const publicHoliday = []; const regionalHoliday = [];
    const { holidayConfigList } = this.props;

    holidayConfigList.forEach((holiday) => {
      if (holiday.holidayType === 'REGIONAL') { regionalHoliday.push(holiday); } else { publicHoliday.push(holiday); }
    });
    this.setState({ publicHoliday, regionalHoliday });
  }

  handleTagInput = (event, inputIdentifier, action) => {
    const { filterTags, selectedYear } = this.state;
    let updatedFilterTags = [...filterTags];
    if (inputIdentifier === 'tags') {
      if (action === 'add') {
        updatedFilterTags = [
          ...updatedFilterTags.slice(0),
          event.value,
        ];
      } else if (action === 'delete') {
        updatedFilterTags = updatedFilterTags.filter((tag) => tag.uuid !== event.value.uuid);
      }
    }
    this.handleUrlChange(updatedFilterTags, selectedYear);
    this.setState({
      filterTags: updatedFilterTags,
    });
  };

  handleDropdown = (value) => {
    const { filterTags } = this.state;
    this.setState({ selectedYear: value });
    this.handleUrlChange(filterTags, value);
  }

  handleUrlChange = (tagList, year) => {
    const { match, history, location } = this.props;
    const orgId = match.params.uuid;
    let url = `/customer-mgmt/org/${orgId}/attendconfig/holiday-config`;
    const urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.set('year', year);
    if (!isEmpty(tagList)) {
      let tagIdList = [];
      tagList.forEach((tag) => {
        tagIdList.push(tag.uuid);
      });
      tagIdList = tagIdList.join(',');
      urlSearchParams.set('tags', tagIdList);
    } else {
      urlSearchParams.delete('tags');
    }
    url = `${url}?${urlSearchParams.toString()}`;
    history.push(url);
  }

  handleDropdownOptions = () => {
    const currentYear = new Date().getFullYear();
    let futureLimit = currentYear + 5;
    let timespan = 10; const options = [];
    while (timespan >= 0) {
      const obj = {}; obj.option = futureLimit.toString();
      obj.optionLabel = futureLimit.toString(); options.push(obj);
      timespan -= 1; futureLimit -= 1;
    }
    return options;
  }

  handleLocationTags = (holidayData, tagType) => {
    let element = null;
    const { tagList } = this.props;
    if (holidayData.allTags && tagType === 'includeTags') {
      element = (
        <span className={cx(styles.headingWidth3, styles.listSmallText)} style={{ paddingTop: '8px' }}>all locations</span>
      );
    } else if (isEmpty(holidayData[tagType])) {
      element = (
        <span className={cx(styles.headingWidth3, styles.listSmallText)} style={{ paddingTop: '8px' }}> - - </span>
      );
    } else if (!isEmpty(tagList)) {
      const tagNames = [];
      holidayData[tagType].forEach((tag) => {
        const selectedTag = tagList.filter((item) => item.uuid === tag);
        if (!isEmpty(selectedTag)) {
          tagNames.push(selectedTag[0].name.toLowerCase());
        }
      });
      if (!isEmpty(tagNames)) {
        const first = tagNames[0];
        tagNames.shift();
        const remainingList = tagNames.join(', ');
        element = (
          <div className={cx('d-flex flex-row', styles.headingWidth3)}>
            <div className={styles.locationNameContainer}>
              <span data-tip={`tooltip${first}`} data-for={`tooltip${first}`} className={styles.textElipsis}>{first}</span>
              <Tooltip id={`tooltip${first}`} place="bottom" tooltipClass={styles.tooltiptext} arrowColor="transparent">
                <span>{first}</span>
              </Tooltip>
            </div>
            {tagNames.length >= 1
              && (
                <div className={styles.locationNameContainer}>
                  <span data-tip={`tooltip${remainingList}`} data-for={`tooltip${remainingList}`}>
                    {`+ ${tagNames.length} more`}
                  </span>
                  <Tooltip id={`tooltip${remainingList}`} place="bottom" tooltipClass={styles.tooltiptext} arrowColor="transparent">
                    <span>{remainingList}</span>
                  </Tooltip>
                </div>
              )}
          </div>
        );
      }
    }
    return element;
  }

  togglePublicDropdown = () => {
    const { showPublicDropdown } = this.state;
    this.setState({ showPublicDropdown: !showPublicDropdown });
  }

  handleShowVendorDropDown = () => {
    let showVendorDropDown = false;
    const { enabledServices } = this.props;
    if (!isEmpty(enabledServices) && !isEmpty(enabledServices.platformServices)) {
      forEach(enabledServices.platformServices, (service) => {
        if (service.platformService === 'VENDOR') showVendorDropDown = true;
      });
    }
    return showVendorDropDown;
  }

  handleSelectFromVendor = (type, org) => {
    const { location, history } = this.props;
    const { filterTags } = this.state;
    const urlSearchParams = new URLSearchParams(location.search);
    if (type === 'org') {
      urlSearchParams.delete('vendorId');
      urlSearchParams.delete('clientId');
    } else if (type === 'vendor') {
      urlSearchParams.delete('clientId');
      urlSearchParams.set('vendorId', org._id);
    } else if (type === 'client') {
      urlSearchParams.delete('vendorId');
      urlSearchParams.set('clientId', org._id);
    }
    urlSearchParams.delete('tags');
    history.push({
      search: `?${urlSearchParams.toString()}`,
    });
    if (!isEmpty(filterTags)) {
      this.setState({
        filterTags: [],
      });
    }
  }

  render() {
    const {
      match,
      holidayConfig,
      location,
    } = this.props;
    const orgId = match.params.uuid;
    const urlSearchParams = new URLSearchParams(location.search);
    const viewOnly = !!urlSearchParams.get('vendorId');
    const showVendorDropDown = this.handleShowVendorDropDown();
    const {
      publicHoliday,
      regionalHoliday,
      showPublicDropdown,
      showNotification,
      filterTags,
      selectedYear,
    } = this.state;

    return (
      <div className={styles.alignCenter}>
        <div className="d-flex">
          <ArrowLink
            label={get(this.props, 'orgData.name', '').toLowerCase()}
            url={`/customer-mgmt/org/${orgId}/profile`}
          />
          {showVendorDropDown
            && (
              <div className="ml-auto mt-2">
                <VendorDropdown
                  showIcon
                  onSelect={(type, org) => this.handleSelectFromVendor(type, org)}
                />
              </div>
            )}
        </div>
        <div className="d-flex">
          <CardHeader label="holiday configuration" iconSrc={holidayConfigIcon} />
          {
            !viewOnly
            && (
              <HasAccess
                permission={['HOLIDAY_CONFIG:CREATE']}
                orgId={orgId}
                yes={() => (
                  <div className="ml-auto my-auto">
                    {moment().format('YYYY') <= parseInt(selectedYear, 10)
                      && (
                        <Button
                          label="configure new holiday"
                          type="add"
                          clickHandler={() => this.redirectToAddNew()}
                        />
                      )}
                  </div>
                )}
              />
            )
          }
        </div>
        <div className={cx('d-flex flex-column', styles.configFilterCard)}>
          <div className="d-flex flex-row position-relative">
            <div className="w-100">
              <TagSearchField
                name="location"
                labelText={styles.labelText}
                className={cx(styles.tagInputField, 'col-10')}
                label=""
                placeholder="search for any locations to filter holidays"
                orgId={orgId}
                category="geographical"
                tags={filterTags}
                updateTag={(value, action) => this.handleTagInput(value, 'tags', action)}
                dropdownMenu={styles.tagDropdown}
                vendorId={urlSearchParams.get('vendorId')}
                clientId={urlSearchParams.get('clientId')}
              />
            </div>
            <div>
              <DropDownSmall
                Options={this.handleDropdownOptions()}
                dropdownMenu={styles.dropdownMenu}
                className={cx(styles.dropDownStyle, 'ml-4')}
                value={get(this.state, 'selectedYear', new Date().getFullYear().toString())}
                changed={(value) => this.handleDropdown(value)}
                defaultColor={cx(styles.optionDropdown)}
              />
            </div>
          </div>
          <div className="mt-4">
            {(get(location, 'state.status', '') === 'success' && showNotification && !isEmpty(holidayConfig))
              && (
                <>
                  {get(location, 'state.action', '') === 'deleted'
                    ? (
                      <Notifier type="delete" text={`'${get(holidayConfig, 'holidayName', '')}' holiday ${get(location, 'state.action', '')} successfully`} />
                    )
                    : <Notifier type="success" text={`'${get(holidayConfig, 'holidayName', '')}' holiday ${get(location, 'state.action', '')} successfully`} />}
                </>
              )}
          </div>

          <div style={{ overflow: 'auto', maxHeight: '480px', marginTop: '32px' }} className={scrollStyle.scrollbar}>
            {!isEmpty(regionalHoliday)
              && (
                <div className="d-flex flex-column mt-3">
                  <span className={styles.sectionHeading}>regional holiday</span>
                  <div className={cx(styles.holidayListContainer)} style={{ marginBottom: '2rem' }}>
                    <div className="row no-gutters" style={{ overflow: 'hidden' }}>
                      <span className={cx(styles.Heading, styles.headingWidth1)}>holiday name</span>
                      <span className={cx(styles.Heading, styles.headingWidth2)}>date</span>
                      <span className={cx(styles.Heading, styles.headingWidth3)}>included locations</span>
                      <span className={cx(styles.Heading, styles.headingWidth4)}>excluded locations</span>
                    </div>
                    <hr />
                    <div>
                      {!isEmpty(regionalHoliday)
                        && regionalHoliday.map((obj) => (
                          <div key={obj['_id']}>
                            <div className="d-flex flex-row position-relative" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                              <span className={cx(styles.listBoldText, styles.headingWidth1)} style={{ paddingTop: '6px' }}>
                                {obj.holidayName}
                              </span>
                              <span className={cx(styles.listText, styles.headingWidth2)} style={{ paddingTop: '6px' }}>
                                {`${moment(obj.startDate).format('DD MMM, YYYY').toLowerCase()}, ${obj.dayOfHoliday}`}
                              </span>
                              {this.handleLocationTags(obj, 'includeTags')}
                              {this.handleLocationTags(obj, 'excludeTags')}
                              <div />
                              {!(obj.isDefaultHoliday || parseInt(selectedYear, 10) < new Date().getFullYear())
                                && (
                                  <HasAccess
                                    permission={['HOLIDAY_CONFIG:CREATE']}
                                    orgId={orgId}
                                    yes={() => (
                                      <Link className={styles.editContainer} to={`/customer-mgmt/org/${orgId}/attendconfig/holiday-config/holiday-config-detail/${obj['_id']}?${urlSearchParams.toString()}`}>
                                        {
                                          viewOnly
                                            ? (
                                              <span>
                                                <img src={viewIcon} alt="view" />
                                                &nbsp;view
                                              </span>
                                            )
                                            : (
                                              <span>
                                                <img src={blueEdit} alt="edit" />
                                                &nbsp;edit
                                              </span>
                                            )
                                        }
                                      </Link>
                                    )}
                                    no={() => (
                                      <Link className={styles.editContainer} to={`/customer-mgmt/org/${orgId}/attendconfig/holiday-config/holiday-config-detail/${obj['_id']}?${urlSearchParams.toString()}`}>
                                        <span>
                                          <img src={viewIcon} alt="view" />
                                          &nbsp;view
                                        </span>
                                      </Link>
                                    )}
                                  />
                                )}

                            </div>
                            <hr style={{ marginRight: '0.5rem' }} />
                          </div>

                        ))}

                    </div>

                  </div>

                </div>
              )}

            {!isEmpty(publicHoliday)
              && (
                <div className="d-flex flex-column mt-3">
                  <div className="d-flex flex-row justify-content-between">
                    <span className={styles.sectionHeading}>public holiday</span>
                    <div onClick={this.togglePublicDropdown} role="button" aria-hidden>
                      {showPublicDropdown ? <img src={formChecked} className={styles.pointer} alt="show dropdown" />
                        : <img src={form} alt="show dropdown" className={styles.pointer} />}
                    </div>
                  </div>
                  {showPublicDropdown && (
                    <div className={cx(styles.holidayListContainer)} style={{ marginBottom: '2rem' }}>
                      <div className="row no-gutters" style={{ overflow: 'hidden' }}>
                        <span className={cx(styles.Heading, styles.headingWidth1)}>holiday name</span>
                        <span className={cx(styles.Heading, styles.headingWidth2)}>date</span>
                        <span className={cx(styles.Heading, styles.headingWidth3)}>included locations</span>
                        <span className={cx(styles.Heading, styles.headingWidth4)}>excluded locations</span>
                      </div>
                      <hr />
                      <div>
                        {!isEmpty(publicHoliday)
                          && publicHoliday.map((obj) => (
                            <div key={obj['_id']}>
                              <div className="d-flex flex-row position-relative" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                                <span className={cx(styles.listBoldText, styles.headingWidth1)} style={{ paddingTop: '6px' }}>
                                  {obj.holidayName}
                                </span>
                                <span className={cx(styles.listText, styles.headingWidth2)} style={{ paddingTop: '6px' }}>
                                  {`${moment(obj.startDate).format('DD MMM, YYYY').toLowerCase()}, ${obj.dayOfHoliday}`}
                                </span>
                                {this.handleLocationTags(obj, 'includeTags')}
                                {this.handleLocationTags(obj, 'excludeTags')}
                                <div />
                                {!(obj.isDefaultHoliday || parseInt(selectedYear, 10) < new Date().getFullYear())
                                  && (
                                    <HasAccess
                                      permission={['HOLIDAY_CONFIG:CREATE']}
                                      orgId={orgId}
                                      yes={() => (
                                        <Link className={styles.editContainer} to={`/customer-mgmt/org/${orgId}/attendconfig/holiday-config/holiday-config-detail/${obj['_id']}?${urlSearchParams.toString()}`}>
                                          {
                                          viewOnly
                                            ? (
                                              <span>
                                                <img src={viewIcon} alt="view" />
                                                &nbsp;view
                                              </span>
                                            )
                                            : (
                                              <span>
                                                <img src={blueEdit} alt="edit" />
                                                &nbsp;edit
                                              </span>
                                            )
                                          }
                                        </Link>
                                      )}
                                      no={() => (
                                        <Link className={styles.editContainer} to={`/customer-mgmt/org/${orgId}/attendconfig/holiday-config/holiday-config-detail/${obj['_id']}?${urlSearchParams.toString()}`}>
                                          <span>
                                            <img src={viewIcon} alt="view" />
                                            &nbsp;view
                                          </span>
                                        </Link>
                                      )}
                                    />
                                  )}
                              </div>
                              <hr style={{ marginRight: '0.5rem' }} />
                            </div>

                          ))}

                      </div>

                    </div>
                  )}

                </div>
              )}
          </div>

        </div>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  postHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.postHolidayConfigState,
  putHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.putHolidayConfigState,
  deleteHolidayConfigState: state.orgMgmt.orgAttendConfig.holidayConfig.deleteHolidayConfigState,
  getHolidayConfigListState: state.orgMgmt.orgAttendConfig.holidayConfig.getHolidayConfigListState,
  holidayConfig: state.orgMgmt.orgAttendConfig.holidayConfig.holidayConfigData,
  holidayConfigList: state.orgMgmt.orgAttendConfig.holidayConfig.holidayConfigList,
  getTagListState: state.orgMgmt.orgAttendConfig.holidayConfig.getTagInfoState,
  tagList: state.orgMgmt.orgAttendConfig.holidayConfig.tagList,
  error: state.orgMgmt.orgAttendConfig.holidayConfig.error,
  orgData: state.orgMgmt.staticData.orgData,
  enabledServices: state.orgMgmt.staticData.servicesEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  onGetHolidayConfig:
    (orgId, year, tags, fetchInputTags, query) => dispatch(actions.getHolidayConfigList(orgId, year, tags, fetchInputTags, query)),
  initState: () => dispatch(actions.initState()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HolidayConfig));
