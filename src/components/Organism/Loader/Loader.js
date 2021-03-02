import React from 'react';
import ContentLoader from 'react-content-loader';

import cx from 'classnames';
import themes from '../../../theme.scss';
import styles from './Loader.module.scss';

import TileLoader from './TileLoader/TileLoader';
import ListLoader from './ListLoader/ListLoader';
import FormLoader from './FormLoader/FormLoader';

import OrgAccessMgmtLoader from './OrgAccessMgmtLoader/OrgAccessMgmtLoader';
import OrgProfileLoader from './OrgProfileLoader/OrgProfileLoader';

import BGVSelectService from './BGVConfigServiceLoader/BGVConfigServiceLoader';
import SpocLoader from './SpocLoader/SpocLoader';
import StatusMgmt from './StatusMgmt/StatusMgmt';
import StatusMgmtTopNav from './StatusMgmtTopNav/StatusMgmtTopNav';

import TagSearchModalLoader from './TagSearchModalLoader/TagSearchModalLoader';
import TagLoader from './TagLoader/TagLoader';

import EmpListLoader from './EmpListLoader/EmpListLoader';
import EmpProfileLoader from './EmpProfileLoader/EmpProfileLoader';

import OpsTaskLowerCard from './OpsTaskLowerCard/OpsTaskLowerCard';
import OpsHome from './OpsHome/OpsHome';

import DashboardLoader from './DashboardLoader/DashboardLoader';
import ChartLoader from './ChartLoader/ChartLoader';

import OnBoardForm from './OnBoardForm/OnBoardForm';
import OnboardDashboardLoader from './OnboardDashboardLoader/OnboardDashboardLoader';
import OnboardTodoLoader from './OnboadTodoLoader/onboardTodoLoader';

import OpsTaskCardLoader from './OpsTaskCardLoader/OpsTaskCardLoader';
import TaskListLoader from './TaskListLoader/TaskListLoader';
import TaskFilter from './TaskFilterLoader';

import AttendShiftLoader from './AttendShiftLoader/AttendShiftLoader';
import BgvInitiateModal from './BgvInitiateModal';

import RosterEmpTable from './RosterEmpTable/RosterEmpTable';
import RosterEmpCount from './RosterEmpCount/RosterEmpCount';

