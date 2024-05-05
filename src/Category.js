import './Category.css';
import Question from './Question';

function Category(props) {
  
  let questions = []
  
  // console.log(props)

  // for (let i = 0; i < props.questions.length; i++) {
  //   questions.push(<Question key={i} pointValue={props.reward} backgroundColour={props.backgroundColour} ></Question>)
  // }

  props.questions.forEach((q, i) => {
    questions.push(<Question key={i} data={q} backgroundColour={props.backgroundColour} ></Question>)
  });

  

  return (
    <div className="Category">
      <p className="CategoryName">{props.name}</p>
      {questions}
    </div>
  );
}

export default Category;
