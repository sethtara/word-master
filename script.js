const loading = document.querySelector(".loading");
const boardLetter=document.querySelectorAll(".board-letter");

initGame();

function initGame(){
    const apiUrl= 'https://words.dev-apis.com/word-of-the-day';
    let theWord;
    let isValidWord;
    let gameWon=false;
  
    async function getWord(){
        showLoading();
        const response= await fetch(apiUrl);
        const data=await response.json().then(hideLoading());
        theWord= data.word;
    }
    
    async function validateWord(word){
    showLoading();
        const url="https://words.dev-apis.com/validate-word";
        const response= await fetch(url,{method:"POST",body:JSON.stringify({'word':word})});
        const data = await response.json().then(hideLoading());
        isValidWord=  data.validWord;
    }

    getWord();

    let id=0;
    let currentWord="";
    let wordCount=0;

    window.addEventListener("keydown", function(e){
        const userInput=e.key;
        
        if(isLetter(userInput) && currentWord.length<5 && id<30 && !gameWon){
            updateLetter(userInput,id)
            currentWord+=userInput;
            id+=1;
        }
        else if (userInput==="Backspace" && id>wordCount*5 && !gameWon){
            id-=1;
            currentWord=currentWord.substring(0,currentWord.length-1);
            updateLetter(" ",id);

        }
        else if (userInput==="Enter" && id>wordCount*5 && !gameWon ){
            validateWord(currentWord).then( function (){
                if(currentWord===theWord){
                    alert("you win!\n The word is "+theWord);
                    gameWon=true;
                }
                if(isValidWord){
                    updateStyle(wordCount,currentWord,theWord);
                    wordCount+=1;
                    currentWord="";

                    console.log(id);
                    if(wordCount===6 && id===30){
                        
                        alert("you lost!\n The word is "+theWord);
                    }
                }
                else{
                   wrongWord(wordCount);
                    
                }
            })
          
        }
     
    })
}

function updateLetter(letter,id){
    let currentLetterPos="#letter-"+id;
    const letterSpot=document.querySelector(currentLetterPos);
    letterSpot.innerText=letter;
}

function isLetter(value){
    return /^[a-zA-Z]$/.test(value);
}

function showLoading(){
    loading.classList.remove("hidden");
}
function hideLoading(){
    loading.classList.add("hidden");
}

function wrongWord(wordCount){
    setInterval(function (){
        boardLetter.forEach((index,item)=>{
            index.classList.remove("wrongLetter");
        })
    },1000);
    for(let i=wordCount*5;i<wordCount*5+5;i++){
        let letterPos="#letter-"+i;
        const letterDiv=document.querySelector(letterPos);
        letterDiv.classList.add("wrongLetter");
    }
}



function updateStyle(wordCount,currentWord,theWord){
    let wordObj= new Map();
    for(const char of theWord){
        wordObj.set(char,(wordObj.get(char)||0)+1);
    }
    for(let i=0;i<5;i++){
        let n=wordCount*5+i;
        let letterPos="#letter-"+n;
        const letterDiv=document.querySelector(letterPos);
        if(currentWord[i]===theWord[i]){
            letterDiv.classList.add("correctPos");
            wordObj.set(theWord[i],wordObj.get(theWord[i])-1);
        }
        if(theWord.includes(currentWord[i]) && wordObj.get(theWord[i])>0){
            letterDiv.classList.add("correctLetter");
        }
        else{
            letterDiv.classList.add("correctWord");
        }
    }
}

 