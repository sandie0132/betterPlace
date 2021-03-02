import React from 'react';
import CircularProgress from "../../Atom/CircularProgress/CircularProgress";
import CircularLoading from "../../Atom/CircularProgressLoading/CircularProgressLoading";
import styles from "./CircularProgressBar.module.scss";

const CircularProgressBar = (props) => {

    let progress = null;

    const getBuildStyles = () => {
        const status = props.status
        switch (status) {
            case 'error':
                return {
                    pathColor: "#EE3942",
                    trailColor: "#F4F7FB",
                    backgroundColor: "#FDEBEC"
                }

            case 'success':
                return {
                    pathColor: "#4BB752",
                    trailColor: "#F4F7FB",
                    backgroundColor: "#EDF7ED"
                }
            default:
                return {
                    pathColor: "#0059B2",
                    trailColor: "#F4F7FB",
                    backgroundColor: "#E5EEF7"
                }
        }
    }

    switch (props.type) {
        case 'progress':
            progress =
                <CircularProgress
                    percentValue={props.percentValue}
                    centerImage={props.centerImage}
                    buildStyles={getBuildStyles()}
                />
            break;
        case 'loading':
            progress =
                <div className={styles.progressLoader}>
                    <div style={{ height: "5.5rem" }}>
                    <CircularLoading
                        height= "5.5rem"
                    />
                    </div>
                    <div style={{ position: 'absolute', marginTop: "-56px", marginLeft: "34px" }}>
                        <img src={props.centerImage} style={{ height: "24px" }} alt="img"></img>
                    </div>

                </div>
            break;
        default:
            progress =
                <div>
                    <CircularLoading
                        height={"5.5rem"}
                    />
                    <div style={{ position: 'absolute', marginTop: "-6.5%", marginLeft: "4.25%" }}>
                        <img src={props.image} style={{ height: "15px" }} alt="img"></img>
                    </div>

                </div>
            break;

    }
    return (
        <div>
            {progress}
        </div>
    )
}

export default CircularProgressBar;