import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import SelectService from './OpsSelectService/SelectService';
import TatMapping from './OpsTatMapping/TatMapping';
import PriceMapping from './OpsPricing/PriceMapping';

class OrgOpsConfig extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="container-fluid row px-0 mx-0">
                <Switch>
                    <Route path={`${match.path}/ops-select`} exact component={SelectService} />
                    <Route path={`${match.path}/ops-tat`} exact component={TatMapping} />
                    <Route path={`${match.path}/ops-price`} exact component={PriceMapping} />
                </Switch>
            </div>
        );
    }
}
export default withRouter(OrgOpsConfig);