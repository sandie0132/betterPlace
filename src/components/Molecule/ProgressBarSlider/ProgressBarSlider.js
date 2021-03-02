import React, { Component } from 'react';
import cx from 'classnames';
import styles from './ProgressBarSlider.module.scss';

class ProgressBarSlider extends Component {

    render() {

        let percentage = (this.props.value - parseInt(this.props.min)) / (parseInt(this.props.max) - parseInt(this.props.min)) * 100;
        return (
            <React.Fragment>
                <div className={cx(this.props.className, "d-flex flex-column")}>
                    <label className={styles.Label}>{this.props.label}</label>
                    {this.props.status === 'LOADING' ?
                        <input className={styles.ProgressBarSlider}
                            style={{ backgroundImage: "linear-gradient(90deg, #4BB752 " + percentage + "% , #EBECFD 0%)" }}
                            type="range"
                            min={this.props.min}
                            max={this.props.max}
                            defaultValue={this.props.value}
                        >
                        </input>
                        :
                        <input className={styles.ProgressBarSlider}
                            style={{ backgroundImage: "linear-gradient(90deg, #EE3942 " + percentage + "% , #FDEBEC 0%)" }}
                            type="range"
                            min={this.props.min}
                            max={this.props.max}
                            defaultValue={this.props.value}
                        >
                        </input>
                    }

                    {/* <output className={styles.Output}>
                        <label className = {styles.OutputMessage}>
                        {this.props.value} / {this.props.max} verifications done
                        </label>
                    </output> */}

                </div>
            </React.Fragment>
        );
    }
}

export default ProgressBarSlider;