import React,{Component} from 'react';
import cx from 'classnames';
import _ from 'lodash';

import eye from "../../../assets/icons/eyeRecognition.svg";
import eyeOpen from "../../../assets/icons/eyeOpen.svg";

import styles from './PasswordInput.module.scss';

class PasswordInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
           focus:false,
           showPassword: false
        };
    }

     handleOnBlur = (event) => {
        this.handleCheckValidation(event.target.value);
    }

     handleOnChange = (event) => {
        this.props.onChange(event.target.value);
        if(!_.isEmpty(this.props.errors)){
            this.handleCheckValidation(event.target.value);
        }
    }

     handleCheckValidation = (value) => {
        if(!_.isEmpty(this.props.validation)){
            let errors = {};
            _.forEach(this.props.validation, function(validationFunction, rule){
                if(!validationFunction(value)){
                    errors[rule] = this.props.message[rule];
                }
            })
            this.props.onError(errors);
        }
    }

    onFocus = () => {
        this.setState({ focus: true })
    }

    onBlur = () => {
        this.setState({ focus: false })
    }

    handleShowPassword = () =>{
        this.setState({
            showPassword : !this.state.showPassword
        })
    }

    
    render(){
        let errorList = [];
    if(!_.isEmpty(this.props.errors)){
        _.forEach(this.props.errors, function(error, field){
            errorList.push(
                <div key={field} className={styles.ErrorMessage}>{error}</div>
            )
        })
    }

    return (
        <div className={cx(this.props.className, styles.Input, 'my-1')}>
            
            {
                this.props.label ?
                <div className={(this.props.value && this.props.value.length > 0) ? cx(styles.LabelWithValue) : cx(styles.Label)}>
                    {this.props.label} <span className={styles.requiredStar}>{this.props.required ? '*' : null}</span>
                </div>
                : 
                null
            }
            <div className={cx(this.state.focus ? styles.passwordFieldActive : styles.passwordField)}>
            <input
                className={styles.inputField}
                type={this.state.showPassword ? 'text' : 'password'}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
                value={!_.isEmpty(this.props.value) ? this.props.value : ''}
                onChange={(event) => this.handleOnChange(event)}
                onPaste={(event) => this.handleOnChange(event)}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                min="0"
                autoComplete="off"
                
            />
            <img src={this.state.showPassword ? eye : eyeOpen} alt="eye" onClick={()=>this.handleShowPassword()} style={{cursor:"pointer"}}/>
            </div>
            {errorList}
            
        </div>
    );
        }
}
export default PasswordInput;