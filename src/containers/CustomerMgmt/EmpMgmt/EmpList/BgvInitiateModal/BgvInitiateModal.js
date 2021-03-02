/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import cx from 'classnames';
import { Button } from 'react-crux';
import { isEmpty, get, cloneDeep } from 'lodash';
import styles from './BgvInitiateModal.module.scss';
import themes from '../../../../../theme.scss';
import { serviceCards } from './ServiceIconLabel';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import Loader from '../../../../../components/Organism/Loader/Loader';

import closePage from '../../../../../assets/icons/closePage.svg';
import warning from '../../../../../assets/icons/yellowWarningTriangle.svg';
import circleWarning from '../../../../../assets/icons/warningIcon.svg';
import doubleTick from '../../../../../assets/icons/doubleTicks.svg';
import selectedEmp from '../../../../../assets/icons/selectedEmp.svg';
import missingInfo from '../../../../../assets/icons/missingInfo.svg';
import arrowMark from '../../../../../assets/icons/arrowDownBlack.svg';
import defaultPic from '../../../../../assets/icons/defaultPic.svg';
/**
 *
 * @toggle => {function} to toggle modal
 * @selectAll => {boolean} if all emps are selected
 * @totalEmployeeCount => {number} count of all emps
 * @selectedEmployees => {array} of selected empIds
 * @employeeList => {array of objects} of emplist
 * @handleBGVInitiate => props {function} to call bgvInitiate bulk actions api
 */

