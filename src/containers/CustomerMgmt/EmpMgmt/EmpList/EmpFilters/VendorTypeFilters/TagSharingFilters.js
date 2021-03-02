/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-boolean-value */
import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorTypeFilters.module.scss';

import arrow from '../../../../../../assets/icons/arrowLeft.svg';
import close from '../../../../../../assets/icons/closeNotification.svg';
import locTag from '../../../../../../assets/icons/locationTags.svg';
import funcTag from '../../../../../../assets/icons/functionTags.svg';

import Checkbox from '../../../../../../components/Atom/CheckBox/CheckBox';
import TagSearchField from '../../../../VendorMgmt/TagSearch/TagSearchField/TagSearchField';

/**
@type = vendor or client or searched org
@orgId = orgId from url
@selectedOrg = searched and selected vendor/client
@selectedTagOrg = the sub/super org whose tags are opened
@handleTagData = function to send data to parent
@handleShowTags = function to toggle back button from tags tab
*/
class TagSharingFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTagsSelected: '',
      sharedSites: [],
      sharedSitesId: [],
      sharedRoles: [],
      sharedRolesId: [],
      type: '',
    };
  }

  componentDidMount = () => {
    const { selectedTagOrg, type } = this.props;
    if (!_.isEmpty(selectedTagOrg)) {
      this.setState({
        allTagsSelected: selectedTagOrg.allTagsSelected,
        sharedSites: selectedTagOrg.sharedSites,
        sharedSitesId: selectedTagOrg.sharedSitesId,
        sharedRoles: selectedTagOrg.sharedRoles,
        sharedRolesId: selectedTagOrg.sharedRolesId,
        type,
      });
    }
  }

  toggleAllSelected = () => {
    const { allTagsSelected } = this.state;
    this.setState({ allTagsSelected: !allTagsSelected });
  }

  handleSelectedFilterTag = (value, action) => {
    const {
      sharedSitesId, sharedSites, sharedRolesId, sharedRoles,
    } = this.state;
    let { allTagsSelected } = this.state;
    let updatedSitesId = _.cloneDeep(sharedSitesId);
    let updatedSites = _.cloneDeep(sharedSites);
    let updatedRolesId = _.cloneDeep(sharedRolesId);
    let updatedRoles = _.cloneDeep(sharedRoles);

    if (!_.isEmpty(value)) {
      if (value.category === 'geographical' && value.type === 'site') {
        if (action === 'add') {
          if (updatedSitesId && !updatedSitesId.includes(value.uuid)) {
            updatedSitesId.push(value.uuid);
            updatedSites.push(value);
          }
        } else {
          updatedSitesId = updatedSitesId.filter((eachItem) => eachItem !== value.uuid);
          updatedSites = updatedSites.filter((eachSite) => eachSite.uuid !== value.uuid);
        }
      } else if (value.category === 'functional' && value.type === 'role') {
        if (action === 'add') {
          if (updatedRolesId && !updatedRolesId.includes(value.uuid)) {
            updatedRolesId.push(value.uuid);
            updatedRoles.push(value);
          }
        } else {
          updatedRolesId = updatedRolesId.filter((eachItem) => eachItem !== value.uuid);
          updatedRoles = updatedRoles.filter((eachSite) => eachSite.uuid !== value.uuid);
        }
      }
    }
    if (_.isEmpty(updatedRolesId) && _.isEmpty(updatedSitesId)) {
      allTagsSelected = true;
    }

    const { selectedTagOrg, type, handleTagData } = this.props;

    this.setState({
      sharedSitesId: updatedSitesId,
      sharedSites: updatedSites,
      sharedRolesId: updatedRolesId,
      sharedRoles: updatedRoles,
      allTagsSelected,
    }, () => {
      handleTagData(type, { ...selectedTagOrg, ...this.state }, true);
    });
  }

  render() {
    const {
      orgId, type, selectedOrg, selectedTagOrg, handleTagData,
    } = this.props;
    const { allTagsSelected, sharedSites, sharedRoles } = this.state;
    const payload = { ...selectedTagOrg, ...this.state };

    // condition to check if main org is selected for tags sharing
    const orgUuid = type === 'vendor'
      ? (selectedTagOrg._id === selectedOrg._id ? orgId : selectedOrg._id)
      : type === 'client' ? selectedOrg._id
        : null;

    return (
      <div className="m-3">
        <div
          className={cx(styles.Cursor, 'row no-gutters')}
          role="button"
          aria-hidden
          onClick={() => handleTagData(type, payload, false)}
        >
          <img src={arrow} alt="" />
          &emsp;
          <span className={styles.GreyBoldText} style={{ fontSize: '14px' }}>
            {selectedTagOrg._id === selectedOrg._id ? 'tags' : type}
            {' '}
            of
            {' '}
            {selectedTagOrg.name}
          </span>
        </div>

        <div className="row no-gutters mt-2 mb-3">
          <Checkbox
            type="medium"
            value={allTagsSelected}
            onChange={this.toggleAllSelected}
            disabled={false}
            className={styles.PositionRelative}
          />
          <span className={cx('ml-4', styles.SelectAll)}>all tags</span>
        </div>

        <div disabled={allTagsSelected}>
          <TagSearchField
            className={styles.TagSearch}
            dropdownMenu={styles.dropdownMenu}
            emptySearchClassname={styles.emptyTagSearch}
            imgSize={styles.imgSize}
            name="tagSearch"
            placeholder="search for loc or role"
            updateTag={(value) => this.handleSelectedFilterTag(value.value, 'add')}
            isSelected={true}
            deployModal={true}
            orgId={orgUuid}
            vendorId={type === 'vendor' ? selectedTagOrg._id : orgId}
            clientId={type === 'vendor' ? orgId : selectedTagOrg._id}
          />

          <div className="row no-gutters my-2">
            <span className={styles.GreyBoldText}>locations</span>
          </div>
          <div className="row no-gutters my-2">
            {!_.isEmpty(sharedSites)
              ? (
                <div>
                  {sharedSites.map((tag) => (
                    <div key={tag.uuid} className={styles.tagButtons}>
                      <img
                        src={locTag}
                        className="pr-2 ml-1"
                        height="12px"
                        alt=""
                      />
                      {tag.name}
                      &nbsp;
                      <img
                        src={close}
                        alt=""
                        onClick={() => this.handleSelectedFilterTag(tag, 'delete')}
                        className={cx(styles.Cursor, 'ml-2')}
                        aria-hidden
                      />
                    </div>
                  ))}
                </div>
              )
              : (
                <span className={styles.GreyMediumText}>
                  <i>there are no location tags selected</i>
                </span>
              )}
          </div>

          <hr />

          <div className="row no-gutters">
            <span className={styles.GreyBoldText}>roles</span>
          </div>
          <div className="row no-gutters">
            {!_.isEmpty(sharedRoles)
              ? (
                <div>
                  {sharedRoles.map((tag) => (
                    <div key={tag.uuid} className={styles.tagButtons}>
                      <img
                        src={funcTag}
                        className="pr-2 ml-1"
                        height="12px"
                        alt=""
                      />
                      {tag.name}
                      &nbsp;
                      <img
                        src={close}
                        alt=""
                        onClick={() => this.handleSelectedFilterTag(tag, 'delete')}
                        className={cx(styles.Cursor, 'ml-2')}
                        aria-hidden
                      />
                    </div>
                  ))}
                </div>
              )
              : (
                <span className={styles.GreyMediumText}>
                  <i>there are no role tags selected</i>
                </span>
              )}
          </div>

          <hr />

        </div>
      </div>
    );
  }
}

export default TagSharingFilters;
