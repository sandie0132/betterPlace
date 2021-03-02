import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './EmpSearch.module.scss';
import cx from 'classnames';
import search from '../../../../../../assets/icons/search.svg';
// import right from '../../../../assets/icons/right.svg';
import * as actions from './Store/action';
import { withRouter } from "react-router";
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

class EmployeeSearch extends Component {

    state = {
        queryString: '',
        tagName: [],
        orgId: null
    };
    _isMounted = false;

    componentDidMount = () => {
        this._isMounted = true;
        const { match } = this.props;
        const orgId = match.params.uuid;
        
        this.setState({ mounted: true, orgId: orgId });
        document.addEventListener('click', this.handleClick, false);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.queryString !== this.state.queryString) {
            if (this.state.queryString.length !== 0) {
                this.props.onSearchEmployee(this.state.orgId, this.state.queryString)
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
        this.props.initState();
    }

    handleClick = () => {
        if (this.dropDownDiv) {
            this.props.initState();
        }
    }

    handleInputChange = (event) => {
        this.setState({
            queryString: event.target.value
        });
    };

    handleSelectTag = (targetIndex) => {
        const selectedEmp = _.cloneDeep(this.props.searchedEmployeeList[targetIndex]);
        this.props.updateTag(selectedEmp);
        this.setState({ queryString: '' });
    }

    render() {
        const { t } = this.props;
        let updatedSearchResult = this.props.searchedEmployeeList;

        return (
            <React.Fragment>
                
                {this.props.label ? <label className={cx(styles.labelText, "mt-3")}>
                    {this.props.label}
                </label> : null}

                <div className={cx(this.props.BarStyle, this.props.noBorder ? null : styles.tagBar)} >
                    <img src={search} alt={t('translation_empSearch:image_alt_empSearch.search')} className="pb-1 pl-1 mr-1" />
                    <input
                        name={this.props.name}
                        className={cx(" ml-1 px-0 ", styles.searchBar)}
                        type='text'
                        value={this.state.queryString}
                        placeholder={this.props.placeholder}
                        onChange={(event) => this.handleInputChange(event)}
                        disabled={this.props.disabled}
                        autoComplete="off"
                    />

                    {!_.isEmpty(updatedSearchResult) && !_.isEmpty(this.state.queryString) ?
                        <div
                            className={cx(styles.dropdownMenu, scrollStyle.scrollbar, this.props.dropdownMenu)}>
                            {updatedSearchResult.map((employee, index) => {
                                if (_.includes(this.props.selectedResult, employee.uuid))
                                    return null;
                                else return (
                                    <div key={index}
                                        className={styles.tagDropDown}
                                        onClick={() => this.handleSelectTag(index)}
                                        ref={dropDownDiv => this.dropDownDiv = dropDownDiv}>
                                        <span className={styles.searchText}>{employee.firstName} {employee.lastName}</span>
                                    </div>
                                )
                            })
                            }
                        </div>
                        : null
                    }

                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        searchEmployeeState: state.empMgmt.empSearch.searchEmployeeState,
        searchedEmployeeList: state.empMgmt.empSearch.searchedEmployeeList
    };
};


const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        onSearchEmployee: (orgId, searchInput) => dispatch(actions.searchEmployee(orgId, searchInput)),
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(EmployeeSearch)));