const BgvInitiateModal = ({
  toggle, selectAll, totalEmployeeCount, selectedEmployees, employeeList, handleBGVInitiate,
}) => {
  const imagesRState = useSelector((rstate) => get(rstate, 'imageStore', []), shallowEqual);
  const images = get(imagesRState, 'images', {});
  const empMgmtRState = useSelector((rstate) => get(rstate, 'empMgmt', {}), shallowEqual);
  const bgvInitiateData = get(empMgmtRState, 'empList.bgvInitiateData', []);
  const bgvInitiateDataState = get(empMgmtRState, 'empList.bgvInitiateDataState', 'INIT');

  // state variable
  const [state, setState] = useState({
    bgvOrgsData: [],
  });
  const empCount = selectAll ? totalEmployeeCount : selectedEmployees.length;
  let empName = '';
  employeeList.forEach((emp) => {
    if (selectedEmployees.includes(emp.uuid)) {
      empName = `${emp.firstName} ${emp.lastName ? emp.lastName : ''}`.toLowerCase();
    }
  });
  const empHeading = empCount > 1 ? `initiate bgv for ${empCount} selected employees` : `initiate bgv for ${empName}`;

  // setting props to state
  useEffect(() => {
    if (bgvInitiateDataState === 'SUCCESS' && !isEmpty(bgvInitiateData)) {
      const bgvOrgsData = [];
      bgvInitiateData.forEach((element) => {
        bgvOrgsData.push({
          ...element, openOrg: false,
        });
      });
      setState((prev) => ({ ...prev, bgvOrgsData }));
    }
  }, [bgvInitiateDataState, bgvInitiateData]);

  // toggle arrow mark beside each org
  const toggleOrgConfigDropdown = (orgId) => {
    const updatedBgvData = cloneDeep(state.bgvOrgsData);
    updatedBgvData.forEach((element) => {
      if (element.orgId === orgId) {
        element.openOrg = !element.openOrg;
      }
    });
    setState((prev) => ({ ...prev, bgvOrgsData: updatedBgvData }));
  };

  const individualStyle = (serv, showProgressBar, orgBgvData) => (
    <div className={cx('d-flex flex-row my-3')}>
      {/* 1st column */}
      <div className={styles.primaryText} style={showProgressBar ? { width: '40%' } : { width: '80%' }}>
        <img src={serviceCards[serv.service].icon} alt="" className="my-auto" />
          &nbsp;&nbsp;
        <span className="my-auto">{serviceCards[serv.service].label}</span>
      </div>
      {/* 2nd column */}
      {showProgressBar
        ? (
          <div className="d-flex flex-row" style={{ width: '50%', margin: 'auto' }}>
            <div
              className={cx(styles.statusBar,
                serv.missingDocs > 0 ? styles.yellowBorder : styles.greenBorder)}
            >
              <span
                className={cx(serv.missingDocs > 0 ? styles.yellow : styles.green)}
                style={serv.missingDocs > 0 ? { width: `${((orgBgvData.totalEmps - serv.missingDocs) / orgBgvData.totalEmps) * 100}%` } : { width: '100%' }}
              />
            </div>
            &nbsp;
            <img src={serv.missingDocs > 0 ? warning : doubleTick} className={cx('mb-auto', styles.img16px)} alt="" />
          </div>
        ) : null}
      {/* 3rd column */}
      {showProgressBar
        ? (
          <div style={{ width: '30%', margin: 'auto' }}>
            <span className={styles.primaryText}>{serv.missingDocs > 0 ? (serv.missingDocs < 10 ? `0${serv.missingDocs}` : serv.missingDocs) : '00'}</span>
          </div>
        )
        : (
          <div style={{ width: '20%', margin: 'auto' }}>
            {serv.missingDocs > 0 ? (
              <span className={styles.missingInfo}>
                <img src={missingInfo} style={{ marginBottom: '4px' }} alt="" />
                &nbsp;
                missing info
              </span>
            ) : <img src={doubleTick} alt="" className={styles.img24px} />}
          </div>
        )}
    </div>
  );

  const handleIndividualService = (orgBgvData, showProgressBar) => {
    let eachService = [];
    let idCards = []; let addressCards = []; let legalCards = [];
    let careerCards = []; let healthRefCards = [];

    if (!isEmpty(orgBgvData) && orgBgvData.configCards) {
      orgBgvData.configCards.forEach((serv, index) => (
        <React.Fragment key={index}>
          {serv.type === 'DOCUMENT'
            ? idCards = idCards.concat(
              individualStyle(serv, showProgressBar, orgBgvData),
            )
            : serv.type === 'ADDRESS'
              ? addressCards = addressCards.concat(
                individualStyle(serv, showProgressBar, orgBgvData),
              ) : serv.type === 'LEGAL'
                ? legalCards = legalCards.concat(
                  individualStyle(serv, showProgressBar, orgBgvData),
                ) : serv.type === 'CAREER'
                  ? careerCards = careerCards.concat(
                    individualStyle(serv, showProgressBar, orgBgvData),
                  ) : serv.type === 'HEALTH' || serv.type === 'REFERENCE'
                    ? healthRefCards = healthRefCards.concat(
                      individualStyle(serv, showProgressBar, orgBgvData),
                    )
                    : null}
        </React.Fragment>
      ));
    }
    if (!isEmpty(idCards)) {
      eachService = eachService.concat(
        <>
          <div className={cx('d-flex flex-row mb-2', styles.greySubHeadingBold)}>
            ids
          </div>
          {idCards}
        </>,
      );
    }
    if (!isEmpty(addressCards)) {
      eachService = eachService.concat(
        <>
          <div className={cx('d-flex flex-row mb-2', styles.greySubHeadingBold)}>
            address verification
          </div>
          {addressCards}
        </>,
      );
    }
    if (!isEmpty(legalCards)) {
      eachService = eachService.concat(
        <>
          <div className={cx('d-flex flex-row mb-2', styles.greySubHeadingBold)}>
            legal
          </div>
          {legalCards}
        </>,
      );
    }
    if (!isEmpty(careerCards)) {
      eachService = eachService.concat(
        <>
          <div className={cx('d-flex flex-row mb-2', styles.greySubHeadingBold)}>
            career verification
          </div>
          {careerCards}
        </>,
      );
    }
    if (!isEmpty(healthRefCards)) {
      eachService = eachService.concat(
        <>
          <div className={cx('d-flex flex-row mb-2', styles.greySubHeadingBold)}>
            health and reference
          </div>
          {healthRefCards}
        </>,
      );
    }
    return eachService;
  };

  const profilePics = []; const empIds = [];
  employeeList.forEach((emp) => {
    if (selectedEmployees.includes(emp.uuid)) {
      profilePics.push(emp.profilePicUrl);
      empIds.push(emp.uuid);
    }
  });

  return (
    <div className={cx(styles.backdrop, scrollStyle.scrollbar)}>
      <div>
        <img
          aria-hidden
          className={styles.closeStyle}
          src={closePage}
          onClick={toggle}
          alt=""
        />
      </div>
      <div className={styles.MainHeading}>initiate bgv</div>
      <div className={cx(styles.Container, scrollStyle.scrollbar)}>
        {bgvInitiateDataState === 'LOADING'
          ? (
            <div className={cx(styles.CardPadding)}>
              <Loader type="bgvInitiateModal" />
            </div>
          )
          : (
            <div className={cx(styles.CardPadding)}>
              <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-center">
                  {profilePics.map((pic, index) => {
                    if (index < 5) {
                      return (
                        <span key={empIds[index]}>
                          <img
                            src={pic ? (images[empIds[index]]
                              ? images[empIds[index]].image : defaultPic) : defaultPic}
                            alt=""
                            className={cx('mr-2', styles.profilePicUrl)}
                          />
                        </span>
                      );
                    } return null;
                  })}
                  {/* {employeeList.map((emp, index) => (
                    selectedEmployees.includes(emp.uuid) && index < 5 ? (
                      <span key={emp.uuid}>
                        <img
                          src={emp.profilePicUrl ? (images[emp.uuid]
                            ? images[emp.uuid].image : defaultPic) : defaultPic}
                          alt=""
                          className={cx('mr-2', styles.profilePicUrl)}
                        />
                      </span>
                    ) : null
                  ))} */}
                  {empCount > 5
                    ? (
                      <span className={cx('align-self-center', styles.countcircle)}>
                        +
                        {empCount - 5}
                      </span>
                    ) : null}
                </div>
                <span className={cx('mt-3 mb-1', styles.mediumText)}>
                  {empHeading}
                </span>
                <div className={cx('mx-auto', styles.greyTextSmall)}>
                  <span className={styles.greyTextBold}>
                    {empCount > 1 ? `${empCount} employees` : empName}
                  </span>
                  {' '}
                  from
                  {' '}
                  <span className={styles.greyTextBold}>my org</span>
                  {' '}
                  {!isEmpty(bgvInitiateData) && bgvInitiateData.length > 1 ? (`and ${bgvInitiateData.length - 1} clients `) : null}
                  selected to initiate bgv. please check following details before initiation.
                </div>
              </div>
              <div className={cx('d-flex flex-row mt-3 px-2', styles.greyBg)}>
                <img src={warning} className="my-auto" style={{ height: '24px' }} alt="" />
              &nbsp;
                <span className={cx('pl-2 my-auto', styles.helpText)}>
                  {empCount > 1 ? 'only the checks with no missing information will be initiated'
                    : 'only the checks with no missing information will be initiated. checks with missing details can only be initiated after filling details in profile'}
                </span>
              </div>
              <hr className={cx(styles.HorizontalLine)} />

              <div className={cx(scrollStyle.scrollbar, styles.overflow)}>
                {!isEmpty(state.bgvOrgsData) && state.bgvOrgsData.map((data) => (
                  <React.Fragment key={data.orgId}>
                    {/* show the heading only if configCards array length > 0 */}
                    {state.bgvOrgsData.length > 1 && data.configCards && data.configCards.length > 0
                      ? (
                        <div className="d-flex flex-row mb-4">
                          <span
                            className={styles.orgCircle}
                            style={{ backgroundColor: data.brandColor || themes.defaultTheme }}
                          >
                            {data.orgName.substring(0, 2)}
                          </span>
                    &nbsp; &nbsp;
                          <span className={cx(styles.primaryText, 'mr-3 my-auto')}>
                            {!isEmpty(data.relation) ? data.orgName : 'my org'}
                            {' '}
                            {!isEmpty(data.relation) ? `(${data.relation})` : `( ${data.orgName} )`}
                          </span>
                          <img src={selectedEmp} alt="" />
                    &nbsp; &nbsp;
                          <span className={cx(styles.primaryText, 'mr-3 my-auto')}>
                            {data.totalEmps}
                            {' '}
                            employees selected
                          </span>
                          <img src={missingInfo} alt="" />
                    &nbsp; &nbsp;
                          <span className={cx(styles.primaryText, 'my-auto')}>
                            {data.missingInfoProfiles}
                            {' '}
                            missing info profiles
                          </span>
                          <img aria-hidden src={arrowMark} className={cx('ml-auto', styles.Cursor, !data.openOrg ? null : styles.rotateIcon)} alt="" onClick={() => toggleOrgConfigDropdown(data.orgId)} />
                        </div>
                      ) // if only one org but not configured, show empty state
                      : state.bgvOrgsData.length === 1
                      && data.configCards && data.configCards.length === 0
                        ? (
                          <div className={cx('d-flex justify-content-center', styles.greySubHeadingBold)}>
                            there are no configurations enabled for selected employee(s)
                          </div>
                        )
                        : null}
                    {data.openOrg || state.bgvOrgsData.length === 1
                      ? empCount > 1
                        ? (
                          <>
                            {data.configCards && data.configCards.length > 0
                              ? (
                                <div className="d-flex flex-row mb-3">
                                  <div className={cx(styles.headingBold)} style={{ width: '40%' }}>checks configured</div>
                                  <div className={cx(styles.headingBold)} style={{ width: '50%' }}>{`possible checks (${data.totalEmps} profiles)`}</div>
                                  <div className={cx(styles.headingBold)} style={{ width: '30%' }}>profiles with missing info</div>
                                </div>
                              ) : null}
                            {handleIndividualService(data, true)}
                            {data.missingInfoProfiles > 0
                              ? (
                                <div className={cx('d-flex flex-row mt-3')}>
                                  <img src={circleWarning} style={{ height: '24px' }} alt="" />
                            &nbsp;
                                  <span className={cx('pl-2 my-auto', styles.helpText)}>
                                    <i>
                                      unique profile having incomplete/missing info -
                                      {' '}
                                      {data.missingInfoProfiles}
                                      {' '}
                                      profiles
                                    </i>
                                  </span>
                                </div>
                              ) : null}
                          </>
                        )
                        : (
                          <>
                            {data.configCards && data.configCards.length > 0
                              ? (
                                <div className="d-flex flex-row mb-3">
                                  <div className={cx(styles.headingBold)} style={{ width: '80%' }}>checks configured</div>
                                  <div className={cx(styles.headingBold)} style={{ width: '20%' }}>can initiate ?</div>
                                </div>
                              ) : null}
                            {handleIndividualService(data, false)}
                          </>
                        )
                      : null}
                    {(state.bgvOrgsData.length > 1 && data.configCards
                    && data.configCards.length > 0) || state.bgvOrgsData.length === 1
                      ? <hr className={styles.HorizontalLine} /> : null}
                  </React.Fragment>
                ))}
              </div>

              <div className="d-flex flex-row justify-content-end mt-2">
                <Button
                  type="save"
                  label="confirm and initiate"
                  isDisabled={false}
                  clickHandler={handleBGVInitiate}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default BgvInitiateModal;
