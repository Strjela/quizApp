
import { decode } from 'html-entities';


export default function Questions(props) {


  function getAnswerClass(item) {
    if (props.answersChecked) {
      if (item.isHeld && item.isCorrect) {
        return "held correct";
      } else if (item.isHeld && !item.isCorrect) {
        return "held incorrect";
      } else if(!item.isHeld && item.isCorrect){
        return "held correct"
      } else if(!item.isHeld && !item.isCorrect) {
        return "neutral"
      }
    } else if (!props.answersChecked && item.isCorrect) {
      return "correct";
    } else if(item.isHeld){
      return "held"
    }

    return "";
  }

  return (
    <div className="questions--container">
      <div className="questions--text">
        {decode(props.questionsText)}
      </div>
      <div className="questions--answers">
        {/* mapira kroz sva pitanja te provjerava isHeld i isCorrect 
        te na temelju toga vraca css class */}
        {props.allAns.map((item) => {
          const answerClass = getAnswerClass(item);
          return (
            <button
              onClick={() => props.handleClick(item.allAnsId)}
              className={`questions--button ${answerClass}`}
              key={item.allAnsId}
            >
              {decode(item.answer) }
            </button>
          );
        })}
      </div>
    </div>
  );
}