/* eslint-disable no-nested-ternary */
import React from 'react';
import { withRouter } from 'react-router';

import cx from 'classnames';
import styles from './VendorTagRow.module.scss';

import Checkbox from '../../../../../../components/Atom/CheckBox/CheckBox';

/**
 * Generates a Vendor Row
 * @tagName {string}
 * @country {string}
 * @state {string}
 * @city {string}
 * @hierarchy {string}
 * @handleSelectedTasks {function} to handle selection of tags
 * @allTagsSelected {boolean} if all tags are selected or not
 * @categoryLabel {string}
 * @func {string}
 * @role {string}
 */

const VendorTagRow = ({
  tagName,
  country,
  state,
  city,
  hierarchy,
  allTagsSelected,
  tagId,
  selectedTags,
  handleSelectedTasks,
  categoryLabel,
  func,
  role,
}) => (
  <>
    <div className={cx('row no-gutters py-2')} style={{ position: 'relative' }}>

      <Checkbox
        type="smallCircle"
        className="mr-2"
        name="tags"
        disabled={false}
        value={allTagsSelected ? true : selectedTags.includes(tagId)}
        onChange={() => handleSelectedTasks(tagId)}
      />

      <span className={cx(styles.TagName, 'my-auto')}>{tagName}</span>
      {categoryLabel === 'location' ? (
        <>
          <span className={cx(styles.Details, styles.CountryWidth, 'my-auto')}>{country}</span>
          <span className={cx(styles.Details, styles.StateWidth, 'my-auto')}>{state}</span>
          <span className={cx(styles.Details, styles.CityWidth, 'my-auto')}>{city}</span>
          <span className={cx(styles.Details, styles.HierarchyWidth, 'my-auto')}>{hierarchy}</span>
        </>
      )
        : categoryLabel === 'function'
          ? (
            <>
              <span className={cx(styles.Details, styles.CountryWidth, 'my-auto')}>{func}</span>
              <span className={cx(styles.Details, styles.StateWidth, 'my-auto')}>{role}</span>
              <span className={cx(styles.Details, styles.FunctHierarchy, 'my-auto')}>{hierarchy}</span>
            </>
          )
          : null}

    </div>
    <hr style={{ marginLeft: '2rem', marginRight: '1rem' }} />
  </>
);

export default withRouter(VendorTagRow);
