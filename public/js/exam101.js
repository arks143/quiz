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


async function getUserData() {
    let url = '/userdata';
    try {
        let res = await fetch(url);
        let data = await res.json();
        return data.email;
    } catch (error) {
        console.log(error);
    }
}


async function getScoreTotal() {
    let url = '/getscore';
    try {
        let res = await fetch(url);
        let data = await res.json();
        var i = 1;
        data.forEach(element => {
            i++;
        });
        return i;
    } catch (error) {
        console.log(error);
    }
}


async function checkEntry(usermail) {
    let url = '/check_entry/' + usermail + '';
    try {
        let res = await fetch(url);
        return res;
    } catch (error) {
        console.log(error);
    }
}



function insertData(user_mail, correct, questionid, aid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "_auth_verification=%7B%22nonce%22%3A%22gk45MVicoWYQxrU4S0wtiGsuTal-7-hCa80pOjRz5e4%22%2C%22state%22%3A%22eyJyZXR1cm5UbyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9%22%7D.V26yoqMEXeQWYF_VkG2J3WJA6FeAifkt_Cso_DmaN8I");
    var urlencoded = new URLSearchParams();

    urlencoded.append("email", user_mail);
    urlencoded.append("score", correct);
    urlencoded.append("qid", questionid);
    urlencoded.append("aid", aid);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("/savescore", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


async function saveScore(correct, questions, aid) {
    const user_mail = await getUserData();
    await insertData(user_mail, correct, questions, aid);
}


async function startGame() {
    const entry = await checkEntry(await getUserData());

    if (entry) {
        startButton.innerText = 'Re-Take Test';
        return '';
    }

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
    //const consolee
    console.log(question.qnumber); //load number to frontend
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
    const aid = selectedButton;
    console.log(aid);
    var correct = '';
    var answer_protect = selectedButton.innerText;
    let url = '/answer/' + answer_protect + '';

    try {
        let res = await fetch(url);
        let res2 = await res.json();
        correct = res2.toString();
        if (correct == 'true') {
            console.log(selectedButton);
            // console.log(shuffledQuestions[currentQuestionIndex].answers[0].aid);
            var i = 0;
            Array.from(answerButtonsElement.children).forEach(button => {
                shuffledQuestions[currentQuestionIndex].answers[i].aid;
                selectedButton.dataset.aid = shuffledQuestions[currentQuestionIndex].answers[i].aid
            })
            saveScore(correct, shuffledQuestions[currentQuestionIndex].qnumber, selectedButton.dataset.aid).then(function(result) {});
        }
        if (correct == 'false') {
            correct = 'wrong';
        }
    } catch (error) {
        console.log(error);
    }
    //set data to correct or wrong
    selectedButton.dataset.correct = correct;
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    //disable answer buttons could put onto a function 
    const button = document.getElementById('answer-buttons');
    button.getElementsByClassName('btn')
    const answer_buttons = button.getElementsByClassName('btn');

    for (const element of answer_buttons) {
        element.setAttribute('disabled', '')
    }


    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {

        const score = document.getElementsByClassName('score');
        score[0].innerText = await getScoreTotal();
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

async function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

const questions = [{
        question: 'What is a blockchain?',
        qnumber: 'q1',
        answers: [{
                text: 'A distributed ledger of trasactions',
                aid: '01'
            },
            {
                text: 'A database',
                aid: '02'
            }
        ]
    },
    {
        question: 'What is a Solana',
        qnumber: 'q2',
        answers: [{
                text: 'Fiat Currency',
                aid: '01'
            },
            {
                text: 'An NFT',
                aid: '02'
            },
            {
                text: 'A Blockchain',
                aid: '03'
            },
            {
                text: 'A type of food',
                aid: '04'
            }
        ]
    },
    {
        question: 'What is Crypto used for?',
        qnumber: 'q3',
        answers: [{
                text: 'Transfer of wealth',
                aid: '01'
            },
            {
                text: 'Hacking',
                aid: '02'
            },
            {
                text: 'Google Search',
                aid: '03'
            },
            {
                text: 'IDK',
                aid: '04'
            }
        ]
    },
    {
        question: 'What is a blockchain?',
        qnumber: 'q4',
        answers: [{
                text: 'A 4 distributed ledger of trasactions',
                aid: '01'
            },
            {
                text: 'A database',
                aid: '02'
            }
        ]
    },
    {
        question: 'What is a Solana',
        qnumber: 'q5',
        answers: [{
                text: 'Fiat Currency',
                aid: '01'
            },
            {
                text: 'An NFT',
                aid: '02'
            },
            {
                text: 'A Blockchain',
                aid: '03'
            },
            {
                text: 'A type of food',
                aid: '04'
            }
        ]
    },
    {
        question: 'What is Crypto used for?',
        qnumber: 'q6',
        answers: [{
                text: 'Transfer of wealth',
                aid: '01'
            },
            {
                text: 'Hacking',
                aid: '02'
            },
            {
                text: 'Google Search',
                aid: '03'
            },
            {
                text: 'IDK',
                aid: '04'
            }
        ]
    }

]