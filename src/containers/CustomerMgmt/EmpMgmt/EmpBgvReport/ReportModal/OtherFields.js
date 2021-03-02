/* eslint-disable no-nested-ternary */
import React from 'react';
// import _ from 'lodash';
import cx from 'classnames';
import styles from './SingleModal.module.scss';

/*
{to be displayed fields}
aadhaar = age, gender, state
pan = name, dob
voter = name, age, fatherName, state
dl = name, issuedOn
rc = nothing
crc_current_address = current_address, state, city, pincode
crc_permanent_address = permanent_address, state, city, pincode
globaldb = dob, gender, country
education = qualification, course, graduation, startDate, endDate, % (multiple cards)
employment = empId, designation, joiningDate, leavingDate, salary (multiple cards)
reference check = mobile number (multiple cards)
health = nothing
pvc = police_station
postal = CA, state, city, pincode
physical = state, city, pincode
*/

const OtherFields = ({ dataFields, service, verificationData }) => {
  const getAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  const addressObj = (givenAddress) => {
    let fullAddress = '';
    if (givenAddress.addressLine1) { fullAddress += `${givenAddress.addressLine1}, `; }
    if (givenAddress.addressLine2) { fullAddress += `${givenAddress.addressLine2}, `; }
    if (givenAddress.landmark) { fullAddress += `${givenAddress.landmark}, `; }
    if (givenAddress.city) { fullAddress += `${givenAddress.city}, `; }
    if (givenAddress.state) { fullAddress += `${givenAddress.state}, `; }
    if (givenAddress.pincode) { fullAddress += givenAddress.pincode; }
    return fullAddress;
  };

  const eachField = (fieldValue, fieldName, colValue) => (
    <div className={cx(colValue, 'px-0 d-flex flex-column')}>
      <span className={styles.mediumText}>
        {fieldValue}
      </span>
      <span className={styles.greySmallText}>
        {fieldName}
      </span>
    </div>
  );

  return (
    <>
      {service === 'AADHAAR'
        ? (
          <div className="d-flex flex-row mt-3">
            {dataFields.dob ? eachField(getAge(dataFields.dob), 'age', 'col-3') : null}
            {dataFields.gender ? eachField(dataFields.gender, 'gender', 'col-3') : null}
            {dataFields.state ? eachField(dataFields.state, 'state', 'col-6') : null}
          </div>
        )
        : service === 'PAN'
          ? (
            <div className="d-flex flex-row mt-3">
              {dataFields.name ? eachField(dataFields.name, 'name', 'col-4') : null}
              {dataFields.dob ? eachField(dataFields.dob.split('-').reverse().join(' • '), 'date of birth', 'col-4') : null}
            </div>
          )
          : service === 'VOTER'
            ? (
              <div className="d-flex flex-row mt-3">
                {dataFields.name ? eachField(dataFields.name, 'name', 'col-4') : null}
                {dataFields.dob ? eachField(getAge(dataFields.dob), 'age', 'col-2') : null}
                {dataFields.fatherName ? eachField(dataFields.fatherName, 'father name', 'col-3') : null}
                {dataFields.state ? eachField(dataFields.state, 'state', 'col-3') : null}
              </div>
            )
            : service === 'DL'
              ? (
                <div className="d-flex flex-row mt-3">
                  {dataFields.name ? eachField(dataFields.name, 'name', 'col-4') : null}
                  {dataFields.issuedOn ? eachField(dataFields.issuedOn, 'date of issue', 'col-4') : null}
                </div>
              )
              : verificationData.verificationPreference === 'PHYSICAL'
                || service === 'CRC_PERMANENT_ADDRESS' || service === 'CRC_CURRENT_ADDRESS'
                ? (
                  <div className="d-flex flex-row mt-4">
                    {dataFields.state ? eachField(dataFields.state, 'state', 'col-4') : null}
                    {dataFields.city ? eachField(dataFields.city, 'city', 'col-4') : null}
                    {dataFields.pincode ? eachField(dataFields.pincode, 'pincode', 'col-4') : null}
                  </div>
                )
                : verificationData.verificationPreference === 'POSTAL'
                  ? (
                    <>
                      <div className="d-flex flex-row mt-3">
                        {dataFields.state ? eachField(addressObj(dataFields), dataFields.addressType.toLowerCase().replace(/_/g, ' '), 'col-12') : null}
                      </div>
                      <div className="d-flex flex-row mt-3">
                        {dataFields.state ? eachField(dataFields.state, 'state', 'col-4') : null}
                        {dataFields.city ? eachField(dataFields.city, 'city', 'col-4') : null}
                        {dataFields.pincode ? eachField(dataFields.pincode, 'pincode', 'col-4') : null}
                      </div>
                    </>
                  )
                  : service === 'POLICE_VERIFICATION'
                    ? (
                      <div className="d-flex flex-row mt-3">
                        {dataFields.city ? eachField(dataFields.city, 'police station', 'col-12') : null}
                      </div>
                    )
                    : service === 'GLOBALDB'
                      ? (
                        <div className="d-flex flex-row mt-3">
                          {dataFields.dob ? eachField(dataFields.dob.split('-').reverse().join(' • '), 'date of birth', 'col-4') : null}
                          {dataFields.gender ? eachField(dataFields.gender, 'gender', 'col-4') : null}
                          {dataFields.country ? eachField(dataFields.country, 'country', 'col-4') : null}
                        </div>
                      )
                      : service === 'EDUCATION'
                        ? (
                          <>
                            <div className="d-flex flex-row mt-3">
                              {dataFields.educationType ? eachField(dataFields.educationType.toLowerCase().replace(/_/g, ' '), 'qualification', 'col-4') : null}
                              {dataFields.course ? eachField(dataFields.course, 'course', 'col-4') : null}
                              {dataFields.passedYear ? eachField(dataFields.passedYear, 'graduation year', 'col-4') : null}
                            </div>
                            <div className="d-flex flex-row mt-3">
                              {dataFields.from ? eachField(dataFields.from.split('-').reverse().join('.'), 'start date', 'col-4') : null}
                              {dataFields.to ? eachField(dataFields.to.split('-').reverse().join('.'), 'end date', 'col-4') : null}
                              {dataFields.cgpa_percentage ? eachField(dataFields.cgpa_percentage, 'percentage / cgpa', 'col-4') : null}
                            </div>
                          </>
                        )
                        : service === 'EMPLOYMENT'
                          ? (
                            <>
                              <div className="d-flex flex-row mt-3">
                                {dataFields.employeeId ? eachField(dataFields.employeeId, 'emp id', 'col-4') : null}
                                {dataFields.designation ? eachField(dataFields.designation, 'designation', 'col-4') : null}
                              </div>
                              <div className="d-flex flex-row mt-3">
                                {dataFields.joinedFrom ? eachField(dataFields.joinedFrom.split('-').reverse().join('.'), 'date of joining', 'col-4') : null}
                                {dataFields.workedUntil ? eachField(dataFields.workedUntil.split('-').reverse().join('.'), 'date of relieving', 'col-4') : null}
                                {dataFields.salary ? eachField(dataFields.salary, 'renumeration/salary', 'col-4') : null}
                              </div>
                            </>
                          )
                          : service === 'REFERENCE'
                            ? (
                              <div className="d-flex flex-row mt-3">
                                {dataFields.mobile ? eachField(dataFields.mobile, 'mobile number', 'col-4') : null}
                              </div>
                            )
                            : null}
    </>
  );
};

export default OtherFields;
