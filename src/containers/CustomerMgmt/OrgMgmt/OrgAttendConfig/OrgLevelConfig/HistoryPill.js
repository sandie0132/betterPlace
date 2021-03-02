/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Tooltip } from 'react-crux';
import get from 'lodash/get';
import { isEmpty } from 'lodash';
import styles from './OrgLevelConfig.module.scss';

const {
  pill,
  iconPill,
  titlePill,
  bodyPill,
  footerPill,
  pillExtended,
  pillDate,
  pillTime,
  historyDT,
  historyBulletin,
  historyTimeLine,
  history,
  firstTimeLine,
  historyList,
  tooltipTitle,
  tooltipTitleArea,
  tooltipBody,
  pillDateBold,
  pillTimeBold,
} = styles;
const initialState = {
  isExpanded: false,
};
const HistoryPill = ({
  title,
  editedBy,
  footer,
  icon,
  historyItems,
  onTooltipShow,
  expandedTitle,
  keyPair,
}) => {
  const [state, setState] = useState(initialState);
  const { isExpanded } = state;
  const offset = new Date().getTimezoneOffset() * -1;
  return (
    <div className={pill}>
      <div className="d-flex flex-row flex-grow-2">
        <div className={iconPill}>
          <img src={icon} alt="pill-icon" />
        </div>
        <div className="d-flex flex-column">
          <div>
            <span className={titlePill}>{title}</span>
          </div>
          <div>
            {historyItems[0]
            && <span className={bodyPill}>{moment(historyItems[0].modifiedOn).format('DD MMM, YYYY').toLowerCase()}</span>}
          </div>
          <div>
            <span
              className={footerPill}
              role="button"
              aria-hidden
              onClick={() => setState({
                ...state,
                isExpanded: !isExpanded,
              })}
            >
              {isExpanded ? footer.expanded : footer.collapsed}
              &#x25BE;
            </span>
          </div>
        </div>
      </div>
      {isExpanded && (
      <>
        <div className={cx('mt-2 mb-1')}>
          <span className={cx(pillExtended, history)}>{expandedTitle}</span>
        </div>
        <div className={cx('mt-3', historyList)}>
          {historyItems.map((ele, index) => (
            <div className="d-flex flex-row" key={ele._id}>
              <div className={historyDT}>
                <p className={index === 0 ? pillDateBold : pillDate}>{moment(ele.modifiedOn).format('DD MMM, YYYY').toLowerCase()}</p>
                <p className={index === 0 ? pillTimeBold : pillTime}>{moment(ele.modifiedOn).add(offset, 'minutes').format('hh:mm A').toLowerCase()}</p>
              </div>
              <div className="flex-grow-1 ml-3">
                <div className={cx(historyTimeLine, { [firstTimeLine]: index === 0 })} style={{ height: '20px' }} />
                <span data-tip={`tooltip${ele._id}`} data-for={`tooltip${ele._id}`}>
                  <Tooltip id={`tooltip${ele._id}`} onShow={() => onTooltipShow(ele.modifiedBy)}>
                    <div className="p-1">
                      <div className={tooltipTitleArea}>
                        <div>
                          <span className={tooltipTitle}>
                            {`configuration on ${moment(ele.modifiedOn).format('DD MMM, YYYY').toLowerCase()}`}
                          </span>
                        </div>
                        <div>
                          <span>{`by ${get(editedBy, 'firstName', '')} ${get(editedBy, 'lastName', '')}`}</span>
                        </div>
                      </div>
                      <div className={tooltipBody}>
                        <table>
                          {keyPair.map(({
                            key, label, value, options,
                          }) => (
                            <tbody key={key}>
                              <tr>
                                <td className="p-1">{label}</td>
                                <td className="p-1">
                                  {
                                  value ? value.map((val) => (
                                    <span key={val.key}>
                                      {isEmpty(options) ? `${get(ele[key], `${val.key}`, '')} ${val.label} `
                                        : `${get(ele[key], `${val.key}`, '')} ${options.val.label} `}
                                    </span>
                                  )) : (
                                    <span>
                                      {isEmpty(options) ? ele[key].toString().toLowerCase() : options[`${ele[key]}`] }
                                    </span>
                                  )
                              }
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </div>
                    </div>
                  </Tooltip>
                  <div className={historyBulletin} data-for="tooltip" />
                </span>
                <div className={historyTimeLine} />
              </div>
            </div>
          ))}
        </div>
      </>
      )}
    </div>
  );
};

export default HistoryPill;
