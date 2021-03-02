import React from 'react';
import _ from 'lodash';
import Select from 'react-select';
import style from './CustomSelect.module.scss';
import cx from 'classnames';
import themes from '../../../theme.scss';

const CustomSelect = (props) => {
    const colourStyles = {

        control: (base) => {
            return {
                ...base,
                borderRadius: "20px",
                fontSize: 14,
                color: themes.activeLink,
                border: 0,
                backgroundColor: themes.secondaryBackground,
                boxShadow: "null",
            }
        },
        singleValue: () => {
            return {
                color: themes.activeLink,
                padding: "2px 0px 2px 3px",
               
            }
        },
        indicatorSeparator: () => null,
        dropdownIndicator: (base) => {
            return {
                ...base,
                color: themes.activeLink,
                padding: '2px 10px 2px 0px',
                fontSize: '12px',
                height: '8px',
                marginBottom: '16px',
                ':hover': {
                    color: themes.activeLink
                },
            }
        },
        input: () => {
            return {
                display: 'inline-block'
            }
        },
        option: (base, state) => {
            return {
                ...base,
                cursor: 'pointer',
                fontSize: '14px',
                position: 'relative',

                color: state.isSelected ? themes.activeLink : themes.secondaryLabel,
                backgroundColor: state.isFocused ? themes.primaryBackground : "null",
                ':hover': {
                    backgroundColor: themes.primaryBackground,
                    color: themes.primaryLabel
                },
            };
        },

        menu: (base) => ({
            ...base,
            borderRadius: "20px",
            border: 0,

            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.11)",
            marginTop: "-2.5rem",
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
            borderRadius: "20px",
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.11)",
        }),
    };

    const onChangeInValue = (event) => {
        props.onChange(event.value)
        if(props.onError){
            props.onError(null);
        }
    }

    let errorList = [];
    if(!_.isEmpty(props.errors)){
        _.forEach(props.errors, function(error, field){
            errorList.push(
                <div key={field} className={style.ErrorMessage}>{error}</div>
            )
        })
    }

    let options = [];

    // filterOptionsBy = {key1: [value1, value2], key2: [value3, value4]}
    if(!_.isEmpty(props.filterOptionsBy)){
        _.forEach(props.options, function(option){
            let showOption = true;
            if(showOption){
                _.forEach(props.filterOptionsBy, function(filterValue, filterKey){
                    if(!_.includes(filterValue, option[filterKey])){
                        if(showOption) showOption = false;
                    }         
                })
            }
            if(showOption) options.push(option);
        })
    }else{
        options = _.cloneDeep(props.options)
    }

    return (
        
        <div className={cx(props.className, style.Input)}>
            {(props.label) ? <label className={props.value ? cx(style.LabelWithValue) : cx(style.Label)}>
                {props.label} <span className={style.requiredStar}>{props.required ? '*' : null}</span>
            </label> : null}
            <Select
                defaultValue={props.options[0]}
                styles={colourStyles}
                isDisabled={props.disabled}
                value={props.options.find(option => _.isEqual(option.value, props.value))}
                onChange={onChangeInValue}
                options={options}
            />
            {errorList}
        </div>
    );
};

export default CustomSelect;

