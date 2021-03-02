import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import { Map, Button, Input } from 'react-crux';
import styles from './Forms.module.scss';

import question from '../../../../../assets/icons/question.svg';
import search from '../../../../../assets/icons/search.svg';
import warning from '../../../../../assets/icons/redWarning.svg';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import FlagCard from '../../FlagCard/FlagCard';
import * as actions from '../../TagMgmtStore/action';

class Forms extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-underscore-dangle
    this._isMounted = false;
    this.state = {
      queryString: '',
      countryList: [],
      stateList: [],
      selectedTag: '',
    };
  }

    componentDidMount = () => {
      // eslint-disable-next-line no-underscore-dangle
      this._isMounted = true;
      const { staticData } = this.props;
      this.handleStaticData(staticData, 'allData');
    }

    componentDidUpdate = (prevProps, prevState) => {
      const {
        searchStaticDataState, searchStaticResult, searchStaticData, staticData,
      } = this.props;
      const { queryString, selectedTag } = this.state;
      if (prevProps.searchStaticDataState !== searchStaticDataState) {
        if (searchStaticDataState === 'SUCCESS') {
          this.handleStaticData(searchStaticResult, 'searchData');
        }
      }
      if (prevState.queryString !== queryString) {
        if (queryString.length !== 0) {
          searchStaticData(selectedTag, queryString);
        } else {
          this.handleStaticData(staticData, 'allData');
        }
      }
    }

    componentWillUnmount() {
      // eslint-disable-next-line no-underscore-dangle
      this._isMounted = false;
    }

    handleStaticData = (staticDataList, staticDataType) => {
      let staticData;
      staticData = _.cloneDeep(staticDataList);
      const { queryString } = this.state;
      const { staticData: propStaticData, tagType, tagsArray } = this.props;
      if (queryString.length === 0) {
        staticData = propStaticData;
      }
      let selectedTag;
      let countries;
      let states;
      if (tagType === 'country') {
        selectedTag = 'COUNTRIES';
      } else if (tagType === 'state') {
        selectedTag = tagsArray[0].selectedTag;
      }

      if (staticData.length > 0 && staticDataType === 'allData') {
        _.forEach(staticData, (data) => {
          if (Object.keys(data)[0] === 'COUNTRIES') {
            countries = data.COUNTRIES;
          } else if (Object.keys(data)[0] === 'India') states = data[selectedTag];
        });
      } else {
        countries = staticData;
        states = staticData;
      }
      this.setState({ countryList: countries, stateList: states, selectedTag });
    }

    checkDefaultTagType = (tagType) => {
      if (tagType === 'country' || tagType === 'state') {
        return true;
      }
      return false;
    }

    handleInput = (inputString) => {
      const { changeHandler } = this.props;
      this.setState({
        queryString: inputString,
      });
      changeHandler(inputString, 'name');
    }

    onGetSearhedGeoTag = (event) => {
      const { getSearchedGeoTag, changeHandler } = this.props;
      getSearchedGeoTag(event);
      changeHandler(event, 'name');
    }

    render() {
      let CardsList;
      const {
        t,
        category,
        staticData,
        tagType,
        currentTag,
        changeHandler,
        isSelected,
        duplicateTag,
        enableSubmit,
        closeForm,
        saveHandler,
      } = this.props;
      const { countryList, stateList } = this.state;
      if (staticData) {
        if (tagType === 'country' && !_.isEmpty(countryList)) {
          CardsList = countryList.map((country) => (currentTag.name !== country.label ? (
            <FlagCard
              key={country.label}
              tagName={country.label}
              tagCode={country.value}
              tagType={tagType}
              handleClick={() => changeHandler(country.label, 'name')}
              isSelectedFlag={country.label === isSelected}
            />
          )
            : null));
        } else if (tagType === 'state') {
          if (stateList) {
            CardsList = stateList.slice(0, 15).map((state) => (currentTag.name !== state.label
              ? (
                <FlagCard
                  key={state.label}
                  tagName={state.label}
                  tagCode={state.value}
                  tagType={tagType}
                  handleClick={() => changeHandler(state.label, 'name')}
                  isSelectedFlag={state.label === isSelected}
                />
              )
              : null));
          }
        }
      }

      const geoForm = (
        <div className={cx('d-flex flex-column mt-1')}>
          <span>
            <img src={search} alt={t('translation_tagInfoForm:image_alt_tagInfoForm.search')} />
            {' '}
&nbsp;
            <input
              type="text"
              value={currentTag.name}
              placeholder={`search ${tagType}`}
              className={styles.searchBar}
              onChange={(event) => this.handleInput(event.target.value, 'name')}
            />
          </span>
          {duplicateTag !== null
            ? (
              <>
                <span style={{ marginLeft: '2.6rem' }}>
                  <img src={warning} alt="" />
                  <label htmlFor="warning" className={styles.duplicateTag}>{duplicateTag}</label>
                </span>
              </>
            )
            : null}
          <div className={styles.FlagCardList}>{CardsList}</div>
          <div className="row mt-3 justify-content-end mr-4">
            <CancelButton isTagForm clickHandler={(event) => closeForm(event)}>
              {t('translation_tagInfoForm:cancel')}
            </CancelButton>
            <Button isDisabled={!enableSubmit} label={t('translation_tagInfoForm:done')} clickHandler={(event) => saveHandler(event)} save />

          </div>
        </div>
      );
      const geoCustomTagForm = (
        <div>
          <span className="row no-gutters py-0 mb-1">
            <span className={styles.smallText}>
              {`enter ${tagType}`}
            </span>
            <img src={question} alt={t('translation_tagInfoForm:image_alt_tagInfoForm.question')} />
          </span>
          <div>
            <div className="d-flex flex-row">
              <div style={{ width: '100%' }}>
                <Map
                  showMap={false}
                  placeholder={`Search ${tagType}`}
                  types={['(cities)']}
                  defaultValue={currentTag.name}
                  onLocationChange={({
                    rawInput,
                  }) => changeHandler(rawInput, 'name')}
                />
              </div>

              <CancelButton
                isTagForm
                clickHandler={closeForm}
              />
              <Button
                isDisabled={!enableSubmit}
                label={t('translation_tagInfoForm:done')}
                clickHandler={saveHandler}
                save
              />

            </div>

            {duplicateTag !== null
              ? (
                <div className="d-flex">
                  <img src={warning} alt="" />
                  <label htmlFor="warning" className={cx(styles.duplicateTag, 'mt-2')}>{duplicateTag}</label>
                </div>
              )
              : null}
          </div>
        </div>
      );
      const defaultForm = (
        <div>
          <div className={cx('row')}>
            <div className="col-5">
              <Input
                name="name"
                label={`${tagType} name`}
                type="text"
                placeholder={t('translation_tagInfoForm:input_tagInfoForm.name')}
                required
                value={currentTag.name}
                onChange={(value) => changeHandler(value, 'name')}
              />

              {duplicateTag !== null && currentTag.name.length > 0
                ? (
                  <>
                    <img src={warning} alt="" className={styles.Warning} />
                    <label htmlFor="warning" className={styles.duplicateTag}>{duplicateTag}</label>
                  </>
                )
                : null}
            </div>
            <Input
              name="code"
              className="col-4"
              label={`${tagType} code`}
              type="text"
              placeholder={t('translation_tagInfoForm:input_tagInfoForm.code')}
              value={currentTag.code}
              onChange={(value) => changeHandler(value, 'code')}
            />
            <Button
              label={t('translation_tagInfoForm:save')}
              clickHandler={saveHandler}
              isDisabled={!enableSubmit}
              save
              className={styles.SaveButtonAlign}
            >
              {t('translation_tagInfoForm:save')}
            </Button>
          </div>
        </div>
      );
      switch (category) {
        case 'geographical': if (this.checkDefaultTagType(tagType)) return geoForm;
          return geoCustomTagForm;
        default: return defaultForm;
      }
    }
}

const mapStateToProps = (state) => ({
  staticData: state.tagMgmt.staticData,
  staticDataState: state.tagMgmt.staticDataState,
  searchStaticDataState: state.tagMgmt.searchStaticDataState,
  tagsArray: state.tagMgmt.tagsArray,
  searchStaticResult: state.tagMgmt.searchStaticResult,
});

const mapDispatchToProps = (dispatch) => ({
  searchStaticData: (key, query) => dispatch(actions.searchStaticData(key, query)),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Forms));
