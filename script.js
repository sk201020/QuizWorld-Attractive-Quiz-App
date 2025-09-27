// Question data
const languages={HTML:[{q:"What does HTML stand for?",options:["Hyperlink and Text Markup Language","HyperText Markup Language","Home Tool Markup Language","Hyper Tool Multi Language"],answer:1,explanation:"HTML = HyperText Markup Language."},{q:"Which tag is used for a paragraph?",options:["p","para","paragraph","pg"],answer:0,explanation:"p element."},{q:"HTML headings?",options:["head","h1-h6","heading","title"],answer:1,explanation:"Use h1-h6."},{q:"Which attribute adds a link?",options:["href","src","link","ref"],answer:0,explanation:"Use href."},{q:"HTML unordered list tag?",options:["ul","ol","li","list"],answer:0,explanation:"<ul> defines unordered list."}],
CSS:[{q:"CSS stands for?",options:["Cascading Style Sheets","Computer Style Sheets","Creative Style Sheets","Colorful Style Sheets"],answer:0,explanation:"CSS = Cascading Style Sheets."},{q:"Change text color?",options:["color","font-color","text-color","background-color"],answer:0,explanation:"Use 'color'."},{q:"Center elements?",options:["align:center","text-align:center","center-align","justify:center"],answer:1,explanation:"text-align:center."},{q:"Selector for id?",options:[".","#","*","$"],answer:1,explanation:"Use # for id."},{q:"Selector for class?",options:[".","#","*","$"],answer:0,explanation:"Use . for class."}],
JavaScript:[{q:"Language runs in browser?",options:["Java","C","Python","JavaScript"],answer:3,explanation:"JavaScript runs in browser."},{q:"Declare variable?",options:["var x;","v x;","variable x;","let x;"],answer:3,explanation:"Use var or let."},{q:"Add event listener?",options:["addEvent()","listen()","addEventListener()","attachEvent()"],answer:2,explanation:"Use addEventListener."},{q:"Strict equality symbol?",options:["==","===","!=","="],answer:1,explanation:"Use ===."},{q:"JS file extension?",options:[".js",".java",".jsx",".j"],answer:0,explanation:".js is correct."}],
Java:[{q:"Java is?",options:["Platform independent","Dependent","Database","OS"],answer:0,explanation:"Platform independent."},{q:"Main method?",options:["public static void main(String[] args)","main()","void main(String[] args)","static main()"],answer:0,explanation:"Use public static void main."},{q:"Keyword for class?",options:["class","Class","CLASS","cls"],answer:0,explanation:"Use 'class'."},{q:"JVM?",options:["Java Virtual Machine","Java Verified Method","Java Variable Method","None"],answer:0,explanation:"Java Virtual Machine."},{q:"Java package syntax?",options:["import package;","include package;","package;","use package;"],answer:0,explanation:"Use import."}],
Python:[{q:"Python is?",options:["High-level language","Low-level","OS","Database"],answer:0,explanation:"Python is high-level."},{q:"Python file extension?",options:[".py",".java",".js",".txt"],answer:0,explanation:".py is correct."},{q:"Print to console?",options:["console.log()","print()","echo()","System.out.println()"],answer:1,explanation:"Use print()."},{q:"Python loop?",options:["for","foreach","loop","repeat"],answer:0,explanation:"Use for loop."},{q:"Define function?",options:["def func():","function func()","fun func():","func()"],answer:0,explanation:"Use def keyword."}],
SQL:[{q:"SQL stands for?",options:["Structured Query Language","Simple Query Language","Standard Query Language","Structured Question Language"],answer:0,explanation:"SQL = Structured Query Language."},{q:"Select all data?",options:["SELECT * FROM table","GET ALL FROM table","SHOW table","FETCH table"],answer:0,explanation:"SELECT * FROM table."},{q:"Where clause?",options:["WHERE","IF","FILTER","WHEN"],answer:0,explanation:"Use WHERE."},{q:"SQL delete?",options:["DELETE FROM table","REMOVE table","DROP table","DEL table"],answer:0,explanation:"DELETE FROM."},{q:"SQL insert?",options:["INSERT INTO table VALUES()","ADD table","PUT INTO","INSERT VALUES"],answer:0,explanation:"INSERT INTO."}]
};

// Variables
let currentLang='', questionsArr=[], current=0, score=0, timeLeft=15, timerId=null, userAnswers=[];
const welcomePage=document.getElementById('welcome');
const langPage=document.getElementById('languagePage');
const quizPage=document.getElementById('quizPage');
const resultPage=document.getElementById('resultPage');
const qNum=document.getElementById('qNum');
const qTotal=document.getElementById('qTotal');
const questionText=document.getElementById('questionText');
const optionsEl=document.getElementById('options');
const btnNext=document.getElementById('btnNext');
const btnSkip=document.getElementById('btnSkip');
const timerEl=document.getElementById('timer');
const finalScore=document.getElementById('finalScore');
const finalMessage=document.getElementById('finalMessage');
const btnRestart=document.getElementById('btnRestart');
const btnReview=document.getElementById('btnReview');
const quizTitle=document.getElementById('quizTitle');
const applause=document.getElementById('applause');
const questionArea=document.getElementById('questionArea');
const languageButtons=document.querySelectorAll('#languageOptions button');
const btnHome=document.getElementById('btnHome');
const btnMenu=document.getElementById('btnMenu');

// Show page function
function showPage(showPageEl){
  [welcomePage, langPage, quizPage, resultPage].forEach(p=>p.classList.remove('show'));
  showPageEl.classList.add('show');
}

