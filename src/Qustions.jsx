




export default function Questions(props) {
      
  const styles = {
    backgroundColor: props.isHeld ? "#D6DBF5" : "#F5F7FB"
}



  return (
    <div className="questions--container">
      <div className="questions--text">
        {props.questionsText}
      </div>
      <div className="questions--answers">
        {props.allAns.map((item) => {
                  return <button
                   
                   style={styles}
                   onClick={()=> props.handleClick(item.allAnsId)}
                   key={item.allAnsId}
                    className="questions--button"> {item.answer}</button>;
                })}
      </div>
      {console.log(props.isHeld)}
    </div>
  )  
} 