/**
 * visualizers.js - 인터랙티브 시각화 모듈
 * 1. 도미노 체인 역추적 렌더러
 * 2. 물리: 자유물체도(Free Body Diagram) 캔버스
 * 3. 화학: 반응 입자 모형 및 몰 변환기
 * 4. 수학: 십자 인수분해 대각선 곱 모형
 */

window.Visualizers = {
  // 1. 도미노 체인 렌더러
  renderDominoChain: function(containerId, rootConcept, onSelectConcept) {
    const container = document.getElementById(containerId);
    if (!container || !rootConcept) return;

    let html = '';
    
    // 도미노 루트 (선택된 단계의 핵심 개념)
    html += `
      <div class="domino-tile active" id="domino-root" onclick="window.Visualizers.handleDominoClick('root')">
        <div class="domino-dots">
          <span class="domino-dot"></span>
          <span class="domino-dot"></span>
          <span class="domino-dot"></span>
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">핵심 개념</span>
          <span class="text-xs font-bold text-slate-800 leading-tight mt-0.5 line-clamp-2 math-content">${rootConcept.concept_name}</span>
        </div>
        <div class="mt-1 text-[9px] text-indigo-500 font-semibold flex items-center justify-between">
          <span>현재 학습 중</span>
          <span>●</span>
        </div>
      </div>
    `;

    // 선수 개념들 (Prerequisites)
    if (rootConcept.prerequisites && rootConcept.prerequisites.length > 0) {
      rootConcept.prerequisites.forEach((pre, idx) => {
        html += `
          <div class="domino-connector flex items-center">
            <svg class="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </div>
          <div class="domino-tile" id="domino-pre-${idx}" onclick="window.Visualizers.handleDominoClick('pre', ${idx})">
            <div class="domino-dots">
              <span class="domino-dot"></span>
              <span class="domino-dot"></span>
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">선수 개념 ${idx + 1}</span>
              <span class="text-xs font-bold text-slate-700 leading-tight mt-0.5 line-clamp-2 math-content">${pre.name}</span>
            </div>
            <div class="mt-1 text-[9px] text-slate-400 font-medium">
              클릭하여 개념 보기
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
    window._currentDominoCallback = onSelectConcept;

    if (window.AppAPI && window.AppAPI.renderMathInElement) {
      window.AppAPI.renderMathInElement(container);
    }
  },

  handleDominoClick: function(type, index) {
    if (window._currentDominoCallback) {
      window._currentDominoCallback(type, index);
    }
  },

  // 2. 물리: 자유물체도(FBD) 캔버스 렌더러
  renderPhysicsFBD: function(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col items-center w-full">
        <canvas id="fbdCanvas" width="480" height="220" class="w-full max-w-[480px] h-[220px] shadow-inner border border-slate-200"></canvas>
        <div class="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-600">
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> 외력 $F_1 = 20\\,\\text{N}$</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span> 외력 $F_2 = 8\\,\\text{N}$</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> 수직항력 $N$</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-gray-500 inline-block"></span> 중력 $mg$</div>
          <div class="flex items-center gap-1.5 font-bold text-indigo-600"><span class="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span> 알짜힘 $\\Sigma F = 12\\,\\text{N}$ (오른쪽)</div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const canvas = document.getElementById('fbdCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 10;

      // 캔버스 초기화
      ctx.clearRect(0, 0, w, h);

      // 바닥면 그리기
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, cy + 35);
      ctx.lineTo(w - 30, cy + 35);
      ctx.stroke();

      // 바닥 마찰 없음 빗금
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      for (let x = 40; x < w - 30; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, cy + 35);
        ctx.lineTo(x - 8, cy + 45);
        ctx.stroke();
      }

      // 물체 상자 (질량 4kg)
      const boxW = 80;
      const boxH = 60;
      const bx = cx - boxW / 2;
      const by = cy + 35 - boxH;

      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      // 상자 텍스트
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 13px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('m = 4 kg', cx, by + 34);

      // 화살표 그리기 헬퍼 함수
      function drawVector(startX, startY, length, angleRad, color, label) {
        const endX = startX + Math.cos(angleRad) * length;
        const endY = startY + Math.sin(angleRad) * length;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;

        // 선
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 화살표 머리
        const headlen = 9;
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // 라벨
        ctx.font = 'bold 12px Pretendard, sans-serif';
        const labelOffset = 18;
        ctx.fillText(label, endX + Math.cos(angle) * labelOffset, endY + Math.sin(angle) * labelOffset + 4);
      }

      const centerBoxX = cx;
      const centerBoxY = by + boxH / 2;

      // 수직항력 (위쪽: 90도 = -pi/2)
      drawVector(centerBoxX, centerBoxY, 50, -Math.PI / 2, '#10b981', 'N (39.2 N)');
      // 중력 (아래쪽: 270도 = pi/2)
      drawVector(centerBoxX, centerBoxY, 50, Math.PI / 2, '#6b7280', 'mg (39.2 N)');
      // 외력 F1 (오른쪽: 0도)
      drawVector(bx + boxW, centerBoxY, 70, 0, '#3b82f6', 'F1 (+20 N)');
      // 외력 F2 (왼쪽: 180도 = pi)
      drawVector(bx, centerBoxY, 35, Math.PI, '#ef4444', 'F2 (-8 N)');

      // 상단에 알짜힘 표시 (보라색 화살표)
      drawVector(cx - 30, 30, 60, 0, '#6366f1', 'ΣF = +12 N (오른쪽)');
    }, 50);
  },

  // 3. 화학: 반응 입자 모형 및 실시간 몰 계산기
  renderChemistryWidget: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="w-full space-y-4">
        <!-- 반응식 계수비 시각화 박스 -->
        <div class="p-3 bg-white rounded-xl border border-slate-200">
          <div class="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
            <span>반응식 입자 모형 비교</span>
            <span class="text-[11px] text-slate-400 font-normal">($\\mathrm{CH_4 + 2O_2 \\longrightarrow CO_2 + 2H_2O}$)</span>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-center text-xs">
            <!-- 반응물 -->
            <div class="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex flex-col items-center">
              <span class="font-bold text-emerald-700">반응물 (1 mol : 2 mol)</span>
              <div class="flex items-center gap-3 mt-2">
                <div class="text-center">
                  <div class="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[11px] shadow">CH₄</div>
                  <span class="text-[10px] text-slate-500 mt-0.5 block">1 분자</span>
                </div>
                <span class="text-lg font-bold text-emerald-600">+</span>
                <div class="text-center">
                  <div class="flex gap-1">
                    <div class="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow">O₂</div>
                    <div class="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow">O₂</div>
                  </div>
                  <span class="text-[10px] text-slate-500 mt-0.5 block">2 분자</span>
                </div>
              </div>
            </div>

            <!-- 생성물 -->
            <div class="p-2.5 rounded-lg bg-sky-50/60 border border-sky-100 flex flex-col items-center">
              <span class="font-bold text-sky-700">생성물 (1 mol : 2 mol)</span>
              <div class="flex items-center gap-3 mt-2">
                <div class="text-center">
                  <div class="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow">CO₂</div>
                  <span class="text-[10px] text-slate-500 mt-0.5 block">1 분자</span>
                </div>
                <span class="text-lg font-bold text-sky-600">+</span>
                <div class="text-center">
                  <div class="flex gap-1">
                    <div class="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px] shadow">H₂O</div>
                    <div class="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px] shadow">H₂O</div>
                  </div>
                  <span class="text-[10px] text-slate-500 mt-0.5 block">2 분자</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 인터랙티브 몰 변환기 위젯 -->
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-700">인터랙티브 몰(mol) 변환 실험기</span>
            <span class="text-[11px] text-slate-400">공식: $n = \\frac{m}{M}$</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <label class="block text-slate-500 mb-1">물질 선택</label>
              <select id="chemSubstanceSelect" onchange="window.Visualizers.updateMoleCalc()" class="w-full p-2 bg-white rounded-lg border border-slate-300 outline-none">
                <option value="16,CH4">메테인 (CH4, M=16)</option>
                <option value="44,CO2">이산화탄소 (CO2, M=44)</option>
                <option value="18,H2O">물 (H2O, M=18)</option>
                <option value="32,O2">산소 (O2, M=32)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-500 mb-1">질량 입력 (g)</label>
              <input type="number" id="chemMassInput" value="16" oninput="window.Visualizers.updateMoleCalc()" class="w-full p-2 bg-white rounded-lg border border-slate-300 outline-none">
            </div>
            <div class="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col justify-center">
              <span class="text-[10px] text-emerald-700 font-bold">계산된 몰수 (n)</span>
              <span id="chemCalcMoleResult" class="text-sm font-bold text-emerald-900">1.00 mol</span>
            </div>
          </div>
        </div>
      </div>
    `;

    window.Visualizers.updateMoleCalc();
  },

  updateMoleCalc: function() {
    const sel = document.getElementById('chemSubstanceSelect');
    const massInput = document.getElementById('chemMassInput');
    const resultBox = document.getElementById('chemCalcMoleResult');
    if (!sel || !massInput || !resultBox) return;

    const [molarMass, formula] = sel.value.split(',');
    const mass = parseFloat(massInput.value) || 0;
    const M = parseFloat(molarMass) || 1;
    const moles = mass / M;

    resultBox.innerHTML = `<strong>${moles.toFixed(2)}</strong> mol <span class="text-[10px] text-slate-500">(${(moles * 6.02).toFixed(2)} × 10²³ 개)</span>`;
  },

  // 4. 수학: 십자 인수분해 대각선 곱 모형
  renderMathVisualizer: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="w-full p-3 bg-white rounded-xl border border-slate-200">
        <div class="text-xs font-bold text-indigo-800 mb-2">대각선(십자) 곱셈 메커니즘: $2x^2 - 5x - 3$</div>
        <div class="flex items-center justify-center gap-8 py-3 bg-indigo-50/40 rounded-lg">
          <div class="text-center font-bold text-sm text-slate-800">
            <div class="p-1.5 bg-white border border-indigo-200 rounded shadow-sm">2x</div>
            <div class="my-2 text-indigo-400">✕</div>
            <div class="p-1.5 bg-white border border-indigo-200 rounded shadow-sm">x</div>
          </div>

          <div class="text-center font-bold text-sm text-slate-800">
            <div class="p-1.5 bg-white border border-indigo-200 rounded shadow-sm">+1</div>
            <div class="my-2 text-indigo-400">✕</div>
            <div class="p-1.5 bg-white border border-indigo-200 rounded shadow-sm">-3</div>
          </div>

          <div class="text-xs text-slate-600 pl-4 border-l border-indigo-200 space-y-1 text-left">
            <div>대각선 1: $2x \\times (-3) = -6x$</div>
            <div>대각선 2: $x \\times (+1) = +1x$</div>
            <div class="pt-1 font-bold text-indigo-700 border-t border-indigo-200">합: $-6x + 1x = -5x$ (일차항 일치!)</div>
          </div>
        </div>
      </div>
    `;
  }
};
