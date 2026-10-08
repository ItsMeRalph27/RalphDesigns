const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

// Active navigation + scroll state
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${entry.target.id}`
      );
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const updateNav = () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
};
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// Scroll reveal with subtle stagger
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document
  .querySelectorAll(".skill-card, .stat-card, .portfolio-picture, .service-grid article, .timeline article, .edu-grid > div")
  .forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
    revealObserver.observe(element);
  });

// Animated skill/stat counters
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.count);
    const duration = 1200;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    observer.unobserve(element);
  });
}, { threshold: 0.7 });

counters.forEach((counter) => counterObserver.observe(counter));

// Final interaction polish
(() => {
  const progress = document.querySelector('.scroll-progress span');
  const glow = document.querySelector('.cursor-glow');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, {passive:true});
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = '1';
    }, {passive:true});
    window.addEventListener('pointerleave', () => glow.style.opacity = '0');
  }

})();


// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
if (menuToggle && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
}

// Lightweight magnetic buttons on precise pointers only.
if (window.matchMedia("(pointer:fine) and (prefers-reduced-motion: no-preference)").matches) {
  document.querySelectorAll(".magnetic").forEach(button => {
    button.addEventListener("pointermove", e => {
      const r = button.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.08;
      const y = (e.clientY - r.top - r.height / 2) * 0.08;
      button.style.transform = `translate(${x}px,${y}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

// Subtle card tilt for project previews.
if (window.matchMedia("(pointer:fine) and (prefers-reduced-motion: no-preference)").matches) {
  document.querySelectorAll(".project").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -2.5;
      const ry = ((e.clientX - r.left) / r.width - .5) * 2.5;
      card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}


/* =========================================================
   FULL-PAGE GRAPHIC DESIGNER TOOL / GEOMETRIC MOTION
   Shooting lines, geometric particles, pen-tool nodes and vector marks.
   ========================================================= */
(() => {
  const canvas = document.getElementById("designerCanvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let w=0,h=0,dpr=1,last=0;
  const palette=["rgba(201,255,55,.34)","rgba(255,255,255,.18)","rgba(126,89,255,.28)"];
  const shapes=[];
  const rand=(a,b)=>a+Math.random()*(b-a);
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0)};
  const makeShape=()=>({x:rand(0,w),y:rand(0,h),s:rand(10,46),a:rand(0,Math.PI*2),r:rand(-.015,.015),vx:rand(-.16,.16),vy:rand(.08,.34),type:Math.floor(rand(0,6)),alpha:rand(.2,.7),color:palette[Math.floor(rand(0,palette.length))]});
  const resetShape=(o,fromTop=false)=>{o.x=rand(0,w);o.y=fromTop?rand(-80,-10):rand(0,h);o.s=rand(10,46);o.a=rand(0,Math.PI*2);o.vx=rand(-.2,.2);o.vy=rand(.1,.45);o.type=Math.floor(rand(0,6));o.color=palette[Math.floor(rand(0,palette.length))]};
  for(let i=0;i<Math.min(42,Math.max(22,Math.floor(innerWidth/35)));i++)shapes.push(makeShape());
  const drawPen=(x,y,s,alpha,rot)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=alpha;ctx.strokeStyle="rgba(201,255,55,.5)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-s*.22,-s*.42);ctx.lineTo(s*.25,-s*.05);ctx.lineTo(-s*.02,s*.44);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.22,-s*.42);ctx.lineTo(-s*.03,s*.04);ctx.lineTo(s*.25,-s*.05);ctx.stroke();ctx.fillStyle="rgba(201,255,55,.75)";[[ -s*.22,-s*.42],[s*.25,-s*.05],[-s*.02,s*.44]].forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],2.3,0,Math.PI*2);ctx.fill()});ctx.restore()};
  const drawShape=o=>{ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.a);ctx.globalAlpha=o.alpha;ctx.strokeStyle=o.color;ctx.lineWidth=1;ctx.beginPath();if(o.type===0){ctx.rect(-o.s/2,-o.s/2,o.s,o.s)}else if(o.type===1){ctx.moveTo(0,-o.s/2);ctx.lineTo(o.s/2,o.s/2);ctx.lineTo(-o.s/2,o.s/2);ctx.closePath()}else if(o.type===2){ctx.arc(0,0,o.s/2,0,Math.PI*2)}else if(o.type===3){for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2;const x=Math.cos(a)*o.s/2,y=Math.sin(a)*o.s/2;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()}else if(o.type===4){ctx.moveTo(-o.s/2,0);ctx.lineTo(o.s/2,0);ctx.moveTo(0,-o.s/2);ctx.lineTo(0,o.s/2)}else{ctx.moveTo(-o.s/2,-o.s/2);ctx.lineTo(o.s/2,o.s/2);ctx.moveTo(o.s/2,-o.s/2);ctx.lineTo(-o.s/2,o.s/2)}ctx.stroke();ctx.restore()};
  const frame=(t)=>{const dt=Math.min(32,t-last||16);last=t;ctx.clearRect(0,0,w,h);for(const o of shapes){o.x+=o.vx*dt;o.y+=o.vy*dt;o.a+=o.r*dt;if(o.y>h+80||o.x<-100||o.x>w+100)resetShape(o,true);drawShape(o)}
    // Shooting vector streaks
    const count=Math.max(2,Math.floor(w/700));
    for(let i=0;i<count;i++){const y=((t*.07+i*260)% (h+260))-130;const x=((i*410+t*.12)%(w+500))-300;ctx.strokeStyle="rgba(201,255,55,.13)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rand(90,190),y-rand(12,35));ctx.stroke()}
    // Graphic-design tool marks
    const px=(w*.16+(t*.012)%w), py=h*.23+(Math.sin(t*.0007)*h*.12);drawPen(px,py,34,.45,-.35);
    const px2=(w*.78+(Math.sin(t*.00045)*w*.16)), py2=h*.7+(Math.cos(t*.0006)*h*.12);drawPen(px2,py2,26,.3,.75);
    requestAnimationFrame(frame)};
  addEventListener("resize",resize);resize();requestAnimationFrame(frame);
})();

