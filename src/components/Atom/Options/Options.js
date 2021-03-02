import React from 'react';
import { components } from 'react-select';
import yellowCase from '../../../assets/icons/yellow.svg';
import greenCase from '../../../assets/icons/verifyGreen.svg';
import redCase from '../../../assets/icons/verifyRed.svg';
import themes from '../../../theme.scss';

const { Option } = components;
   const statusProperties = {
        'YELLOW' : { bgColor: themes.warningBackground, img: yellowCase, label: 'yellow'},
        'RED' : { bgColor: themes.errorNotification, img: redCase, label: 'red'},
        'GREEN' : { bgColor: themes.successNotification, img: greenCase, label: 'green'} 
    };

    const IconOption = (props) => (
    
    <Option {...props}>
    <img src={statusProperties[props.value].img} alt={statusProperties[props.value].label} />
    <span className="ml-2">
        {statusProperties[props.value].label} 
    </span> 
    </Option>
);

export default IconOption;
