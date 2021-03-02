import React from 'react';
import Select from 'react-select';
import style from './CustomSelectSmall.module.scss';
import cx from 'classnames';
import themes from '../../../../../../theme.scss';
import yellowCase from '../../../../../../assets/icons/yellow.svg';
import greenCase from '../../../../../../assets/icons/verifyGreen.svg';
import redCase from '../../../../../../assets/icons/verifyRed.svg';

import IconOption from '../../../../../../components/Atom/Options/Options';

const CustomSelectSmall = (props) => {
   const statusProperties = {
        'YELLOW' : { bgColor: themes.warningBackground, img: yellowCase, label: 'yellow'},
        'RED' : { bgColor: themes.errorNotification, img: redCase, label: 'red'},
        'GREEN' : { bgColor: themes.successNotification, img: greenCase, label: 'green'} 
    };
    let options = [];
    if(props.type === 'section'){
        options = [{ value: 'YELLOW', label: 'yellow' },{ value: 'RED', label: 'red' },{ value: 'GREEN', label: 'green' }];
    }
    else{
        options = [{ value: 'YELLOW', label: 'yellow' },{ value: 'RED', label: 'red' }];
    }

    const dot = (status) => ({
    alignItems: "center",
    display: "flex",

        ":before": {
            borderRadius: 5,
            content: '" "',
            display: "block",
            backgroundImage: `url(${status})`,
            marginRight: 6,
            height: 16,
            width: 16
        }
    });
    
    const colourStyles = {

        control: (base, state) => {
            return {
                ...base,
                borderRadius: "20px",
                fontSize: 14,
                color: themes.primaryLabel,
                border: 0,
                backgroundColor: statusProperties[props.value].bgColor,
                boxShadow: "null",
            }
        },
        singleValue: (styles, { data }) => ({ ...styles, ...dot(statusProperties[props.value].img) }),
        indicatorSeparator: () => null,
        dropdownIndicator: (base, state) => {
            return {
                ...base,
                color: themes.primaryLabel,
                padding: '2px 10px 2px 0px',
                fontSize: '12px',
                height: '8px',
                marginBottom: '16px',
                ':hover': {
                    color: themes.primaryLabel
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

        menu: (base, state) => ({
            ...base,
            borderRadius: "20px",
            border: 0,

            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.11)",
            marginTop: "-2.5rem",
        }),
        menuList: (base, state) => ({
            ...base,
            padding: 0,
            borderRadius: "20px",
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.11)",
        }),
    };
    return (
        <div className={cx(props.className, style.Input)}>
            {(props.label) ? <label className={props.value ? cx(style.LabelWithValue) : cx(style.Label)}>
                {props.label}
            </label> : null}

            <Select
                defaultValue={options[0]}
                styles={colourStyles}
                isDisabled={props.disabled}
                value={options.find(option => option.value === props.value)}
                onChange={props.changed}
                options={options}
                components={{ Option: IconOption }}
            />
        </div>
    );
};

export default CustomSelectSmall;

