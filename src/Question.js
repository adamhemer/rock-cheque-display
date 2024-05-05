import './Question.css';

function Question(props) {
  return (
    <button onClick={console.log} type="button" className="Question" style={{backgroundColor: props.backgroundColour}}>
      <p style={{ display: !props.data.complete ? "block" : "none" }}>
        {props.data.reward}
      </p>
      <p className="answer-label" style={{ display: props.data.complete ? "block" : "none" }}>
        {props.data.answer}
      </p>
    </button>
  );
}

export default Question;
