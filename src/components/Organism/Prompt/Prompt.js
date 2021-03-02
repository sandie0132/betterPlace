import React from 'react';
import { withRouter } from "react-router";
import WarningPopUp from '../../Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../assets/icons/warning.svg';

class prompt extends React.Component {
    
    state = {
        modalVisible: false,
        nextLocation: null
    }
    _isMounted = false

    componentDidMount() {
        this._isMounted = true;
        this.unblock = this.props.history.block((nextLocation) => {
            if(this.props.location.pathname === nextLocation.pathname){
                return true;
            }else{
                if (this.props.when) {
                    this.handleShowModal(nextLocation)
                }
                return !this.props.when;
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.unblock();
    }

    handleShowModal = (nextLocation) => {
        this.setState({
            modalVisible: true,
            nextLocation: nextLocation
        });
    }

    closeModal = () => {
        this.setState({
            modalVisible: false
        });

        if (this.props.takeActionOnKeep) {
            this.props.takeActionOnKeep();
        }
    }

    handleConfirmNavigationClick = () => {
        const { nextLocation } = this.state;
        let newPath = nextLocation.pathname;
        if (nextLocation.hash !== "") {
            newPath = newPath + nextLocation.hash
        }
        this.unblock();
        if(this._isMounted){
            this.setState({
                modalVisible: false,
                nextLocation: null
            })
        }
        if (this.props.takeActionOnCancel) {
            this.props.takeActionOnCancel();
        }
        this.props.history.push(newPath);
    }

    render() {
        return (
            <>
                {
                    this.state.modalVisible ?
                        <WarningPopUp
                            text='cancel?'
                            para='Warning: this cannot be undone'
                            confirmText='yes, cancel'
                            cancelText='keep'
                            icon={warn}
                            warningPopUp={this.handleConfirmNavigationClick}
                            closePopup={this.closeModal}
                        />
                    : null
                }
            </>
        )
    }
}
export default withRouter(prompt);