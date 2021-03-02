import React, { Component } from 'react';
import cx from 'classnames';
import styles from './ExpandTags.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import close from '../../../../../assets/icons/closeBlack.svg';
import folderIcon from '../../../../../assets/icons/locationTags.svg';
import closeBigIcon from '../../../../../assets/icons/closeBigIcon.svg';

class ExpandTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { selectedTags, handleDeleteSelectedTag, toggleExpandList } = this.props;
    return (
      <div className={cx('row no-gutters', styles.ExpandTagsBg, scrollStyle.scrollbarBlue)}>
        <div className="row no-gutters w-100">
          <div className="d-flex flex-row justify-content-end mr-3" style={{ width: '100%' }}>
            <img
              aria-hidden="true"
              src={closeBigIcon}
              className={cx(styles.Cursor)}
              onClick={toggleExpandList}
              alt=""
            />
          </div>
          <div className={cx('row no-gutters', styles.Overflow, scrollStyle.scrollbarBlue)}>
            {selectedTags.map((item) => (
              <div className={cx(styles.SelectedWhiteTag)} key={item.uuid}>
                <img
                  src={folderIcon}
                  className={cx(styles.FolderIcon, 'pr-2 ml-1')}
                  alt=""
                />
                {` ${item.name}`}
                <img
                  aria-hidden="true"
                  src={close}
                  className={cx('ml-3', styles.Cursor)}
                  onClick={() => handleDeleteSelectedTag(item)}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandTags;
