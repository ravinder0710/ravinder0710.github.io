/**
 * RAVINDER GUPTA - 2:30m CINEMATIC PORTFOLIO SHOWCASE & AUTOPILOT ENGINE
 * 
 * Choreographed sequence:
 * 1. Loader completion & Hero reveal (0:00 - 0:08)
 * 2. Skills Filters Demonstration: Excel -> Python -> SQL -> Power BI -> All (0:08 - 0:30)
 * 3. Honda Telematics Deep-Dive: Instant load, Dashboard Views, Pipeline Zoom, Demo Video (0:30 - 1:08)
 * 4. Emperor Cuisine Enterprise BI: Instant load, Suite views, Project Report PDF (1:08 - 1:36)
 * 5. Portfolio Full Projects Panoramic Scroll & Back to Top (1:36 - 1:54)
 * 6. Executive Resume Showcase & Scroll (1:54 - 2:10)
 * 7. Let's Connect & Socials Highlight (2:10 - 2:20)
 * 8. Grand Outro: RG Monogram 3D Laser Aura + Thank You screen (2:20 - 2:30)
 */

(function() {
  'use strict';

  const TOTAL_DURATION_SEC = 150; // 2:30 minutes
  const urlParams = new URLSearchParams(window.location.search);
  const isTourActive = urlParams.get('tour') === '1' || sessionStorage.getItem('rg_tour_active') === 'true';
  const currentStep = urlParams.get('step') || sessionStorage.getItem('rg_tour_step') || 'start';

  // State Management
  let startTime = parseInt(sessionStorage.getItem('rg_tour_start_time') || '0', 10);
  let timerInterval = null;
  let isPaused = false;

  // Initialize Showcase UI & Handlers
  function init() {
    createLaunchButton();
    if (isTourActive) {
      sessionStorage.setItem('rg_tour_active', 'true');
      if (!startTime || currentStep === 'start') {
        startTime = Date.now();
        sessionStorage.setItem('rg_tour_start_time', startTime.toString());
      }
      createCinematicHUD();
      createVirtualCursor();
      createThankYouModal();
      startTimer();
      runStepRouter();
    }
  }

  // Floating Launch Button on bottom left
  function createLaunchButton() {
    if (document.getElementById('startTourFloatingBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'startTourFloatingBtn';
    btn.className = 'fixed bottom-6 left-6 z-40 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-2xl shadow-cyan-500/30 border border-cyan-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md';
    btn.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
      <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
      <span>Start 2:30m Showcase</span>
    `;
    btn.onclick = () => startTourFromBeginning();
    document.body.appendChild(btn);
    if (window.lucide) window.lucide.createIcons();
  }

  function startTourFromBeginning() {
    sessionStorage.setItem('rg_tour_active', 'true');
    sessionStorage.setItem('rg_tour_step', 'start');
    sessionStorage.setItem('rg_tour_start_time', Date.now().toString());
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    if (isHomePage) {
      window.location.search = '?tour=1&step=start';
    } else {
      window.location.href = 'index.html?tour=1&step=start';
    }
  }

  function stopTour() {
    sessionStorage.removeItem('rg_tour_active');
    sessionStorage.removeItem('rg_tour_step');
    sessionStorage.removeItem('rg_tour_start_time');
    const hud = document.getElementById('cinematicHud');
    if (hud) hud.remove();
    const cursor = document.getElementById('cinematicCursor');
    if (cursor) cursor.remove();
    const btn = document.getElementById('startTourFloatingBtn');
    if (btn) btn.style.display = 'flex';
  }

  // Top Cinematic HUD Bar
  function createCinematicHUD() {
    if (document.getElementById('cinematicHud')) return;
    const hud = document.createElement('div');
    hud.id = 'cinematicHud';
    hud.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-2xl bg-[#070b14]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex items-center gap-4 text-xs font-mono text-white select-none';
    hud.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
        <span class="font-bold tracking-wider text-cyan-400">REC • SHOWCASE</span>
      </div>
      <div class="h-3 w-px bg-slate-700"></div>
      <span id="hudTimer" class="font-bold text-slate-300">00:00 / 02:30</span>
      <div class="h-3 w-px bg-slate-700"></div>
      <span id="hudStepTitle" class="text-slate-400 font-sans font-medium text-[11px] truncate max-w-[200px] sm:max-w-xs">Initializing Showcase...</span>
      <div class="flex items-center gap-1.5 ml-2">
        <button id="hudPauseBtn" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">⏸</button>
        <button id="hudStopBtn" class="px-2 py-0.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white transition cursor-pointer">✕</button>
      </div>
    `;
    document.body.appendChild(hud);

    document.getElementById('hudStopBtn').onclick = () => {
      stopTour();
      window.location.search = '';
    };

    document.getElementById('hudPauseBtn').onclick = () => {
      isPaused = !isPaused;
      document.getElementById('hudPauseBtn').textContent = isPaused ? '▶' : '⏸';
    };

    // Keyboard controls: Space to pause, Esc to exit
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        stopTour();
      }
    });
  }

  function updateHUD(stepTitle) {
    const titleEl = document.getElementById('hudStepTitle');
    if (titleEl) titleEl.textContent = stepTitle;
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (isPaused) return;
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const timerEl = document.getElementById('hudTimer');
      if (timerEl) {
        const curM = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
        const curS = String(elapsedSec % 60).padStart(2, '0');
        timerEl.textContent = `${curM}:${curS} / 02:30`;
      }
    }, 500);
  }

  // Virtual Cursor
  function createVirtualCursor() {
    if (document.getElementById('cinematicCursor')) return;
    const cursor = document.createElement('div');
    cursor.id = 'cinematicCursor';
    cursor.style.cssText = 'position:fixed;top:0;left:0;width:24px;height:24px;border-radius:50%;border:2px solid #06b6d4;background:rgba(6,182,212,0.25);box-shadow:0 0 15px #06b6d4;pointer-events:none;z-index:99999;transition:transform 0.08s ease-out, opacity 0.3s;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;';
    cursor.innerHTML = '<div style="width:6px;height:6px;border-radius:50%;background:#ffffff;"></div>';
    document.body.appendChild(cursor);
  }

  function moveVirtualCursor(targetX, targetY, durationMs, callback) {
    const cursor = document.getElementById('cinematicCursor');
    if (!cursor) { if (callback) callback(); return; }
    
    const startX = cursor._curX || window.innerWidth / 2;
    const startY = cursor._curY || window.innerHeight / 2;
    const diffX = targetX - startX;
    const diffY = targetY - startY;
    const start = performance.now();

    function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function step(now) {
      if (isPaused) { requestAnimationFrame(step); return; }
      const progress = Math.min((now - start) / durationMs, 1);
      const curX = startX + diffX * ease(progress);
      const curY = startY + diffY * ease(progress);
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      cursor._curX = curX;
      cursor._curY = curY;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Click pulse effect
        cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
        setTimeout(() => {
          cursor.style.transform = 'translate(-50%,-50%) scale(1)';
          if (callback) callback();
        }, 180);
      }
    }
    requestAnimationFrame(step);
  }

  function moveCursorToElement(selectorOrEl, durationMs, callback) {
    const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
    if (!el) { if (callback) callback(); return; }
    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    moveVirtualCursor(targetX, targetY, durationMs, callback);
  }

  // Smooth Cubic-Bezier Scrolling Engine (Mathematical 60FPS)
  function smoothScrollTo(targetY, durationMs, callback) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    const start = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      if (isPaused) { requestAnimationFrame(step); return; }
      const progress = Math.min((now - start) / durationMs, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (callback) callback();
      }
    }
    requestAnimationFrame(step);
  }

  // ROUTER FOR STEPS
  function runStepRouter() {
    switch (currentStep) {
      case 'start':
        executeHomeStep();
        break;
      case 'honda':
        executeHondaStep();
        break;
      case 'emperor':
        executeEmperorStep();
        break;
      case 'portfolio_all':
        executePortfolioAllStep();
        break;
      case 'resume':
        executeResumeStep();
        break;
      case 'contact':
        executeContactStep();
        break;
      default:
        executeHomeStep();
        break;
    }
  }

  // ==========================================
  // STEP 1: HOME PAGE (Intro -> Skills Filters -> Honda Click)
  // ==========================================
  function executeHomeStep() {
    updateHUD('1/7: Loader Finish & Hero Presentation');
    window.scrollTo(0, 0);

    // 0:00 - 0:04: Wait for loader to finish and admire hero
    setTimeout(() => {
      updateHUD('2/7: Smooth Scroll to Technical Projects');
      const projectsEl = document.getElementById('projects');
      const targetY = projectsEl ? projectsEl.offsetTop - 80 : 1100;

      smoothScrollTo(targetY, 3200, () => {
        // Skill filter demonstration sequence
        updateHUD('Skills Filter: Excel Analytics');
        const excelBtn = Array.from(document.querySelectorAll('.badge-filter')).find(b => b.textContent.includes('Excel'));
        moveCursorToElement(excelBtn, 1200, () => {
          if (excelBtn) excelBtn.click();
          
          setTimeout(() => {
            updateHUD('Skills Filter: Python Analytics & ML');
            const pythonBtn = Array.from(document.querySelectorAll('.badge-filter')).find(b => b.textContent.includes('Python'));
            moveCursorToElement(pythonBtn, 1200, () => {
              if (pythonBtn) pythonBtn.click();

              setTimeout(() => {
                updateHUD('Skills Filter: Relational SQL');
                const sqlBtn = Array.from(document.querySelectorAll('.badge-filter')).find(b => b.textContent.includes('SQL'));
                moveCursorToElement(sqlBtn, 1200, () => {
                  if (sqlBtn) sqlBtn.click();

                  setTimeout(() => {
                    updateHUD('Skills Filter: Power BI Enterprise');
                    const pbiBtn = Array.from(document.querySelectorAll('.badge-filter')).find(b => b.textContent.includes('Power BI'));
                    moveCursorToElement(pbiBtn, 1200, () => {
                      if (pbiBtn) pbiBtn.click();

                      setTimeout(() => {
                        updateHUD('Skills Filter: All (12) Full Suite');
                        const allBtn = Array.from(document.querySelectorAll('.badge-filter')).find(b => b.textContent.includes('All'));
                        moveCursorToElement(allBtn, 1200, () => {
                          if (allBtn) allBtn.click();

                          // Navigate to Honda Project
                          setTimeout(() => {
                            updateHUD('Opening Honda Two-Wheelers Pipeline (Zero Lag)');
                            const hondaCard = document.querySelector('#projectsGrid article');
                            const hondaLink = hondaCard ? hondaCard.querySelector('a[href*="honda"]') : null;
                            
                            moveCursorToElement(hondaCard, 1400, () => {
                              sessionStorage.setItem('rg_tour_step', 'honda');
                              window.location.href = 'honda-project.html?tour=1&step=honda';
                            });
                          }, 1500);
                        });
                      }, 2500);
                    });
                  }, 2500);
                });
              }, 2500);
            });
          }, 2500);
        });
      });
    }, 2000);
  }

  // ==========================================
  // STEP 2: HONDA TELEMATICS PROJECT
  // ==========================================
  function executeHondaStep() {
    updateHUD('3/7: Honda DirectQuery Dashboard (Zero Lag)');
    window.scrollTo(0, 0);

    setTimeout(() => {
      // Smooth scroll down to Dashboard Views
      const dashboardSec = document.querySelector('.aspect-\\[16\\/9\\]') || document.querySelector('section');
      const targetY = dashboardSec ? dashboardSec.getBoundingClientRect().top + window.pageYOffset - 120 : 600;

      smoothScrollTo(targetY, 2800, () => {
        // Cycle dashboard view buttons
        const viewTabs = document.querySelectorAll('.dashboard-view-tab, button[onclick*="switchView"], button[onclick*="showView"]');
        if (viewTabs.length > 1) {
          updateHUD('Honda Dashboard: Switching Executive Views');
          moveCursorToElement(viewTabs[1], 1200, () => {
            viewTabs[1].click();
          });
        }

        // Scroll to Pipeline Architecture
        setTimeout(() => {
          updateHUD('Honda Architecture: Data Pipeline Inspection');
          const archBtn = document.querySelector('button[onclick*="openArchModal"]') || document.querySelector('a[href*="pipeline"]');
          const archSection = document.querySelector('section[id*="architecture"]') || archBtn;
          const archY = archSection ? archSection.getBoundingClientRect().top + window.pageYOffset - 140 : 1400;

          smoothScrollTo(archY, 2800, () => {
            if (archBtn) {
              moveCursorToElement(archBtn, 1200, () => {
                archBtn.click();
                updateHUD('Pipeline Architecture: Zoom Inspection');

                // Modal zoom animation
                const modalImg = document.querySelector('#archModal img, .modal img');
                if (modalImg) {
                  modalImg.style.transition = 'transform 2.5s ease-in-out';
                  modalImg.style.transform = 'scale(1.18)';
                }

                setTimeout(() => {
                  if (modalImg) modalImg.style.transform = 'scale(1)';
                  const closeBtn = document.querySelector('#archModal button, button[onclick*="closeArchModal"]');
                  if (closeBtn) closeBtn.click();

                  // Scroll to Demo Video & Next Project
                  setTimeout(() => {
                    updateHUD('Honda Project: Proceeding to Emperor Cuisine');
                    const nextBtn = document.querySelector('a[href*="emperor-project.html"]') || document.querySelector('a[href*="emperor"]');
                    const nextY = nextBtn ? nextBtn.getBoundingClientRect().top + window.pageYOffset - 200 : document.body.scrollHeight;

                    smoothScrollTo(nextY, 2600, () => {
                      moveCursorToElement(nextBtn, 1400, () => {
                        sessionStorage.setItem('rg_tour_step', 'emperor');
                        window.location.href = 'emperor-project.html?tour=1&step=emperor';
                      });
                    });
                  }, 2000);
                }, 4000);
              });
            } else {
              // Direct navigation if arch button not found
              const nextBtn = document.querySelector('a[href*="emperor-project.html"]') || document.querySelector('a[href*="emperor"]');
              if (nextBtn) {
                window.location.href = 'emperor-project.html?tour=1&step=emperor';
              }
            }
          });
        }, 3500);
      });
    }, 1500);
  }

  // ==========================================
  // STEP 3: EMPEROR CUISINE RESTAURANT BI
  // ==========================================
  function executeEmperorStep() {
    updateHUD('4/7: Emperor Cuisine 24-Page Suite (Zero Lag)');
    window.scrollTo(0, 0);

    setTimeout(() => {
      // Smooth scroll through Emperor modules
      smoothScrollTo(800, 3000, () => {
        updateHUD('Emperor Cuisine: Opening 43-Page Project Report');
        const reportBtn = document.querySelector('a[href*="Emperor_Restaurant_Project_Report.pdf"], a[href*="Report"], a[href*="report"]');
        
        if (reportBtn) {
          moveCursorToElement(reportBtn, 1200, () => {
            // Showcase report preview without disrupting tab
            updateHUD('Technical Handover Report Verified');
          });
        }

        setTimeout(() => {
          updateHUD('Returning to Main Portfolio');
          const backBtn = document.querySelector('a[href*="index.html"]');
          const topBackY = 0;

          smoothScrollTo(topBackY, 1800, () => {
            moveCursorToElement(backBtn, 1200, () => {
              sessionStorage.setItem('rg_tour_step', 'portfolio_all');
              window.location.href = 'index.html?tour=1&step=portfolio_all';
            });
          });
        }, 4000);
      });
    }, 1500);
  }

  // ==========================================
  // STEP 4: PORTFOLIO ALL PROJECTS PANORAMA
  // ==========================================
  function executePortfolioAllStep() {
    updateHUD('5/7: Complete Portfolio Panoramic Overview');
    window.scrollTo(0, 0);

    setTimeout(() => {
      const projectsEl = document.getElementById('projects');
      const startProjectsY = projectsEl ? projectsEl.offsetTop - 60 : 1000;
      const endProjectsY = document.body.scrollHeight - 900;

      smoothScrollTo(startProjectsY, 2000, () => {
        // Slow cinematic scroll through all 12 projects
        updateHUD('Exploring 12 Production BI Projects');
        smoothScrollTo(endProjectsY, 8000, () => {
          updateHUD('Clicking Up-Arrow (↑) Back to Top');
          const backToTop = document.getElementById('backToTopBtn');
          if (backToTop) {
            backToTop.classList.remove('opacity-0', 'pointer-events-none');
            backToTop.classList.add('opacity-100');
          }

          moveCursorToElement(backToTop, 1200, () => {
            smoothScrollTo(0, 2400, () => {
              // Navigate to Resume
              updateHUD('Opening Executive Resume');
              const resumeBtn = document.querySelector('nav a[href*="resume.html"]') || document.querySelector('a[href*="resume.html"]');
              moveCursorToElement(resumeBtn, 1200, () => {
                sessionStorage.setItem('rg_tour_step', 'resume');
                window.location.href = 'resume.html?tour=1&step=resume';
              });
            });
          });
        });
      });
    }, 1000);
  }

  // ==========================================
  // STEP 5: EXECUTIVE RESUME SHOWCASE
  // ==========================================
  function executeResumeStep() {
    updateHUD('6/7: Executive Resume & Credentials');
    window.scrollTo(0, 0);

    setTimeout(() => {
      // Smooth scroll down the resume document
      smoothScrollTo(600, 3500, () => {
        setTimeout(() => {
          smoothScrollTo(0, 1800, () => {
            updateHUD('Returning to Connect & Final Outro');
            const backBtn = document.querySelector('a[href*="index.html"]');
            moveCursorToElement(backBtn, 1200, () => {
              sessionStorage.setItem('rg_tour_step', 'contact');
              window.location.href = 'index.html?tour=1&step=contact';
            });
          });
        }, 2000);
      });
    }, 1500);
  }

  // ==========================================
  // STEP 6: CONTACT & GRAND FINALE OUTRO
  // ==========================================
  function executeContactStep() {
    updateHUD('7/7: Contact, LinkedIn & Grand Finale');
    window.scrollTo(0, 0);

    setTimeout(() => {
      const contactEl = document.getElementById('contact');
      const contactY = contactEl ? contactEl.offsetTop - 80 : document.body.scrollHeight;

      smoothScrollTo(contactY, 3000, () => {
        // Highlight social channels
        const githubBtn = document.querySelector('a[href*="github.com/ravinder0710"]');
        const linkedinBtn = document.querySelector('a[href*="linkedin.com/in/ravinder-gupta-da"]');

        if (githubBtn) {
          moveCursorToElement(githubBtn, 1400, () => {
            if (linkedinBtn) {
              moveCursorToElement(linkedinBtn, 1400, () => {
                // Glide back to top
                const backToTop = document.getElementById('backToTopBtn');
                moveCursorToElement(backToTop, 1000, () => {
                  smoothScrollTo(0, 2200, () => {
                    // Trigger Grand Finale
                    showGrandFinaleModal();
                  });
                });
              });
            }
          });
        }
      });
    }, 1000);
  }

  // ==========================================
  // STEP 7: GRAND FINALE "RG + THANK YOU" MODAL
  // ==========================================
  function createThankYouModal() {
    if (document.getElementById('thankYouOutroModal')) return;
    const modal = document.createElement('div');
    modal.id = 'thankYouOutroModal';
    modal.className = 'fixed inset-0 z-[100000] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 opacity-0 pointer-events-none transition-opacity duration-1000 ease-out select-none';
    modal.innerHTML = `
      <div class="relative max-w-lg w-full flex flex-col items-center space-y-6">
        <!-- 3D Monogram Badge with Continuous Laser Glow -->
        <div class="relative group">
          <div class="w-24 h-24 rounded-3xl p-[3px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-2xl shadow-cyan-500/50 animate-pulse">
            <div class="w-full h-full bg-[#080d1a] rounded-[21px] flex items-center justify-center font-black text-4xl text-white tracking-widest">
              RG
            </div>
          </div>
          <div class="absolute -inset-4 bg-cyan-500/30 rounded-full blur-2xl -z-10 animate-ping" style="animation-duration: 3s;"></div>
        </div>

        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            ● Executive BI Architecture
          </div>
          <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            RAVINDER GUPTA<span class="text-cyan-400">.</span>
          </h1>
          <p class="text-sm font-mono text-cyan-300">
            Data Analyst &amp; Business Intelligence Specialist
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3 max-w-md w-full">
          <h2 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300">
            Thank You for Watching!
          </h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ready to deploy enterprise dimensional models, DAX cockpits, and serverless data pipelines for your organization.
          </p>
          <div class="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">iamravindergupta17@gmail.com</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Gurugram, India</span>
          </div>
        </div>

        <div class="pt-2 flex items-center gap-3">
          <button onclick="document.getElementById('thankYouOutroModal').classList.add('opacity-0', 'pointer-events-none'); sessionStorage.removeItem('rg_tour_active');" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-slate-200 transition shadow-lg cursor-pointer">
            Explore Portfolio Manually ➔
          </button>
          <button onclick="window.location.href='index.html?tour=1&step=start';" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 transition cursor-pointer">
            Replay Showcase ↺
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function showGrandFinaleModal() {
    updateHUD('Showcase Completed (02:30)');
    const modal = document.getElementById('thankYouOutroModal');
    if (modal) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
    }
  }

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
