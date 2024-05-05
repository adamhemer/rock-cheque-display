import './Player.css';

function Player(props) {
  return (
    <div className="PlayerScore">
      <p className="PlayerProperties">{props.name}</p>
      <p className="PlayerProperties">{props.score}</p>
    </div>
  );
}

export default Player;
