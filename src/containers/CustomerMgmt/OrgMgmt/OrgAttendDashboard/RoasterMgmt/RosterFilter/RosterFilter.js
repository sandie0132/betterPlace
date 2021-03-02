import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import cx from 'classnames';
import { Button } from 'react-crux';
import styles from './RosterFilter.module.scss';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
import close from '../../../../../../assets/icons/closeNotification.svg';
import functional from '../../../../../../assets/icons/functionTags.svg';
import vendor from '../../../../../../assets/icons/vendorIconRed.svg';
import functionalKey from '../../../../../../assets/icons/functionTagsKey.svg';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';
import VendorStaticSearch from '../../../../../VendorSearch/VendorStaticSearch/VendorStaticSearch';
import { getTagInfo } from '../Store/actions';

const initialState = {
  tags: [],
  vendors: [],
};

const RosterFilter = ({ handleCloseFilter }) => {
  const [state, setState] = useState(initialState);
  const {
    tags, vendors,
  } = state;
  const { uuid } = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const filterRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const vendorData = useSelector((rstate) => get(rstate, 'vendorSearch.associatedOrgList.associatedList.vendors', {}), shallowEqual);

  const {
    tagList, error,
  } = get(filterRState, 'orgAttendDashboard.roasterMgmt.roasterMgmt', {});

  const { servicesEnabled } = get(filterRState, 'staticData', {});

  const targetUrl = location.search;
  const urlSearchParams = new URLSearchParams(targetUrl);
  const urlTags = urlSearchParams.get('tags');
  const urlVendors = urlSearchParams.get('vendor');

  useEffect(() => {
    if (urlTags != null && urlTags.length !== 0) {
      dispatch(getTagInfo(urlTags.split(',')));
    }
    // eslint-disable-next-line
  }, []);

  const handleTagInput = (event, action) => {
    let updatedFilterTags = [...tags];
    if (action === 'add') {
      updatedFilterTags = [
        ...updatedFilterTags.slice(0),
        event.value,
      ];
    } else if (action === 'delete') {
      updatedFilterTags = updatedFilterTags.filter((tag) => tag.uuid !== event.value.uuid);
    }
    setState({
      ...state,
      tags: updatedFilterTags,
    });
  };

  const applyFilters = () => {
    let filterTagsUuid = tags.map((tag) => tag.uuid);
    filterTagsUuid = Array.from(filterTagsUuid).join(',');

    let vendorUuid = vendors.map((vend) => vend._id);
    vendorUuid = Array.from(vendorUuid).join(',');

    const urlSearchParam = new URLSearchParams();
    if (!isEmpty(filterTagsUuid)) {
      urlSearchParam.set('tags', filterTagsUuid);
    } else {
      urlSearchParam.delete('tags');
    }
    if (!isEmpty(vendorUuid)) {
      urlSearchParam.set('vendor', vendorUuid);
    } else {
      urlSearchParam.delete('vendor');
    }
    history.push({
      search: `?${urlSearchParam.toString()}`,
    });
    handleCloseFilter();
  };

  const removeFilters = () => {
    const urlSearchParam = new URLSearchParams();
    urlSearchParam.delete('tags');
    urlSearchParam.delete('vendor');
    history.push({
      search: `?${urlSearchParam.toString()}`,
    });
    setState((prev) => ({
      ...prev,
      tags: [],
      vendors: [],
    }), handleCloseFilter());
  };

  const handleUrlToStateTags = useCallback((tagArray) => {
    let updatedTag = [];

    if (!isEmpty(urlTags)) {
      const urlTagList = urlTags && urlTags.split(',');
      updatedTag = tagArray.filter((tagdId) => urlTagList.includes(tagdId.uuid));
    }
    setState((prev) => ({
      ...prev,
      tags: updatedTag,
    }));
    // eslint-disable-next-line
  }, []);

  const handleUrlToStateVendor = useCallback((vendorArr) => {
    let updatedVendor = [];

    if (!isEmpty(urlVendors)) {
      const urlVendorList = urlVendors && urlVendors.split(',');
      updatedVendor = vendorArr.filter((vendId) => urlVendorList.includes(vendId._id));
    }
    setState((prev) => ({
      ...prev,
      vendors: updatedVendor,
    }));
    // eslint-disable-next-line
  }, []);

  const handleCancel = () => {
    if (!isEmpty(urlVendors) && !isEmpty(vendorData)) {
      handleUrlToStateVendor(vendorData);
    } else {
      setState((prev) => ({
        ...prev,
        vendors: [],
      }));
    }
    if (!isEmpty(tagList) && !isEmpty(urlTags)) {
      setState((prev) => ({
        ...prev,
        tags: tagList,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        tags: [],
      }));
    }
  };

  useEffect(() => {
    if (!isEmpty(vendorData)) {
      handleUrlToStateVendor(vendorData);
    }
  }, [handleUrlToStateVendor, vendorData]);

  useEffect(() => {
    if (!error) {
      if (!isEmpty(tagList)) {
        handleUrlToStateTags(tagList);
      }
    }
  }, [error, handleUrlToStateTags, tagList]);

  const handleShowVendorFilter = () => {
    let showVendorLabel = false;
    if (!isEmpty(servicesEnabled) && !isEmpty(servicesEnabled.platformServices)) {
      forEach(servicesEnabled.platformServices, (service) => {
        if (service.platformService === 'VENDOR') showVendorLabel = true;
      });
    }
    return showVendorLabel;
  };

  const handleSelectedVendor = (data, action) => {
    let updatedVendor = [...vendors];
    if (action === 'add') {
      updatedVendor = [
        data,
      ];
    } else if (action === 'delete') {
      updatedVendor = updatedVendor.filter((ven) => ven._id !== data._id);
    }
    setState({
      ...state,
      vendors: updatedVendor,
    });
  };

  return (
    <div className={styles.filterCard}>
      <div className="row mx-0 px-0">
        <div className={cx('col-6 mx-0 ', styles.card)}>
          <div className={styles.smalHeading}>filter employees by function & role</div>
          <TagSearchField
            placeholder="search and select a function or role"
            orgId={uuid}
            tags={tags}
            dropdownMenu={styles.dropdownMenu}
            category="functional"
            updateTag={(value, action) => handleTagInput(value, action)}
            className={styles.placeholderText}
            hideTagsInInput
          />
          {
            !isEmpty(tags)
              && (
                <>
                  <div className={cx(styles.smalHeading, 'mt-4')}>selected</div>
                  { tags.map((tag) => (
                    <div className={styles.selectedTagTab} key={tag.uuid}>
                      <img src={tag.hasAccess ? functionalKey : functional} alt="functional" className="mr-2" height="12px" />
                      {tag.name}
                      <button type="button" onClick={() => handleTagInput({ value: tag }, 'delete')} className={styles.btn}>
                        <img src={close} alt="close" className="ml-3" />
                      </button>
                    </div>
                  ))}
                </>
              )
          }
        </div>
        {
          handleShowVendorFilter()
          && (
          <div className={cx('col-6 mx-0 ', styles.card, styles.borderLeft)}>
            <div className={styles.smalHeading}>filter employees by vendors</div>
            <VendorStaticSearch
              orgId={uuid}
              showOnly="vendor"
              handleSelectedValue={(value) => handleSelectedVendor(value, 'add')}
              getAssociatedOrgs
              hideInput
              isDisabled={!isEmpty(vendors)}
            />
            {
            !isEmpty(vendors)
              && (
                <>
                  <div className={cx(styles.smalHeading, 'mt-4')}>selected</div>
                  { vendors.map((ven) => (
                    <div className={styles.selectedTagTab} key={ven._id}>
                      <img src={vendor} alt="functional" className="mr-2" height="14px" />
                      {ven.name}
                      <button type="button" onClick={() => handleSelectedVendor(ven, 'delete')} className={styles.btn}>
                        <img src={close} alt="close" className="ml-3" />
                      </button>
                    </div>
                  ))}
                </>
              )
          }
          </div>
          )
        }
      </div>
      <div className={styles.footer}>
        <div className={styles.resetButton} onClick={() => removeFilters()} aria-hidden>
          reset filters
        </div>
        <div className="ml-auto">
          <div className="d-flex">
            <CancelButton
              className={styles.cancelButton}
              clickHandler={() => handleCancel()}
            >
              cancel
            </CancelButton>
            <Button type="save" label="apply" clickHandler={() => applyFilters()} />
          </div>

        </div>

      </div>
    </div>
  );
};
export default RosterFilter;
