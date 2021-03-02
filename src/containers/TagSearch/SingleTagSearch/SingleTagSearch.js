import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../Store/action';
import styles from './SingleTagSearch.module.scss';
import cx from 'classnames';
import search from '../../../assets/icons/search.svg';
import close from '../../../assets/icons/closeNotification.svg';
import right from '../../../assets/icons/right.svg';
import TagIcon from '../../../components/Atom/TagIcons/TagIcons';
import { withTranslation } from 'react-i18next';
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';

class SingleTagSearch extends Component {

    state = {
        queryString: '',
    };

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.setState({ mounted: true });
        document.addEventListener('click', this.handleClick, false);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.queryString !== this.state.queryString) {
            if (this.state.queryString.length !== 0) {
                this.props.onGetTagList(this.props.orgId, this.props.category, this.props.type, this.state.queryString, this.props.name, this.props.vendorId, this.props.clientId)
            }
            else {
                this.props.onInitState();
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
        this.props.onInitState();
    }

    handleInputChange = (event) => {
        this.setState({
            queryString: event.target.value
        });
    };

    handleSelectTag = (targetIndex) => {
        const selectedTag = _.cloneDeep(this.props.data[this.props.name][targetIndex]).pop();
        this.props.updateTag(selectedTag, 'add');
        this.props.onInitState();
        this.setState({ queryString: '' });
    }

    handleClose = () => {
        this.props.onInitState();
    }

    handleClick = (event) => {
        if (this.dropDownDiv) {
            if (!this.dropDownDiv.contains(event.target)) {
                this.handleClose();
            }
        }
    }

    render() {
        const { t } = this.props;
        const name = this.props.name;

        return (
            <React.Fragment>
                {this.props.label ? <label className={cx(styles.labelText, "mt-3")}>
                    {this.props.label}
                </label> : null}
                <div className={cx(this.props.BarStyle, this.props.noBorder ? null : styles.tagBar)} 
                    style={this.props.position ?  null :{ position: 'relative' } } >

                    
                    {
                        this.props.tags ?
                            <React.Fragment>
                                <TagIcon
                                    hasAccess={this.props.tags.hasAccess}
                                    category={this.props.tags.category ? this.props.tags.category :this.props.category }
                                    className={styles.TagIconSize}
                                />
                            </React.Fragment> : <img src={search} alt={t('translation_tagSearch:image_alt_tagSearch.search')} className={cx("pb-1 pl-1 mr-1", this.props.imgSize,styles.searchIcon)} />
                    }
                    <input
                        name={this.props.name}
                        className={cx("ml-1 px-0 ", styles.searchBarTag,this.props.tags ? styles.place : null,this.props.searchBar)}
                        type='text'
                        value={this.state.queryString}
                        placeholder={this.props.tags ? (this.props.tags.name ? this.props.tags.name: this.props.tags)  : this.props.placeholder}
                        onChange={(event) => this.handleInputChange(event)}
                        disabled={this.props.tags || this.props.disabled}
                        autoComplete="off"
                    />
                    {this.props.tags ? 
                    <span className={this.props.disabled ? styles.cancelTagInactive :styles.cancelTag} 
                        onClick={ !this.props.disabled ? () => this.props.updateTag(null, 'delete') : null}
                    >
                        <img src={close} alt="close"/>
                    </span> : <span className="mr-4" />}
                    {!_.isEmpty(this.props.data[name]) ?
                        <div className={cx(styles.dropdownMenu, scrollStyle.scrollbar, this.props.dropdownMenu)}>

                            {this.props.data[name].map((searchArr, index) => {
                                const searchLength = searchArr.length;
                                if (this.props.disableTags !== undefined && _.includes(this.props.disableTags, searchArr[searchLength - 1].uuid)) {
                                    return null;
                                }
                                else return (
                                    <div key={index}
                                        className={styles.tagDropDown}
                                        onClick={(() => this.handleSelectTag(index))}
                                        ref={dropDownDiv => this.dropDownDiv = dropDownDiv}
                                    >
                                        {searchArr.map((ser, index) => {
                                            return (

                                                <div key={index} className={cx(styles.iconStyle)}>
                                                    <TagIcon
                                                        hasAccess={ser.hasAccess}
                                                        category={ser.category}
                                                        className={styles.iconSize}
                                                    />
                                                    <span className="pl-2">
                                                        {index !== (searchArr.length - 1) ?
                                                            <span>{ser.name}<img src={right} alt={t('translation_tagSearch:image_alt_tagSearch.right')} className="mx-3" /></span>
                                                            :
                                                            <span className={styles.searchText}>{ser.name}</span>}
                                                    </span>
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>
                                )
                            })
                            }
                        </div>
                        : null}

                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        getDataState: state.tagSearch.getDataState,
        data: state.tagSearch.data,
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onInitState: () => dispatch(actions.initState()),
        onGetTagList: (orgId, category, type, key, name, vendorId, clientId) => dispatch(actions.getTagList(orgId, category, type, key, name, vendorId, clientId)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleTagSearch)));