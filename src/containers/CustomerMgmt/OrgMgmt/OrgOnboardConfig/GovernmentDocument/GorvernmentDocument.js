import React from 'react';
import { withRouter } from "react-router";
import EPF from './EPF/EPF';
import ESIC from './ESIC/ESIC';

const GovernmentDocument = (props) => {
    return (
        
        props.match.params.documentType === "esic" ?
        <ESIC/>
        :
        <EPF/>
        
    )
}

export default withRouter(GovernmentDocument);
