import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import cx from 'classnames';
import styles from './AddressVerificationInsights.module.scss';
import DropDownSmall from "../../../../components/Atom/SmallDropDown/SmallDropDown";

class AddressVerificationInsights extends Component {

    state = {
        selectTime: '',
        duration: null,
        taskStatus: null
    }

    handleSelectDuration = (value) => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let url = this.props.location.pathname;
        urlSearchParams.set("duration", value);
        urlSearchParams.delete("pageNumber");
        url = url + "?" + urlSearchParams.toString();
        this.props.history.push(url);
        let durationType = this.handleDateFilter(value);
        
        this.setState({ selectTime: value, duration: durationType })
    }

    handleDateFilter = (value) => {
        let dateType = value
        let newDate = new Date();
        let today = new Date();
        let lastWeek = null;
        let duration = {};

        switch (dateType) {
            case 'last_week':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'weekly'
                };
                return duration;


            case 'last_day':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'daily'
                };
                return duration;


            case 'last_month':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'monthly'
                };
                return duration;

            case 'last_year':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    dateFrom: lastWeek,
                    dateTo: newDate,
                    type: 'yearly'
                };
                return duration;

            case 'all_time':
                duration = {
                    type: 'overall'
                };
                return duration;

            default:
                return null;

        }

    }


    handleTasks = (value) => {
        this.setState({ taskStatus: value })
    }

    render() {
        return (
            <div className={cx(styles.WorkloadSection)}>

                <div className={cx('d-flex flex-row justify-content-between mt-0')}>
                    <div className={cx('mb-4', styles.Insights)}>Insights</div>
                    <div>
                        <DropDownSmall
                            Options={[
                                { "option": "all_time", "optionLabel": "all time" },
                                { "option": "last_day", "optionLabel": "last day" },
                                { "option": "last_week", "optionLabel": "last week" },
                                { "option": "last_month", "optionLabel": "last month" },
                                { "option": "last_year", "optionLabel": "last year" },
                            ]}
                            changed={(value) => this.handleSelectDuration(value)}
                            value={this.state.selectTime}
                            defaultColor={this.state.selectTime === "all_time" ? styles.DefaultOptionColor : null}
                        />
                        {/* dropdowns */}
                    </div>

                </div>

                <div className={cx('d-flex flex-row')}>
                    <div className={cx('mb-3', styles.Heading)}>case closure summary</div>
                </div>

                <div className={cx('row no-gutters mb-5', styles.Card)}>
                    <div className='flex-column my-auto mr-auto'>
                        <span className={cx('d-flex', styles.Total)}>3.8k <span className={styles.Heading}>tasks</span></span>
                        <span className={styles.Heading}>overall received</span>
                    </div>

                    <div className={cx(styles.Box, "row no-gutters justify-content-between")}>
                        <div className='flex-column'>
                            <span className={cx('d-flex', styles.GreyBold)}>60% <span className={styles.GreySmall}>picked</span></span>
                            <span className='d-flex'>
                                <span className={styles.Yellow} />
                                <span className={cx('ml-2', styles.GreySmall)}>2.2 tasks</span>
                            </span>
                        </div>

                        <div className='flex-column mx-auto'>
                            <span className={cx('d-flex', styles.GreyBold)}>30% <span className={styles.GreySmall}>closed</span></span>
                            <span className='d-flex'>
                                <span className={styles.Green} />
                                <span className={cx('ml-2', styles.GreySmall)}>1.1k tasks</span>
                            </span>
                        </div>

                        <div className='flex-column'>
                            <span className={cx('d-flex', styles.GreyBold)}>10% <span className={styles.GreySmall}>not picked</span></span>
                            <span className='d-flex'>
                                <span className={styles.Pink} />
                                <span className={cx('ml-2', styles.GreySmall)}>0.3k tasks</span>
                            </span>
                        </div>

                        <div className='d-flex' style={{ width: '100%' }}>
                            <hr className={styles.YellowLine} style={{ width: '60%' }} />
                            <hr className={styles.GreenLine} style={{ width: '30%' }} />
                            <hr className={styles.PinkLine} style={{ width: '10%' }} />
                        </div>

                        <div className='d-flex' style={{ width: '100%' }}>
                            <span className={styles.GreySmall} style={{ width: '60%' }}>picked</span>
                            <span className={styles.GreySmall} style={{ width: '30%' }}>completed</span>
                            <span className={styles.GreySmall} style={{ width: '10%' }}>not picked</span>
                        </div>
                    </div>
                </div>

                {/* lower card */}
                <div className={cx('row no-gutters justify-content-between')}>
                    <div className={cx('mb-3', styles.Heading)}>open tasks vs tat</div>
                    <div style={{ width: '5rem' }}>
                        dropdown number 2
                    </div>
                </div>

                <div className={cx('row no-gutters justify-content-between mb-5', styles.Card)}>
                    <div className='flex-column my-auto'>
                        <span className={cx('d-flex', styles.Total)}>1.2k <span className={styles.Heading}>tasks</span></span>
                        <span className={styles.Heading}>yet to be picked</span>
                    </div>

                    <span className={styles.VerticalLine} />

                    <div className='flex-column'>
                        <span className={cx('d-flex', styles.GreyBold)}>60% <span className={styles.GreenZone}>green zone</span></span>
                        <span className={styles.GreySmall}>200 tasks</span>
                        <span className={styles.GreySmall}>{"( >5d remaining )"}</span>
                    </div>

                    <div className='flex-column'>
                        <span className={cx('d-flex', styles.GreyBold)}>30% <span className={styles.OrangeZone}>orange zone</span></span>
                        <span className={styles.GreySmall}>80 tasks</span>
                        <span className={styles.GreySmall}>{"( <5d remaining )"}</span>
                    </div>

                    <div className='flex-column'>
                        <span className={cx('d-flex', styles.GreyBold)}>10% <span className={styles.RedZone}>red zone</span></span>
                        <span className={styles.GreySmall}>30 tasks</span>
                        <span className={styles.GreySmall}>{"( exceeded tat )"}</span>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddressVerificationInsights));