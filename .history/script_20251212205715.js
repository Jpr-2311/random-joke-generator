

const FALLBACK = [
"Why did the scarecrow win an award? Because he was outstanding in his field.",
"I told my computer I needed a break, and now it won't stop sending me Kit Kat ads.",
"Why do programmers prefer dark mode? Because light attracts bugs.",
"I changed my password to 'incorrect'. So whenever I forget it, the computer will say 'Your password is incorrect.'"
];


async function fetchJoke(){
showLoading(true);
try{
const res = await fetch('https://official-joke-api.appspot.com/random_joke', {cache:'no-store'});
if(!res.ok) throw new Error('API error');
const data = await res.json();
const text = data.setup ? `${data.setup} ${data.punchline || ''}` : (data.joke || JSON.stringify(data));
showJoke(text);
sourceEl.textContent = 'Source: Official Joke API';
}catch(err){
const text = FALLBACK[Math.floor(Math.random()*FALLBACK.length)];
showJoke(text);
sourceEl.textContent = 'Source: Local fallback';
}
}


function showLoading(isLoading){
if(isLoading){
jokeEl.style.opacity = '0.7';
jokeEl.textContent = 'Fetching a fresh joke...';
} else {
jokeEl.style.opacity = '1';
}
}


function showJoke(text){
// subtle entrance animation using simple style changes
jokeEl.style.transition = 'none';
jokeEl.style.opacity = '0';
jokeEl.style.transform = 'translateY(6px)';
requestAnimationFrame(()=>{
requestAnimationFrame(()=>{
jokeEl.textContent = text;
jokeEl.style.transition = 'transform .32s ease, opacity .32s ease';
jokeEl.style.opacity = '1';
jokeEl.style.transform = 'translateY(0)';
});
});
}


newJokeBtn.addEventListener('click', fetchJoke);
newJokeBtn.addEventListener('keyup', (e)=>{ if(e.key === 'Enter' || e.key === ' ') fetchJoke(); });


copyBtn.addEventListener('click', async ()=>{
try{
await navigator.clipboard.writeText(jokeEl.textContent || '');
copyBtn.textContent = 'Copied!';
setTimeout(()=> copyBtn.textContent = 'Copy', 1400);
}catch(e){
copyBtn.textContent = 'Unable to copy';
setTimeout(()=> copyBtn.textContent = 'Copy', 1400);
}
});


// load one joke on start
window.addEventListener('load', fetchJoke);