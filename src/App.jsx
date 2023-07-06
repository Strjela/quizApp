import "./styles.css"
import yellow from "./assets/yellow.png"
import blue from "./assets/blue.png"
import IntroQuiz from "./IntroQuiz"
import { useState,useEffect } from "react"
import { nanoid } from "nanoid"
import Questions from "./Qustions"




 function App() {

/*   koristin boolean za condicional rendering prve stranice*/ 
  const [introQuiz, setIntroQuiz] = useState(false)
  /* ode su spremljena sva pitanja */
  const [allQuestions, setAllQuestions] = useState([]);

 /*  bolean za provjeru koji se trigera na checkAnswers button i 
  prema tome se orjentiran u Questions komponenti za stylove u css */
  const [answersChecked, setAnswersChecked] = useState(false);

  /* boolean koji upravljan kad ce se renderat pitanja */
  const [renderQuestions, setrenderQuestions] = useState(true);
  /* state koji broji tocan broj odgovora */
  const [numberOfCorrectAns, setNumberOfCorrectAns] = useState(0);

  
  

  
  

 

  
  useEffect(() => {
    /* dohvaca podatke samo kad renderQuestions true */
    if (renderQuestions) {
      fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then((res) => res.json())
        .then((data) => {
          /* dohvacan podatke i u te podatke dodajn novi array objekat koji se sastoji od:
          Svih pitanja koji su pomjesani u random orderu, isHeld boolean koji sluzi da prikaz jeli odgovor stisnut,
          isCrorrect za provjeru jeli pitanje tocno */
          const updatedQuestions = data.results.map((item) => {
            /* funkcija za mjesanje redosljed pitanja zato sto u api su dovojeni correct ans i incorrect ans */
            const mergedAndShuffled = mergeAndShuffleArrays(item.incorrect_answers, item.correct_answer);
            const allAns = mergedAndShuffled.map((ans) => ({
              allAnsId: nanoid(),
              answer: ans,
              isHeld: false,
              isCorrect: false,
            }));
  
            return {
              ...item,
              allAns,
              id: nanoid(),
            };
          });
  
          setAllQuestions(updatedQuestions);
        });
    }
  }, [renderQuestions]);

  /* handleClick funkcija stavljena na prvi button  */
  function removeQuizIntro(){
    return setIntroQuiz(prevIntro => !prevIntro)
  }

    function mergeAndShuffleArrays(array1, array2) {
      const mergedArray = array1.concat(array2); // Merge the two arrays
    
      for (let i = mergedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [mergedArray[i], mergedArray[randomIndex]] = [mergedArray[randomIndex], mergedArray[i]]; // Swap elements using destructuring assignment
      }
    
      return mergedArray;
    }

    


    /* funkcija stavljena na svaki answer button koja mapira kroz svaki odgovor i prima id stisnutog 
    buttona te na temelju toga mjenja isHeld u true */
    function pickAns(id) {
      setAllQuestions((oldAns) =>
        oldAns.map((item) => {
          if (item.allAns.map((ans) => ans.allAnsId).includes(id)) {
            return {
              ...item,
              allAns: item.allAns.map((ans) => {
                if (ans.allAnsId === id) {
                  return {
                    ...ans,
                    isHeld: true, // Select the clicked answer
                  };
                }
                return {
                  ...ans,
                  isHeld: false, // Deselect all other answers
                };
              }),
            };
          }
          return item;
        })
      );
      setAnswersChecked(false);
    }

    
   

  
    function checkAnswers() {
      setAnswersChecked(oldRend => !oldRend); // Update the state variable to indicate that answers have been checked
    
      /* mjenja setrenderQuestions jer svaki put jer mi triba da svaki drugi put kad je kliknut rendera pitanja */
      setrenderQuestions(oldRend => !oldRend)

      setNumberOfCorrectAns(0)
      let count = 0
      
      /* mapira kroz sva pitanja i provjerava koji odgovor je stisnut i tocan te samo tocan */
      setAllQuestions((oldQue) => {
        const updatedQuestions = oldQue.map((question) => {
          const updatedAnswers = question.allAns.map((ans) => {
            if (ans.isHeld && ans.answer === question.correct_answer) {
              setNumberOfCorrectAns(oldAns => oldAns + 1)
              return { ...ans, isCorrect: true };
            } else if (!ans.isHeld && ans.answer === question.correct_answer) {
              return { ...ans, isCorrect: true };
            }
            return ans;
          });
  
          return { ...question, allAns: updatedAnswers };
        });
        
        console.log(count)
        /* ovo je vjerovatno najgluplje rjesenje ikad al nisan zna vise kako al ovo radi jbg xD */
        /* setNumberOfCorrectAns(count /2); */
        return updatedQuestions;
      });
    }
    
setNumberOfCorrectAns(oldAns => oldAns + 1)

     const rendering =   allQuestions.map((item)=>{
      return <Questions 
                  key={item.id}
                  questionsText={item.question}
                  allAns={item.allAns  || []}
                  handleClick={pickAns}
                  answersChecked={answersChecked}
                     />
    })


   

    
    
    return (
      <div className="container">
        <img src={yellow} alt="Top Right Image" className="top-right-image" />
        <img src={blue} alt="Bottom Left Image" className="bottom-left-image" />
    
        {!introQuiz ? (
          <IntroQuiz removeQuizIntro={removeQuizIntro} />
        ) : (
          <div>
            <div className="sveikad">{rendering}</div>
            <div className="endGame">
              <p>{!renderQuestions ? `You scored ${numberOfCorrectAns}/5 correct answers` : ""}</p>
              <button className="check--button" onClick={checkAnswers}>
                {renderQuestions ? "Check answers" : "Play again!"}
              </button>
            </div>
            
          </div>
        )}
      </div>
    );
}

export default App
