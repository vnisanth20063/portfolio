/* V NISANTH — cinematic portfolio / Vanilla JS + Anime.js */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

document.body.classList.add("is-locked");

const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- INTRO ---------------- */
function initIntro(){
  const intro = $("#intro");
  const title = $("#konnichiwa");
  const word = "KONNICHIWA";
  title.innerHTML = [...word].map(c => `<span>${c}</span>`).join("");

  if(reduceMotion){
    intro.style.display = "none";
    document.body.classList.remove("is-locked");
    return;
  }

  anime({
    targets:"#konnichiwa span",
    opacity:[0,1],
    translateY:[30,0],
    rotateX:[-90,0],
    delay:anime.stagger(90),
    duration:900,
    easing:"easeOutExpo"
  });

  anime({
    targets:".intro-line",
    width:["0%","100%"],
    delay:700,
    duration:1300,
    easing:"easeInOutQuart"
  });

  const enter = () => {
    anime.timeline({
      complete:()=>{
        intro.style.display="none";
        document.body.classList.remove("is-locked");
        initReveals();
      }
    })
    .add({targets:".intro h1",scale:[1,1.12],opacity:[1,0],duration:500,easing:"easeInQuad"})
    .add({targets:".intro",opacity:[1,0],duration:700,easing:"easeInOutQuad"});
    window.removeEventListener("keydown", enter);
    intro.removeEventListener("click", enter);
  };
  window.addEventListener("keydown", e => { if(e.key==="Enter" || e.key===" ") enter(); });
  intro.addEventListener("click", enter, {once:true});

  // Auto-continue after a short cinematic pause.
  setTimeout(enter, 2800);
}

/* ---------------- CURSOR ---------------- */
function initCursor(){
  if(window.matchMedia("(pointer:coarse)").matches) return;
  const dot = $(".cursor-dot"), ring = $(".cursor-ring");
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY});
  function tick(){
    dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    rx += (mx-rx)*.14; ry += (my-ry)*.14;
    ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  $$("a,.skill-node,.project-item,.dream-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>ring.classList.add("big"));
    el.addEventListener("mouseleave",()=>ring.classList.remove("big"));
  });
}

/* ---------------- NAVIGATION ---------------- */
function initNavigation(){
  const links=$$(".nav-links a");
  const sections=$$("main .chapter[id]");
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));
        animateChapter(entry.target);
      }
    });
  },{threshold:.45});
  sections.forEach(s=>io.observe(s));

  links.forEach(a=>{
    a.addEventListener("click",e=>{
      const target=$(a.getAttribute("href"));
      if(!target)return;
      e.preventDefault();
      target.scrollIntoView({behavior:reduceMotion?"auto":"smooth"});
    });
  });
}

/* ---------------- REVEALS ---------------- */
function initReveals(root=document){
  const els=$$(".reveal",root);
  if(reduceMotion){els.forEach(e=>{e.style.opacity=1;e.style.transform="none"});return}
  els.forEach((el,i)=>{
    anime({
      targets:el,
      opacity:[0,1],
      translateY:[25,0],
      delay:i*45,
      duration:900,
      easing:"easeOutExpo"
    });
  });
}

/* ---------------- SKILLS ---------------- */
const skills=[
  ["Python","Primary language for AI, automation and backend development."],
  ["RAG","Retrieval-Augmented Generation for connecting LLMs with external knowledge."],
  ["LLM","Working with large language model concepts and APIs."],
  ["AI Agents","Building task-oriented systems around tools and model capabilities."],
  ["Machine Learning","Foundational machine-learning concepts and workflows."],
  ["LangChain","Framework used in the user's LLM/RAG projects."],
  ["FastAPI","Python framework used to build APIs and backend services."],
  ["Pandas","Data manipulation and analysis."],
  ["NumPy","Numerical computing and data operations."],
  ["EDA","Exploratory Data Analysis for understanding datasets."],
  ["Data Visualization","Communicating data through visual analysis."],
  ["MySQL","Relational database technology used in projects/learning."],
  ["n8n Automations","Workflow automation and integration."],
  ["Streamlit","Rapid data and AI application interfaces."],
  ["HTML","Semantic structure for web pages."],
  ["CSS","Styling, layout and visual presentation."]
];

