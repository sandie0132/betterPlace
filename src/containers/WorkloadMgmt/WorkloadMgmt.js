import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import cx from 'classnames';
import ServiceVerification from './ServiceVerification/ServiceVerification';
import AddressVerification from './AddressVerification/AddressVerification';
// import AddressInsights from './AddressVerification/AddressInsights/AddressInsights';
import PhysicalAddress from './AddressVerification/PhysicalAddress/PhysicalAddress';
import PostalAddress from './AddressVerification/PostalAddress/PostalAddress';
import styles from "./WorkLoadMgmt.module.scss";
import scrollStyle from '../../components/Atom/ScrollBar/ScrollBar.module.scss';

class Workloadmgmt extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
                <Switch>
                    <Route path={`${match.path}/address/postal/:_id`} exact component={PostalAddress} />
                    <Route path={`${match.path}/address/physical/:_id`} exact component={PhysicalAddress} />
                    <Route path={`${match.path}/address/:cardType`} exact component={AddressVerification} />
                    <Route path={`${match.path}/:cardType`} exact component={ServiceVerification} />
                    {/* <Route path={`${match.path}/address/insights`} exact component={AddressInsights} /> */}
                </Switch>
            </div>
        );
    }
}

export default withRouter(Workloadmgmt);