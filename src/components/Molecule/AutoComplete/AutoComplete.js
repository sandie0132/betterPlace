import React, { Component } from 'react';
import _ from 'lodash';
import {Input} from 'react-crux';
import cx from 'classnames';
import styles from './AutoComplete.module.scss';

class AutoComplete extends Component {

    state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        isTagPresent: false
    }

    handleInputChange = (event) => {
        let suggestions = [], updatedfilteredSuggestions = [];
        _.forEach(this.props.suggestions, function (object) {
            suggestions.push(object.label)
        });

        const userInput = event;
        updatedfilteredSuggestions = suggestions.filter(
            suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        updatedfilteredSuggestions = [event, ...updatedfilteredSuggestions];
        let isTagPresent = false;

        this.props.selectedTags.map(tag => {
            _.forEach(updatedfilteredSuggestions, function(suggestion) {
                if(tag.name.toLowerCase() === suggestion.toLowerCase() && userInput.length === suggestion.length) {
                    isTagPresent = true;
                }
            })

            updatedfilteredSuggestions = updatedfilteredSuggestions.filter(
                suggestion => suggestion.toLowerCase() !== tag.name.toLowerCase()
            )
            return updatedfilteredSuggestions;
        })

        if(isTagPresent) {
            updatedfilteredSuggestions.push(userInput + ' cannot be added again');
        }

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: updatedfilteredSuggestions,
            showSuggestions: true,
            userInput: userInput,
            isTagPresent: isTagPresent
        });
    }

    onSelectSuggestion = (event) => {

        let selectedValue = event.target.innerText;
        const selectedObject = this.props.suggestions.find(object => object.label === event.target.innerText);
        if (selectedObject) {
            selectedValue = selectedObject.value;
        }
        let selectedTag = selectedValue.split(' ');
        if (selectedTag[selectedTag.length - 1] !== 'again') {
            this.props.addNewTag({ value: selectedValue })
        }
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: ''
        });
    };


    render() {

        let suggestionsListComponent;
        if (this.state.showSuggestions && this.state.userInput) {
            if (this.state.filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul className={cx("suggestions ml-2", styles.AutoList)}>
                        {this.state.filteredSuggestions.map((suggestion, index) => {
                            let className = !this.state.isTagPresent ? styles.ActiveTag : styles.InactiveTag
                            return (
                                <span key={index} className={cx(styles.List, "dropdown-list ml-0")}>
                                    <li
                                        className={cx(className, styles.DList)}
                                        key={suggestion}
                                        onClick={this.onSelectSuggestion}
                                    >
                                        {suggestion}
                                    </li>
                                </span>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        {/* <br /><em>No suggestions, you're on your own!</em> */}
                    </div>
                );
            }
        }

        return (
            <div className='col-4 px-0'>
                <Input
                    name={this.props.name}
                    className={this.props.className}
                    label={this.props.label}
                    type='text'
                    placeholder={this.props.placeholder}
                    //required={this.props.required}
                    disabled={this.props.disabled}
                    onChange={(event)=>this.handleInputChange(event)}
                    value={this.state.userInput}

                />
                {suggestionsListComponent}
            </div>
        );
    }
}

export default AutoComplete;