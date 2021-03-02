import * as themes from '../../../../theme.scss';

//used in address verification - search
export const searchDropdownStaticData = [
    { label: 'profile details', value: 'profile' },
    { label: 'phone number', value: 'phoneNumber' }
]

//used in re-assign modal
export const agencyTypes = [
    { "label": "select agency type", "value": "" },
    { "label": "physical verification", "value": "PHYSICAL" },
    { "label": "postal verification", "value": "POSTAL" }
]


//used in task filters
export const initFilterState = {
    state: { label: 'select state', value: '' },
    district: { label: 'select district', value: '' },
    city: { label: 'select town/city', value: '' },
    allPincodes: true,
    pincodeSearch: '',
    pincodeList: [],
    caseAssignee: { label: 'select assignee', value: '' },
    tatLeft: { label: 'select tat left', value: '' },
    client: { label: 'select a client', value: '' }
}

export const initDateRange = 'all time';

export const assignStatusData = [
    { "label": "unassigned", "value": "UNASSIGNED" },
    { "label": "assigned to me", "value": "ASSIGNED_TO_ME" }
]

export const assignStatusDataToMe = [
    { "label": "select assignee", "value": "" },
    { "label": "assigned to me", "value": "ASSIGNED_TO_ME" }
]

export const colorStatus = {
    //default case
    "select case status":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},

    //pending color
    "pending":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},
    "awaiting generate tracking number":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},
    "tracking number assigned":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},
    "label printed":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},
    "shipment cancelled":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},
    "unassigned":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},

    "awaiting to send":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},
    "pending results":
        { background: themes.defaultBackground, numeratorColor: themes.defaultNumerator, denominatorColor: themes.defaultDenominator},

    //picked color
    "label generated":
        { background: themes.pickedBackground, numeratorColor: themes.pickedNumerator, denominatorColor: themes.defaultDenominator},
    "picked cases":
        { background: themes.pickedBackground, numeratorColor: themes.pickedNumerator, denominatorColor: themes.defaultDenominator},

    //failed color
    "tracking number assignment failed":
        { background: themes.failedBackground, numeratorColor: themes.failedNumerator, denominatorColor: themes.defaultDenominator},
    "delivery failed":
        { background: themes.failedBackground, numeratorColor: themes.failedNumerator, denominatorColor: themes.defaultDenominator},
    "shipment rejected":
        { background: themes.failedBackground, numeratorColor: themes.failedNumerator, denominatorColor: themes.defaultDenominator},

    //closed
    "delivered":
        { background: themes.closedBackground, numeratorColor: themes.closedNumerator, denominatorColor: themes.defaultDenominator},
    "closed":
        { background: themes.closedBackground, numeratorColor: themes.closedNumerator, denominatorColor: themes.defaultDenominator},
    "pending ops review":
        { background: themes.closedBackground, numeratorColor: themes.closedNumerator, denominatorColor: themes.defaultDenominator},
    "closed cases":
        { background: themes.closedBackground, numeratorColor: themes.closedNumerator, denominatorColor: themes.defaultDenominator},

    //open color
    "open cases":
        { background: themes.openBackground, numeratorColor: themes.openNumerator, denominatorColor: themes.defaultDenominator},
    "shipped":
        { background: themes.openBackground, numeratorColor: themes.openNumerator, denominatorColor: themes.defaultDenominator},
    "in transit":
        { background: themes.openBackground, numeratorColor: themes.openNumerator, denominatorColor: themes.defaultDenominator}
}

export const numeratorLabel = {
    'awaiting generate tracking number': 'Awaiting',
    'tracking number assigned': 'Tracked',
    'tracking number assignment failed': 'Failed',
    'label generated': 'Labelled',
    'label printed': 'Printed',
    'shipped': 'Shipped',
    'in transit': 'In Transit',
    'delivered': 'Delivered',
    'delivery failed': 'Failed',
    'shipment cancelled': 'Cancelled',
    'shipment rejected': 'Rejected',
    'closed': 'Closed',

    'unassigned': 'Pending',
    'open cases': 'Open',
    'picked cases': 'Picked',
    'awaiting to send': 'Awaiting To Send',
    'pending results': 'Pending',
    'Result Ready': 'Ready',
    'pending ops review': 'Ops Review Pending',
    'closed cases': 'Closed'
}

export const denominatorLabel = {
    'unassigned' : 'Unassigned',
    'assigned to me' : 'Assigned To Me'
}

export const inValid = [];
