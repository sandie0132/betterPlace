import i18n from 'i18next';
// import Backend from 'i18next-xhr-backend';
import orgMgmtLeftNav_en from './locales/en/translation_orgMgmtLeftNav.json';
import orgDetails_en from './locales/en/translation_orgDetails.json';
import orgContact_en from './locales/en/translation_orgContact.json';
import orgAddress_en from './locales/en/translation_orgAddress.json';
import orgAccessMgmt_en from './locales/en/translation_orgAccessManagement.json';
import orgDocs_en from './locales/en/translation_orgDoc.json';
import orgList_en from './locales/en/translation_orgList.json';
import orgCard_en from './locales/en/translation_orgCard.json';
import orgPaginator_en from './locales/en/translation_orgPaginator.json';
import orgMgmtRightNav_en from './locales/en/translation_orgMgmtRightNav.json';
import orgOnboarding_en from './locales/en/translation_orgOnboarding.json';
import orgInfo_en from './locales/en/translation_orgInfo.json';
import orgPriceMap_en from './locales/en/translation_orgPriceMap.json';
import orgProfile_en from './locales/en/translation_orgProfile.json';
import orgSelectService_en from './locales/en/translation_orgSelectService.json';
import orgBgvConfigRightNav_en from './locales/en/translation_orgBgvConfigRightNav.json';
import orgBgvSelectService_en from './locales/en/translation_orgBgvSelectService.json';
import orgBgvServiceMapping_en from './locales/en/translation_orgBgvServiceMapping.json';
import orgBgvTatMapping_en from './locales/en/translation_orgBgvTatMapping.json';
import orgClientDetails_en from './locales/en/translation_orgClientDetails.json';
import orgClientList_en from './locales/en/translation_orgClientList.json';
import orgClientRightNav_en from './locales/en/translation_orgClientRightNav.json';
import orgClientSpoc_en from './locales/en/translation_orgClientSpoc.json';
import orgClientTags_en from './locales/en/translation_orgClientTags.json';
import orgOpsConfigRightNav_en from './locales/en/translation_orgOpsConfigRightNav.json';
import orgSpocCard_en from './locales/en/translation_orgSpocCard.json';
import orgTatMapping_en from './locales/en/translation_orgTatMapping.json';
import orgBgvBetterPlaceSpoc_en from './locales/en/translation_orgBgvBetterplaceSpoc.json';
import orgStatusMgmtCheckLevel_en from './locales/en/translation_orgStatusMgmtCheckLevel.json';
import orgStatusMgmtSectionLevel_en from './locales/en/translation_orgStatusMgmtSectionLevel.json';
import orgStatusMgmtProfileLevel_en from './locales/en/translation_orgStatusMgmtProfileLevel.json';
import orgReportDashboard_en from './locales/en/translation_orgReportDashboard.json';

import empList_en from './locales/en/translation_empList.json';
import empTermination_en from './locales/en/translation_empTermination.json';
import empSocial_en from './locales/en/translation_empSocial.json';
import empSkillsPreference_en from './locales/en/translation_empSkillsPreference.json';
import empProfile_en from './locales/en/translation_empProfile.json';
import empOnboarding_en from './locales/en/translation_empOnboarding.json';
import empMgmtRightNav_en from './locales/en/translation_empMgmtRightNav.json';
import empAddNew_en from './locales/en/translation_empAddNew.json';
import empBasicDetails_en from './locales/en/translation_empBasicDetails.json';
import empBasicRegistration_en from './locales/en/translation_empBasicRegistration.json';
import empContact_en from './locales/en/translation_empContact.json';
import empAddress_en from './locales/en/translation_empAddress.json';
import empDetails_en from './locales/en/translation_empDetails.json';
import empEntity_en from './locales/en/translation_empEntity.json';
import empDocuments_en from './locales/en/translation_empDocuments.json';
import empEducation_en from './locales/en/translation_empEducation.json';
import empFamily_en from './locales/en/translation_empFamily.json';
import empHealth_en from './locales/en/translation_empHealth.json';
import empHistory_en from './locales/en/translation_empHistory.json';
import empMgmtLeftNav_en from './locales/en/translation_empMgmtLeftNav.json';
import empSearch_en from './locales/en/translation_empSearch.json';
import empExcelOnboarding_en from './locales/en/translation_empExcelOnboarding.json';
import empOnboardingConfigCompany_en from './locales/en/translation_empOnboardingConfigCompany.json';
import vendorList_en from './locales/en/translation_vendorList.json';
import vendorOnboarding_en from './locales/en/translation_vendorOnboarding.json';
import vendorDetails_en from './locales/en/translation_vendorDetails.json';
import vendorTags_en from './locales/en/translation_vendorTags.json';
import vendorMgmtRightNav_en from './locales/en/translation_vendorMgmtRightNav.json';

