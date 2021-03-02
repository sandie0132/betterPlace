import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import styles from './ServiceVerification.module.scss';
import cx from 'classnames';

import * as OpsHomePageAction from '../../Home/OpsHome/Store/action';
import * as actions from './Store/action';

import TaskSearchCloseReview from './TaskSearchCloseReview/TaskSearchCloseReview';
import TasksCountInfo from './TasksCountInfo/TasksCountInfo';
import ArrowLink from '../../../components/Atom/ArrowLink/ArrowLink';

class ServiceVerification extends Component {

    componentDidMount = () => {
        this.props.getDocuments();
    }

    componentWillUnmount = () => {
        this.props.onGetInitState();
    }

    render() {
        const { t } = this.props;
        let { match } = this.props;
        return (
            <React.Fragment>

                <div className={cx(styles.workloadSection)}>
                    <div className="d-flex justify-content-between">
                        <ArrowLink
                            label={t('translation_docVerification:dashboard')}
                            url={'/workload-mgmt'}
                        />
                    </div>

                    <TasksCountInfo
                        taskType={match.params.cardType}
                    />

                    <TaskSearchCloseReview
                        taskType={match.params.cardType}
                    />

                </div>
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        documentTasksList: state.workloadMgmt.DocVerification.documentTasksList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetInitState: () => dispatch(actions.initState()),
        getDocuments: () => dispatch(OpsHomePageAction.getDocuments())
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ServiceVerification));