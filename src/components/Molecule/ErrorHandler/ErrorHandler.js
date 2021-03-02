import React from 'react';
import ErrorPage from './ErrorPage/ErrorPage';


class ErrorHandler extends React.Component {

    constructor(props) {
        super(props)
        this.state = { errorOccurred: false }
    }

    componentDidCatch(error, info) {
        this.setState({ errorOccurred: true })
    }

    render() {
        return(
        <div>
        {this.state.errorOccurred ? 
        <ErrorPage /> 
        : this.props.children}
        </div>
        )
    }

}
export default ErrorHandler;
