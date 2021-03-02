import React from 'react';
import styles from './TopNavUrl.module.scss';
import cx from 'classnames';
import tick from '../../../assets/icons/rightNavTick.svg';
import activeCircle from '../../../assets/icons/rightNavCircle.svg';
import inactiveCircle from '../../../assets/icons/emptyCirle.svg';

const TopNavUrl = 
(props) => {

    let TopNavItem;

    let labelClassName = (props.imageState === 'next') ? cx(styles.LabelNext, styles.endIconLabelMargin)
        : (props.imageState === 'current') ? cx(styles.LabelCurrent, styles.endIconLabelMargin) :
            cx(styles.LabelPrev, styles.endIconLabelMargin)

    let configured = props.configured;
    if (props.last===true) {
        
        TopNavItem = (
            <React.Fragment>

                {props.imageState === 'current' ?
                    <div className={styles.AlignCenter}>
                        <img className={cx(props.classNameCircle,styles.activeCircle, styles.iconMarginLeft)} src={activeCircle} alt='activeCircle' />
                    <div />
                    </div > :
                    props.imageState === 'prev' ?
                        <div className={styles.AlignCenter}>
                            <img className={cx(props.classNameCircle,styles.iconMarginLeft)} src={tick} alt='tick' />
                        <div />
                        </div > :
                        <div className={styles.AlignCenter}>
                            <img className={cx(styles.inactiveCircle)} src={inactiveCircle} alt='inactiveCircle' />
                        </div>
                }
                <div className={props.imageState === 'next' ? cx(styles.LabelNext, styles.endIconLabelMargin,styles.textCenter) :
                    props.imageState === 'current' ? cx(styles.textCenter,styles.LabelCurrent)
                        : cx(styles.LabelPrev, styles.endIconLabelMargin,styles.textCenter)}>{props.label}
                        <div className={cx("mt-4")}>
                        <div className={cx(props.currentSection ? styles.arrow_up : undefined)}/>
                        <div className={cx(props.currentSection ? styles.svg : undefined)}/>    
                    </div>
                </div>
            </React.Fragment>
        )
    }

    else {
        TopNavItem = (
            <React.Fragment>

                {props.imageState === 'current' ?
                    <div className={styles.AlignCenter}>
                        {configured  ? <span className={cx(props.classNameVerticalLine,styles.verticleLineActive)} /> : <span className={styles.verticleLineInactive} />}
                        <img className={cx(props.classNameCircle,styles.activeCircle, styles.iconMarginLeft)} src={activeCircle} alt='activeCircle' />
                    </div> :
                    props.imageState === 'prev' ?
                        <div className={styles.AlignCenter} >
                            <span className={cx(props.classNameVerticalLine,styles.verticleLineActive)} />
                            <img className={cx(props.classNameCircle,styles.iconMarginLeft)} src={tick} alt='tick' />
                            
                        </div > :
                        <div className={styles.AlignCenter}>
                            <span className={styles.verticleLineInactive} />
                            <img className={cx(styles.inactiveCircle)} src={inactiveCircle} alt='inactiveCircle' />
                            {/* <span className={styles.verticleLineDisabled} /> */}
                        </div>
                }
                {/* {props.imageState === 'prev' ? <div className={styles.verticleLineActive} /> : <div className={styles.verticleLineDisabled} />} */}

                <div className={cx(props.widthOflabel,labelClassName,styles.textCenter)}>
                    {props.label}
                    <div className={cx("mt-4")}>
                        
                        <div className={cx(props.currentSection ? styles.svg : undefined)}>
                        <div className={cx(props.currentSection ? styles.arrow_up : undefined)}/>
                        </div>    
                    </div>
                </div>
            </React.Fragment>
        )
    }
    return (
        TopNavItem
    )
};

export default TopNavUrl;