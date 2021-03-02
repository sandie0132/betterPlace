/* eslint-disable import/prefer-default-export */
import panConfigIcon from '../../../../../assets/icons/panConfigIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadhaarConfigIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/permanentaddressConfigIcon.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/currentAddressConfigIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import globalDb from '../../../../../assets/icons/databaseWithBackground.svg';
import educationConfigIcon from '../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentConfigIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthConfigIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refConfigIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtConfigIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcConfigIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeConfigIcon.svg';

export const serviceCards = {
  PAN: { icon: panConfigIcon, label: 'pan card' },
  AADHAAR: { icon: aadhaarConfigIcon, label: 'aadhaar card' },
  VOTER: { icon: voterConfigIcon, label: 'voter card' },
  DL: { icon: drivingLicenseConfigIcon, label: 'driving license' },
  RC: { icon: vehicleregistrationConfigIcon, label: 'vehicle registration' },
  CURRENT_ADDRESS: { icon: currentAddressConfigIcon, label: 'current address' },
  PERMANENT_ADDRESS: { icon: permanentaddressConfigIcon, label: 'permanent address' },
  ADDRESS_AGENCY_VERIFICATION: { icon: permanentaddressConfigIcon, label: 'address agency' },
  CRC_CURRENT_ADDRESS: { icon: courtSmallIcon, label: 'current address' },
  CRC_PERMANENT_ADDRESS: { icon: courtSmallIcon, label: 'permanent address' },
  POLICE_VERIFICATION: { icon: policeVerificationConfigIcon, label: 'police verification' },
  GLOBALDB: { icon: globalDb, label: 'database verification' },
  PHYSICAL: { icon: globalDb, label: 'physical verification' },
  POSTAL: { icon: globalDb, label: 'postal verification' },
  EDUCATION: { icon: educationConfigIcon, label: 'education verification' },
  EMPLOYMENT: { icon: employmentConfigIcon, label: 'employment verification' },
  HEALTH: { icon: healthConfigIcon, label: 'health verification' },
  REFERENCE: { icon: refConfigIcon, label: 'reference verification' },
};
