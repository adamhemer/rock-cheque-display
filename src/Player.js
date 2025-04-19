import './Player.css';

function Player(props) {
    const playerStyle = {};
    if (props.selected)
    {
        playerStyle.backgroundColor = "#" + props.colour;
    }
    return (
    <div style={playerStyle} className="PlayerScore">
        <p className="PlayerProperties">{props.name}</p>
        <p className="PlayerProperties">{props.score}</p>
    </div>
    );
}

export default Player;
