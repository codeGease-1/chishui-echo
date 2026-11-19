/* Presentation enhancements; the original simulation animation remains untouched. */
const originalRender = render;
const simulationArt = [{"file":"01-tucheng.webp","alt":"山坡上的联络员向队伍传递消息，远处村落与山谷间升起战斗烟尘。"},{"file":"02-yuanhou.webp","alt":"暮色中的河岸，战士、担架和粮袋有序等候，木船靠岸接运。"},{"file":"03-zaxi.webp","alt":"雾中的扎西山村，队伍在石板院落整理行装、分发粮食并短暂休息。"},{"file":"04-erdu.webp","alt":"晨光中的渡口，船工检查木船与绳索，先头人员核对岸边道路。"},{"file":"05-loushan.webp","alt":"娄山关陡峭山路上，队伍沿石阶和侧坡攀行，山口隐在雾里。"},{"file":"06-zunyi.webp","alt":"遵义城内的旧式院落里，医护人员照料伤员，队伍补粮、取水和轮流休息。"},{"file":"07-gouba.webp","alt":"夜里的农屋中，联络员带来消息，几名干部围着油灯和手绘地图核对情况。"},{"file":"08-maotai.webp","alt":"川南山地里，小分队沿开阔山脊活动，主力隐蔽在林间整理行装。"},{"file":"09-sidu.webp","alt":"月色下，几路队伍沿山径抵达渡口，木船接连往返赤水两岸。"},{"file":"10-wujiang.webp","alt":"乌江峡谷岸边，先头人员用竹木和绳索准备渡河工具，后续队伍沿山路接近。"},{"file":"11-guiyang.webp","alt":"贵阳附近的丘陵上，一支小分队向远处城镇活动，主力在林间道路上准备转移。"},{"file":"12-jinsha.webp","alt":"金沙江深峡谷中，船工撑桨往返，两岸人员有序上船、接应和休息。"}];
let lastView = '', homeEntered = false;
const storyHintObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries=>{
  entries.forEach(entry=>entry.target.toggleAttribute('data-story-visible',entry.isIntersecting&&entry.intersectionRatio>=.25));
},{threshold:[0,.25]}) : null;
document.addEventListener('visibilitychange',()=>document.documentElement.toggleAttribute('data-page-hidden',document.hidden));
function softenChange(element, duration = 200, distance = 0) {
  if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  element.animate([{opacity:.65,transform:`translateY(${distance}px)`},{opacity:1,transform:'none'}],{duration,easing:'cubic-bezier(.16,1,.3,1)'});
}
function presentV3() {
  const view = simActive ? 'simulation' : tab;
  document.body.dataset.view = view;
  document.querySelectorAll('.main-nav [data-tab]').forEach(b=>{
    b.toggleAttribute('data-current',b.dataset.tab===tab);
    if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-answer]').forEach(b=>{
    b.disabled=sel!==null;
    if(sel!==null)b.setAttribute('aria-pressed',String(+b.dataset.answer===sel));
  });
  document.querySelectorAll('[data-node]').forEach((b,i)=>{
    b.setAttribute('aria-current',i===active?'step':'false');
    b.querySelector('.tl-dot').textContent=i+1;
  });
  const hero=document.querySelector('.hero-grid');
  if(hero){
    hero.classList.add('hero');hero.dataset.enter='';
    const copy=hero.querySelector('.hero-copy');
    copy.querySelector('h1').after(copy.querySelector('.eyebrow'));
    hero.append(document.querySelector('.home-strip'));
    document.querySelector('.strip-arrow')?.remove();
    if(!homeEntered){softenChange(copy,650,8);homeEntered=true;}
  }
  document.querySelectorAll('.section-head .eyebrow').forEach(e=>e.parentElement.append(e));
  presentRefinements();
  presentSimulationArt();
  // Keep simulation illustrations separate from the original value and meter animations.
  // Only new chapters/questions transition; answering never reanimates the question.
  const key=view==='learn'?`learn:${active}`:view==='game'?`quiz:${qi}:${sel!==null}`:view;
  if(key!==lastView){
    if(view==='learn')softenChange(document.querySelector('.sheet-main'),220);
    else if(view==='game'&&sel!==null)softenChange(document.querySelector('.answer-note'),180);
    else if(view==='game')softenChange(document.querySelector('.quiz-panel'),200);
    // Keep simulation's original value, bar, delta and emphasis animations exclusive.
    lastView=key;
  }
}
function presentSimulationArt() {
  if(!simActive||!simState||simState.awaiting||simState.ended)return;
  const copy=document.querySelector('.event-main>.event-copy'),art=simulationArt[simRecords.length];
  if(!copy||!art)return;
  const intro=document.createElement('div');intro.className='event-scene-intro';
  const figure=document.createElement('figure');figure.className='event-scene-art';
  const image=document.createElement('img');image.src='assets/simulation-scenes/'+art.file;
  image.alt=art.alt;image.width=1672;image.height=941;image.decoding='async';
  const credit=document.createElement('figcaption');credit.textContent='AI 情景插画';
  figure.append(image,credit);copy.before(intro);intro.append(figure,copy);
  const note=document.querySelector('.event-model-note');
  if(note)note.append(' 画面为AI生成的情景插画，非历史影像。');
}
function presentRefinements() {
  storyHintObserver?.disconnect();
  document.querySelectorAll('.story-trigger').forEach(trigger=>{
    let frame=trigger.querySelector('.photo-frame');
    const image=trigger.querySelector('img');
    if(!frame&&image){frame=document.createElement('span');frame.className='photo-frame';image.before(frame);frame.append(image)}
    if(!frame)return;
    const hint=trigger.querySelector('.photo-story-hint');
    if(hint)frame.append(hint);
    if(storyHintObserver)storyHintObserver.observe(frame);else frame.setAttribute('data-story-visible','');
  });
  const chapter=document.querySelector('.route-card>span');
  if(chapter){
    const current=questions[qi].chapter+1;
    chapter.className='quiz-chapter-index';
    chapter.setAttribute('aria-label',`第${current}关，共${quizChapters.length}关`);
    const index=document.createElement('strong'),total=document.createElement('small');
    index.textContent=String(current).padStart(2,'0');total.textContent='/ '+String(quizChapters.length).padStart(2,'0');
    chapter.replaceChildren(index,total);
  }
  document.querySelectorAll('.completion-pillar').forEach(pillar=>{
    if(pillar.querySelector('.completion-pillar-copy'))return;
    const copy=document.createElement('div');copy.className='completion-pillar-copy';
    [...pillar.children].filter(child=>child.tagName!=='HEADER').forEach(child=>copy.append(child));
    pillar.append(copy);
  });
  document.querySelectorAll('.completion-reflection-heading,.completion-answer').forEach(section=>{
    const heading=section.querySelector(':scope>h2'),label=section.querySelector(':scope>p');
    if(heading&&label)heading.after(label);
  });
}
render=function(){originalRender();presentV3();};
const originalOpenStory = openStory;
openStory=function(index){originalOpenStory(index);softenChange(document.querySelector('.story-card'),220,6);};
completionBoot();
