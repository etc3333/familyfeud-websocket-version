import '../css/Display.css';

const Display = ({location, answer, number, showAnswer}) => {

  if (answer !== undefined) {
    if (showAnswer) {
      return (
        <div className="display-container">
          <span className="answer-container">
            {answer}
          </span>
          <span className="number-container">
            {number}
          </span>
        </div>
      )
    } else {
      return (
        <div className="display-container">
          {location}
        </div>
      )
    }
  } else {
    return <div>&nbsp;</div>;
  }
}

export default Display;