import tagColumn_en from './locales/en/translation_tagColumn.json';
import tagNewTagTypeForm_en from './locales/en/translation_tagNewTagTypeForm.json';
import tagMgmt_en from './locales/en/translation_tagMgmt.json';
import tagCard_en from './locales/en/translation_tagCard.json';
import tagInfoForm_en from './locales/en/translation_tagInfoForm.json';

import successNotification_en from './locales/en/translation_SuccessNotification.json';
import errorNotification_en from './locales/en/translation_errorNotification.json';
import superAdminHome_en from './locales/en/translation_superAdminHome.json';
import clientAdminHome_en from './locales/en/translation_clientAdminHome.json';
import orgBgvStatus_en from './locales/en/translation_orgBgvStatus.json';
import emptyPage_en from './locales/en/translation_emptyPage.json';
import opsHome_en from './locales/en/translation_opsHome.json';

import verificationModal_en from './locales/en/translation_verificationModal.json';
import docVerification_en from './locales/en/translation_docVerification.json';

import addressVerification_en from './locales/en/translation_addressVerification.json';
import addressTaskClosure_en from './locales/en/translation_addressTaskClosure.json';

import tagSearch_en from './locales/en/translation_tagSearch.json';
// import russianTranslations from '../public/locales/ru';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const fallbackLng = ['en'];
const availableLanguages = ['en', 'ru'];

