import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from './Store/action';
import styles from './EmpSearch.module.scss';
import cx from 'classnames';
import search from '../../assets/icons/search.svg';
import close from '../../assets/icons/closeNotification.svg';
import empIcon from '../../assets/icons/manager.svg';

import { withTranslation } from 'react-i18next';
import scrollStyle from '../../components/Atom/ScrollBar/ScrollBar.module.scss';

class EmployeeSearch extends Component {

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
                this.props.onSearchEmployee(this.props.orgId, this.state.queryString)
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

    handleSelect = (targetIndex) => {
        const selectedEmployee = _.cloneDeep(this.props.data[targetIndex]);
        this.props.onUpdateSelection(selectedEmployee, 'add');
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

        return (
            <React.Fragment>
                {this.props.label ? <label className={cx(styles.labelText, "mt-3")}>
                    {this.props.label}
                </label> : null}
                <div className={cx(this.props.BarStyle, this.props.noBorder ? null : styles.tagBar)} style={this.props.position ?  null :{ position: 'relative' } }  >
                    {
                        this.state.queryString || !this.props.value ?
                        <img src={search} alt={'search'} className={cx("pb-1 pl-1 mr-1", this.props.imgSize,styles.searchIcon)} />
                        :
                        <img src={empIcon} alt={'empIcon'} className={cx("pb-1 pl-1 mr-1 mt-1", this.props.imgSize,styles.searchIcon)} />

                    }
                    <input
                        name={this.props.name}
                        className={cx("ml-1 px-0 ", styles.searchBarTag,this.props.value ? styles.place : null,this.props.searchBar)}
                        type='text'
                        value={this.state.queryString ? this.state.queryString : (this.props.value ? this.props.value : '')}
                        placeholder={this.props.placeholder}
                        onChange={(event) => this.handleInputChange(event)}
                        disabled={this.props.value || this.props.disabled}
                        autoComplete="off"
                    />
                    {this.props.value ? 
                    <span className={this.props.disabled ? styles.cancelTagInactive :styles.cancelTag} 
                        onClick={ !this.props.disabled ? () => this.props.onUpdateSelection(null, 'delete') : null}
                    >
                    <img src={close} alt="close"/>
                    </span> : <span className="mr-4" />}
                    {!_.isEmpty(this.props.data) ?
                        <div className={cx(styles.dropdownMenu, scrollStyle.scrollbar, this.props.dropdownMenu)}>

                            {this.props.data.map((searchArr, index) => {
                                return (
                                    <div key={index}
                                        className={styles.tagDropDown}
                                        onClick={(() => this.handleSelect(index))}
                                        ref={dropDownDiv => this.dropDownDiv = dropDownDiv}
                                    >
                                        {
                                            searchArr['firstName'] 
                                            + (!_.isEmpty(searchArr['middleName']) ? (' '+ searchArr['middleName']):'')
                                            + (!_.isEmpty(searchArr['lastName']) ? (' '+ searchArr['lastName']): '')
                                        }
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
        getDataState: state.employeeSearch.searchEmployeeState,
        data: state.employeeSearch.employeeList
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onInitState: () => dispatch(actions.getInitState()),
        onSearchEmployee: (orgId, searchInput) => dispatch(actions.searchEmployee(orgId, searchInput)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(EmployeeSearch)));