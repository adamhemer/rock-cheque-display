import React from "react";
import "./App.css";
import "./index.css";

class LargePlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className="player-list-item" style={{ border: "5px solid #" + this.props.colour, backgroundColor: `hsl(from #${this.props.colour} h calc(s - 20) calc(l + 20))`}}>
                {this.props.name}<br></br><span id="player-buzzer-text">Buzzer {this.props.index}</span>
            </div>
        );
    }
}

export default LargePlayer;
