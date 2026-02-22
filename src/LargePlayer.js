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
        let secondRowText = `Buzzer ${this.props.index}`;
        if (this.props.score != null) {
            secondRowText = `${this.props.score} Points`;
        }
        return (
            <div className={`player-list-item ${this.props.winner ? "Winner" : ""}`} style={{ border: "5px solid #" + this.props.colour, backgroundColor: `hsl(from #${this.props.colour} h calc(s - 20) calc(l + 20))`}}>
                {this.props.name}<br></br><span id="player-buzzer-text">{secondRowText}</span>
            </div>
        );
    }
}

export default LargePlayer;
