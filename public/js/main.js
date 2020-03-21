const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

const gameState = {
    quizzes:[],
    currentIndex:0,
    numberOfCorrects:0
};

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const resultElement = document.getElementById('result');
const restartElement = document.getElementById('restart-button');

window.addEventListener('load',(event)=>{
    fetchQuizData();
});

const fetchQuizData = async () =>{
    questionElement.textContent = 'Now Loading...';
    resultElement.textContent = '';
    restartElement.hidden = true;

    try{
        const response = await fetch(API_URL);
        const data = await response.json();
        gameState.quizzes = data.results;
        gameState.currentIndex = 0;
        gameState.numberOfCorrects = 0;
        setNextQuiz();
    }catch(error){
        alert(`読み込み失敗...${error.message}`);
    }
};

const setNextQuiz = () =>{
    questionElement.textContent = '';
    removeAllAnswers();

    if(gameState.currentIndex<gameState.quizzes.length){
        const quiz = gameState.quizzes[gameState.currentIndex];
        makeQuiz(quiz);
    }else{
        finishQuiz();
    }
};

const finishQuiz = () =>{
    resultElement.textContent = `${gameState.numberOfCorrects}/${gameState.quizzes.length} corrects!`;
    restartElement.hidden = false;
};

const removeAllAnswers = () => {
    while(answersElement.firstChild){
        answersElement.removeChild(answersElement.firstChild);
    }
};

const makeQuiz = (quiz) =>{
    const answers = buildAnswers(quiz);

    questionElement.textContent = unescapeHTML(quiz.question);
    // questionElement.textContent = quiz.question;

    answers.forEach((answer)=>{
        const liElement = document.createElement('li');
        liElement.className = 'button';
        liElement.textContent = unescapeHTML(answer);
        // liElement.textContent = answer;
        answersElement.appendChild(liElement);

        liElement.addEventListener('click',(event)=>{
            unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
            // unescapedCorrectAnswer = quiz.correct_answer;
            if(event.target.textContent === unescapedCorrectAnswer){
                gameState.numberOfCorrects++;
                alert('Correct Answer!');
            }else{
                alert('Wrong Answer!');
            }
            gameState.currentIndex++;
            setNextQuiz();
        });
    });
};

const buildAnswers = (quiz) =>{
    const answers = [
        quiz.correct_answer,
        ...quiz.incorrect_answers
    ];

    const shuffledAnswers = shuffle(answers);

    return shuffledAnswers;
}

const shuffle = (answers) => {
    const copiedAnswers = answers.slice();
    for (let i = copiedAnswers.length-1;i>=0;i--){
        const rand = Math.floor(Math.random()*(i+1));
        [copiedAnswers[i],copiedAnswers[rand]] = [copiedAnswers[rand],copiedAnswers[i]];
    }

    return copiedAnswers;
}

const unescapeHTML = (str) =>{
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                       .replace(/>/g,"&gt;")
                       .replace(/ /g, "&nbsp;")
                       .replace(/\r/g, "&#13;")
                       .replace(/\n/g, "&#10;");

    return div.textContent || div.innerText;
  };