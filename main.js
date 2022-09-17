const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const finalScore = document.getElementById('final-score')
 const blockchain = document.getElementById('blockchain')
let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  finalScore.classList.add('hide')
  blockchain.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

async function selectAnswer(e) {
  const selectedButton = e.target
  // const correct = selectedButton.dataset.correct;
  var correct = '';
  var answer_protect = selectedButton.innerText;
  let url = '/answer/' + answer_protect + '';

    try {
        let res = await fetch(url);
        let res2 = await res.json();
        correct =  res2.toString();
    } catch (error) {
        console.log(error);
    }

    if (correct == 'false'){
        correct = 'wrong';
    }

    selectedButton.dataset.correct = correct;

  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
    finalScore.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct == 'true') {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

const questions = [
  {
    question: 'What is a blockchain?',
    answers: [
      { text: 'A distributed ledger of trasactions' },
      { text: 'A database'}
    ]
  },
  {
    question: 'What is a Solana',
    answers: [
      { text: 'Fiat Currency'},
      { text: 'An NFT'},
      { text: 'A Blockchain' },
      { text: 'A type of food'}
    ]
  },
  {
    question: 'What is Crypto used for?',
    answers: [
      { text: 'Transfer of wealth' },
      { text: 'Hacking' },
      { text: 'Google Search'},
      { text: 'IDK'}
    ]
  }
  // {
  //   question: 'What is 4 * 2?',
  //   answers: [
  //     { text: '6', correct: false },
  //     { text: '8', correct: true }
  //   ]
  // }
]