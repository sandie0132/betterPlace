/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import styles from './ClientTagList.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import ClientTagRow from './ClientTagRow/ClientTagRow';

import Loader from '../../../../../components/Organism/Loader/Loader';
import Paginator from '../../../../../components/Organism/Paginator/Paginator';
import EmptyState from '../../../../../components/Atom/EmptyState/EmptyState';

import dash from '../../../../../assets/icons/dash.svg';

import * as actions from '../Store/action';
// import HasAccess from '../../../../../services/HasAccess/HasAccess';

class ClientTagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 20,
      showSelectedFiltersNotification: false,
    };
  }

  componentDidMount = () => {
  }

  componentDidUpdate = (prevProps) => {
    const { selectedFilters } = this.props;
    if (prevProps.selectedFilters !== selectedFilters) {
      this.setState({ showSelectedFiltersNotification: true });
      setTimeout(() => {
        this.setState({ showSelectedFiltersNotification: false });
      }, 4000);
    }
  }

  componentWillUnmount = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onGetInitState();
  }

  render() {
    const {
      t, location, searchKey, selectedFilters, vendorName,
      clientTagsCountState, clientTagsCount, clientTags, clientTagsState,
      clientName, categoryLabel, selectedFilterTagCount, selectedFilterTagCountState,
      selectedFilterTagData,
    } = this.props;

    let {
      // eslint-disable-next-line prefer-const
      pageSize, showSelectedFiltersNotification,
    } = this.state;

    return (
      <>
        {/* {(_.isEmpty(searchKey) && !_.isEmpty(clientTags))
         || (!_.isEmpty(searchKey) && !_.isEmpty(selectedFilters))
          ? (
            <> */}
        <div className="d-flex flex-row justify-content-end" style={{ height: '2.5rem' }}>
          {clientTagsCountState === 'SUCCESS' && _.isEmpty(selectedFilters) && clientTagsCount.count > pageSize
            ? (
              <>
                <img src={dash} alt="" className="mr-3 ml-2" />
                <Paginator
                  dataCount={clientTagsCount.count}
                  pageSize={pageSize}
                  baseUrl={location.pathname}
                  className="mb-2"
                />
              </>
            ) : selectedFilterTagCountState === 'SUCCESS' && !_.isEmpty(selectedFilters) && selectedFilterTagCount.count > pageSize
              ? (
                <>
                  <img src={dash} alt="" className="mr-3 ml-2" />
                  <Paginator
                    dataCount={selectedFilterTagCount.count}
                    pageSize={pageSize}
                    baseUrl={location.pathname}
                    className="mt-2"
                  />
                </>
              )
              : null}
        </div>
        {/* </>
        //   )
        //   : <div className={cx(styles.emptyActionContent, 'd-flex flex-row')} />
        // } */}

        {clientTagsState === 'LOADING' || clientTagsCountState === 'LOADING'
          ? <Loader type="taskListLoader" />
          : (
            ((_.isEmpty(searchKey) || searchKey.length < 3) && _.isEmpty(selectedFilters))
              ? !_.isEmpty(clientTags)
                ? (
                  <div className={cx('mt-1 mb-4', styles.Card)}>
                    <div className={cx('row no-gutters')} style={{ overflow: 'hidden' }}>
                      <span className={cx(styles.Heading, styles.Width1)}>{t('translation_vendorTags:vendorTagList.tagName')}</span>
                      {categoryLabel === 'location' ? (
                        <>
                          <span className={cx(styles.Heading, styles.Width2)}>{t('translation_vendorTags:vendorTagList.country')}</span>
                          <span className={cx(styles.Heading, styles.Width3)}>{t('translation_vendorTags:vendorTagList.state')}</span>
                          <span className={cx(styles.Heading, styles.Width4)}>{t('translation_vendorTags:vendorTagList.city')}</span>
                          <span className={cx(styles.Heading, styles.Width5)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                        </>
                      )
                        : categoryLabel === 'function' ? (
                          <>
                            <span className={cx(styles.Heading, styles.Width2)}>function</span>
                            <span className={cx(styles.Heading, styles.Width3)}>role</span>
                            <span className={cx(styles.Heading, styles.WidthFuncHierarchy)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                          </>
                        )
                          : null}
                    </div>

                    <hr className={styles.HrStyle} />
                    <div style={{ overflow: 'auto', maxHeight: '40rem' }} className={scrollStyle.scrollbarBlue} />
                    {clientTags.map((item) => (
                      categoryLabel === 'location'
                        ? (
                          <ClientTagRow
                            categoryLabel={categoryLabel}
                            key={item.tagName.name}
                            tagName={item.tagName.name}
                            tagId={item.tagName.uuid}
                            country={!_.isEmpty(item.country) ? item.country.name : 'n/a'}
                            state={!_.isEmpty(item.state) ? item.state.name : 'n/a'}
                            city={!_.isEmpty(item.city) ? item.city.name : 'n/a'}
                            hierarchy={!_.isEmpty(item.hierarchy)
                              ? item.hierarchy.map((each, index) => (
                                <span key={each.name}>
                                  {each.name}
                                  {' '}
                                  {index === item.hierarchy.length - 1 ? '' : '> '}
                                </span>
                              ))
                              : 'n/a'}
                          />
                        )
                        : categoryLabel === 'function'
                          ? (
                            <ClientTagRow
                              categoryLabel={categoryLabel}
                              key={item.tagName.name}
                              tagName={item.tagName.name}
                              tagId={item.tagName.uuid}
                              func={!_.isEmpty(item.function) ? item.function.name : 'n/a'}
                              role={!_.isEmpty(item.role) ? item.role.name : 'n/a'}
                              hierarchy={!_.isEmpty(item.hierarchy)
                                ? item.hierarchy.map((each, index) => (
                                  <span key={each.name}>
                                    {each.name}
                                    {' '}
                                    {index === item.hierarchy.length - 1 ? '' : '> '}
                                  </span>
                                ))
                                : 'n/a'}
                            />
                          )
                          : null
                    )) }
                  </div>
                )
                : (
                  <div className={cx('mt-1 mb-4', styles.Card)}>
                    <EmptyState
                      type="emptyVendorTagsList"
                      label={`${t('translation_vendorTags:vendorTagList.emptyState')} ${clientName} ${t('translation_vendorTags:vendorTagList.to')} ${vendorName}`}
                    />
                  </div>
                )
              : !_.isEmpty(selectedFilters)
                // : !_.isEmpty(searchKey) && searchKey.length > 2
                ? (
                  <div className={cx('mt-1 mb-4', styles.Card)}>
                    <div className={cx('row no-gutters')} style={{ overflow: 'hidden' }}>
                      <span className={cx(styles.Heading, styles.Width1)}>{t('translation_vendorTags:vendorTagList.tagName')}</span>
                      {categoryLabel === 'location' ? (
                        <>
                          <span className={cx(styles.Heading, styles.Width2)}>{t('translation_vendorTags:vendorTagList.country')}</span>
                          <span className={cx(styles.Heading, styles.Width3)}>{t('translation_vendorTags:vendorTagList.state')}</span>
                          <span className={cx(styles.Heading, styles.Width4)}>{t('translation_vendorTags:vendorTagList.city')}</span>
                          <span className={cx(styles.Heading, styles.Width5)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                        </>
                      )
                        : categoryLabel === 'function' ? (
                          <>
                            <span className={cx(styles.Heading, styles.Width2)}>function</span>
                            <span className={cx(styles.Heading, styles.Width3)}>role</span>
                            <span className={cx(styles.Heading, styles.WidthFuncHierarchy)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                          </>
                        )
                          : null}
                    </div>

                    <hr className={styles.HrStyle} />
                    {showSelectedFiltersNotification && selectedFilterTagData
                      ? (
                        <div className="row no-gutters">
                          <span className={styles.FiltersMessage}>
                            {t('translation_vendorTags:vendorTagList.showingResults')}
                          </span>
                        </div>
                      )
                      : null}
                    <div style={{ overflow: 'auto', maxHeight: '40rem' }} className={scrollStyle.scrollbarBlue} />

                    {!_.isEmpty(selectedFilters) && !_.isEmpty(selectedFilterTagData)
                      ? selectedFilterTagData.map((item) => (
                        categoryLabel === 'location'
                          ? (
                            <ClientTagRow
                              categoryLabel={categoryLabel}
                              key={item.tagName.name}
                              tagName={item.tagName.name}
                              tagId={item.tagName.uuid}
                              country={!_.isEmpty(item.country) ? item.country.name : 'n/a'}
                              state={!_.isEmpty(item.state) ? item.state.name : 'n/a'}
                              city={!_.isEmpty(item.city) ? item.city.name : 'n/a'}
                              hierarchy={!_.isEmpty(item.hierarchy)
                                ? item.hierarchy.map((each, index) => (
                                  <span key={each.name}>
                                    {each.name}
                                    {' '}
                                    {index === item.hierarchy.length - 1 ? '' : '> '}
                                  </span>
                                ))
                                : 'n/a'}
                            />
                          )
                          : categoryLabel === 'function'
                            ? (
                              <ClientTagRow
                                categoryLabel={categoryLabel}
                                key={item.tagName.name}
                                tagName={item.tagName.name}
                                tagId={item.tagName.uuid}
                                func={!_.isEmpty(item.function) ? item.function.name : 'n/a'}
                                role={!_.isEmpty(item.role) ? item.role.name : 'n/a'}
                                hierarchy={!_.isEmpty(item.hierarchy)
                                  ? item.hierarchy.map((each, index) => (
                                    <span key={each.name}>
                                      {each.name}
                                      {' '}
                                      {index === item.hierarchy.length - 1 ? '' : '> '}
                                    </span>
                                  ))
                                  : 'n/a'}
                              />
                            )
                            : null
                      ))
                      : (
                        <div className={cx('d-flex justify-content-center', styles.Heading)}>
                          {t('translation_vendorTags:vendorTagList.noResults')}
                        </div>
                      )}
                  </div>
                )
                : null) }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  clientData: state.vendorMgmt.clientTags.getClientData,
  clientDataState: state.vendorMgmt.clientTags.getClientDataState,
  clientTagsCount: state.vendorMgmt.clientTags.getClientTagsCount,
  clientTagsCountState: state.vendorMgmt.clientTags.getClientTagsCountState,
  clientTags: state.vendorMgmt.clientTags.clientTags,
  clientTagsState: state.vendorMgmt.clientTags.clientTagsState,

  selectedFilterTagCountState: state.vendorMgmt.clientTags.selectedFilterTagCountState,
  selectedFilterTagCount: state.vendorMgmt.clientTags.selectedFilterTagCount,
  selectedFilterTagState: state.vendorMgmt.clientTags.selectedFilterTagState,
  selectedFilterTagData: state.vendorMgmt.clientTags.selectedFilterTagData,
  error: state.vendorMgmt.clientTags.error,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.initState()),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientTagList),
));
