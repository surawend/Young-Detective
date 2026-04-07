const socket = io();
const chatContainer = document.getElementById("chat-container");
const questionContainer = document.getElementById("question-container");
const voteContainer = document.getElementById("vote-container");
const resultContainer = document.getElementById("result-container");

let role = "";

socket.emit("join-game");
socket.on("role-assigned", r => {
  role = r;
  chatContainer.innerHTML = `<div class="message left">You are ${role}</div>`;
  // ตัวอย่างข้อความ chat
  const chats = [
    {text:"Hello! How was your day?", side:"left"},
    {text:"Pretty good, you?", side:"right"},
    {text:"I was thinking about Alex.", side:"left"}
  ];
  chats.forEach(c => {
    const div = document.createElement("div");
    div.className = "message " + c.side;
    div.innerText = c.text;
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // ตัวอย่างคำถาม 5 ข้อ
  questionContainer.innerHTML = `<p>Question 1: What was discussed?</p>
    <button onclick="submitHP(1)">1</button>
    <button onclick="submitHP(0)">0</button>`;
});

function submitHP(score){
  socket.emit("submit-hp", score);
  voteContainer.innerHTML = `<p>Vote who is the killer:</p>
    <button onclick="vote('Jamie')">Jamie</button>
    <button onclick="vote('Taylor')">Taylor</button>
    <button onclick="vote('Chris')">Chris</button>
    <button onclick="vote('Morgan')">Morgan</button>`;
}

function vote(name){
  socket.emit("vote", name);
}

socket.on("game-result", data=>{
  resultContainer.innerHTML = `<p>Killer: ${data.killer}</p>
  <p>Clues:</p><ul>${data.clues.map(c=>"<li>"+c+"</li>").join("")}</ul>
  <p>Votes:</p><pre>${JSON.stringify(data.votes,null,2)}</pre>
  <p>HP Score:</p><pre>${JSON.stringify(data.hp,null,2)}</pre>`;
});
