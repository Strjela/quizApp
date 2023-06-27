import "./styles.css"
import yellow from "./assets/yellow.png"
import blue from "./assets/blue.png"
import IntroQuiz from "./IntroQuiz"
import { useState,useEffect } from "react"
import {decode} from 'html-entities';
import {encode} from 'html-entities'
import { nanoid } from "nanoid"
import Questions from "./Qustions"

 function App() {

  const [allQuestions, setAllQuestions] = useState([]);
  
  
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        const updatedQuestions = data.results.map((item) => {
          const mergedAndShuffled = mergeAndShuffleArrays(item.incorrect_answers, item.correct_answer);
          const allAns = mergedAndShuffled.map((ans, index) => ({
            allAnsId: index + 1, // Assign an ID based on the index
            answer: ans,
            isHeld: false,
          }));
  
          return {
            ...item,
            allAns,
            id: nanoid(),
          };
        });
  
        setAllQuestions(updatedQuestions);
        console.log(allQuestions);
      });
  }, []);

    function mergeAndShuffleArrays(array1, array2) {
      const mergedArray = array1.concat(array2); // Merge the two arrays
    
      for (let i = mergedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [mergedArray[i], mergedArray[randomIndex]] = [mergedArray[randomIndex], mergedArray[i]]; // Swap elements using destructuring assignment
      }
    
      return mergedArray;
    }

    
    function pickAns(id){
      setAllQuestions(oldAns => oldAns.map(item =>{
        if(item.allAns.allAnsId === id){
          return {
            ...item,
            isHeld: !item.isHeld
          }
        }
        return item 
      }))
    }

    
     const rendering =   allQuestions.map((item)=>{
      return <Questions 
                  key={item.id} 
                  questionsText={item.question} 
                  allAns={item.allAns} 
                  isHeld={item.allAns.isHeld}
                  handleClick={pickAns}
                     />
    })

  return (
    <div className="container">
      <img src={yellow} alt="Top Right Image" className="top-right-image" />
      <img src={blue} alt="Bottom Left Image" className="bottom-left-image" />

      {/* <IntroQuiz /> */}
      
      <div className="sveikad">
        {rendering}
      </div> 
      <button className="check--button">Check answers</button>
    </div>
  )
}

export default App
