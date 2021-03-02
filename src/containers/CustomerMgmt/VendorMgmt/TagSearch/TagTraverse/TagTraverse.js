/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from './Store/action';
import TraverseCol from './TraverseCol/TraverseCol';
import styles from './TagTraverse.module.scss';
import Loader from '../../../../../components/Organism/Loader/Loader';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import { insertItemInArray, removeItemsInArray } from './Store/utility';

class TagTraverse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsArray: [],
    };
  }

  componentDidMount() {
    const updateTAgArray = [...this.props.tagsArray];
    this.setState({ tagsArray: updateTAgArray });
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const orgId = match.params.uuid;
    const { clientId } = match.params;
    if (this.props.orgId !== prevProps.orgId || this.props.category !== prevProps.category) {
      this.props.onGetTagList(orgId, this.props.category, clientId);
    }
  }

  componentWillUnmount() {
    this.props.onInitState();
  }

  handleGetSubTagsList = (arrayIndex, tagId, tagName) => {
    const { tagsArray } = this.state;

    const index = arrayIndex + 1;
    const existingTagData = _.cloneDeep(this.props.tagData);
    if (index < existingTagData.length) {
      let updatedTagArray = _.cloneDeep(tagsArray);
      const newTagData = existingTagData[index];
      const { tagList } = newTagData;
      _.remove(tagList, (n) => n.parent !== tagId);

      updatedTagArray[arrayIndex].selectedId = tagId;
      updatedTagArray[arrayIndex].selectedTag = tagName;
      updatedTagArray = removeItemsInArray(updatedTagArray, arrayIndex);
      const newArrayItem = {
        selectedId: null,
        selectedTag: null,
        tagId,
        tagType: newTagData.tagType,
        tagList: newTagData.tagList,
      };
      updatedTagArray = insertItemInArray(updatedTagArray, newArrayItem);
      this.setState({
        tagsArray: updatedTagArray,
      });
    }
  }

  render() {
    const tagColumns = this.state.tagsArray.map((tagColumn, index) => (
      <React.Fragment key={index}>
        <TraverseCol
          key={index}
          tagList={tagColumn.tagList}
          disableTags={this.props.disableTags}
          tagType={tagColumn.tagType}
          category={this.props.category}
          tagId={tagColumn.tagId}
          selectedId={tagColumn.selectedId}
          selectedTag={tagColumn.selectedTag}
          arrayIndex={index}
          addedTags={this.props.tags}
          updateTag={this.props.updateTag}
          SectionHead={this.props.SectionHead}
          cardStyle={this.props.cardStyle}
          ActiveClass={this.props.ActiveClass}
          singleTagSelection={this.props.singleTagSelection}
          showSelectAll={this.props.showSelectAll}
          selectAllTags={this.props.selectAllTags}
          subTagsList={(arrayIndex, tagId, tagName) => this.handleGetSubTagsList(arrayIndex, tagId, tagName)}
          disabled={this.props.disabled}
        />
      </React.Fragment>
    ));

    return (
      <>

        {this.props.tagTraverseState === 'LOADING'
          ? (
            <div className="col-12 px-0">
              <Loader type="tagSearchModal" assign />
            </div>
          )
          : (
            <div className={cx(styles.scroll, scrollStyle.scrollbar)}>
              <div className={cx(styles.SectionAli, this.props.SectionStyle)}>
                {tagColumns}
              </div>
            </div>
          )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  tagData: state.vendorMgmt.vendorTagTraverse.tagData,
  tagsArray: state.vendorMgmt.vendorTagTraverse.tagsArray,
  tagTraverseState: state.vendorMgmt.vendorTagTraverse.getTagTraverseState,
});

const mapDispatchToProps = (dispatch) => ({
  onInitState: () => dispatch(actions.initState()),
  onGetTagList: (orgId, category, clientId) => dispatch(actions.getTagTraverse(orgId, category, clientId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TagTraverse));
