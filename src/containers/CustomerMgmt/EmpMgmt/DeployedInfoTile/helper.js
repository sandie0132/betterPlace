import themes from '../../../../theme.scss';

export const getBgColor = ({ brandColor }) => {
  switch (brandColor) {
    case '#262D33': return themes.black1Theme;
    case '#0059B2': return themes.blueTheme;
    case '#88ABD3': return themes.greyTheme;
    case '#4BB752': return themes.greenTheme;
    case '#FFB803': return themes.yellowTheme;
    case '#7C2E9E': return themes.purpleTheme;
    case '#EE3942': return themes.redTheme;
    case '#8D6D55': return themes.brownTheme;
    case '#A84567': return themes.black2Theme;
    default: return themes.defaultTheme;
  }
};

const displayName = (name) => {
  if (name.length > 26) {
    const updatedName = `${name.substring(0, 26)}...`;
    return (updatedName);
  }
  return (name);
};

export const getDescription = ({ orgType, sourceOrgName }) => {
  switch (orgType) {
    case 'org': return 'employee details of';
    case 'client': return 'deployed to client';
    case 'superClient': return displayName(`deployed to client of ${sourceOrgName}`);
    default: return 'employee details of';
  }
};

export const handleOrgLogo = ({ orgName }) => {
  let updatedShortName = orgName.split(' ');
  if (updatedShortName.length === 1) {
    updatedShortName = updatedShortName[0].substr(0, 2);
  } else if (updatedShortName.length > 1) {
    updatedShortName = updatedShortName[0].substr(0, 1) + updatedShortName[1].substr(0, 1);
  }
  return updatedShortName.toLowerCase();
};
