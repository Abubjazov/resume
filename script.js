const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionAllowed && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.opening,.intro-grid,.process,.company,.skills,.education,.telegram-invite').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
document.querySelector('.copy').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('abubjazov@mail.ru'); status.textContent = 'Email скопирован'; }
  catch { status.textContent = 'Email: abubjazov@mail.ru'; }
});

// Native details semantics and keyboard interaction remain available.
const experienceCases = [...document.querySelectorAll('#experience details.case')];
const caseAnimations = new WeakMap();
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
  details.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    setCaseOpen(details, !(desiredStates.get(details) ?? details.open));
  });
});
