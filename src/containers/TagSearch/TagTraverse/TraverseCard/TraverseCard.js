/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import * as actions from '../Store/action';
import styles from './TraverseCard.module.scss';
import TagIcons from '../../../../components/Atom/TagIcons/TagIcons';
import arrow from '../../../../assets/icons/dropdownArrow.svg';
import check from '../../../../assets/icons/rightNavTick.svg';
import uncheck from '../../../../assets/icons/greyCircle.svg';

class TraverseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false,
      showAddIcon: false,
    };
  }

  componentDidMount() {
    this.handleShowAdded();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.addedTags !== this.props.addedTags || this.props.tag !== prevProps.tag) {
      this.handleShowAdded();
    }
  }

    handleShortenTagName = (tagName) => {
      const maxLength = 24;
      if (tagName.length > maxLength) {
        const updatedName = `${tagName.substring(0, maxLength)}...`;
        return (updatedName);
      }
      return (tagName);
    }

    handleShowAdded() {
      let isAdded = false;
      const { id } = this.props;
      _.forEach(this.props.addedTags, (addedtag) => {
        if (addedtag.uuid === id) {
          isAdded = true;
        }
      });
      this.setState({ isAdded });
    }

    handleGetSubTagsList = () => {
      const { match, sharedTagQuery } = this.props;
      const orgId = match.params.uuid;
      this.props.onGetSubTagList(this.props.arrayIndex, this.props.id,
        this.props.name, orgId, this.props.tag.category, sharedTagQuery);
    }

    handleSelectTag = (event) => {
      event.stopPropagation();
      if (!this.props.isDisabled) {
        if (this.state.isAdded) this.props.updateTag({ value: this.props.tag }, 'delete');
        else this.props.updateTag({ value: this.props.tag }, 'add');
      }
    }

    render() {
      const { t, selectionType, tagType } = this.props;
      const allowSelection = selectionType != null ? (selectionType === tagType) : true;
      return (
        <>
          <div
            className={cx(styles.FolderAlign, this.props.cardStyle, this.props.isSelected
              ? (styles.FolderActive, this.props.ActiveClass) : null)}
            onClick={this.handleGetSubTagsList}
            onMouseEnter={allowSelection ? () => this.setState({ showAddIcon: true }) : null}
            onMouseLeave={() => this.setState({ showAddIcon: false })}
          >

            <span
              className={this.props.isDisabled ? styles.disableSelection : null}
            >
              <TagIcons
                category={this.props.tag.category}
                hasAccess={this.props.tag.hasAccess}
              />

                        &nbsp; &nbsp;
            </span>
            {this.handleShortenTagName(this.props.name)}

            <div onClick={(event) => (this.props.disabled ? null : this.handleSelectTag(event))} className={cx('ml-auto', this.props.disabled ? styles.disabled : null)}>
              {this.state.showAddIcon && !this.state.isAdded
                ? (
                  <>
                    <img src={uncheck} alt={t('translation_tagSearch:image_alt_tagSearch.lock')} style={{ height: '15px', marginRight: '0.5rem' }} />
                    <span className={styles.verticalLine} />
                  </>
                )
                : this.state.isAdded
                  ? (
                    <>
                      {' '}
                      <img src={check} alt={t('translation_tagSearch:image_alt_tagSearch.lock')} style={{ height: '14px', marginRight: '0.5rem' }} />
                      <span className={styles.verticalLine} />
                    </>
                  )
                  : null}

            </div>

            {this.props.tag.hasChildren
              ? <><img src={arrow} alt={t('translation_tagSearch:image_alt_tagSearch.arrow')} className={cx(styles.arrow)} /></>
              : null}

          </div>
          <br />
        </>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  onGetSubTagList: (arrayIndex, tagId, tagName, orgId, category, sharedTagQuery) => dispatch(
    actions.getSubTagTraverse(arrayIndex, tagId, tagName, orgId, category, sharedTagQuery),
  ),
});

export default withTranslation()(withRouter(connect(null, mapDispatchToProps)(TraverseCard)));
