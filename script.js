const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionAllowed && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.opening,.intro-grid,.process,.company,.qiwi-grid,.skills,.education,.telegram-invite').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
document.querySelector('.copy').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('abubjazov@mail.ru'); status.textContent = 'Email скопирован'; }
  catch { status.textContent = 'Email: abubjazov@mail.ru'; }
});

// Open each experience once as its toggle crosses the middle of the viewport.
// Native details semantics and keyboard interaction remain available.
const experienceCases = [...document.querySelectorAll('#experience details.case')];
const visitedCases = new WeakSet();
const caseAnimations = new WeakMap();
const centers = new WeakMap();
const desiredStates = new WeakMap();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function setCaseOpen(details, opening) {
  desiredStates.set(details, opening);
  const previous = caseAnimations.get(details);
  const startHeight = details.getBoundingClientRect().height;
  if (previous) previous.cancel();
  const summary = details.querySelector('summary');
  const body = details.querySelector('.case-body');
  details.open = true;
  if (reducedMotion.matches || !details.animate) {
    details.open = opening;
    details.classList.remove('is-animating');
    caseAnimations.delete(details);
    return;
  }
  const targetHeight = opening ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
  details.classList.add('is-animating');
  const animation = details.animate(
    [{height:`${startHeight}px`},{height:`${targetHeight}px`}],
    {duration:420,easing:'cubic-bezier(.22,1,.36,1)'}
  );
  caseAnimations.set(details, animation);
  if (opening) {
    body.getAnimations().forEach(a=>a.cancel());
    body.animate([
      {opacity:0,transform:'translateY(-14px) scale(.985)',clipPath:'inset(0 0 100% 0)'},
      {opacity:1,transform:'translateY(0) scale(1)',clipPath:'inset(0 0 0% 0)'}
    ],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  animation.onfinish = () => {
    details.open = opening;
    details.classList.remove('is-animating');
    caseAnimations.delete(details);
  };
}
experienceCases.forEach(details => {
  const toggle = details.querySelector('.toggle');
  centers.set(details, toggle.getBoundingClientRect().top + toggle.getBoundingClientRect().height / 2);
  details.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    visitedCases.add(details);
    setCaseOpen(details, !(desiredStates.get(details) ?? details.open));
  });
});
let lastScrollY = window.scrollY;
let scrollFramePending = false;
function checkCasePositions() {
  scrollFramePending = false;
  const downward = window.scrollY > lastScrollY;
  const middle = window.innerHeight / 2;
  lastScrollY = window.scrollY;
  experienceCases.forEach(details => {
    const rect = details.querySelector('.toggle').getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const previousCenter = centers.get(details);
    if (downward && !visitedCases.has(details) && previousCenter > middle && center <= middle) {
      visitedCases.add(details);
      setCaseOpen(details, true);
    }
    centers.set(details, center);
  });
}
window.addEventListener('scroll', () => {
  if (!scrollFramePending) { scrollFramePending = true; requestAnimationFrame(checkCasePositions); }
}, {passive:true});
window.addEventListener('resize', () => {
  experienceCases.forEach(details => {
    const rect=details.querySelector('.toggle').getBoundingClientRect();
    centers.set(details,rect.top+rect.height/2);
  });
});
