import React, { Component } from 'react';

class Timer extends Component {
    state = { seconds: 3 }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    tick = () => {
        if (this.state.seconds > 0) {
            this.setState({ seconds: this.state.seconds - 1 })
        } 
        else {
            clearInterval(this.timer);
        }
    }

    render() {
        return (<p className='mt-3 mx-1'>00:{this.state.seconds}</p>
        )
    }
}

export default Timer;