/* =========================================================
   RALPH DESIGNS — INTERACTION ENGINE
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer:fine)").matches;

  // Page loader: wait for document assets, but never block the portfolio.
  const finishLoading = () => {
    document.body.classList.add("is-loaded");
    setTimeout(() => document.querySelector(".page-loader")?.remove(), 1200);
  };
  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading, { once:true });
  setTimeout(finishLoading, 2200);

  // Turn hero heading into staged words without changing the copy.
  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle && !reduceMotion) {
    const nodes = [...heroTitle.childNodes];
    const frag = document.createDocumentFragment();
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) frag.appendChild(document.createTextNode(part));
          else {
            const w = document.createElement("span");
            w.className = "word";
            const inner = document.createElement("span");
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          }
        });
      } else frag.appendChild(node.cloneNode(true));
    });
    // Keep original HTML because <br>/<em> are meaningful.
    // Apply reveal to existing top-level pieces instead.
    heroTitle.querySelectorAll("em").forEach(em => em.style.display = "inline-block");
  }

  // Smooth pointer system + global light source.
  if (finePointer && !reduceMotion) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    const trail = document.querySelector(".cursor-trail");
    let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my, tx = mx, ty = my;
    const move = e => {
      mx=e.clientX; my=e.clientY;
      document.documentElement.style.setProperty("--mx", `${(mx/innerWidth)*100}%`);
      document.documentElement.style.setProperty("--my", `${(my/innerHeight)*100}%`);
      [dot,ring,trail].forEach(el=>{if(el){el.style.opacity="1";}});
    };
    window.addEventListener("pointermove", move, {passive:true});
    const loop = () => {
      rx += (mx-rx)*.18; ry += (my-ry)*.18;
      tx += (mx-tx)*.07; ty += (my-ty)*.07;
      if(dot){dot.style.left=mx+"px";dot.style.top=my+"px";}
      if(ring){ring.style.left=rx+"px";ring.style.top=ry+"px";}
      if(trail){trail.style.left=tx+"px";trail.style.top=ty+"px";}
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll("a,button,.project,.skill-card,.service-grid article,.process-grid article").forEach(el=>{
      el.addEventListener("pointerenter",()=>document.body.classList.add("cursor-hover"));
      el.addEventListener("pointerleave",()=>document.body.classList.remove("cursor-hover"));
    });
  }

  // Mouse-position spotlight for cards.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".skill-card,.service-grid article,.process-grid article,.edu-grid>div,.stat-card").forEach(card=>{
      card.addEventListener("pointermove", e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty("--px", `${e.clientX-r.left}px`);
        card.style.setProperty("--py", `${e.clientY-r.top}px`);
      });
    });
  }

  // Hero parallax: restrained enough to stay professional.
  if (finePointer && !reduceMotion) {
    const hero = document.querySelector(".hero");
    const copy = document.querySelector(".hero-copy");
    const card = document.querySelector(".hero-card");
    hero?.addEventListener("pointermove", e=>{
      const r=hero.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      copy?.style.setProperty("--hero-shift", `${y*-12}px`);
      card?.style.setProperty("--hero-card-shift", `${y*18}px`);
      card?.style.setProperty("rotate", `${x*1.2}deg`);
    });
    hero?.addEventListener("pointerleave",()=>{
      copy?.style.setProperty("--hero-shift","0px");
      card?.style.setProperty("--hero-card-shift","0px");
      card?.style.removeProperty("rotate");
    });
  }

  // Scroll depth variable for subtle section movement.
  const updateDepth = () => {
    document.documentElement.style.setProperty("--scroll-depth", `${window.scrollY}px`);
    document.querySelector(".back-top")?.classList.toggle("show", window.scrollY > 700);
  };
  window.addEventListener("scroll", updateDepth, {passive:true});
  updateDepth();

  // Back to top.
  document.querySelector(".back-top")?.addEventListener("click",()=>window.scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"}));

  // Project case-study modal with multi-image galleries.
  const modal=document.querySelector("#projectModal");
  const modalImage=document.querySelector("#modalImage");
  const modalCategory=document.querySelector("#modalCategory");
  const modalTitle=document.querySelector("#modalTitle");
  const modalDescription=document.querySelector("#modalDescription");
  const modalTags=document.querySelector("#modalTags");
  const modalThumbs=document.querySelector("#modalThumbs");
  const modalCurrent=document.querySelector("#modalCurrent");
  const modalTotal=document.querySelector("#modalTotal");
  const galleryPrev=document.querySelector(".gallery-prev");
  const galleryNext=document.querySelector(".gallery-next");

  const galleries={
    don:[
      ["assets/don-01.jpg","Don Macchiatos — campaign poster"],
      ["assets/don-02.jpg","Don Macchiatos — product campaign"],
      ["assets/don-03.jpg","Don Macchiatos — social creative"],
      ["assets/don-04.jpg","Don Macchiatos — anniversary promotion"],
      ["assets/don-05.jpg","Don Macchiatos — weekly social post"],
      ["assets/don-06.jpg","Don Macchiatos — grand opening campaign"],
      ["assets/don-07.jpg","Don Macchiatos — coffee campaign"],
      ["assets/don-08.jpg","Don Macchiatos — Bonifacio Day creative"]
    ],
    "3r":[
      ["assets/rkj-01.png","3R Sportswear — Maizuru basketball jersey"],
      ["assets/rkj-02.png","3R Sportswear — Maizuru basketball shorts"],
      ["assets/rkj-03.png","3R Sportswear — EXECOM sportswear polo"],
      ["assets/3r-01.png","3R Sportswear — Brigadea Eskwela apparel"],
      ["assets/3r-02.png","3R Sportswear — performance jersey design"],
      ["assets/3r-03.png","3R Sportswear — custom sportswear campaign"]
    ],
    rkj:[
      ["assets/rkj-04.jpg","RKJ Apparel — All Saints Day advisory"],
      ["assets/rkj-05.jpg","RKJ Apparel — cycling apparel campaign"],
      ["assets/rkj-06.jpg","RKJ Apparel — coffee shop polo campaign"],
      ["assets/rkj-07.jpg","RKJ Apparel — custom shirt campaign"],
      ["assets/rkj-08.jpg","RKJ Apparel — polo apparel campaign"],
      ["assets/rkj-09.jpg","RKJ Apparel — red black shirt campaign"],
      ["assets/rkj-10.jpg","RKJ Apparel — polo shirt campaign"],
      ["assets/rkj-11.jpg","RKJ Apparel — sublimation apparel promotion"]
    ],
    act:[
      ["assets/act-01.jpg","ACT — basketball game results"],
      ["assets/act-02.jpg","ACT — basketball game results"],
      ["assets/act-03.jpg","ACT — Asianista Games campaign"],
      ["assets/act-04.jpg","ACT — women's volleyball result"],
      ["assets/act-05.jpg","ACT — event coordinator poster"],
      ["assets/act-victory.jpg","ACT Cyberknights — basketball victory poster"]
    ],
  };

  let activeGallery=[];
  let activeIndex=0;

  const renderGallery=()=>{
    if(!activeGallery.length) return;
    const [src,alt]=activeGallery[activeIndex];
    modalImage.classList.remove("image-load-error");
    modalImage.src=src;
    modalImage.alt=alt;
    modalImage.onerror=()=>{ modalImage.classList.add("image-load-error"); modalImage.alt=`Preview unavailable — ${alt}`; };
    modalCurrent.textContent=String(activeIndex+1).padStart(2,"0");
    modalTotal.textContent=String(activeGallery.length).padStart(2,"0");
    modalThumbs.innerHTML="";
    activeGallery.forEach(([thumbSrc,thumbAlt],i)=>{
      const button=document.createElement("button");
      button.type="button";
      button.className=`modal-thumb ${i===activeIndex?"active":""}`;
      button.setAttribute("aria-label",`View image ${i+1}`);
      const image=document.createElement("img");
      image.src=thumbSrc;
      image.alt="";
      image.loading="lazy";
      button.appendChild(image);
      button.addEventListener("click",()=>{activeIndex=i;renderGallery();});
      modalThumbs.appendChild(button);
    });
    galleryPrev?.classList.toggle("disabled",activeGallery.length<2);
    galleryNext?.classList.toggle("disabled",activeGallery.length<2);
  };

  const stepGallery=(direction)=>{
    if(activeGallery.length<2) return;
    activeIndex=(activeIndex+direction+activeGallery.length)%activeGallery.length;
    renderGallery();
  };

  const closeModal=()=>{
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
    activeGallery=[];
  };

  const openProject=(project)=>{
    if(!modal||!project) return;
    const key=project.dataset.project;
    const title=project.dataset.title||project.querySelector(".project-info h3")?.textContent||"Selected Project";
    const category=project.dataset.categoryLabel||project.querySelector(".project-info small")?.textContent||"SELECTED PROJECT";
    const description=project.dataset.description||project.querySelector(".project-info p")?.textContent||"Creative direction, visual design and production-ready execution.";
    activeGallery=galleries[key]||[];
    if(!activeGallery.length){
      const img=project.querySelector("img");
      if(img) activeGallery=[[img.src,img.alt]];
    }
    activeIndex=0;
    modalCategory.textContent=category;
    modalTitle.textContent=title;
    modalDescription.textContent=description;
    modalTags.innerHTML="";
    (project.querySelector(".project-info p")?.textContent||"Graphic design").split("·").map(x=>x.trim()).filter(Boolean).forEach(tag=>{
      const s=document.createElement("span");
      s.textContent=tag;
      modalTags.appendChild(s);
    });
    renderGallery();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close")?.focus();
  };

  document.querySelectorAll(".project").forEach(project=>{
    project.addEventListener("click",e=>{
      if(e.target.closest("a,button")) return;
      openProject(project);
    });
    project.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();openProject(project);}
    });
  });

  galleryPrev?.addEventListener("click",()=>stepGallery(-1));
  galleryNext?.addEventListener("click",()=>stepGallery(1));
  modal?.addEventListener("click",e=>{
    if(e.target.matches("[data-modal-close]")) closeModal();
  });
  document.addEventListener("keydown",e=>{
    if(!modal?.classList.contains("open")) return;
    if(e.key==="Escape") closeModal();
    if(e.key==="ArrowLeft") stepGallery(-1);
    if(e.key==="ArrowRight") stepGallery(1);
  });

  // Portfolio filters — keep the selected button visibly active and in sync.
  const filterButtons=[...document.querySelectorAll(".filter-btn")];
  const portfolioProjects=[...document.querySelectorAll(".portfolio-picture[data-category]")];
  const applyPortfolioFilter=(filter, clickedButton)=>{
    filterButtons.forEach(btn=>{
      const active=btn===clickedButton || btn.dataset.filter===filter;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-selected",String(active));
    });
    portfolioProjects.forEach((project,i)=>{
      const show=filter==="all"||project.dataset.category===filter;
      clearTimeout(project._filterTimer);
      project.classList.remove("filter-in");
      if(show){
        project.classList.remove("is-hidden","filter-out");
        void project.offsetWidth;
        project.style.animationDelay=`${Math.min(i*45,240)}ms`;
        project.classList.add("filter-in");
      }else{
        project.classList.add("filter-out");
        project._filterTimer=setTimeout(()=>project.classList.add("is-hidden"),280);
      }
    });
  };
  filterButtons.forEach(button=>{
    button.addEventListener("click",()=>applyPortfolioFilter(button.dataset.filter,button));
  });
  const initialFilter=filterButtons.find(btn=>btn.classList.contains("active"))?.dataset.filter || "all";
  applyPortfolioFilter(initialFilter,filterButtons.find(btn=>btn.dataset.filter===initialFilter));

  // Add a gentle reveal to section copy.
  if ("IntersectionObserver" in window) {
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.18});
    document.querySelectorAll(".process-head p,.work-heading>p,.contact-inner>p").forEach(el=>{
      el.classList.add("reveal-text");io.observe(el);
    });
  }

  // Image fallback.
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      const frame = img.closest(".portfolio-picture-frame, .project-art, .modal-media");
      if(frame){
        img.style.opacity="0";
        frame.classList.add("image-missing");
      }
    },{once:true});
  });
})();

// =========================================================
// APPEARANCE SYSTEM — robust dark/light mode + highlight colors
// =========================================================
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const icon = document.querySelector("#themeToggle .theme-icon");
  const label = document.querySelector("#themeToggle .theme-label");
  const dots = [...document.querySelectorAll(".accent-dot")];
  const accents = {
    lime: "#c9ff37",
    cyan: "#36e6ff",
    violet: "#a875ff",
    orange: "#ff9f43",
    pink: "#ff4fa3"
  };

  const validTheme = value => value === "light" || value === "dark" ? value : "dark";
  const validAccent = value => Object.prototype.hasOwnProperty.call(accents, value) ? value : "lime";

  const applyTheme = (mode, persist = true) => {
    mode = validTheme(mode);
    root.setAttribute("data-theme", mode);
    document.body?.setAttribute("data-theme", mode);
    document.body?.classList.remove("theme-light", "theme-dark");
    document.body?.classList.add(`theme-${mode}`);
    root.style.colorScheme = mode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "light" ? "#f4f5f2" : "#080909");
    if (toggle) {
      const next = mode === "light" ? "dark" : "light";
      toggle.setAttribute("aria-label", `Switch to ${next} mode`);
      toggle.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
      toggle.title = `Switch to ${next} mode`;
    }
    if (icon) icon.textContent = mode === "light" ? "☀" : "☾";
    if (label) label.textContent = mode.toUpperCase();
    window.dispatchEvent(new CustomEvent("appearancechange", {detail:{theme:mode, accent:root.dataset.accent || "lime"}}));
    if (persist) localStorage.setItem("ralph-theme", mode);
  };

  const applyAccent = (name, persist = true) => {
    name = validAccent(name);
    const value = accents[name];
    root.setAttribute("data-accent", name);
    root.style.setProperty("--accent", value);
    root.style.setProperty("--lime", value);
    root.style.setProperty("--highlight", value);
    root.style.setProperty("--theme-accent", value);
    root.style.setProperty("--accent-rgb", ({lime:"201,255,55",cyan:"54,230,255",violet:"168,117,255",orange:"255,159,67",pink:"255,79,163"})[name]);
    dots.forEach(dot => {
      const active = dot.dataset.accent === name;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-pressed", active ? "true" : "false");
    });
    window.dispatchEvent(new CustomEvent("appearancechange", {detail:{theme:root.dataset.theme || "dark", accent:name}}));
    if (persist) localStorage.setItem("ralph-accent", name);
  };

  // Restore saved state first so the page never gets stuck in a half-applied mode.
  applyTheme(localStorage.getItem("ralph-theme") || "dark", false);
  applyAccent(localStorage.getItem("ralph-accent") || "lime", false);

  toggle?.addEventListener("click", event => {
    event.preventDefault();
    applyTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
  dots.forEach(dot => dot.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    applyAccent(dot.dataset.accent);
  }));
})();

// =========================================================
// FULL-PAGE GRAPHIC DESIGNER ATMOSPHERE
// Falling geometry + pen-tool nodes + vector marks + clouds + thunder
// =========================================================
(() => {
  const canvas = document.getElementById("designerCanvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d", {alpha:true});
  if (!ctx) return;

  let w=0, h=0, dpr=1, last=0, lightning=0, nextLightning=0;
  const shapes=[];
  const clouds=[];
  const rand=(a,b)=>a+Math.random()*(b-a);
  const cssVar=name=>getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hexToRgb=hex=>{
    const m=hex.replace('#','').match(/.{1,2}/g); if(!m||m.length<3) return [201,255,55];
    return m.slice(0,3).map(v=>parseInt(v,16));
  };
  const accentRgb=()=>hexToRgb(cssVar('--accent') || '#c9ff37');
  const isLight=()=>document.documentElement.dataset.theme==='light';
  const rgba=(rgb,a)=>`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

  const resize=()=>{
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=window.innerWidth; h=window.innerHeight;
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!clouds.length) for(let i=0;i<6;i++) clouds.push({x:rand(-100,w+100),y:rand(30,h*.55),s:rand(100,230),vx:rand(.012,.035),a:rand(.035,.09)});
  };
  const makeShape=()=>({x:rand(0,w),y:rand(-h,h),s:rand(10,46),a:rand(0,Math.PI*2),r:rand(-.0008,.0008),vx:rand(-.012,.012),vy:rand(.035,.12),type:Math.floor(rand(0,7)),alpha:rand(.13,.38)});
  const resetShape=o=>{o.x=rand(0,w);o.y=rand(-80,-10);o.s=rand(10,46);o.a=rand(0,Math.PI*2);o.r=rand(-.0008,.0008);o.vx=rand(-.012,.012);o.vy=rand(.035,.12);o.type=Math.floor(rand(0,7));o.alpha=rand(.13,.38)};
  for(let i=0;i<Math.min(58,Math.max(30,Math.floor(window.innerWidth/25)));i++) shapes.push(makeShape());

  const drawShape=o=>{
    const rgb=accentRgb();
    ctx.save(); ctx.translate(o.x,o.y); ctx.rotate(o.a); ctx.globalAlpha=o.alpha;
    ctx.strokeStyle=isLight()?`rgba(20,25,20,.18)`:rgba(rgb,.75); ctx.lineWidth=1;
    ctx.beginPath();
    if(o.type===0) ctx.rect(-o.s/2,-o.s/2,o.s,o.s);
    else if(o.type===1){ctx.moveTo(0,-o.s/2);ctx.lineTo(o.s/2,o.s/2);ctx.lineTo(-o.s/2,o.s/2);ctx.closePath();}
    else if(o.type===2) ctx.arc(0,0,o.s/2,0,Math.PI*2);
    else if(o.type===3){for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2,x=Math.cos(a)*o.s/2,y=Math.sin(a)*o.s/2;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();}
    else if(o.type===4){ctx.moveTo(-o.s/2,0);ctx.lineTo(o.s/2,0);ctx.moveTo(0,-o.s/2);ctx.lineTo(0,o.s/2);}
    else if(o.type===5){ctx.moveTo(-o.s/2,-o.s/2);ctx.lineTo(o.s/2,o.s/2);ctx.moveTo(o.s/2,-o.s/2);ctx.lineTo(-o.s/2,o.s/2);}
    else {ctx.arc(0,0,o.s/2,0,Math.PI*2);ctx.moveTo(-o.s/2,0);ctx.lineTo(o.s/2,0);ctx.moveTo(0,-o.s/2);ctx.lineTo(0,o.s/2);}
    ctx.stroke(); ctx.restore();
  };

  const drawPen=(x,y,s,alpha,rot)=>{
    const rgb=accentRgb(); ctx.save(); ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=alpha;
    ctx.strokeStyle=rgba(rgb,.85);ctx.lineWidth=1.25;ctx.beginPath();
    ctx.moveTo(-s*.28,-s*.42);ctx.lineTo(s*.28,-s*.06);ctx.lineTo(-s*.04,s*.42);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-s*.28,-s*.42);ctx.lineTo(-s*.04,s*.03);ctx.lineTo(s*.28,-s*.06);ctx.stroke();
    [[-s*.28,-s*.42],[s*.28,-s*.06],[-s*.04,s*.42]].forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],2.4,0,Math.PI*2);ctx.fillStyle=rgba(rgb,.95);ctx.fill()});
    ctx.restore();
  };

  const drawToolMarks=t=>{
    const rgb=accentRgb(); const light=isLight(); const c=light?'rgba(20,25,20,.14)':rgba(rgb,.32);
    // Selection box / transform handles
    const x=w*.72+Math.sin(t*.00055)*w*.08,y=h*.25+Math.cos(t*.00065)*h*.08,s=42;
    ctx.save();ctx.strokeStyle=c;ctx.lineWidth=1;ctx.strokeRect(x-s,y-s*.6,s*2,s*1.2);
    [[x-s,y-s*.6],[x+s,y-s*.6],[x-s,y+s*.6],[x+s,y+s*.6]].forEach(p=>{ctx.fillStyle=light?'rgba(20,25,20,.28)':rgba(rgb,.7);ctx.fillRect(p[0]-2,p[1]-2,4,4)});ctx.restore();
    // Type tool
    ctx.save();ctx.fillStyle=c;ctx.font='700 18px Space Grotesk, sans-serif';ctx.fillText('T',w*.14,h*.72);ctx.restore();
    // Color swatches
    ctx.save();ctx.globalAlpha=light?.18:.35;['#ffffff',cssVar('--accent')||'#c9ff37','#7e59ff'].forEach((col,i)=>{ctx.fillStyle=col;ctx.fillRect(w*.84+i*12,h*.82,9,9)});ctx.restore();
    drawPen(w*.17+(Math.sin(t*.0009)*w*.07),h*.26+(Math.cos(t*.0011)*h*.08),34,.48,-.4);
    drawPen(w*.78+(Math.sin(t*.0008)*w*.08),h*.67+(Math.cos(t*.001)*h*.1),28,.3,.7);
  };

  const drawClouds=t=>{
    const light=isLight();
    ctx.save();
    clouds.forEach(cl=>{
      cl.x+=cl.vx*(t-last||16);
      if(cl.x> w+260) cl.x=-260;
      const grad=ctx.createRadialGradient(cl.x,cl.y,0,cl.x,cl.y,cl.s);
      grad.addColorStop(0,light?'rgba(40,45,40,.055)':'rgba(60,75,95,.10)');
      grad.addColorStop(1,'transparent');
      ctx.fillStyle=grad;ctx.globalAlpha=cl.a;
      ctx.beginPath();ctx.arc(cl.x,cl.y,cl.s,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(cl.x-cl.s*.38,cl.y+cl.s*.08,cl.s*.62,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(cl.x+cl.s*.4,cl.y+cl.s*.05,cl.s*.55,0,Math.PI*2);ctx.fill();
    });
    ctx.restore();
  };

  const triggerLightning=()=>{lightning=1.35;nextLightning=performance.now()+rand(1500,3600)};
  const drawLightning=now=>{
    if(now>nextLightning && lightning<=0) triggerLightning();
    if(lightning<=0) return;
    const rgb=accentRgb();
    const baseAlpha=isLight()?0.30:1;
    ctx.save();
    ctx.globalAlpha=Math.min(1,lightning*1.35);
    ctx.strokeStyle=isLight()?`rgba(35,40,35,${baseAlpha})`:rgba(rgb,.98);
    ctx.shadowColor=rgba(rgb,.85);
    ctx.shadowBlur=28;
    ctx.lineWidth=4.2;
    const startX=w*rand(.10,.90), top=rand(20,h*.18);
    const drawBolt=(offset=0,scale=1)=>{
      let x=startX+offset, y=top;
      ctx.beginPath();ctx.moveTo(x,y);
      for(let i=0;i<9;i++){
        y+=rand(28,62)*scale;
        x+=rand(-52,52)*scale;
        ctx.lineTo(x,y);
      }
      ctx.stroke();
    };
    drawBolt(0,1);
    ctx.globalAlpha*=.55;
    ctx.lineWidth=1.4;
    drawBolt(rand(-28,28),.72);
    ctx.restore();
    lightning-=.12;
  };

  const frame=now=>{
    const rawDt=Math.min(32,now-last||16); last=now; const speed=2.2; const dt=rawDt*speed; const motionNow=now*speed; ctx.clearRect(0,0,w,h);
    drawClouds(motionNow);
    shapes.forEach(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;o.a+=o.r*dt;if(o.y>h+80)resetShape(o);drawShape(o)});
    // Fast vector shooting lines
    const rgb=accentRgb();ctx.save();ctx.globalAlpha=isLight()?.10:.22;ctx.strokeStyle=rgba(rgb,.8);ctx.lineWidth=1;
    for(let i=0;i<Math.max(2,Math.floor(w/650));i++){const y=((now*.065+i*250)%(h+250))-120,x=((i*390+now*.11)%(w+500))-300;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rand(100,210),y-rand(12,35));ctx.stroke()}ctx.restore();
    drawToolMarks(now);drawLightning(now);requestAnimationFrame(frame);
  };
  window.addEventListener('resize',resize,{passive:true});resize();nextLightning=performance.now()+1200;requestAnimationFrame(frame);
})();
