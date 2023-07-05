

export default function IntroQuiz(props){
    return (
        <div className="quizIntro"> 
            <h1>Quizzical</h1>
            <p>Test your knowledge now</p> 
            <button onClick={props.removeQuizIntro}>Start quiz</button> 
        </div>
        
    )
}