function initSkills(){
  const wrap=$("#skillNodes");
  const positions=[
    [18,17],[37,8],[61,10],[82,20],[10,39],[28,31],[72,31],[91,40],
    [8,62],[28,67],[73,62],[93,64],[21,86],[42,92],[62,87],[82,83]
  ];
  skills.forEach((item,i)=>{
    const el=document.createElement("button");
    el.className="skill-node magnetic";
    el.type="button";
    el.textContent=item[0];
    el.style.left=positions[i][0]+"%";
    el.style.top=positions[i][1]+"%";
    el.addEventListener("mouseenter",()=>showSkill(i,el));
    el.addEventListener("focus",()=>showSkill(i,el));
    el.addEventListener("click",()=>showSkill(i,el));
    wrap.appendChild(el);
  });
  if(!reduceMotion){
    anime({
      targets:".skill-node",
      translateY:()=>anime.random(-7,7),
      direction:"alternate",loop:true,duration:2200,
      delay:anime.stagger(80),easing:"easeInOutSine"
    });
  }
}
function showSkill(i,el){
  $$(".skill-node").forEach(n=>n.classList.remove("active"));
  el.classList.add("active");
  const d=$("#skillDetail");
  d.innerHTML=`<span>SKILL ${String(i+1).padStart(2,"0")}</span><strong>${skills[i][0]}</strong><p>${skills[i][1]}</p>`;
  if(!reduceMotion) anime({targets:d,translateX:[12,0],opacity:[.2,1],duration:450,easing:"easeOutExpo"});
}

/* ---------------- PROJECTS ---------------- */
const projects=[
  {title:"AI Quiz Generator",tech:["FastAPI","LangChain","Groq","PostgreSQL","Pydantic","Streamlit","Docker"],desc:"AI-powered quiz generation application with a FastAPI backend and Streamlit interface.",repo:"https://github.com/vnisanth20063/AI_Quiz__generator",demo:"https://ai-quiz-generator-2-27m1.onrender.com"},
  {title:"Health Report Analyzer",tech:["Streamlit","LangChain","Groq","LLM"],desc:"LLM-based health report analysis and diet-plan generation application.",repo:"",demo:""},
  {title:"DigiSailor RAG Assistant",tech:["RAG","PyMuPDF","HuggingFace","ChromaDB","Groq","LangChain"],desc:"RAG assistant using PDF processing, embeddings and ChromaDB across HR, Medical, Legal and Support domains.",repo:"",demo:""},
  {title:"Telegram RAG Inventory Agent",tech:["FastAPI","Telegram","PostgreSQL","LangGraph","Groq","Tool Calling"],desc:"Telegram inventory assistant with inventory, low-stock detection and replenishment tools.",repo:"",demo:""},
  {title:"PhonePe Analytics Dashboard",tech:["Streamlit","Data Analysis","Data Visualization"],desc:"Interactive PhonePe analytics dashboard built with Streamlit.",repo:"",demo:"https://phonepeanalytics.streamlit.app"},
  {title:"Hospital Token System Agent",tech:["Agent","Automation","Python"],desc:"Hospital token system agent project.",repo:"https://github.com/vincy200631/Hospital_token_system-Agent-",demo:""}
];

function initProjects(){
  const list=$("#projectList");
  projects.forEach((p,i)=>{
    const el=document.createElement("article");
    el.className="project-item";
    el.tabIndex=0;
    el.innerHTML=`<small>MISSION ${String(i+1).padStart(2,"0")}</small><h3>${p.title}</h3><p>${p.desc}</p>`;
    el.addEventListener("mouseenter",()=>showProject(i,el));
    el.addEventListener("focus",()=>showProject(i,el));
    el.addEventListener("click",()=>showProject(i,el));
    list.appendChild(el);
  });
  showProject(0,list.firstElementChild);
}
function showProject(i,el){
  $$(".project-item").forEach(n=>n.classList.remove("active"));
  el.classList.add("active");
  const p=projects[i], ins=$("#projectInspector");
  ins.querySelector(".inspector-index").textContent=`PROJECT ${String(i+1).padStart(2,"0")}`;
  ins.querySelector("h3").textContent=p.title;
  ins.querySelector("p").textContent=p.desc;
  ins.querySelector(".inspector-tags").innerHTML=p.tech.map(t=>`<span>${t}</span>`).join("");
  const actions=ins.querySelector(".inspector-actions");
  actions.innerHTML="";
  if(p.repo) actions.innerHTML+=`<a class="mini-btn magnetic" target="_blank" rel="noopener" href="${p.repo}">VIEW REPOSITORY ↗</a>`;
  else actions.innerHTML+=`<span class="mini-btn">ADD_GITHUB_LINK_HERE</span>`;
  if(p.demo) actions.innerHTML+=`<a class="mini-btn magnetic" target="_blank" rel="noopener" href="${p.demo}">VIEW DEMO ↗</a>`;
  if(!reduceMotion) anime({targets:ins,opacity:[.3,1],translateY:[8,0],duration:350,easing:"easeOutQuad"});
}