i18n
  // .use(Backend) // load translation using xhr -> see /public/locales. We will add locales in the next step

  .use(LanguageDetector) // detect user language

  .use(initReactI18next) // pass the i18n instance to react-i18next.

  .init({
    fallbackLng, // if user computer language is not on the list of available languages, than we will be using the fallback language specified earlier
    debug: false,
    whitelist: availableLanguages,
    lng: 'en',
    resources : {
      en: {
        'translation_empList': empList_en,
        'translation_orgDetails': orgDetails_en,
        'translation_orgContact': orgContact_en,
        'translation_orgAddress': orgAddress_en,
        'translation_orgAccessManagement': orgAccessMgmt_en,
        'translation_orgDoc': orgDocs_en,
        'translation_orgList': orgList_en,
        'translation_orgCard': orgCard_en,
        'translation_orgPaginator': orgPaginator_en,
        'translation_orgMgmtLeftNav': orgMgmtLeftNav_en,
        'translation_orgMgmtRightNav': orgMgmtRightNav_en,
        'translation_orgOnboarding': orgOnboarding_en,
        'translation_orgInfo': orgInfo_en,
        'translation_orgPriceMap': orgPriceMap_en,
        'translation_orgProfile': orgProfile_en,
        'translation_orgSelectService': orgSelectService_en,
        'translation_empTermination': empTermination_en,
        'translation_empSocial': empSocial_en,
        'translation_empSkillsPreference': empSkillsPreference_en,
        'translation_empProfile': empProfile_en, 
        'translation_empOnboarding': empOnboarding_en,
        'translation_empOnboardingConfigCompany':empOnboardingConfigCompany_en,
        'translation_empMgmtRightNav': empMgmtRightNav_en,
        'translation_orgBgvConfigRightNav': orgBgvConfigRightNav_en,
        'translation_orgBgvSelectService': orgBgvSelectService_en,
        'translation_orgBgvServiceMapping': orgBgvServiceMapping_en,
        'translation_orgBgvTatMapping': orgBgvTatMapping_en,
        'translation_orgClientDetails': orgClientDetails_en,
        'translation_orgClientList': orgClientList_en,
        'translation_orgClientRightNav': orgClientRightNav_en,
        'translation_orgClientSpoc': orgClientSpoc_en,
        'translation_orgClientTags': orgClientTags_en,
        'translation_orgOpsConfigRightNav': orgOpsConfigRightNav_en,
        'translation_orgBgvBetterplaceSpoc': orgBgvBetterPlaceSpoc_en,
        'translation_orgSpocCard': orgSpocCard_en,
        'translation_orgTatMapping': orgTatMapping_en,
        'translation_orgReportDashboard': orgReportDashboard_en,
        'translation_empAddNew': empAddNew_en,
        'translation_empBasicDetails': empBasicDetails_en,
        'translation_empBasicRegistration': empBasicRegistration_en,
        'translation_empContact': empContact_en,
        'translation_empAddress': empAddress_en,
        'translation_empDetails': empDetails_en,
        'translation_empEntity': empEntity_en, 
        'translation_empDocuments': empDocuments_en, 
        'translation_empEducation': empEducation_en, 
        'translation_empFamily': empFamily_en, 
        'translation_empHealth': empHealth_en, 
        'translation_empHistory': empHistory_en,
        'translation_empMgmtLeftNav': empMgmtLeftNav_en,
        'translation_empSearch': empSearch_en,
        'translation_empExcelOnboarding': empExcelOnboarding_en,
        'translation_vendorList': vendorList_en,
        'translation_vendorOnboarding': vendorOnboarding_en,
        'translation_vendorDetails': vendorDetails_en,
        'translation_vendorTags': vendorTags_en,
        'translation_vendorMgmtRightNav': vendorMgmtRightNav_en,
        'translation_tagColumn': tagColumn_en,
        'translation_tagNewTagTypeForm': tagNewTagTypeForm_en,
        'translation_tagMgmt': tagMgmt_en,
        'translation_tagCard': tagCard_en,
        'translation_tagInfoForm': tagInfoForm_en,
        'translation_SuccessNotification': successNotification_en,
        'translation_errorNotification': errorNotification_en,
        'translation_superAdminHome': superAdminHome_en,
        'translation_clientAdminHome': clientAdminHome_en,
        'translation_orgBgvStatus': orgBgvStatus_en,
        'translation_emptyPage' : emptyPage_en,
        'translation_orgStatusMgmtCheckLevel': orgStatusMgmtCheckLevel_en,
        'translation_orgStatusMgmtSectionLevel': orgStatusMgmtSectionLevel_en,
        'translation_orgStatusMgmtProfileLevel': orgStatusMgmtProfileLevel_en,
        'translation_opsHome': opsHome_en,
        'translation_tagSearch': tagSearch_en,
        'translation_verificationModal': verificationModal_en,
        'translation_docVerification': docVerification_en,
        'translation_addressVerification': addressVerification_en,
        'translation_addressTaskClosure': addressTaskClosure_en
        },
      ru: {

      }
    },
    // ns: ['translation_empList', 'translation_orgDetails', 'translation_orgContact', 'translation_orgAddress',
    //   'translation_orgAccessManagement', 'translation_orgDoc', 'translation_orgList', 'translation_orgCard', 'translation_orgPaginator',
    //   'translation_orgMgmtLeftNav', 'translation_orgMgmtRightNav','translation_orgOnboarding','translation_orgInfo',
    //   'translation_orgPriceMap','translation_orgProfile','translation_orgSelectService','translation_empTermination',
    //   'translation_empSocial','translation_empSkillsPreference','translation_empProfile','translation_empOnboarding',
    //   'translation_empMgmtRightNav','translation_orgMgmtLeftNav', 'translation_orgMgmtRightNav', 'translation_orgOnboarding', 
    //   'translation_orgInfo','translation_orgPriceMap', 'translation_orgProfile', 'translation_orgSelectService', 
    //   'translation_orgBgvConfigRightNav','translation_orgBgvSelectService', 'translation_orgBgvServiceMapping', 
    //   'translation_orgBgvTatMapping', 'translation_orgClientDetails','translation_orgClientList', 'translation_orgClientRightNav', 
    //   'translation_orgClientSpoc', 'translation_orgClientTags','translation_orgOpsConfigRightNav', 'translation_orgSpocCard', 
    //   'translation_orgTatMapping','translation_empAddNew','translation_empBasicDetails', 'translation_empContact', 'translation_empAddress', 'translation_empDetails',
    //   'translation_empEntity','translation_empDocuments', 'translation_empEducation', 'translation_empFamily', 'translation_empHealth', 
    //   'translation_empHistory', 'translation_empMgmtLeftNav',
    //   'translation_vendorList', 'translation_vendorOnboarding', 'translation_vendorDetails', 'translation_vendorTags', 'translation_vendorMgmtRightNav',
    //   'translation_orgStatusMgmtSectionLevel', 'translation_orgStatusMgmtProfileLevel', 'translation_orgStatusMgmtCheckLevel', 'translation_orgBgvBetterplaceSpoc',
    //   'translation_tagColumn', 'translation_tagNewTagTypeForm', 'translation_tagMgmt', 'translation_tagCard', 'translation_SuccessNotification',
    //   'translation_errorNotification', 'translation_superAdminHome', 'translation_clientAdminHome',
    // 'translation_orgBgvStatus', 'translation_emptyPage'],
    defaultNS: 'translation_empList',
    interpolation: {
      escapeValue: false
    },
  }, (err, t) => {
    t('key'); // -> same as i18next.t
  });

export default i18n;