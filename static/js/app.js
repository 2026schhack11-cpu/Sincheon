/**
 * app.js - 지식의 도미노 (Domino of Knowledge) 메인 애플리케이션 컨트롤러
 * 2022 개정 교육과정 기준 수학, 물리, 화학 학습 통합
 */

class DominoApp {
  constructor() {
    this.currentSubject = 'math';
    this.uploadedImageBase64 = null;
    this.currentProblemData = null;
    this.selectedStepIndex = null;
    this.activeConceptKey = null;
    this.activeConceptData = null;
    this.selectedQuizOption = null;
    this.quizSubmitted = false;
    this.completedSteps = new Set();
    this.curriculumData = null;

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.updateApiKeyStatusUI();
    this.setSubject('math');
    this.curriculumData = await window.AppAPI.fetchCurriculum();
    this.refreshIcons();

    // 브라우저 클립보드 붙여넣기(Ctrl+V) 지원
    window.addEventListener('paste', (e) => this.handlePasteImage(e));
  }

  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupEventListeners() {
    // 드롭존 드래그 앤 드롭
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('border-sky-500', 'bg-sky-50/50');
        });
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('border-sky-500', 'bg-sky-50/50');
        });
      });
      dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          this.processImageFile(files[0]);
        }
      });
    }
  }

  // 알림 배너
  showAlert(message, type = 'info') {
    const banner = document.getElementById('alertBanner');
    const msg = document.getElementById('alertMessage');
    const icon = document.getElementById('alertIcon');
    if (!banner || !msg) return;

    msg.innerHTML = message;
    banner.className = 'rounded-xl p-4 text-sm flex items-start gap-3 border shadow-sm transition';
    if (type === 'error') {
      banner.classList.add('bg-rose-50', 'border-rose-200', 'text-rose-900');
      icon.setAttribute('data-lucide', 'alert-circle');
    } else if (type === 'success') {
      banner.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-900');
      icon.setAttribute('data-lucide', 'check-circle');
    } else {
      banner.classList.add('bg-sky-50', 'border-sky-200', 'text-sky-900');
      icon.setAttribute('data-lucide', 'info');
    }
    banner.classList.remove('hidden');
    this.refreshIcons();
  }

  hideAlert() {
    const banner = document.getElementById('alertBanner');
    if (banner) banner.classList.add('hidden');
  }

  // 1. 과목 전환 (수학 / 물리 / 화학)
  setSubject(subject) {
    this.currentSubject = subject;
    const tabMath = document.getElementById('tab-math');
    const tabPhysics = document.getElementById('tab-physics');
    const tabChem = document.getElementById('tab-chemistry');
    const bannerText = document.getElementById('subjectBannerText');
    const banner = document.getElementById('subjectBanner');

    // 탭 스타일 초기화
    [tabMath, tabPhysics, tabChem].forEach(tab => {
      if (tab) {
        tab.className = 'subject-tab flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap text-slate-600 hover:text-slate-900';
      }
    });

    if (subject === 'math') {
      tabMath.className = 'subject-tab flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap bg-white text-indigo-600 shadow-sm';
      banner.className = 'mt-4 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between';
      bannerText.innerHTML = '<strong>2022 개정 공통수학1, 대수, 미적분Ⅰ</strong> 지원: 대수적 풀이와 선수 개념 역추적';
    } else if (subject === 'physics') {
      tabPhysics.className = 'subject-tab flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap bg-white text-sky-600 shadow-sm';
      banner.className = 'mt-4 p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between';
      bannerText.innerHTML = '<strong>2022 개정 물리학 (역학과 에너지, 전자기와 양자)</strong> 지원: 힘 분석, 자유물체도(FBD), 법칙 연계';
    } else if (subject === 'chemistry') {
      tabChem.className = 'subject-tab flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap bg-white text-emerald-600 shadow-sm';
      banner.className = 'mt-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between';
      bannerText.innerHTML = '<strong>2022 개정 화학 (화학 반응의 양적 관계, 몰, 원자 구조)</strong> 지원: 계수비-몰비, 입자 모형 분석';
    }

    this.refreshIcons();
  }

  // 2. 이미지 업로드 처리
  handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.processImageFile(file);
    }
  }

  handlePasteImage(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        this.processImageFile(file);
        this.showAlert('클립보드의 이미지가 성공적으로 추가되었습니다.', 'success');
        break;
      }
    }
  }

  processImageFile(file) {
    if (!file.type.startsWith('image/')) {
      this.showAlert('이미지 파일(PNG, JPG 등)만 업로드할 수 있습니다.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImageBase64 = e.target.result;
      document.getElementById('imagePreview').src = this.uploadedImageBase64;
      document.getElementById('imagePreviewContainer').classList.remove('hidden');
      document.getElementById('dropzonePlaceholder').classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  removeImage(event) {
    if (event) event.stopPropagation();
    this.uploadedImageBase64 = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreviewContainer').classList.add('hidden');
    document.getElementById('dropzonePlaceholder').classList.remove('hidden');
  }

  // 3. 대표 예제 불러오기
  loadPresetExample() {
    const preset = window.MOCK_DATA.examples[this.currentSubject];
    if (preset) {
      document.getElementById('problemTextInput').value = preset.problem_statement;
      this.showAlert(`[${preset.title}] 예제 내용이 입력창에 불러와졌습니다.`, 'info');
    }
  }

  selectSubjectAndLoadDemo(subject) {
    this.setSubject(subject);
    const demo = window.MOCK_DATA.examples[subject];
    if (demo) {
      this.currentProblemData = demo;
      this.completedSteps.clear();
      this.showSolutionView();
    }
  }

  // 동적 실시간 로딩 애니메이션 및 단계별 체커
  startLoadingAnimation(subjectName) {
    this.loadingStartTime = Date.now();
    const timerElem = document.getElementById('loadingTimerText');
    const progressBar = document.getElementById('loadingProgressBar');
    const percentElem = document.getElementById('loadingPercentLabel');
    const stepLabelElem = document.getElementById('loadingStepLabel');
    const tipElem = document.getElementById('loadingTipText');

    const tips = [
      "'지식의 도미노'는 정답만 알려주지 않고, 내가 막힌 지점의 기초 개념을 찾아줍니다.",
      "2022 개정 교육과정에서는 공식의 단순 암기보다 개념의 전후 인과관계 파악이 중요합니다.",
      "물리에서는 수직과 수평 방향을 나누어 힘의 합력(알짜힘)을 먼저 분석하는 것이 핵심입니다.",
      "화학 반응식의 계수비는 입자 수와 몰수의 비이며, 질량비와는 절대 같지 않습니다.",
      "인수분해는 다항식 전개의 역과정으로, 분배법칙을 이해하면 훨씬 쉬워집니다.",
      "막힌 단계를 직접 선택하면 필요한 선수 개념을 도미노처럼 연결해 드립니다."
    ];
    let tipIdx = 0;

    // 초기화
    for (let i = 1; i <= 5; i++) {
      const row = document.getElementById(`chk-step-${i}`);
      if (!row) continue;
      const icon = row.querySelector('.step-icon');
      const status = row.querySelector('.step-status');
      if (i === 1) {
        row.className = 'flex items-center gap-3 transition-all';
        icon.className = 'step-icon w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 shadow-sm step-pulse';
        icon.innerHTML = '1';
        status.className = 'step-status text-[11px] font-semibold text-indigo-600';
        status.innerText = '분석 중...';
      } else {
        row.className = 'flex items-center gap-3 transition-all opacity-40';
        icon.className = 'step-icon w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[11px] flex-shrink-0';
        icon.innerHTML = String(i);
        status.className = 'step-status text-[11px] text-slate-400';
        status.innerText = '대기 중';
      }
    }

    // 100ms마다 타이머 및 진행률 업데이트
    this.loadingTimerInterval = setInterval(() => {
      const elapsedSec = (Date.now() - this.loadingStartTime) / 1000;
      if (timerElem) {
        timerElem.innerText = `${elapsedSec.toFixed(1)}초 경과`;
      }

      // 시간에 따른 자연스러운 진행률 & 단계 시뮬레이션
      let targetPercent = 15;
      let activeStep = 1;
      let label = '1단계: 문제 이미지 및 텍스트 인식 중...';

      if (elapsedSec < 1.6) {
        targetPercent = Math.min(25, 12 + elapsedSec * 8);
        activeStep = 1;
        label = '1단계: 문제 이미지 및 수식 정밀 판독 중...';
      } else if (elapsedSec < 3.5) {
        targetPercent = Math.min(50, 25 + (elapsedSec - 1.6) * 13);
        activeStep = 2;
        label = `2단계: 2022 개정 ${subjectName} 단원 및 성취기준 분석 중...`;
      } else if (elapsedSec < 5.8) {
        targetPercent = Math.min(72, 50 + (elapsedSec - 3.5) * 10);
        activeStep = 3;
        label = '3단계: 3~5개 사고 단계 분할 및 핵심 수식 설계 중...';
      } else if (elapsedSec < 8.2) {
        targetPercent = Math.min(88, 72 + (elapsedSec - 5.8) * 7);
        activeStep = 4;
        label = '4단계: 기초 개념 역추적 도미노 체인 구축 중...';
      } else {
        targetPercent = Math.min(96, 88 + (elapsedSec - 8.2) * 1.5);
        activeStep = 5;
        label = '5단계: 개념 카드 및 진단 확인 퀴즈 검증 중...';
      }

      if (progressBar) progressBar.style.width = `${targetPercent.toFixed(0)}%`;
      if (percentElem) percentElem.innerText = `${targetPercent.toFixed(0)}%`;
      if (stepLabelElem) stepLabelElem.innerText = label;

      // 단계별 체크리스트 시각 상태 업데이트
      for (let i = 1; i <= 5; i++) {
        const row = document.getElementById(`chk-step-${i}`);
        if (!row) continue;
        const icon = row.querySelector('.step-icon');
        const status = row.querySelector('.step-status');

        if (i < activeStep) {
          // 완료된 단계
          row.className = 'flex items-center gap-3 transition-all';
          icon.className = 'step-icon w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 shadow-sm';
          icon.innerHTML = '✓';
          status.className = 'step-status text-[11px] font-semibold text-emerald-600';
          status.innerText = '완료됨';
        } else if (i === activeStep) {
          // 현재 진행 중인 단계
          row.className = 'flex items-center gap-3 transition-all';
          icon.className = 'step-icon w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 shadow-sm step-pulse';
          icon.innerHTML = String(i);
          status.className = 'step-status text-[11px] font-semibold text-indigo-600';
          status.innerText = '분석 중...';
        } else {
          // 대기 중인 단계
          row.className = 'flex items-center gap-3 transition-all opacity-40';
          icon.className = 'step-icon w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[11px] flex-shrink-0';
          icon.innerHTML = String(i);
          status.className = 'step-status text-[11px] text-slate-400';
          status.innerText = '대기 중';
        }
      }
    }, 100);

    // 2.5초마다 학습 팁 회전
    this.tipInterval = setInterval(() => {
      tipIdx = (tipIdx + 1) % tips.length;
      if (tipElem) {
        tipElem.style.opacity = '0';
        setTimeout(() => {
          tipElem.innerText = tips[tipIdx];
          tipElem.style.opacity = '1';
        }, 200);
      }
    }, 2800);
  }

  stopLoadingAnimation() {
    if (this.loadingTimerInterval) {
      clearInterval(this.loadingTimerInterval);
      this.loadingTimerInterval = null;
    }
    if (this.tipInterval) {
      clearInterval(this.tipInterval);
      this.tipInterval = null;
    }

    // 100% 완료 상태 표시
    const progressBar = document.getElementById('loadingProgressBar');
    const percentElem = document.getElementById('loadingPercentLabel');
    const stepLabelElem = document.getElementById('loadingStepLabel');
    if (progressBar) progressBar.style.width = '100%';
    if (percentElem) percentElem.innerText = '100%';
    if (stepLabelElem) stepLabelElem.innerText = '분석 완료! 풀이 화면을 불러옵니다.';

    for (let i = 1; i <= 5; i++) {
      const row = document.getElementById(`chk-step-${i}`);
      if (!row) continue;
      const icon = row.querySelector('.step-icon');
      const status = row.querySelector('.step-status');
      row.className = 'flex items-center gap-3 transition-all';
      if (icon) {
        icon.className = 'step-icon w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 shadow-sm';
        icon.innerHTML = '✓';
      }
      if (status) {
        status.className = 'step-status text-[11px] font-semibold text-emerald-600';
        status.innerText = '완료됨';
      }
    }
  }

  // 4. 문제 분석 시작 (AI 호출 또는 데모)
  async startAnalysis() {
    const textInput = document.getElementById('problemTextInput').value.trim();
    
    if (!textInput && !this.uploadedImageBase64) {
      // 아무것도 입력 안했을 때 현재 과목 대표 예제로 안내
      this.selectSubjectAndLoadDemo(this.currentSubject);
      return;
    }

    // 로딩 화면 표시 및 실시간 동적 프로그레스 시작
    this.showSection('loadingSection');
    const subjectName = { math: '수학', physics: '물리', chemistry: '화학' }[this.currentSubject] || '수학';
    this.startLoadingAnimation(subjectName);

    try {
      const result = await window.AppAPI.analyzeProblem({
        subject: this.currentSubject,
        problemText: textInput,
        imageBase64: this.uploadedImageBase64
      });

      this.currentProblemData = result;
      this.completedSteps.clear();

      // 100% 완료 표시 후 부드럽게 화면 전환
      this.stopLoadingAnimation();
      await new Promise(r => setTimeout(r, 450));

      if (result._mode === 'live_gemini') {
        this.showAlert(`<strong>Gemini 실시간 AI 분석 완료!</strong> (${result._model_used} 모델 / 2022 개정 교육과정 기준 단계별 풀이 생성)`, 'success');
      } else if (result._notice) {
        this.showAlert(result._notice, 'info');
      } else if (result._error_detail) {
        this.showAlert(result._error_detail, 'info');
      }

      this.showSolutionView();
    } catch (e) {
      console.error(e);
      this.stopLoadingAnimation();
      this.showAlert('문제 분석 중 오류가 발생하여 내장 예제로 전환합니다: ' + e.message, 'error');
      this.selectSubjectAndLoadDemo(this.currentSubject);
    }
  }

  formatFormula(formula) {
    if (!formula) return '';
    const cleaned = window.AppAPI.cleanMathText(formula);
    const f = cleaned.trim();
    if (!f.includes('$') && !f.includes('\\(') && !f.includes('\\[')) {
      return `$$${f}$$`;
    }
    return f;
  }

  // 5. 단계별 풀이 화면 (Solution View)
  showSolutionView() {
    if (!this.currentProblemData) return;

    this.showSection('solutionStepsSection');

    // 과목 뱃지 및 단원 뱃지
    const subjectBadge = document.getElementById('problemSubjectBadge');
    const curriculumBadge = document.getElementById('problemCurriculumBadge');
    const titleElem = document.getElementById('problemTitle');
    const statementElem = document.getElementById('problemStatement');

    const subjectMap = {
      math: { text: '수학', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      physics: { text: '물리', class: 'bg-sky-50 text-sky-700 border-sky-200' },
      chemistry: { text: '화학', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    };
    const sInfo = subjectMap[this.currentProblemData.subject] || subjectMap.math;
    subjectBadge.className = `px-2.5 py-1 text-xs font-bold rounded-lg border ${sInfo.class}`;
    subjectBadge.innerText = sInfo.text;

    curriculumBadge.innerText = this.currentProblemData.curriculum_badge || '2022 개정 교육과정';
    titleElem.innerText = window.AppAPI.cleanMathText(this.currentProblemData.title || '문제 분석 결과');
    statementElem.innerHTML = window.AppAPI.cleanMathText(this.currentProblemData.problem_statement || '');

    // 단계별 카드 렌더링
    const container = document.getElementById('stepsContainer');
    container.innerHTML = '';

    (this.currentProblemData.steps || []).forEach((step, idx) => {
      const isCompleted = this.completedSteps.has(step.step_index);
      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl border transition-all ${
        isCompleted 
          ? 'bg-emerald-50/40 border-emerald-300 shadow-sm' 
          : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
      }`;

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-slate-800'} text-white text-xs font-bold flex items-center justify-center">
                ${isCompleted ? '✓' : step.step_index}
              </span>
              <h3 class="text-base font-bold text-slate-900">${window.AppAPI.cleanMathText(step.title)}</h3>
              ${isCompleted ? '<span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">개념 보완 완료</span>' : ''}
            </div>

            <!-- 핵심 공식 / 관계 -->
            <div class="p-3 bg-slate-900 text-sky-200 rounded-xl text-sm font-semibold math-content overflow-x-auto">
              ${this.formatFormula(step.core_formula)}
            </div>

            <!-- 설명 -->
            <p class="text-xs text-slate-600 leading-relaxed math-content">
              ${window.AppAPI.cleanMathText(step.description)}
            </p>
          </div>

          <!-- 막힘 선택 버튼 -->
          <div class="pt-2 sm:pt-0 sm:pl-4 flex-shrink-0 flex sm:flex-col items-center gap-2">
            ${
              isCompleted
                ? `<span class="text-xs font-medium text-emerald-600 flex items-center gap-1">
                     <i data-lucide="check-circle" class="w-4 h-4"></i> 이해 확인됨
                   </span>`
                : `<button onclick="app.selectStuckStep(${step.step_index}, '${step.domino_root}')" class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition flex items-center gap-1.5 shadow-sm">
                     <i data-lucide="help-circle" class="w-4 h-4 text-indigo-500"></i>
                     <span>이 과정이 이해되지 않아요</span>
                   </button>`
            }
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // KaTeX 렌더링 호출
    window.AppAPI.renderMathInElement(statementElem);
    window.AppAPI.renderMathInElement(container);
    this.refreshIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 6. 막힌 단계 선택 -> 개념 역추적 도미노 화면으로 전환
  selectStuckStep(stepIndex, dominoRootKey) {
    this.selectedStepIndex = stepIndex;
    this.activeConceptKey = dominoRootKey;

    const dominoTree = this.currentProblemData.domino_tree || {};
    let conceptData = dominoTree[dominoRootKey];

    // 만약 트리에서 못 찾으면 첫 번째 개념으로 대체
    if (!conceptData) {
      const keys = Object.keys(dominoTree);
      if (keys.length > 0) {
        conceptData = dominoTree[keys[0]];
        this.activeConceptKey = keys[0];
      }
    }

    this.activeConceptData = conceptData;
    this.selectedQuizOption = null;
    this.quizSubmitted = false;

    this.showConceptLearningView();
  }

  // 7. 개념 학습 및 퀴즈 화면 렌더링
  showConceptLearningView() {
    this.showSection('conceptLearningSection');

    const data = this.activeConceptData;
    if (!data) return;

    // 네비게이션 컨텍스트
    document.getElementById('conceptNavContext').innerText = 
      `원래 문제 ${this.selectedStepIndex}단계에서 막힌 원인을 역추적 학습 중입니다.`;

    // 1. 도미노 체인 렌더링
    window.Visualizers.renderDominoChain('dominoChainContainer', data, (type, idx) => {
      if (type === 'pre' && data.prerequisites && data.prerequisites[idx]) {
        const pre = data.prerequisites[idx];
        // 선수 개념 정보로 가벼운 안내 팝업 또는 개념 전환
        this.showAlert(`<strong>[선수 개념] ${pre.name}</strong> (${pre.curriculum}):<br>${pre.desc}`, 'info');
      } else {
        this.hideAlert();
      }
    });

    // 2. 개념 기본 정보
    document.getElementById('conceptCurriculumTag').innerText = data.curriculum || '2022 개정 교육과정';
    document.getElementById('conceptName').innerText = window.AppAPI.cleanMathText(data.concept_name);
    document.getElementById('conceptShortExplanation').innerHTML = window.AppAPI.cleanMathText(data.short_explanation || '');
    document.getElementById('conceptFormulaBox').innerHTML = this.formatFormula(data.core_formula);

    // 기호 의미 목록
    const symbolsList = document.getElementById('conceptSymbolsList');
    symbolsList.innerHTML = '';
    (data.symbol_meanings || []).forEach(sym => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between p-1.5 rounded bg-white border border-slate-100';
      row.innerHTML = `<span class="font-bold text-slate-800 math-content">${this.formatFormula(sym.symbol)}</span><span class="text-slate-600">${window.AppAPI.cleanMathText(sym.meaning)}</span>`;
      symbolsList.appendChild(row);
    });

    // 3. 과목별 인터랙티브 시각자료 렌더링
    const visContainer = document.getElementById('visualizerCanvasContainer');
    const visTitle = document.getElementById('visualizerTitle');
    const subj = this.currentProblemData.subject;

    if (subj === 'physics') {
      visTitle.innerText = '물리 시각화: 물체에 작용하는 힘과 자유물체도(FBD)';
      window.Visualizers.renderPhysicsFBD('visualizerCanvasContainer', data.fbd_data);
    } else if (subj === 'chemistry') {
      visTitle.innerText = '화학 시각화: 반응 전후 입자 모델 및 실시간 몰수 변환';
      window.Visualizers.renderChemistryWidget('visualizerCanvasContainer');
    } else {
      visTitle.innerText = '수학 시각화: 대각선 곱과 인수분해 구조';
      window.Visualizers.renderMathVisualizer('visualizerCanvasContainer');
    }

    // 4. 적용 예제
    if (data.example) {
      document.getElementById('exampleQuestion').innerHTML = window.AppAPI.cleanMathText(data.example.question);
      const stepsDiv = document.getElementById('exampleSteps');
      stepsDiv.innerHTML = '';
      (data.example.solution_steps || []).forEach((st, i) => {
        const stepP = document.createElement('p');
        stepP.className = 'math-content';
        stepP.innerHTML = `<strong>단계 ${i + 1}:</strong> ${window.AppAPI.cleanMathText(st)}`;
        stepsDiv.appendChild(stepP);
      });
    }

    // 5. 확인 퀴즈 렌더링
    this.renderQuiz(data.quiz);

    // KaTeX 수식 적용
    window.AppAPI.renderMathInElement(document.getElementById('conceptCard'));
    this.refreshIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderQuiz(quiz) {
    const qBox = document.getElementById('quizQuestion');
    const optContainer = document.getElementById('quizOptionsContainer');
    const submitBtn = document.getElementById('submitQuizBtn');
    const feedbackBox = document.getElementById('quizFeedbackBox');

    feedbackBox.classList.add('hidden');
    submitBtn.disabled = true;
    this.selectedQuizOption = null;
    this.quizSubmitted = false;

    if (!quiz) {
      qBox.innerText = '준비된 확인 문제가 없습니다.';
      optContainer.innerHTML = '';
      return;
    }

    qBox.innerHTML = window.AppAPI.cleanMathText(quiz.question);
    optContainer.innerHTML = '';

    (quiz.options || []).forEach((opt, idx) => {
      const cleanOpt = window.AppAPI.cleanMathText(opt);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option-btn p-3 rounded-xl bg-white text-left text-xs font-medium text-slate-700 flex items-center gap-2.5';
      btn.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-600 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
          ${idx + 1}
        </span>
        <span class="flex-1 math-content">${cleanOpt}</span>
      `;
      btn.onclick = () => this.selectQuizOption(idx);
      optContainer.appendChild(btn);
    });

    window.AppAPI.renderMathInElement(qBox);
    window.AppAPI.renderMathInElement(optContainer);
  }

  selectQuizOption(idx) {
    if (this.quizSubmitted) return;
    this.selectedQuizOption = idx;

    const btns = document.querySelectorAll('.quiz-option-btn');
    btns.forEach((b, i) => {
      if (i === idx) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });

    document.getElementById('submitQuizBtn').disabled = false;
  }

  submitQuiz() {
    if (this.selectedQuizOption === null || this.quizSubmitted) return;
    this.quizSubmitted = true;

    const quiz = this.activeConceptData.quiz;
    const isCorrect = this.selectedQuizOption === quiz.correct_index;

    const btns = document.querySelectorAll('.quiz-option-btn');
    btns.forEach((b, i) => {
      if (i === quiz.correct_index) {
        b.classList.add('correct');
      } else if (i === this.selectedQuizOption && !isCorrect) {
        b.classList.add('incorrect');
      }
    });

    const feedbackBox = document.getElementById('quizFeedbackBox');
    const fbTitle = document.getElementById('feedbackTitle');
    const fbExp = document.getElementById('feedbackExplanation');
    const fbMis = document.getElementById('feedbackMistakeAnalysis');
    const fbIcon = document.getElementById('feedbackIcon');

    feedbackBox.className = `p-4 rounded-xl border transition mt-3 space-y-2 ${
      isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
    }`;
    fbTitle.innerText = isCorrect ? '정답입니다! 완벽하게 개념을 이해하셨네요.' : '아쉽지만 오답입니다. 오답 분석을 확인해 보세요!';
    fbExp.innerHTML = `<strong>해설:</strong> ${window.AppAPI.cleanMathText(quiz.explanation)}`;
    fbMis.innerHTML = `<strong>💡 오답 분석 & 주의할 점:</strong> ${window.AppAPI.cleanMathText(quiz.mistake_analysis || '공식의 조건과 계산 부호를 다시 한 번 확인해 보세요.')}`;
    
    fbIcon.setAttribute('data-lucide', isCorrect ? 'check-circle-2' : 'alert-circle');
    feedbackBox.classList.remove('hidden');

    document.getElementById('submitQuizBtn').disabled = true;
    window.AppAPI.renderMathInElement(feedbackBox);
    this.refreshIcons();
  }

  // 8. 개념 학습 완료 및 원래 문제로 복귀
  completeConceptAndReturn() {
    if (this.selectedStepIndex !== null) {
      this.completedSteps.add(this.selectedStepIndex);
    }
    this.showAlert(`<strong>${this.selectedStepIndex}단계</strong>의 기초 개념을 보완했습니다. 이제 다음 풀이 과정을 스스로 해결해 보세요!`, 'success');
    this.showSolutionView();
  }

  returnToProblem() {
    this.showSolutionView();
  }

  resetToHome() {
    this.showSection('problemInputSection');
    this.currentProblemData = null;
    this.selectedStepIndex = null;
    this.activeConceptKey = null;
    this.activeConceptData = null;
    this.completedSteps.clear();
    this.hideAlert();
    this.removeImage();
    document.getElementById('problemTextInput').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showSection(sectionId) {
    const sections = ['problemInputSection', 'loadingSection', 'solutionStepsSection', 'conceptLearningSection'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === sectionId) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });
  }

  // 9. API 키 모달 제어
  openApiKeyModal() {
    const input = document.getElementById('apiKeyInput');
    const select = document.getElementById('modelSelect');
    const resultBox = document.getElementById('keyCheckResult');
    
    input.value = window.AppAPI.getStoredApiKey();
    select.value = window.AppAPI.getStoredModel();
    resultBox.className = 'hidden';

    document.getElementById('apiKeyModal').classList.remove('hidden');
    this.refreshIcons();
  }

  closeApiKeyModal() {
    document.getElementById('apiKeyModal').classList.add('hidden');
  }

  updateModelSelectOptions(availableModels, selectedModel) {
    const select = document.getElementById('modelSelect');
    if (!select) return;

    let html = `<option value="gemini-3.5-flash">Gemini 3.5 Flash (스마트 최적화 매핑)</option>`;
    availableModels.forEach(m => {
      const isSel = (m === selectedModel) ? 'selected' : '';
      html += `<option value="${m}" ${isSel}>${m} (API 활성화됨)</option>`;
    });
    select.innerHTML = html;
  }

  async saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    const model = document.getElementById('modelSelect').value;
    const saveBtn = document.getElementById('saveKeyBtn');
    const resultBox = document.getElementById('keyCheckResult');

    if (!key) {
      window.AppAPI.setStoredApiKey('');
      this.updateApiKeyStatusUI();
      this.closeApiKeyModal();
      this.showAlert('API 키가 삭제되어 내장 예제 모드로 동작합니다.', 'info');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerText = '연결 확인 중...';
    resultBox.className = 'p-2.5 rounded-lg text-xs bg-slate-100 text-slate-700';
    resultBox.innerText = 'Google Gemini 서버와 모델 목록을 조회하고 있습니다...';
    resultBox.classList.remove('hidden');

    const res = await window.AppAPI.checkKey(key, model);
    saveBtn.disabled = false;
    saveBtn.innerText = '검증 및 저장';

    if (res.valid) {
      window.AppAPI.setStoredApiKey(key);
      const chosenModel = res.connected_model || model;
      window.AppAPI.setStoredModel(chosenModel);

      if (res.available_models && res.available_models.length > 0) {
        this.updateModelSelectOptions(res.available_models, chosenModel);
      }

      resultBox.className = 'p-2.5 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200';
      resultBox.innerText = res.message || 'Gemini API 연결 확인 완료!';
      this.updateApiKeyStatusUI();
      setTimeout(() => this.closeApiKeyModal(), 1400);
    } else {
      resultBox.className = 'p-2.5 rounded-lg text-xs bg-rose-50 text-rose-800 border border-rose-200';
      resultBox.innerText = res.message || 'API 키 검증에 실패했습니다. 키를 다시 확인해 주세요.';
    }
  }

  clearApiKey() {
    window.AppAPI.setStoredApiKey('');
    document.getElementById('apiKeyInput').value = '';
    this.updateApiKeyStatusUI();
    this.closeApiKeyModal();
    this.showAlert('API 키가 삭제되었습니다. 내장 2022 개정 예제로 학습하실 수 있습니다.', 'info');
  }

  updateApiKeyStatusUI() {
    const key = window.AppAPI.getStoredApiKey();
    const model = window.AppAPI.getStoredModel();
    const dot = document.getElementById('apiKeyStatusDot');
    const text = document.getElementById('apiKeyBtnText');
    const modelLabel = document.getElementById('activeModelLabel');

    if (key) {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
      text.innerText = `Gemini 연결됨 (${model})`;
    } else {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
      text.innerText = 'API 키 설정 (내장 모드)';
    }

    if (modelLabel) {
      modelLabel.innerHTML = `선택 AI 모델: <strong class="text-slate-800 font-bold">${model}</strong>`;
    }
  }

  // 10. 2022 개정 교육과정 단원표 모달
  openCurriculumModal() {
    const modal = document.getElementById('curriculumModal');
    const body = document.getElementById('curriculumModalBody');
    if (!this.curriculumData) {
      body.innerHTML = '<p>단원 체계를 불러오는 중...</p>';
    } else {
      let html = '';
      const subjKeys = [
        { key: 'math', title: '수학 (2022 개정)', color: 'text-indigo-600 bg-indigo-50' },
        { key: 'physics', title: '물리 (2022 개정 물리학)', color: 'text-sky-600 bg-sky-50' },
        { key: 'chemistry', title: '화학 (2022 개정 화학)', color: 'text-emerald-600 bg-emerald-50' }
      ];

      subjKeys.forEach(s => {
        const item = this.curriculumData[s.key];
        if (!item) return;

        html += `
          <div class="p-3 rounded-xl border border-slate-200">
            <h4 class="text-xs font-bold px-2 py-1 rounded inline-block ${s.color} mb-2">${s.title}</h4>
            <div class="space-y-2">
        `;

        const courses = item.courses || item.units || [];
        courses.forEach(c => {
          html += `<div class="font-semibold text-slate-800">${c.title || c.course || ''}</div>`;
          const units = c.units || c.chapters || [];
          units.forEach(u => {
            const topics = u.topics || u.sections || [];
            html += `
              <div class="ml-2 pl-2 border-l-2 border-slate-200 text-[11px] text-slate-600">
                <span class="font-medium text-slate-700">${u.name}:</span>
                <span>${topics.join(', ')}</span>
              </div>
            `;
          });
        });

        html += `</div></div>`;
      });

      body.innerHTML = html;
    }

    modal.classList.remove('hidden');
    this.refreshIcons();
  }

  closeCurriculumModal() {
    document.getElementById('curriculumModal').classList.add('hidden');
  }
}

// 애플리케이션 인스턴스 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DominoApp();
});
