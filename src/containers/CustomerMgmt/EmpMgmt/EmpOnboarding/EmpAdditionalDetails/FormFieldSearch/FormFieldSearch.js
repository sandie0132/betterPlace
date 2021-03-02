import React, { Component } from 'react';
import _ from "lodash";
import { withRouter } from "react-router";

import arrow from "../../../../../../assets/icons/greyDropdown.svg";
import search from "../../../../../../assets/icons/searchSmall.svg";

import { fieldSearchMapping } from './SearchInitData';
import styles from "./FormFieldSearch.module.scss";

import { goToAnchor } from 'react-scrollable-anchor'


class FormFieldSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: '',
            searchResult: []
        }
    }

    componentDidMount(){
        document.addEventListener('click', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }

    handleClick = (event) => {
        if (this.dropDownDiv) {
            if (!this.dropDownDiv.contains(event.target)) {
                this.setState({
                    searchResult: []
                })
            }
        }
    }

    handleSearch = (event) => {
        const key = event.target.value;
        var regex = new RegExp(key, 'g');
        let searchResult = [];
        if(!_.isEmpty(key)){
            _.forEach(fieldSearchMapping, function(options, field){
                if(field.match(regex)){
                    _.forEach(options, function(option){
                        searchResult.push(option)
                    })
                }
            })
        }
        this.setState({
            key: key,
            searchResult: searchResult
        })
    }

    handleSelectOption = (hashId) => {
        this.setState({
            key: '',
            searchResult: []
        })
        goToAnchor(hashId, true)
    }

    render() {
        return (
            <div>
                <div className={styles.searchBorder}>
                    <img src={search} alt="search" />
                    <input type="text"
                        value={this.state.key}
                        placeholder="search a field here.."
                        className={styles.searchBar}
                        onChange={(event) => this.handleSearch(event)}
                    />
                </div>
                {
                    !_.isEmpty(this.state.searchResult) ?
                        <div className={styles.searchDropdown}>
                            {
                                this.state.searchResult.map((menu, index) => {
                                    return (
                                        <div className={styles.searchOption} key={index} onClick={() => this.handleSelectOption(menu['value'])}
                                            ref={dropDownDiv => this.dropDownDiv = dropDownDiv}
                                        >
                                            {
                                                menu["label"].map((option, index) => {
                                                    return (
                                                        <span 
                                                            key={index} 
                                                            className={index === menu["label"].length - 1 ? styles.searchOptionFontActive : styles.searchOptionFont}>
                                                            {option} 
                                                            {
                                                                index === menu["label"].length - 1 ? 
                                                                    null 
                                                                    : 
                                                                    <span className="mx-2">
                                                                        <img src={arrow} alt="img" className={styles.imgRotate} />
                                                                    </span>
                                                            }
                                                        </span>
                                                    )
                                            })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default withRouter(FormFieldSearch);