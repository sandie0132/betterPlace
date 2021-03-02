import React from 'react';
import styles from './RightNavUrl.module.scss';
import cx from 'classnames';
import tick from '../../../assets/icons/rightNavTick.svg';
import activeCircle from '../../../assets/icons/rightNavCircle.svg';
import inactiveCircle from '../../../assets/icons/rightNavInactive.svg';

const RightNavUrl = (props) => {

  let rightNavItem;

  let labelClassName = (props.imageState === 'next') ? cx(styles.LabelNext, styles.endIconLabelMargin)
    : (props.imageState === 'current') ? cx(styles.LabelCurrent, styles.endIconLabelMargin) :
      (props.imageState === "prev") ? cx(styles.LabelPrev, styles.endIconLabelMargin) :
        cx(styles.LabelNext, styles.endIconLabelMargin, styles.cursorPointer)



  if (!props.subSection) {
    if (props.first) {
      rightNavItem = (
        <div className={cx('py-0 px-0 d-flex flex-row', styles.divHeight)}>
          <div className="flex-column justify-content-center">
            {props.imageState === 'current' ?
              <div style={{ position: "relative" }}>
                <img className={cx(styles.activeCircle, styles.iconMarginLeft, 'mr-2')} src={activeCircle} alt='activeCircle' />
                <div />
              </div> :
              props.imageState === 'prev' ?
                <div style={{ position: "relative" }}>

                  <img className={cx('mr-2', styles.iconMarginLeft)} src={tick} alt='tick' />
                  <div />
                </div > :
                <div style={{ position: "relative" }}>
                  <img className={cx(styles.inactiveCircle)} src={inactiveCircle} alt='inactiveCircle' />
                </div>
            }
          </div>
          <div className="flex-column ml-2" style={{ position: "relative" }}>
            <label className={props.imageState === 'next' ? cx(styles.LabelNext, styles.endIconLabelMargin) :
              props.imageState === 'current' ? cx(styles.LabelCurrent, styles.endIconLabelMargin)
                : cx(styles.LabelPrev, styles.endIconLabelMargin)}>{props.label}</label>


          </div>

        </div>
      )


    }
    else {
      rightNavItem = (
        <div className={cx('py-0 px-0 d-flex flex-row', styles.divHeight)}>
          <div className="flex-column justify-content-center">
            {props.imageState === 'current' ?
              <div style={{ position: "relative" }}>

                <img className={cx(styles.activeCircle, styles.iconMarginLeft, 'mr-2')} src={activeCircle} alt='activeCircle' />
                {!props.noLine ? <div className={styles.verticleLineActive} /> : null }
              </div> :
              props.imageState === 'prev' ?
                <div style={{ position: "relative" }}>

                  <img className={cx('mr-2', styles.iconMarginLeft)} src={tick} alt='tick' />
                  {!props.noLine ? <div className={styles.verticleLineActive} /> : null }
                </div > :
                <div style={{ position: "relative" }}>
                  <img className={cx(styles.inactiveCircle)} src={inactiveCircle} alt='inactiveCircle' />
                  {!props.noLine ? <div className={styles.verticleLineDisabled} /> : null}
                </div>
            }
            {/* {props.imageState === 'prev' ? <div className={styles.verticleLineActive} /> : <div className={styles.verticleLineDisabled} />} */}

          </div>
          <div className="flex-column" style={{ position: "relative" }}>
            <label className={labelClassName}>
              {props.label}</label>
          </div>

        </div>


      )

    }
  }
  else {
    rightNavItem = (
      <div className={cx('py-0 px-0 d-flex flex-row p-relative', styles.subDivheight)}>
        <div className="">
          {props.imageState === 'current' ?
            <div style={{ position: "absolute" }}>
              <img className={cx(styles.activeCircleSmall, styles.iconMarginLeft, styles.subSectionIcon, 'mr-2 mt-0')} src={activeCircle} alt='activeCircle' />
              <div />
            </div> :
            props.imageState === 'prev' ?
              <div style={{ position: "absolute" }}>

                <img className={cx('mr-2 mt-0', styles.iconMarginLeft, styles.subSectionIcon)} src={tick} alt='tick' />
                <div />
              </div > :

              props.imageState === 'completed' ?
                <div style={{ position: "absolute" }}>

                  <img className={cx('mr-2 mt-0', styles.iconMarginLeft, styles.subSectionIcon)} src={tick} alt='tick' />
                  <div />
                </div > :
                <div style={{ position: "absolute" }}>
                  <img className={cx(styles.inactiveCircle, styles.subSectionIcon, "mt-0")} src={inactiveCircle} alt='inactiveCircle' />
                </div>
          }
        </div>
        <div style={{ position: "relative", width: '10rem' }}>
          <div className={props.imageState === 'next' ? cx(styles.LabelNext) :
            props.imageState === 'current' || props.imageState==='completed' ? cx(styles.LabelCurrent)
              : cx(styles.LabelPrev)} style={{ fontSize: "12px", marginTop: "0px", cursor: "pointer" }}>{props.label}</div>


        </div>

      </div>
    )

  }


  return (
    rightNavItem
  )
};

export default RightNavUrl;