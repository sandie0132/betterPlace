import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { Button } from 'react-crux';
import CaseList from './CaseList/CaseList';

class CourtVerification extends Component {

    state = {
        caseListPopup: false
    }

    toggleCaseListPopup = () => {
        let updatedPopup = this.state.caseListPopup;
        this.setState({ caseListPopup: !updatedPopup });
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <Button
                    type='medium'
                    label={t('translation_docVerification:crc.caseList')}
                    clickHandler={this.toggleCaseListPopup}
                />
                {this.state.caseListPopup === true ?
                    <CaseList
                        toggle={this.toggleCaseListPopup}
                    />
                    : null
                }
            </div>
        );
    }
}

export default withTranslation()(CourtVerification);