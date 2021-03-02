import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import cx from 'classnames';
import styles from './Carousel.module.scss';
import right from '../../../../assets/icons/rightScrollArrow.svg';

const initialState = {
  showScrollLeft: false,
  showScrollRight: false,
  translatedXForwards: 0,
};

const Carousel = ({
  showItems = 2, itemWidth = 291, children, selectedTile, clickHandler,
  widthStyles, iconStylesLeft, iconStylesRight,
}) => {
  const [state, setState] = useState(initialState);
  const {
    showScrollLeft, showScrollRight, translatedXForwards,
  } = state;

  const scrollBy = showItems * itemWidth;

  const listRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (listRef.current) {
      const elmnt = document.getElementById('list');
      const slider = document.getElementById('slider');
      const visibleWidth = slider.offsetWidth;

      let updatedTranslatedXForwards = translatedXForwards;
      let updatedShowScrollLeft = showScrollLeft;
      let updatedShowScrollRight = showScrollRight;

      if (direction === 'left') {
        updatedTranslatedXForwards = translatedXForwards - scrollBy;
      } else {
        updatedTranslatedXForwards = translatedXForwards + scrollBy;
      }
      const updatedSelectedTile = updatedTranslatedXForwards / itemWidth;
      updatedShowScrollLeft = updatedTranslatedXForwards !== 0;
      updatedShowScrollRight = elmnt.scrollWidth - updatedTranslatedXForwards >= visibleWidth;

      elmnt.animate([
        { transform: `translateX(-${updatedTranslatedXForwards}px)` },
      ], {
        duration: 1000,
        fill: 'forwards',
      });

      setState((prev) => ({
        ...prev,
        showScrollRight: updatedShowScrollRight,
        showScrollLeft: updatedShowScrollLeft,
        translatedXForwards: updatedTranslatedXForwards,
      }));
      clickHandler(updatedSelectedTile);
    }
  }, [translatedXForwards, itemWidth, scrollBy, showScrollLeft, showScrollRight, clickHandler]);

  useEffect(() => {
    const scrolledWidth = ((selectedTile) * itemWidth - translatedXForwards);
    if (scrolledWidth && scrolledWidth % scrollBy === 0) {
      scroll('right');
    }
  }, [selectedTile, itemWidth, translatedXForwards, scrollBy, scroll]);

  useEffect(() => {
    if (children.length > showItems) {
      setState((prev) => ({
        ...prev,
        showScrollRight: true,
      }));
    }
  },
  // eslint-disable-next-line
  []);

  return (
    children.length > 0
      && (
        <div className={cx(styles.sliderContainer, widthStyles)} id="slider">
          {showScrollLeft
            ? (
              <div onClick={() => scroll('left')} role="button" tabIndex={0} aria-hidden>
                <img src={right} className={cx(styles.iconLeft, styles.hover, iconStylesLeft)} alt="scrollLeft" />
              </div>
            )
            : (
              <div>
                <img src={right} className={cx(styles.iconLeft, styles.iconInActive, iconStylesLeft)} alt="scrollLeft" />
              </div>
            )}
          <div className={cx(styles.itemsContainer)} id="list" ref={listRef}>
            {/* send this as children */}
            {children}
          </div>
          {showScrollRight
            ? (
              <div onClick={() => scroll('right')} role="button" tabIndex={0} aria-hidden>
                <img src={right} className={cx(styles.iconRight, styles.hover, iconStylesRight)} alt="scrollRight" />
              </div>
            )
            : (
              <div>
                <img src={right} className={cx(styles.iconRight, styles.iconInActive, iconStylesRight)} alt="scrollRight" />
              </div>
            )}
        </div>
      )
  );
};

export default Carousel;
