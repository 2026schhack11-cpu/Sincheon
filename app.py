"""
app.py - '지식의 도미노' (Domino of Knowledge) FastAPI Backend Server
과목 통합 학습 지원: 수학(기존), 물리(신규), 화학(신규)
2022 개정 교육과정 기준 적용
Gemini 3.5 Flash 및 최신 Gemini 모델 연동 지원
"""

import os
import json
import re
import base64
import requests
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from curriculum_data import CURRICULUM_2022, DEFAULT_PROBLEMS

app = FastAPI(title="지식의 도미노 (Domino of Knowledge)", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KeyCheckRequest(BaseModel):
    apiKey: str
    model: Optional[str] = "gemini-3.5-flash"

class AnalyzeProblemRequest(BaseModel):
    apiKey: Optional[str] = None
    model: Optional[str] = "gemini-3.5-flash"
    subject: Optional[str] = "math"  # math, physics, chemistry
    problemText: Optional[str] = ""
    imageBase64: Optional[str] = None
    demoId: Optional[str] = None

def clean_latex_output(text: str) -> str:
    """
    수학/과학 기호 정제:
    영어로 남은 불필요한 raw 토큰 ('left', 'right', 'ight' 등) 및 이스케이프 오류를 완벽히 제거하고,
    수식 기호가 $로 감싸지지 않은 경우 자동으로 $...$로 묶어 KaTeX에서 수식이 완벽히 렌더링되도록 보정합니다.
    """
    if not text:
        return ""
    t = str(text)
    
    # 1. ₩ 기호(윈도우 백슬래시 표시)를 백슬래시로 정상화
    t = t.replace('₩', '\\')
    
    # 2. \left, \right, ight, left, right 변형을 일반 괄호로 완벽 교정
    t = re.sub(r'\\+r?ight\s*\)', ')', t)
    t = re.sub(r'\\+left\s*\(', '(', t)
    t = re.sub(r'\\+r?ight\s*\]', ']', t)
    t = re.sub(r'\\+left\s*\[', '[', t)
    t = re.sub(r'\\+r?ight\s*\\\}', '}', t)
    t = re.sub(r'\\+left\s*\\\{', '{', t)
    
    # JSON \r 손실로 ight) 또는 \right 단독 토큰 잔여물 교정
    t = re.sub(r'(?<![a-zA-Z])ight\s*\)', ')', t)
    t = re.sub(r'(?<![a-zA-Z])left\s*\(', '(', t)
    t = re.sub(r'\\?(?:left|right)(?![a-zA-Z])', '', t)
    
    # \text{...} 내부에서 KaTeX 파싱 에러를 유발하는 중점(·) 치환
    def fix_text_middle_dot(m):
        inner = m.group(1).replace('·', ', ')
        return f"\\text{{{inner}}}"
    t = re.sub(r'\\text\{([^}]+)\}', fix_text_middle_dot, t)
    
    # 3. $ 로 감싸지지 않은 수식 기호 (\frac, 거듭제곱, \sqrt 등) 자동 $...$ 감싸기
    parts = re.split(r'(\$[^$]+\$|\$\$[^$]+\$\$)', t)
    new_parts = []
    
    # 수식 덩어리 패턴 (한글 속 분수, 거듭제곱 등)
    math_pattern = re.compile(
        r'([+-]?\s*\(?\s*[-+]?(?:\\(?:frac\{[^}]+\}\{[^}]+\}|sqrt\{[^}]+\}|text\{[^}]+\}|mathrm\{[^}]+\}|[a-zA-Z]+)|[a-zA-Z0-9_]+\^[a-zA-Z0-9_{}]+|[0-9a-zA-Z]+(?:\s*[=><+\-×÷*\/]\s*[0-9a-zA-Z\\]+)+)+\s*\)?)'
    )
    
    for p in parts:
        if (p.startswith('$') and p.endswith('$')) or (p.startswith('$$') and p.endswith('$$')):
            new_parts.append(p)
        else:
            sub_p = math_pattern.sub(r'$\1$', p)
            new_parts.append(sub_p)
            
    t = ''.join(new_parts)
    t = re.sub(r'\$\s*\$', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def ensure_math_delimiters(formula: str) -> str:
    """수식 문자열에 $ 또는 $$ 가 누락된 경우 KaTeX 렌더링이 가능하도록 감싸줍니다."""
    if not formula:
        return ""
    f = clean_latex_output(formula).strip()
    if not ('$' in f or '\\(' in f or '\\[' in f):
        return f"$${f}$$"
    return f

def build_gemini_prompt(subject: str, problem_text: str) -> str:
    subject_kr = {"math": "수학", "physics": "물리", "chemistry": "화학"}.get(subject, "수학")
    
    prompt = f"""
당신은 대한민국 교육과정을 완벽히 이해하는 친절하고 깊이 있는 AI 학습 튜터 '지식의 도미노'입니다.
학생이 업로드하거나 입력한 [{subject_kr}] 문제를 분석하여, 단순한 정답 제공이 아니라 "학생이 어느 단계에서 막혔는지 스스로 파악하고 기초 선수 개념으로 역추적 학습"할 수 있도록 구조화된 JSON 데이터로 응답하세요.

[반드시 준수할 원칙]:
1. 2022년 개정 교육과정 기준:
   - 과목명 및 단원명은 반드시 2022 개정 교육과정을 기준으로 명시하세요.
   - 예시: 
     * 수학: 2022 개정 [공통수학1 > 다항식 > 인수분해] 또는 2022 개정 [대수 > 지수함수와 로그함수] 등
     * 물리: 2022 개정 [물리학 > Ⅰ. 역학과 에너지 > 뉴턴 운동 법칙] 등
     * 화학: 2022 개정 [화학 > Ⅳ. 화학 반응과 에너지 > 화학 반응식과 양적 관계] 등
2. 풀이 단계 분할 기준:
   - 계산을 지나치게 잘게 쪼개지 말고 학생이 사고할 수 있는 '의미 있는 3~5개의 큰 단계'로 나눕니다.
   - 각 단계에는 명확한 단계 이름(title)과 핵심 식 또는 관계(core_formula)를 우선 표시합니다.
3. 수식 표현 및 괄호 엄격 규칙 (중요):
   - \\left 와 \\right 명령어는 절대로 사용하지 마세요! 
     * (X) \\left(-\\frac{2}{5}\\right)
     * (O) $(-\\frac{2}{5})$
     * 괄호는 오직 일반 괄호 '('와 ')'만을 사용하세요. 영어 'left', 'right' 단어가 수식이나 질문 텍스트에 절대 노출되면 안 됩니다.
   - 모든 수학/과학 수식(분수, 거듭제곱, 미지수, 반응식, 계산식)은 반드시 앞뒤에 달러 기호($...$)를 붙여 KaTeX 규격으로 작성하세요.
     * 문장 중간에 $ 없이 \\frac 등을 쓰면 화면에서 깨지므로, 반드시 "$-(-\\frac{2}{5})$의 값은?" 처럼 수식 부분을 $로 감싸세요.
   - JSON 내부 백슬래시는 반드시 이중 백슬래시(\\\\)로 작성하세요. (예: \\\\frac, \\\\times, \\\\mathrm)
   - 화학 반응식은 \\mathrm{...} 또는 표준 화학식을 활용하여 원소 기호와 아래첨자가 깔끔하게 렌더링되게 하세요.
4. 개념 역추적 (도미노 체인):
   - 각 풀이 단계마다 학생이 막힐 수 있는 핵심 개념을 도미노 루트로 연결합니다.
   - 해당 개념을 이해하기 위해 필요한 '선수 개념(prerequisites)'을 1~2개 역추적하여 트리로 구성하세요.
5. 개념 학습 카드:
   - 1~2문장의 쉬운 설명, 핵심 공식과 기호/단위 의미, 쉬운 예제 1개, 확인 문제(4지선다 퀴즈)를 포함하세요.
   - 퀴즈 오답에 대한 유용한 오답 분석(mistake_analysis)을 반드시 포함하세요.

[반드시 아래 JSON 형식으로만 순수 JSON을 출력하세요 (코드블록 ```json ... ```)]:
{{
  "id": "gen_problem_id",
  "subject": "{subject}",
  "title": "문제 핵심 요약 제목",
  "curriculum_badge": "2022 개정 [과목명 > 대단원 > 중단원]",
  "problem_statement": "인식한 문제 전문 (LaTeX 수식 포함)",
  "difficulty": "중급",
  "steps": [
    {{
      "step_index": 1,
      "title": "1단계: 단계 이름",
      "core_formula": "$핵심 수식 또는 관계식$",
      "description": "이 단계에서 수행하는 핵심 사고 1~2문장 설명",
      "domino_root": "concept_key_1"
    }}
  ],
  "domino_tree": {{
    "concept_key_1": {{
      "concept_name": "개념 이름",
      "curriculum": "2022 개정 [과목명 > 대단원 > 중단원]",
      "short_explanation": "학생 눈높이에 맞춘 1~2문장 쉬운 개념 설명",
      "core_formula": "$핵심 공식$",
      "symbol_meanings": [
        {{"symbol": "$기호$", "meaning": "기호의 의미와 단위"}}
      ],
      "visual_type": "default",
      "prerequisites": [
        {{
          "id": "pre_1",
          "name": "선수 개념 이름",
          "curriculum": "2022 개정 [선수 과목/단원]",
          "desc": "왜 이 개념을 먼저 알아야 하는지 설명"
        }}
      ],
      "example": {{
        "question": "아주 쉬운 1단계 적용 예제 문제",
        "solution_steps": ["예제 풀이 1단계", "예제 풀이 2단계"]
      }},
      "quiz": {{
        "question": "개념 이해 확인용 4지선다형 문제",
        "options": ["선택지 1", "선택지 2", "선택지 3", "선택지 4"],
        "correct_index": 0,
        "explanation": "정답 해설",
        "mistake_analysis": "오답을 고른 학생이 어떤 착각을 했는지 짚어주는 맞춤형 피드백"
      }}
    }}
  }}
}}

[분석할 문제 내용]:
{problem_text if problem_text else "제공된 문제 이미지를 판독하여 분석해주세요."}
"""
    return prompt.strip()

def get_available_models_for_key(api_key: str) -> List[Dict[str, Any]]:
    """
    사용자의 API 키로 Google ModelService.ListModels를 직접 호출하여
    해당 키에서 실제로 generateContent가 가능한 모델 목록과 적합한 API 버전(v1beta vs v1)을 찾습니다.
    """
    if not api_key:
        return []
        
    for api_ver in ["v1beta", "v1"]:
        try:
            url = f"https://generativelanguage.googleapis.com/{api_ver}/models?key={api_key}"
            res = requests.get(url, timeout=7)
            if res.status_code == 200:
                data = res.json()
                models_found = []
                for m in data.get("models", []):
                    methods = m.get("supportedGenerationMethods", [])
                    if "generateContent" in methods:
                        clean_name = m["name"].replace("models/", "")
                        models_found.append({
                            "name": clean_name,
                            "full_name": m["name"],
                            "version": api_ver,
                            "display_name": m.get("displayName", clean_name)
                        })
                if models_found:
                    return models_found
        except Exception:
            pass
    return []

@app.get("/api/curriculum")
async def get_curriculum():
    """2022 개정 교육과정 단원 목록 반환"""
    return CURRICULUM_2022

@app.get("/api/examples")
async def get_examples():
    """수학, 물리, 화학 대표 예제 반환"""
    return DEFAULT_PROBLEMS

@app.post("/api/check-key")
async def check_api_key(req: KeyCheckRequest):
    """사용자가 입력한 Gemini API 키의 유효성을 검증하고 사용 가능한 모델 목록을 자동 판별합니다."""
    key = req.apiKey.strip()
    if not key:
        raise HTTPException(status_code=400, detail="API 키가 비어 있습니다.")
    
    # 1. ListModels를 통해 실제 활성화된 모델 목록 확인
    available = get_available_models_for_key(key)
    
    if available:
        avail_names = [m["name"] for m in available]
        
        # Flash 계열 모델 우선 탐색
        flash_models = [m["name"] for m in available if "flash" in m["name"].lower()]
        best_model = req.model or "gemini-3.5-flash"
        
        # 요청한 모델이 없으면 최신 Flash 모델 자동 매핑
        actual_model = best_model
        if best_model not in avail_names:
            actual_model = flash_models[0] if flash_models else avail_names[0]
            
        return {
            "valid": True,
            "connected_model": actual_model,
            "requested_model": best_model,
            "available_models": avail_names,
            "message": f"Gemini API 연결 성공! ({actual_model} 모델 활성화됨, 총 {len(avail_names)}개 모델 사용 가능)"
        }
    
    # 2. ListModels 권한이 없는 경우 직접 엔드포인트 테스트
    models_to_test = [
        (req.model or "gemini-3.5-flash", "v1beta"),
        ("gemini-2.5-flash", "v1beta"),
        ("gemini-2.0-flash", "v1beta"),
        ("gemini-1.5-flash-latest", "v1beta"),
        ("gemini-1.5-flash", "v1"),
        ("gemini-1.5-flash", "v1beta"),
    ]
    
    last_error = ""
    for model_name, api_ver in models_to_test:
        clean_name = model_name.replace("models/", "")
        test_url = f"https://generativelanguage.googleapis.com/{api_ver}/models/{clean_name}:generateContent?key={key}"
        try:
            res = requests.post(
                test_url,
                json={"contents": [{"parts": [{"text": "Hello"}]}]},
                headers={"Content-Type": "application/json"},
                timeout=8
            )
            if res.status_code == 200:
                return {
                    "valid": True,
                    "connected_model": clean_name,
                    "available_models": [clean_name],
                    "message": f"Gemini API 연결 성공! ({clean_name} 사용 가능)"
                }
            else:
                last_error = f"HTTP {res.status_code}: {res.text[:200]}"
        except Exception as e:
            last_error = str(e)
            
    return {
        "valid": False,
        "connected_model": None,
        "available_models": [],
        "message": f"API 키 검증 실패: {last_error}"
    }

@app.post("/api/analyze-problem")
async def analyze_problem(req: AnalyzeProblemRequest):
    """
    문제 사진 또는 텍스트를 분석하여 단계별 풀이와 역추적 개념 도미노를 생성합니다.
    API 키가 없거나 demoId가 요청되면 완성도 높은 2022 개정 내장 데이터를 즉시 반환합니다.
    """
    subject = req.subject or "math"
    
    # 1. 내장 예제 요청인 경우
    if req.demoId and req.demoId in DEFAULT_PROBLEMS:
        return DEFAULT_PROBLEMS[req.demoId]
        
    # 2. API 키가 제공되지 않은 경우 기본 내장 예제 반환 (안내 메시지 포함)
    api_key = (req.apiKey or "").strip()
    if not api_key:
        default_prob = DEFAULT_PROBLEMS.get(subject, DEFAULT_PROBLEMS["math"])
        return {
            **default_prob,
            "_mode": "demo",
            "_notice": "API 키가 입력되지 않아 2022 개정 교육과정 기준 내장 데이터로 시연합니다. 상단 'API 키 설정'에서 본인의 Gemini 키를 입력하면 모든 문제 사진 및 텍스트를 실시간 AI로 분석할 수 있습니다."
        }
        
    # 3. Gemini API 실시간 호출
    prompt_text = build_gemini_prompt(subject, req.problemText or "")
    
    contents_parts = []
    if req.imageBase64:
        # Base64 이미지 데이터 파싱
        base64_data = req.imageBase64
        mime_type = "image/jpeg"
        if "data:" in base64_data and ";base64," in base64_data:
            header, base64_data = base64_data.split(";base64,")
            mime_type = header.replace("data:", "")
        
        contents_parts.append({
            "inline_data": {
                "mime_type": mime_type,
                "data": base64_data
            }
        })
    
    contents_parts.append({"text": prompt_text})
    
    payload = {
        "contents": [{"parts": contents_parts}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 4096
        }
    }
    
    # 키에 맞춘 동적 모델 목록 탐색 (404 Not Found 방지)
    available = get_available_models_for_key(api_key)
    target_models = []
    
    if available:
        avail_dict = {m["name"]: m["version"] for m in available}
        # 1. 사용자가 선택한 모델이 실제 사용 가능하면 1순위
        clean_req_model = (req.model or "gemini-3.5-flash").replace("models/", "")
        if clean_req_model in avail_dict:
            target_models.append((clean_req_model, avail_dict[clean_req_model]))
            
        # 2. Flash 계열 모델들 우선 추가 (최신순)
        for m in available:
            if "flash" in m["name"].lower() and (m["name"], m["version"]) not in target_models:
                target_models.append((m["name"], m["version"]))
                
        # 3. 그 외 generateContent 지원 모델들 추가
        for m in available:
            if (m["name"], m["version"]) not in target_models:
                target_models.append((m["name"], m["version"]))
    else:
        # ListModels가 막힌 경우 다양한 버전/모델 조합 순차 시도
        candidates = [
            (req.model or "gemini-3.5-flash", "v1beta"),
            (req.model or "gemini-3.5-flash", "v1"),
            ("gemini-2.5-flash", "v1beta"),
            ("gemini-2.0-flash", "v1beta"),
            ("gemini-1.5-flash-latest", "v1beta"),
            ("gemini-1.5-flash", "v1"),
            ("gemini-1.5-flash", "v1beta"),
            ("gemini-1.5-pro", "v1beta")
        ]
        target_models = candidates
    
    last_err_text = ""
    for model_name, api_ver in target_models:
        clean_name = model_name.replace("models/", "")
        url = f"https://generativelanguage.googleapis.com/{api_ver}/models/{clean_name}:generateContent?key={api_key}"
        try:
            resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=35)
            if resp.status_code == 200:
                result_json = resp.json()
                text_content = ""
                candidates = result_json.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    for p in parts:
                        text_content += p.get("text", "")
                
                # Markdown 코드 블록 제거 및 JSON 추출
                json_str = text_content.strip()
                if "```json" in json_str:
                    json_str = json_str.split("```json")[1].split("```")[0].strip()
                elif "```" in json_str:
                    json_str = json_str.split("```")[1].split("```")[0].strip()
                    
                # 1. Raw JSON 문자열에서 \left, \right 및 변형을 선제적으로 일반 괄호로 교정
                # (JSON 파싱 시 \r이 Carriage Return으로 파싱되어 ight)로 누출되는 현상 완벽 방지)
                json_str = re.sub(r'\\+left\s*\(', '(', json_str)
                json_str = re.sub(r'\\+right\s*\)', ')', json_str)
                json_str = re.sub(r'\\+left\s*\[', '[', json_str)
                json_str = re.sub(r'\\+right\s*\]', ']', json_str)
                json_str = re.sub(r'\\+left\s*\\\{', '{', json_str)
                json_str = re.sub(r'\\+right\s*\\\}', '}', json_str)
                json_str = re.sub(r'\\+left\b', '', json_str)
                json_str = re.sub(r'\\+right\b', '', json_str)
                json_str = re.sub(r'(?<![a-zA-Z])ight\s*\)', ')', json_str)
                json_str = re.sub(r'\bleft\s*\(', '(', json_str)
                json_str = re.sub(r'\bright\s*\)', ')', json_str)

                # 2. LaTeX 백슬래시가 단일 백슬래시로 들어온 경우 유효한 JSON을 위해 이중 백슬래시로 이스케이프
                # \frac -> \\frac, \text -> \\text 등 (\f, \t, \r로 오해석되는 것 방지)
                json_str = re.sub(r'(?<!\\)\\(?=[a-zA-Z])', r'\\\\', json_str)
                    
                parsed_data = json.loads(json_str)
                
                # LaTeX 수식 정제 ('left', 'right', 'ight' 단어 누출 방지 및 수식 $ 구분자 보장)
                parsed_data["title"] = clean_latex_output(parsed_data.get("title", ""))
                parsed_data["problem_statement"] = clean_latex_output(parsed_data.get("problem_statement", ""))
                for step in parsed_data.get("steps", []):
                    step["title"] = clean_latex_output(step.get("title", ""))
                    step["core_formula"] = ensure_math_delimiters(clean_latex_output(step.get("core_formula", "")))
                    step["description"] = clean_latex_output(step.get("description", ""))
                    
                for k, concept in parsed_data.get("domino_tree", {}).items():
                    concept["concept_name"] = clean_latex_output(concept.get("concept_name", ""))
                    concept["core_formula"] = ensure_math_delimiters(clean_latex_output(concept.get("core_formula", "")))
                    concept["short_explanation"] = clean_latex_output(concept.get("short_explanation", ""))
                    if "symbol_meanings" in concept:
                        for sym in concept["symbol_meanings"]:
                            sym["symbol"] = clean_latex_output(sym.get("symbol", ""))
                            sym["meaning"] = clean_latex_output(sym.get("meaning", ""))
                    if "example" in concept:
                        concept["example"]["question"] = clean_latex_output(concept["example"].get("question", ""))
                        if "solution_steps" in concept["example"]:
                            concept["example"]["solution_steps"] = [clean_latex_output(st) for st in concept["example"]["solution_steps"]]
                    if "quiz" in concept:
                        concept["quiz"]["question"] = clean_latex_output(concept["quiz"].get("question", ""))
                        concept["quiz"]["options"] = [clean_latex_output(opt) for opt in concept["quiz"].get("options", [])]
                        concept["quiz"]["explanation"] = clean_latex_output(concept["quiz"].get("explanation", ""))
                        concept["quiz"]["mistake_analysis"] = clean_latex_output(concept["quiz"].get("mistake_analysis", ""))
                        
                parsed_data["_mode"] = "live_gemini"
                parsed_data["_model_used"] = clean_name
                parsed_data["_api_version"] = api_ver
                return parsed_data
            else:
                last_err_text = f"HTTP {resp.status_code} ({clean_name} @ {api_ver}): {resp.text[:300]}"
        except Exception as e:
            last_err_text = f"{clean_name}: {str(e)}"
            
    # 실시간 호출 실패 시 안내 및 fallback 반환
    default_prob = DEFAULT_PROBLEMS.get(subject, DEFAULT_PROBLEMS["math"])
    return {
        **default_prob,
        "_mode": "fallback_demo",
        "_error_detail": f"Gemini API 호출에 문제가 발생하여 내장 고품질 예제로 표시합니다: {last_err_text}"
    }

# 정적 파일 서빙
os.makedirs("static", exist_ok=True)
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
