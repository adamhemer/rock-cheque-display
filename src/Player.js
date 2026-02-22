import './Player.css';

function Player(props) {
    const playerStyle = {};

    let lateByText = "";
    if (props.lateBy< 1000) {
        lateByText += props.lateBy+ " ms";
    } else if (props.lateBy< 60 * 1000) {
        lateByText += (props.lateBy / 1000).toFixed(2) + " sec"
    } else if (props.lateBy< 60 * 60 * 1000) {
        lateByText += (props.lateBy / (60 * 1000)).toFixed(0) + " mins"
    }

    lateByText += " late!"

    playerStyle.border = "0.5vh solid #" + props.colour;
    playerStyle.backgroundColor =  `hsl(from #${props.colour} h calc(s - 20) calc(l + 20))`;
    return (

    
    
    <div style={playerStyle} className={"PlayerScore" + (props.selected ? " selected" : "")}>
        <p className="PlayerProperties">{props.name}</p>
        <p className="PlayerProperties">{props.score}</p>
        {(props.lateBy && !props.selected) ? <p key={props.lateBy} style={playerStyle} className="PlayerLate PlayerScore">{lateByText}</p> : null}
        
    </div>
    );
}

export default Player;
