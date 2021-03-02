import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";


const CircularProgress = (props) => {

    return (
        <CircularProgressbarWithChildren
            value={props.percentValue}
            strokeWidth={2.5}
            background
            styles={buildStyles(props.buildStyles)}
        >
            <img src={props.centerImage} style={{ height: "24px" }} alt="img"></img>
        </CircularProgressbarWithChildren>
    )

}

export default CircularProgress;