/* ---------------- CHAPTER MOTION ---------------- */
const played=new Set();
function animateChapter(section){
  if(played.has(section.id) || reduceMotion){return}
  played.add(section.id);
  if(section.id==="skills"){
    anime({targets:".skills-character-wrap",scale:[.92,1],opacity:[0,1],duration:1100,easing:"easeOutExpo"});
    anime({targets:".skill-node",scale:[0,1],opacity:[0,1],delay:anime.stagger(70),duration:650,easing:"easeOutBack"});
  }
  if(section.id==="projects"){
    anime({targets:".projects-character",translateY:[35,0],opacity:[0,1],duration:1000,easing:"easeOutExpo"});
    anime({targets:".project-item",scale:[.85,1],opacity:[0,1],delay:anime.stagger(80),duration:700,easing:"easeOutBack"});
  }
  if(section.id==="experience"){
    anime({targets:[".chain-left",".chain-right"],translateX:[-80,0],opacity:[0,.75],duration:1100,easing:"easeOutExpo"});
    anime({targets:".experience-rocks",translateY:[80,0],opacity:[0,1],duration:1000,easing:"easeOutExpo"});
  }
  if(section.id==="team"){
    anime({targets:".team-words span",translateX:[30,0],opacity:[0,1],delay:anime.stagger(100),duration:700,easing:"easeOutExpo"});
  }
  if(section.id==="dreams"){
    anime({targets:".dream-car",scale:[1.05,1],opacity:[0,1],duration:1400,easing:"easeOutExpo"});
    anime({targets:".dream-card",translateX:[35,0],opacity:[0,1],delay:anime.stagger(100),duration:700,easing:"easeOutExpo"});
  }
  initReveals(section);
}

/* ---------------- MOUSE PARALLAX ---------------- */
function initParallax(){
  if(matchMedia("(pointer:coarse)").matches || reduceMotion)return;
  const heroOrbits=$$(".hero-orbit");
  addEventListener("mousemove",e=>{
    const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
    anime({targets:heroOrbits,translateX:x*25,translateY:y*20,duration:700,easing:"easeOutQuad"});
    anime({targets:".dream-copy,.dream-cards",translateX:x*7,translateY:y*5,duration:900,easing:"easeOutQuad"});
  });
}

/* ---------------- INITIAL HERO ---------------- */
function initHero(){
  if(reduceMotion){initReveals($("#home"));return}
  anime.timeline()
    .add({targets:"#home .eyebrow",opacity:[0,1],translateY:[15,0],duration:650,easing:"easeOutExpo"})
    .add({targets:".hero-title span",opacity:[0,1],translateX:[-35,0],delay:anime.stagger(100),duration:850,easing:"easeOutExpo"},"-=300")
    .add({targets:".hero-role,.hero-description,.hero-actions",opacity:[0,1],translateY:[20,0],delay:anime.stagger(90),duration:700,easing:"easeOutExpo"},"-=350")
    .add({targets:".hero-photo-frame",opacity:[0,1],scale:[.94,1],rotate:[-2,2],duration:1000,easing:"easeOutExpo"},"-=600");
}

/* ---------------- GLOBAL ---------------- */
initIntro();
initCursor();
initNavigation();
initSkills();
initProjects();
initParallax();
initHero();

window.addEventListener("load",()=>{
  // Optional real photo: put assets/images/hero-photo.jpg in the project.
  const box=$("#heroPhoto");
  const img=new Image();
  img.onload=()=>{
    box.innerHTML="";
    img.alt="V Nisanth portrait";
    img.style.cssText="width:100%;height:100%;object-fit:cover;object-position:center;";
    box.appendChild(img);
  };
  img.src="assets/images/hero-photo.jpg";
  img.onerror=()=>{}; // Keep the editable placeholder if no photo is supplied.
});

/* Keyboard chapter navigation */
document.addEventListener("keydown",e=>{
  if(["INPUT","TEXTAREA"].includes(document.activeElement.tagName))return;
  const ids=["home","about","skills","projects","experience","team","dreams"];
  const current=ids.findIndex(id=>{
    const r=$("#"+id).getBoundingClientRect();
    return r.top<=innerHeight*.45 && r.bottom>=innerHeight*.45;
  });
  if(e.key==="ArrowDown" && current<ids.length-1) $("#"+ids[current+1]).scrollIntoView({behavior:"smooth"});
  if(e.key==="ArrowUp" && current>0) $("#"+ids[current-1]).scrollIntoView({behavior:"smooth"});
});
