import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import TraverseCard from '../TraverseCard/TraverseCard';
import styles from './TraverseCol.module.scss';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

class TraverseCol extends Component {
    handleSelectAll = () => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.selectAllTags(this.props.tagList);
    }

    handleShowSelectAll = () => {
      const {
        showSelectAll, addedTags, tagList, singleTagSelection,
      } = this.props;
      let addedtagFromCol = 0;
      _.forEach(addedTags, (addedtag) => {
        _.forEach(tagList, (tag) => {
          if (tag.uuid === addedtag.uuid) {
            addedtagFromCol += 1;
          }
        });
      });
      return !singleTagSelection && showSelectAll && addedtagFromCol !== tagList.length;
    }

    render() {
      const {
        tagList, disableTags, tagType, category, arrayIndex, isTagColumn,
        selectedId, addedTags, updateTag, SectionStyle, cardStyle, ActiveClass,
        SectionHead, disabled, subTagsList,
      } = this.props;
      const showSelectAll = this.handleShowSelectAll();
      const tagListCard = tagList.map((tag) => {
        let isDisabled = false;
        if (disableTags !== undefined) {
          isDisabled = _.includes(disableTags, tag.uuid);
        }
        return (
          <TraverseCard
            key={tag.uuid}
            name={tag.name}
            id={tag.uuid}
            tag={tag}
            isDisabled={isDisabled}
            tagType={tagType}
            category={category}
            arrayIndex={arrayIndex}
            isTag={isTagColumn}
            isSelected={selectedId === tag.uuid}
            markSelected={this.handleSelectedTag}
            addedTags={addedTags}
            updateTag={updateTag}
            SectionStyle={SectionStyle}
            cardStyle={cardStyle}
            ActiveClass={ActiveClass}
            disabled={disabled}
            subTagsList={subTagsList}
          />
        );
      });
      return (

        <div className={cx(styles.SectionStyle, scrollStyle.scrollbar)}>
          <div className="d-flex">
            <span className={cx(styles.sectionHead, SectionHead)}>{tagType}</span>
            {showSelectAll
              ? (
                <div
                  onClick={this.handleSelectAll}
                  className={cx('ml-auto', styles.selectAllBtn)}
                  aria-hidden
                >
                  select all
                </div>
              ) : null}
          </div>
          <br />
          <div>
            {/* className={cx(styles.scrollStyle, scrollStyle.scrollbar)}> */}
            {tagListCard}
          </div>
        </div>

      );
    }
}

export default TraverseCol;
