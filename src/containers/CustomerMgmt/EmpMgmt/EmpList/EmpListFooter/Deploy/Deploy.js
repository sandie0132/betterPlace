import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./Store/action";
import _ from 'lodash';
import styles from './Deploy.module.scss';
import cx from "classnames";
import up from '../../../../../../assets/icons/downArrow.svg';
import down from '../../../../../../assets/icons/orgProfileArrow.svg';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
import { Button } from 'react-crux';
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";

class Deploy extends Component {

    state = {
        tags: [],
        toggleDropdown: false,
        client: '',
        clientId: ''

    }
    componentDidMount() {
        const {match} = this.props;
        const orgId = match.params.uuid;
        this.props.onGetClientList(orgId);
    }

    handleInsertInTags = (tagList, tag) => {
        return [
            tag
        ]
    }

    handleDeleteInTags = (tagList, targetTag) => {
        return (
            tagList.filter(tag => tag.uuid !== targetTag.uuid)
        )
    }

    handleTagChange = (event, inputIdentifier, action) => {
        let updatedTags = _.cloneDeep(this.state.tags);

        if (inputIdentifier === 'tags') {
            if (action === 'add') {
                updatedTags = this.handleInsertInTags(updatedTags, event.value)
            }
            if (action === 'delete') {
                updatedTags = this.handleDeleteInTags(updatedTags, event.value)
            }
        }
        this.setState({ tags: updatedTags });
    };

    handleSubmit = () => {
        const {match} = this.props;
        const orgId = match.params.uuid;
        let clientId = this.state.clientId;
        const deployData = {
            employeeList: this.props.selectedEmployee,
            locationTag: this.state.tags[0].uuid,
            // clientId: this.state.clientId,
            // client: this.state.client
        }
        this.props.onPostDeployEmp(orgId, deployData, clientId);
        this.props.closeFooter();
    }

    handleToggleDropdown = () => {
        this.setState({
            toggleDropdown: !this.state.toggleDropdown
        })
    }
    handleClient = ({ name, uuid }) => {

        this.setState({
            client: name,
            clientId: uuid,
            toggleDropdown: false,
            tags: []
        })
    }

    render() {
        const { t } = this.props;
        return (
            <React.Fragment >
                <div className={styles.Footer}>
                    <span className={styles.Number}>{this.props.selectedEmployee.length}</span>&nbsp; employee{this.props.selectedEmployee.length > 1 ? <span>s</span> : null} selected
                    <span className={cx(styles.verticalLine)}></span>
                    <span className="ml-4 pl-1">
                        &nbsp;deploy employee{this.props.selectedEmployee.length > 1 ? <span>s</span> : null} to

                    {this.state.toggleDropdown ?
                            // <div className={styles.clientMenu}>
                            <React.Fragment>
                                <span className={styles.dropdownClient}>
                                    <div className={styles.scroll}>
                                        {this.props.clientList.map((org, index) => {
                                            return (<React.Fragment key={index}><div className={styles.clientOption} onClick={() => this.handleClient(org)}>{org.name}</div></React.Fragment>)
                                        })}
                                    </div>
                                    <div onClick={() => this.handleToggleDropdown()} className={styles.clientTab} >{t('translation_empList:deployTags.search')} <img src={down} alt={t('translation_empList:deployTags.img')} style={{ marginLeft: "2.25rem" }} /> </div>
                                </span>
                            </React.Fragment>
                            // </div> 
                            : <span onClick={() => this.handleToggleDropdown()} className={styles.dropdown}>{this.state.client !== '' ? <span>{this.state.client}</span> : <span>{t('translation_empList:deployTags.search')}</span>}<img src={up} alt={t('translation_empList:deployTags.img')} className="ml-5" /></span>}
                        <TagSearchField
                            //noBorder
                            disabled={this.state.clientId ? false : true}
                            placeholder={'search for location'}
                            orgId={this.state.clientId}
                            category={'geographical'}
                            tags={this.state.tags}
                            dropdownMenu={styles.dropdownMenu}
                            BarStyle={styles.tagSearch}
                            updateTag={(value, action) => this.handleTagChange(value, 'tags', action)}
                            className={styles.placeholderText}
                        />
                        <span className={styles.AlignRight}>
                            <Button label={t('translation_empList:deployTags.deploy')} type="medium" clickHandler={() => this.handleSubmit()} isDisabled={this.state.tags.length > 0 ? false : true} />
                        </span>
                    </span>



                </div>

            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        getClientListState: state.empMgmt.empDeploy.getClientListState,
        clientList: state.empMgmt.empDeploy.clientList,
        error: state.empMgmt.empDeploy.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onGetClientList: (orgId) => dispatch(actions.getClientList(orgId)),
        onPostDeployEmp: (orgId, data, clientId) => dispatch(actions.postDeployEmp(orgId, data, clientId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Deploy)));