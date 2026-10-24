/**
 * api.js - API 클라이언트 및 KaTeX 렌더링 헬퍼
 * Gemini API Key 관리 및 모델 설정 지원 (Gemini 3.5 Flash 기본)
 */

window.AppAPI = {
  KEY_STORAGE_NAME: 'domino_gemini_api_key',
  MODEL_STORAGE_NAME: 'domino_gemini_model',

  getStoredApiKey: function() {
    return localStorage.getItem(this.KEY_STORAGE_NAME) || '';
  },

  setStoredApiKey: function(key) {
    if (!key) {
      localStorage.removeItem(this.KEY_STORAGE_NAME);
    } else {
      localStorage.setItem(this.KEY_STORAGE_NAME, key.trim());
    }
  },

  getStoredModel: function() {
    return localStorage.getItem(this.MODEL_STORAGE_NAME) || 'gemini-3.5-flash';
  },

  setStoredModel: function(model) {
    localStorage.setItem(this.MODEL_STORAGE_NAME, model);
  },

  // API 키 유효성 테스트
  checkKey: async function(apiKey, model) {
    try {
      const resp = await fetch('/api/check-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model })
      });
      return await resp.json();
    } catch (e) {
      return { valid: false, message: '서버 통신 실패: ' + e.message };
    }
  },

  // 문제 분석 호출 (사진 또는 텍스트)
  analyzeProblem: async function(params) {
    const apiKey = this.getStoredApiKey();
    const model = this.getStoredModel();

    const payload = {
      apiKey: apiKey || null,
      model: model || 'gemini-3.5-flash',
      subject: params.subject || 'math',
      problemText: params.problemText || '',
      imageBase64: params.imageBase64 || null,
      demoId: params.demoId || null
    };

    try {
      const resp = await fetch('/api/analyze-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        throw new Error(`서버 오류 (HTTP ${resp.status})`);
      }
      return await resp.json();
    } catch (err) {
      console.warn('Backend call failed, using mock fallback', err);
      // 오프라인이거나 서버 통신 실패 시 목업 데이터 반환
      const fallback = window.MOCK_DATA.examples[params.subject] || window.MOCK_DATA.examples.math;
      return {
        ...fallback,
        _mode: 'local_fallback',
        _notice: '네트워크 통신 오류로 로컬 고품질 예제로 표시되었습니다: ' + err.message
      };
    }
  },

  // 2022 개정 교육과정 데이터 로드
  fetchCurriculum: async function() {
    try {
      const resp = await fetch('/api/curriculum');
      if (resp.ok) return await resp.json();
    } catch (e) {
      console.warn('Failed to fetch remote curriculum, using mock', e);
    }
    return window.MOCK_DATA.curriculum;
  },

  // 수식 문자열 정제 헬퍼 (left, right, ight, ₩left 원천 제거 및 $...$ 자동 래핑)
  cleanMathText: function(text) {
    if (!text) return '';
    let t = String(text);

    // 1. ₩ 기호(윈도우 폰트의 백슬래시 변형)를 백슬래시로 정상화
    t = t.replace(/₩/g, '\\');

    // 2. \left, \right, ight, left, right를 깨끗한 일반 괄호로 변환
    t = t.replace(/\\+r?ight\s*\)/g, ')');
    t = t.replace(/\\+left\s*\(/g, '(');
    t = t.replace(/\\+r?ight\s*\]/g, ']');
    t = t.replace(/\\+left\s*\[/g, '[');
    t = t.replace(/\\+r?ight\s*\\?\}/g, '}');
    t = t.replace(/\\+left\s*\\?\{/g, '{');
    
    // JSON \r 손실로 ight) 또는 \right 단독 토큰 잔여물 완벽 교정
    t = t.replace(/(?<![a-zA-Z])ight\s*\)/g, ')');
    t = t.replace(/(?<![a-zA-Z])left\s*\(/g, '(');
    t = t.replace(/\\?(?:left|right)(?![a-zA-Z])/g, '');

    // 3. $ 로 감싸지지 않은 수식 덩어리를 자동 $...$ 감싸기
    const parts = t.split(/(\$[^$]+\$|\$\$[^$]+\$\$)/g);
    const mathChunkRe = /([+-]?\s*\(?\s*[-+]?(?:\\(?:frac\{[^}]+\}\{[^}]+\}|sqrt\{[^}]+\}|text\{[^}]+\}|mathrm\{[^}]+\}|[a-zA-Z]+)|[a-zA-Z0-9_]+\^[a-zA-Z0-9_{}]+|[0-9a-zA-Z]+(?:\s*[=><+\-×÷*\/]\s*[0-9a-zA-Z\\]+)+)+\s*\)?)/g;
    
    const newParts = parts.map(p => {
      if ((p.startsWith('$') && p.endsWith('$')) || (p.startsWith('$$') && p.endsWith('$$'))) {
        return p;
      }
      return p.replace(mathChunkRe, '$$$1$$');
    });

    t = newParts.join('');
    t = t.replace(/\$\s*\$/g, ' ');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  },

  // KaTeX 안전 렌더링 헬퍼
  renderMathInElement: function(elem) {
    if (!elem) return;

    // 1. DOM 내부 텍스트 노드에서 left, right, ₩ 단독 누출 2차 방어
    this.cleanRawLeftRightTokens(elem);

    // 2. KaTeX 자동 렌더러 호출
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(elem, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
      }
    }
  },

  cleanRawLeftRightTokens: function(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue) {
        let val = node.nodeValue;
        val = val.replace(/₩/g, '\\');
        val = val.replace(/\\+r?ight\s*\)/g, ')');
        val = val.replace(/\\+left\s*\(/g, '(');
        val = val.replace(/(?<![a-zA-Z])ight\s*\)/g, ')');
        val = val.replace(/(?<![a-zA-Z])left\s*\(/g, '(');
        val = val.replace(/(?<!\\)\bleft\s*\(/g, '(');
        val = val.replace(/(?<!\\)\bright\s*\)/g, ')');
        val = val.replace(/(?<!\\)\bleft\s*\[/g, '[');
        val = val.replace(/(?<!\\)\bright\s*\]/g, ']');
        val = val.replace(/\\left(?![(\[{|\\])/g, '');
        val = val.replace(/\\right(?![)\]}|\\])/g, '');
        node.nodeValue = val;
      }
    }
  }
};
