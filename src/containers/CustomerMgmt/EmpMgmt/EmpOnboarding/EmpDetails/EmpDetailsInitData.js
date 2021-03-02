import { sectionFieldMapping } from '../Store/fieldMapping';

export const InitData = {
  entityType: null,
  employeeType: null,
  employeeId: '',
  status: null,
  joiningDate: null,
  moveInDate: null,
  moveOutDate: null,
  kitNumber: '',
  tags: [],
  defaultLocation: null,
  defaultRole: null,
  // for contractor details,
  contractor: {
    defaultLocation: '',
    defaultRole: '',
    deploymentStartDate: '',
    employeeId: '',
    reportsTo: null,
    status: '',
    tags: [],
  },
};

export const contractorFields = {
  defaultLocation: '',
  defaultRole: '',
  deploymentStartDate: '',
  employeeId: '',
  reportsTo: null,
  status: '',
  tags: [],
};

export const employeeRequiredFields = [
  ...sectionFieldMapping.employeeDetails.EMPLOYEE.requiredFields,
];
export const tenantRequiredFields = [
  ...sectionFieldMapping.employeeDetails.TENANT.requiredFields,
];
export const businessRequiredFields = [
  ...sectionFieldMapping.employeeDetails.BUSINESS_ASSOCIATE.requiredFields,
];
export const contractorRequiredFields = [
  ...sectionFieldMapping.employeeDetails.CONTRACTOR.requiredFields,
];