document.getElementById('startBtn').addEventListener('click',()=>showPage(langPage));

languageButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    currentLang=btn.dataset.lang;
    questionsArr=[...languages[currentLang]];
    shuffleArray(questionsArr);
    showPage(quizPage);
    quizTitle.textContent=currentLang+" Quiz";
    qTotal.textContent=questionsArr.length;
    current=0; score=0; userAnswers=[];
    showQuestion();
  });
});

btnHome.addEventListener('click',()=>{showPage(welcomePage); stopTimer();});
btnMenu.addEventListener('click',()=>{showPage(langPage); stopTimer();});

// Show question
function showQuestion(){const q=questionsArr[current];
  qNum.textContent=current+1;
  questionText.textContent=q.q;
  optionsEl.innerHTML='';
  questionArea.classList.remove('show');
  const opts=q.options.map((opt,i)=>({opt,i})).sort(()=>Math.random()-0.5);
  opts.forEach(({opt,i},idx)=>{
    const btn=document.createElement('button');
    btn.className='option';
    btn.setAttribute('data-index',i);
    btn.innerHTML=`<div class="opt-letter">${String.fromCharCode(65+idx)}</div><div style="flex:1;text-align:left">${opt}</div>`;
    btn.addEventListener('click',onOptionClick);
    optionsEl.appendChild(btn);
  });
  btnNext.disabled=true;
  btnSkip.disabled=false;
  setTimeout(()=>{questionArea.classList.add('show');},50);
  startTimer();
}

// Option click
function onOptionClick(e){
  const target=e.currentTarget;
  if(target.classList.contains('disabled')) return;
  const chosenIndex=Number(target.getAttribute('data-index'));
  const correctIndex=questionsArr[current].answer;
  Array.from(optionsEl.children).forEach(btn=>{
    btn.classList.add('disabled');
    const i=Number(btn.getAttribute('data-index'));
    if(i===correctIndex) btn.classList.add('correct');
    if(i===chosenIndex && i!==correctIndex) btn.classList.add('wrong');
  });
  if(chosenIndex===correctIndex) score++;
  userAnswers.push({q:questionsArr[current].q,chosen:chosenIndex,correct:correctIndex,explanation:questionsArr[current].explanation});
  btnNext.disabled=false;
  btnSkip.disabled=true;
}

btnNext.addEventListener('click',nextQuestion);
btnSkip.addEventListener('click',()=>{userAnswers.push({q:questionsArr[current].q,chosen:null,correct:questionsArr[current].answer,explanation:questionsArr[current].explanation}); nextQuestion();});

function nextQuestion(){stopTimer(); current++; if(current>=questionsArr.length) return showResult(); showQuestion();}
function startTimer(){timeLeft=15; updateTimer(); timerId=setInterval(()=>{timeLeft--; updateTimer(); if(timeLeft<=0){userAnswers.push({q:questionsArr[current].q,chosen:null,correct:questionsArr[current].answer,explanation:questionsArr[current].explanation}); clearInterval(timerId); nextQuestion();}},1000);}
function stopTimer(){clearInterval(timerId);}
function updateTimer(){timerEl.textContent='00:'+(timeLeft<10?'0':'')+timeLeft;}

// Show result
function showResult(){
  showPage(resultPage);
  finalScore.textContent=`${score}/${questionsArr.length}`;
  finalMessage.textContent = score===questionsArr.length 
      ? "🔥 Perfect Score! You nailed every question! 🏆🎉" 
      : `Don't give up! You're born to win, just try it again! 👍`;
  if(score>=questionsArr.length/2){
    applause.play();
    confetti({particleCount:150,spread:100,origin:{y:0.6}});
    setTimeout(()=>confetti({particleCount:100,spread:120,origin:{y:0.4}}),400);
  }
}

// Restart
btnRestart.addEventListener('click',()=>showPage(langPage));
btnReview.addEventListener('click', showReview);

// Review page
function showReview(){
  showPage(quizPage);
  quizTitle.textContent = "Review Answers";
  optionsEl.innerHTML = '';
  questionArea.classList.remove('show');

  const reviewContainer=document.createElement('div');
  reviewContainer.className='review-container';

  userAnswers.forEach((ans, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question-area show';

    const qText = document.createElement('div');
    qText.className = 'question';
    qText.textContent = (idx+1) + '. ' + ans.q;
    qDiv.appendChild(qText);

    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';
    const originalOptions = languages[currentLang].find(q=>q.q===ans.q).options;

    originalOptions.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option disabled';
      btn.innerHTML = `<div class="opt-letter">${String.fromCharCode(65+i)}</div><div style="flex:1;text-align:left">${opt}</div>`;
      if(i === ans.correct) btn.classList.add('correct');
      if(ans.chosen === i && ans.chosen !== ans.correct) btn.classList.add('wrong');
      optsDiv.appendChild(btn);
    });

    qDiv.appendChild(optsDiv);

    const expDiv = document.createElement('div');
    expDiv.style.marginTop = '6px';
    expDiv.style.fontWeight = '600';
    expDiv.style.color = '#555';
    expDiv.textContent = "Explanation: " + ans.explanation;
    qDiv.appendChild(expDiv);

    reviewContainer.appendChild(qDiv);
  });

  optionsEl.appendChild(reviewContainer);
  setTimeout(()=>{questionArea.classList.add('show');},50);
}

function shuffleArray(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}}