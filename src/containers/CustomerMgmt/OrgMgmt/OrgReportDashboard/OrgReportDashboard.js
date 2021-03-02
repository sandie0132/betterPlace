import React, { Component } from "react";
import cx from "classnames";
import styles from './OrgReportDashboard.module.scss';
import active from '../../../../assets/icons/active.svg';
import toDo from '../../../../assets/icons/leftNavClients.svg';
import colorStatus from '../../../../assets/icons/terminateIcon.svg';
import accessManageIcon from '../../../../assets/icons/accessManageIcon.svg';
import InsightChart from "../../../../components/Organism/InsightChart/InsightChart";
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import { withTranslation } from "react-i18next";

class OrgReportDashboard extends Component {
    render() {
        const { t } = this.props;
        return (
            <React.Fragment>
                <div className={cx(styles.Card, "col-9")}>
                    {/* <div className={cx(styles.AlignLeft)}> */}
                    <ArrowLink
                    url = {`/customer-mgmt/org`} 
                    label = 'all clients'
                    className = {styles.PaddingLeftArrow}
                    />
                    {/* </div> */}
                    {/* <div className={cx(styles.Line, "mb-4")} /> */}
                    <div className={styles.orgName}>{t('translation_orgReportDashboard:orgName')}</div>
                    <span className="row mb-2 w-100">
                        <ul className="w-100 mt-2">
                            <li className="px-0 mx-0 py-0 my-0 w-100">
                                <div className={cx(styles.actionContent, " d-flex")}>
                                    <span>
                                        <button className={styles.InactiveButton} onClick={undefined}><img src={toDo} alt={t('translation_orgReportDashboard:image_alt_orgReportDashboard.todo')} className="pr-2" />{t('translation_orgReportDashboard:l1')}</button>
                                        <button className={styles.InactiveButton} onClick={undefined}><img src={active} alt={t('translation_orgReportDashboard:image_alt_orgReportDashboard.active')} className="pr-2" />{t('translation_orgReportDashboard:l2')}</button>
                                        <button className={styles.InactiveButton} onClick={undefined}><img src={colorStatus} alt={t('translation_orgReportDashboard:image_alt_orgReportDashboard.colorStatus')} className="pr-2" />{t('translation_orgReportDashboard:l3')}</button>
                                        <button className={styles.InactiveButton} onClick={undefined}><img src={colorStatus} alt={t('translation_orgReportDashboard:image_alt_orgReportDashboard.colorStatus')} className="pr-2" />{t('translation_orgReportDashboard:l4')}</button>
                                        <button className={styles.InactiveButton} onClick={undefined}><img src={colorStatus} alt={t('translation_orgReportDashboard:image_alt_orgReportDashboard.colorStatus')} className="pr-2" />{t('translation_orgReportDashboard:l5')}</button>
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <hr className={cx(styles.hr1, 'mb-4')} />
                    </span>
                    <div>
                        <span className={styles.heading}>
                            <img src={accessManageIcon} alt={t('translation_orgReportDashboard:image_alt_orgReportDashboard.access')} /> {t('translation_orgReportDashboard:progress')}
                        </span>
                        <br />
                        <div>
                            <InsightChart />
                        </div>

                    </div>


                </div>

            </React.Fragment>
        )
    }
}

export default withTranslation()(OrgReportDashboard);