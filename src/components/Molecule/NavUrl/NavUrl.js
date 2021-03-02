import React from 'react';
import styles from './NavUrl.module.scss';
import cx from 'classnames';
// import warning from "../../../assets/icons/onholdRed.svg"
// import _ from 'lodash';

const navUrl = (props) => {

   let buttonState;
   

   if(props.firstPage===true){
      buttonState= ( <button  disabled={props.isDisabled} className={props.isDisabled?cx('btn',styles.DisabledLink):cx('btn',styles.DefaultLink)} onClick={props.clickHandler}>
        {/* <img src={warning} alt="warning" /> */}
        {props.label}
        {props.warningImgExists ? <img className={styles.imgPosition} src={props.warningImg} alt="warning" />:null }
        </button> )
   }
   else{
      buttonState=( <button  className={props.isDisabled?cx('btn',styles.EnabledLink):cx('btn',styles.DefaultLink)} onClick={props.clickHandler}>
        {/* <img src={warning} alt="warning" /> */}
        {props.label}
        {props.warningImgExists ? <img className={styles.imgPosition} src={props.warningImg} alt="warning" />:null }
       </button>)
   }


  // let firstPage
   return (
   <div className={'py-0 px-0'}>
       {buttonState}
       </div>
   )
 }    ;

export default navUrl;