import React from 'react';
import functn from '../../../assets/icons/functionTags.svg';
import functnKey from '../../../assets/icons/functionTagsKey.svg';
import custom from '../../../assets/icons/customTags.svg';
import customKey from '../../../assets/icons/customTagsKey.svg';
import geoDefault from '../../../assets/icons/locationTags.svg';
import geoDefaultKey from '../../../assets/icons/locationTagsKey.svg';

const TagIcon = (props) => {

    let TagIcon = null;

    switch (props.category) {
        case 'functional':

            TagIcon = <span>
                {props.hasAccess ? <img src={functnKey} alt={"tagImg"} className={props.className} /> 
                : <img src={functn} alt={"tagImg"} className={props.className}/>}
            </span>
            break;

        case 'geographical':

            TagIcon = <span>
                {props.hasAccess ? <img src={geoDefaultKey} alt={"tagImg"} className={props.className}/> 
                : <img src={geoDefault} alt={"tagImg"} className={props.className}/>}
            </span>
            break;

        default:

            TagIcon = <span>
                {props.hasAccess ? <img src={customKey} alt={"tagImg"} className={props.className}/>
                 : <img src={custom} alt={"tagImg"} className={props.className}/>}
            </span>
            break;

    }


    return (
        <React.Fragment>
            {TagIcon}
        </React.Fragment>
    )
};

export default TagIcon;