import './Question.css';

function Question(props) {
  let opacity = props.data.complete ? 0.2 : 1;
  return (
    <button onClick={console.log} type="button" className="Question" style={{backgroundColor: props.backgroundColour, opacity: opacity}}>
      <p style={{ display: !props.data.complete ? "block" : "none" }}>
        {props.data.reward}
      </p>
      <p className="answer-label" style={{ display: props.data.complete ? "block" : "none" }}>
        {props.data.reward}{/* {props.data.answer} */}
      </p>
    </button>
  );
}

export default Question;
