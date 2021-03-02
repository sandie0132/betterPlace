import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { Button, Datepicker } from 'react-crux';
import styles from './DateRangeModal.module.scss';
import closePage from '../../../assets/icons/closePageWhite.svg';



class DateRangeModal extends Component {

    state = {
        enableApply: false,
        from: null,
        to: null,
        error: '',
        errors: {}
    }

    componentDidMount = () => {
        let updatedFrom = this.state.from;
        let updatedTo = this.state.to;

        if (!_.isEmpty(this.props.value)) {
            if (this.props.taskFilters && this.props.value.includes("-")) {
                let updatedValue = this.props.value.split("-");
                updatedFrom = updatedValue[0].replace(/\./g, "-");
                updatedTo = updatedValue[1].replace(/\./g, "-");

                updatedFrom = updatedFrom.split("-").reverse().join("-");
                updatedTo = updatedTo.split("-").reverse().join("-");
            }
            else {
                updatedFrom = this.props.value.from;
                updatedTo = this.props.value.to;
            }
        }

        this.setState({ from: updatedFrom, to: updatedTo })

    }

    // componentWillUnmount=()=>{

    // }

    handleError = (error, inputField) => {

        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        } else {
            delete updatedErrors[inputField]
        }
        this.setState({
            errors: updatedErrors
        });

    };

    handleDateReset = () => {
        this.setStat({ enableApply: false, from: null, to: null, error: '' })
    }

    isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    handleDateUpdate = (value, inputField) => {

        let updatedFrom = this.state.from;
        let updatedTo = this.state.to;

        let enableApply = false;
        let error = this.state.error;

        if (inputField === "from") updatedFrom = value;
        else updatedTo = value;


        if (!_.isEmpty(updatedFrom) && !_.isEmpty(updatedTo)) {
            let fromDate = new Date(updatedFrom)
            let toDate = new Date(updatedTo)

            if (!this.isValidDate(fromDate) || !this.isValidDate(toDate)) {
                enableApply = false;
                error=''
            }
            else if(updatedFrom.length !== 10 || updatedTo.length !== 10){
                enableApply = false
                error=''
            }
            else if (fromDate > toDate) {
                if (updatedFrom.length === 10 && updatedTo.length === 10) {
                    error = "* from date should be less that to date"
                }
            }
            else {
                enableApply = true;
                error = '';
            }
        }


        // if (!_.isEmpty(this.state.errors)) { enableApply = false; }

        this.setState({ from: updatedFrom, to: updatedTo, enableApply: enableApply, error: error })
    }

    handleApply = () => {
        if (_.isEmpty(this.state.errors)) {
            let obj = {}
            obj.from = this.state.from;
            obj.to = this.state.to;

            this.props.onChange(obj);
            this.props.toggle();
        } else {
            this.setState({ enableApply: false })
        }
    }

    render() {
        // console.log(this.state.errors);
        return (
            <div className={cx(styles.backDrop, "d-flex flex-row justify-content-center")}>
                <div className={cx(styles.cardContainer, "d-flex flex-column")}>

                    <img src={closePage} alt="close page" style={{ marginTop: "8rem", marginBottom: "3rem", cursor: "pointer", height: "16px" }} onClick={(e) => this.props.toggle(e)} />

                    <div className={cx(styles.modalContainer)}>
                        <div className="d-flex flex-row">
                                <Datepicker
                                    name="from"
                                    label="from date"
                                    className="col-5 pr-3"
                                    openCalendar
                                    value={this.state.from}
                                    onChange={(value) => this.handleDateUpdate(value, "from")}
                                    onError={(value) => this.handleError(value, "from")}
                                    errors={this.state.errors['from']} />
                                <Datepicker
                                    name="to"
                                    label="to date"
                                    className="col-5 pr-3"
                                    onChange={(value) => this.handleDateUpdate(value, "to")}
                                    onError={(value) => this.handleError(value, "to")}
                                    value={this.state.to}
                                    errors={this.state.errors['to']}
                                    openCalendar/>
                            <div>
                                <Button
                                    label="apply"
                                    isDisabled={!this.state.enableApply}
                                    className={this.state.enableApply ? styles.activeButton : styles.disableButton}
                                    clickHandler={this.handleApply}
                                />
                            </div>
                        </div>
                        {!_.isEmpty(this.state.error) ?
                            <label className={styles.errorMessage} style={{}}>{this.state.error}</label>
                            : null}

                    </div>


                </div>

            </div>
        )
    }

}

export default DateRangeModal;