const Loader = (props) => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;
  const empMgmtRightNavPrimaryColor = themes.empRightNavLoaderPrimary;
  const empMgmtRightNavSecondaryColor = themes.empRightNavLoaderSecondary;

  const vendorListSecondaryColor = themes.tileLoaderSecondary;

  const vendorListLoader = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 5; i++) {
    vendorListLoader.push(
      <div key={i} className={cx('flex row px-0')}>
        <svg viewBox="10 50 2000 210" className="col-12 pl-2">
          <ContentLoader
            height={600}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={vendorListSecondaryColor}
          >
            <rect x="3" y="260" rx="0" ry="0" width="5.5%" height="50%" />
            <rect x="20" y="270" rx="2" ry="100" width="25%" height="19%" />
            <rect x="20" y="446" rx="2" ry="100" width="16%" height="15%" />
            <rect x="172" y="310" rx="5" ry="100" width="13%" height="40%" />
          </ContentLoader>
        </svg>
        <hr className={cx('my-0 mx-3', styles.horizontalLine)} />
      </div>,
    );
  }

  switch (props.type) {
    case 'form': return <FormLoader />;
    case 'list': return <ListLoader />;
    case 'tile': return <TileLoader />;
    case 'empList': return <EmpListLoader data={props} />;
    case 'orgProfile': return <OrgProfileLoader />;
    case 'tagSearchModal': return <TagSearchModalLoader data={props} />;
    case 'tagLoader': return <TagLoader />;
    case 'empProfile': return <EmpProfileLoader data={props} />;
    case 'opsTask': return <OpsTaskCardLoader />;
    case 'opsTaskLower': return <OpsTaskLowerCard />;
    case 'accessMgmt': return <OrgAccessMgmtLoader />;
    case 'bgvSelectService': return <BGVSelectService />;
    case 'statusMgmt': return <StatusMgmt />;
    case 'statusMgmtTop': return <StatusMgmtTopNav />;
    case 'opsHome': return <OpsHome />;
    case 'spoc': return <SpocLoader />;
    case 'orgDashboard': return <DashboardLoader />;
    case 'onboardForm': return <OnBoardForm />;
    case 'taskListLoader': return <TaskListLoader />;
    case 'taskFilter': return <TaskFilter />;
    case 'onboardDashboard': return <OnboardDashboardLoader />;
    case 'onboardTodo': return <OnboardTodoLoader />;
    case 'chartLoader': return <ChartLoader />;
    case 'attendShiftList': return <AttendShiftLoader />;
    case 'rosterEmpTable': return <RosterEmpTable />;
    case 'rosterEmpCount': return <RosterEmpCount />;
    case 'vendorList': return vendorListLoader;
    case 'bgvInitiateModal': return <BgvInitiateModal />;
    case 'tabLoader': return (
      <div className={cx('flex row px-0')}>
        <svg viewBox="10 50 2000 210" className="col-10">
          <ContentLoader
            height={600}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={vendorListSecondaryColor}
          >
            <rect x="0" y="260" rx="0" width="95%" height="40%" />
          </ContentLoader>
        </svg>
      </div>
    );
    case 'cardHeader':
      return (
        <div className={cx('flex row px-0')}>
          <svg viewBox="10 50 2000 210" className="col-10">
            <ContentLoader
              height={600}
              width={200}
              speed={10}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            >
              <rect x="3" y="260" rx="55" ry="100%" width="5.5%" height="50%" />
              <rect x="18" y="350" rx="3" ry="100" width="45%" height="23%" />
            </ContentLoader>
          </svg>
        </div>
      );
    case 'empMgmtRightNav':
      return (
        <div className={cx('flex row px-0')}>
          <svg viewBox="0 0 900 200" className="col-12 px-0">
            <ContentLoader
              height={400}
              width={200}
              speed={5}
              primaryColor={empMgmtRightNavPrimaryColor}
              secondaryColor={empMgmtRightNavSecondaryColor}
            >
              <rect x="11" y="7" rx="55" ry="100%" width="20%" height="90%" />
              <rect x="58" y="50" rx="10" ry="100" width="45%" height="20%" />
              <rect x="58" y="200" rx="8" ry="100" width="42%" height="15%" />
            </ContentLoader>
          </svg>
        </div>
      );
    case 'stepLoader':
      return (
        <div className={styles.stepLoader}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderMid':
      return (
        <div className={styles.stepLoaderMid}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderSmall':
      return (
        <div className={styles.stepLoaderSmall}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'buttonLoader':
      return (
        <span>
          <button type="button" className={cx('btn', styles.DisabledButton, props.className, styles.LargeButton)} disabled>
            loading...
          </button>
        </span>
      );
    case 'stepLoaderGreen':
      return (
        <div className={cx(styles.stepLoaderGreen, props.className)}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderBlue':
      return (
        <div className={cx(props.className, styles.stepLoaderBlue)}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderWhite':
      return (
        <div className={cx(styles.stepLoaderWhite, props.className)}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderGrey':
      return (
        <div className={cx(props.className, styles.stepLoaderGrey)}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderRed':
      return (
        <div className={cx(props.className, styles.stepLoaderRed)}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'stepLoaderBlack':
      return (
        <div className={styles.stepLoaderBlack}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    case 'physicalSpinner':
      return (
        <div>
          <svg viewBox="0 0 215 200" className="col-12 px-0" style={{ backgroundColor: primaryColor }}>
            <ContentLoader
              // height={600}
              // width={200}
              speed={5}
              primaryColor={empMgmtRightNavPrimaryColor}
              secondaryColor={empMgmtRightNavSecondaryColor}
            >
              <rect x="0" y="0" rx="0" ry="100%" width="100%" height="100%" />
            </ContentLoader>
          </svg>
        </div>
      );
    // return <div className={styles.physicalSpinner}></div>
    default:
      return <FormLoader />;
  }
};

export default Loader;
