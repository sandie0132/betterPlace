import React from 'react';
import cx from 'classnames';

import { Tooltip } from 'react-crux';
import styles from './RightNavUrls.module.scss';
import tick from '../../../../../../assets/icons/rightNavTick.svg';
import activeCircle from '../../../../../../assets/icons/rightNavCircle.svg';
import inactiveCircle from '../../../../../../assets/icons/rightNavInactive.svg';
import HasAccess from '../../../../../../services/HasAccess/HasAccess';

const {
  inactive,
  activeCircle: styleActive,
  sectionHeadActive,
  sectionHeadDone,
  sectionHeadInactive,
  tooltipBody,
} = styles;

const RightNavUrls = ({
  headingState, linkTo, iconState, label, orgId, permission = [],
}) => {
  const putIcon = (state) => {
    if (state === 'current') {
      return <img src={activeCircle} className={cx('mr-3', styleActive)} alt="img" />;
    }
    if (state === 'done') {
      return <img src={tick} className="mr-3" alt="img" />;
    }

    return <img src={inactiveCircle} className={cx('mr-3')} alt="img" />;
  };

  return (
    <HasAccess
      permission={permission}
      orgId={orgId}
      yes={() => (
        <div className={cx({ [`${inactive}`]: headingState === 'inactive' })}>
          <div
            role="button"
            tabIndex="0"
            aria-hidden
            className={cx({
              [`${sectionHeadActive}`]: headingState === 'active',
            },
            {
              [`${sectionHeadInactive}`]: headingState === 'inactive' || iconState === 'disabled',
            },
            {
              [`${sectionHeadDone}`]: headingState === 'done' && iconState !== 'disabled',
            })}
            onClick={headingState !== 'inactive' && iconState !== 'disabled' ? linkTo : null}
          >
            <span data-tip={`tooltip${label}`} data-for={`tooltip${label}`}>
              {putIcon(iconState)}
              {label}
              {iconState === 'disabled' && (
                <Tooltip id={`tooltip${label}`} tooltipClass={tooltipBody} place="left" type="info">
                  <div>
                    <span>
                      org. level configuration
                      <br />
                      needs to be done to proceed
                    </span>
                  </div>
                </Tooltip>
              )}
            </span>
          </div>
        </div>
      )}
    />

  );
};

export default RightNavUrls;
