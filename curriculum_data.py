"""
curriculum_data.py
2022 개정 교육과정 기준 과목별 단원 체계 및 지식의 도미노 기본 학습 데이터
"""

CURRICULUM_2022 = {
    "math": {
        "subject_name": "수학",
        "curriculum_version": "2022 개정 교육과정",
        "units": [
            {
                "course": "공통수학1",
                "chapters": [
                    {
                        "name": "Ⅰ. 다항식",
                        "sections": ["다항식의 연산", "나머지정리와 인수분해"]
                    },
                    {
                        "name": "Ⅱ. 방정식과 부등식",
                        "sections": ["복소수와 이차방정식", "이차방정식과 이차함수", "여러 가지 방정식과 부등식"]
                    },
                    {
                        "name": "Ⅲ. 경우의 수",
                        "sections": ["합의 법칙과 곱의 법칙", "순열과 조합"]
                    },
                    {
                        "name": "Ⅳ. 행렬",
                        "sections": ["행렬과 그 연산"]
                    }
                ]
            },
            {
                "course": "공통수학2",
                "chapters": [
                    {
                        "name": "Ⅰ. 도형의 방정식",
                        "sections": ["평면좌표", "직선의 방정식", "원의 방정식", "도형의 이동"]
                    },
                    {
                        "name": "Ⅱ. 집합과 명제",
                        "sections": ["집합", "명제"]
                    },
                    {
                        "name": "Ⅲ. 함수",
                        "sections": ["함수", "유리함수와 무리함수"]
                    }
                ]
            },
            {
                "course": "대수",
                "chapters": [
                    {
                        "name": "Ⅰ. 지수함수와 로그함수",
                        "sections": ["지수와 로그", "지수함수와 로그함수"]
                    },
                    {
                        "name": "Ⅱ. 삼각함수",
                        "sections": ["삼각함수", "사인법칙과 코사인법칙"]
                    },
                    {
                        "name": "Ⅲ. 수열",
                        "sections": ["등차수열과 등비수열", "수열의 합과 수학적 귀납법"]
                    }
                ]
            },
            {
                "course": "미적분Ⅰ",
                "chapters": [
                    {
                        "name": "Ⅰ. 함수의 극한과 연속",
                        "sections": ["함수의 극한", "함수의 연속"]
                    },
                    {
                        "name": "Ⅱ. 다항함수의 미분법",
                        "sections": ["미분계수와 도함수", "도함수의 활용"]
                    },
                    {
                        "name": "Ⅲ. 다항함수의 적분법",
                        "sections": ["부정적분과 정적분", "정적분의 활용"]
                    }
                ]
            }
        ]
    },
    "physics": {
        "subject_name": "물리",
        "curriculum_version": "2022 개정 교육과정",
        "units": [
            {
                "course": "물리학 (일반선택)",
                "chapters": [
                    {
                        "name": "Ⅰ. 역학과 에너지",
                        "sections": [
                            "물체의 운동 (등가속도 직선 운동)",
                            "뉴턴 운동 법칙 (제1·2·3법칙)",
                            "운동량과 충격량",
                            "일과 역학적 에너지 보존",
                            "열역학 제1·2법칙과 열효율",
                            "특수 상대성 이론"
                        ]
                    },
                    {
                        "name": "Ⅱ. 전자기와 양자",
                        "sections": [
                            "전기장과 정전기 유도",
                            "물질의 전기적 성질과 에너지띠",
                            "전류에 의한 자기장 (앙페르 법칙)",
                            "전자기 유도 (패러데이 법칙)",
                            "빛과 물질의 이중성 (광전 효과)"
                        ]
                    },
                    {
                        "name": "Ⅲ. 파동과 정보 통신",
                        "sections": [
                            "파동의 전파와 굴절 (스넬 법칙, 전반사)",
                            "파동의 간섭과 회절",
                            "전자기파의 종류와 센서"
                        ]
                    }
                ]
            }
        ]
    },
    "chemistry": {
        "subject_name": "화학",
        "curriculum_version": "2022 개정 교육과정",
        "units": [
            {
                "course": "화학 (일반선택)",
                "chapters": [
                    {
                        "name": "Ⅰ. 물질의 구성과 화학식량",
                        "sections": [
                            "화학의 유용성과 물질의 양 (몰, 아보가드로수)",
                            "화학식량과 몰질량 (g/mol 변환)",
                            "용액의 농도 (몰농도 M와 용액의 희석)"
                        ]
                    },
                    {
                        "name": "Ⅱ. 원자의 구조와 주기성",
                        "sections": [
                            "원자의 구조와 오비탈 전자 배치",
                            "주기율표와 원소의 주기적 성질 (이온화 에너지, 원자 반지름)"
                        ]
                    },
                    {
                        "name": "Ⅲ. 화학 결합과 분자의 세계",
                        "sections": [
                            "화학 결합 (이온 결합, 공유 결합, 금속 결합)",
                            "루이스 전자점식과 분자의 구조 (VSEPR 이론, 극성)"
                        ]
                    },
                    {
                        "name": "Ⅳ. 화학 반응과 에너지",
                        "sections": [
                            "화학 반응식과 계수 맞추기 (질량 보존 법칙)",
                            "화학 반응의 양적 관계 (몰비, 기체 부피비, 한계 반응물)",
                            "산과 염기 및 중화 반응 (중화 적정과 농도 계산)",
                            "산화·환원 반응 (산화수법과 전자 이동)",
                            "화학 반응에서의 열출입 (발열 반응과 흡열 반응)"
                        ]
                    }
                ]
            }
        ]
    }
}

DEFAULT_PROBLEMS = {
    "math": {
        "id": "math_demo_01",
        "subject": "math",
        "title": "이차방정식의 인수분해를 통한 근 구하기",
        "curriculum_badge": "2022 개정 [공통수학1 > Ⅱ. 방정식과 부등식 > 복소수와 이차방정식]",
        "problem_statement": "이차방정식 $2x^2 - 5x - 3 = 0$ 의 두 실근을 구하시오.",
        "difficulty": "중급",
        "steps": [
            {
                "step_index": 1,
                "title": "1단계: 이차방정식의 표준형 확인",
                "core_formula": "$ax^2 + bx + c = 0 \\quad (a=2, \\ b=-5, \\ c=-3)$",
                "description": "우변이 0인 표준형인지 확인하고, 각 항의 계수 $a, b, c$를 명확히 파악합니다.",
                "domino_root": "quad_standard"
            },
            {
                "step_index": 2,
                "title": "2단계: 대각선 곱을 이용한 인수분해",
                "core_formula": "$2x^2 - 5x - 3 = (2x + 1)(x - 3) = 0$",
                "description": "$2$의 약수 $(2, 1)$과 $-3$의 약수 $(1, -3)$을 엇갈려 곱해 일차항 계수 $-5$를 만듭니다.",
                "domino_root": "factorization_cross"
            },
            {
                "step_index": 3,
                "title": "3단계: 인수별 해 구하기 (영인자 성질)",
                "core_formula": "$2x + 1 = 0 \\implies x = -\\frac{1}{2} \\quad \\text{또는} \\quad x - 3 = 0 \\implies x = 3$",
                "description": "두 식의 곱이 $0$이면 적어도 하나는 $0$이어야 하므로, 각 일차식을 $0$으로 놓아 $x$의 값을 구합니다.",
                "domino_root": "zero_product_property"
            },
            {
                "step_index": 4,
                "title": "4단계: 근의 검산 및 최종 해 작성",
                "core_formula": "$x = -\\frac{1}{2} \\quad \\text{또는} \\quad x = 3$",
                "description": "구한 해를 원래 방정식에 대입하여 좌변이 $0$이 되는지 확인하고 해를 정리합니다.",
                "domino_root": "solution_verification"
            }
        ],
        "domino_tree": {
            "factorization_cross": {
                "concept_name": "일차식의 곱을 이용한 십자 인수분해",
                "curriculum": "2022 개정 [공통수학1 > Ⅰ. 다항식 > 나머지정리와 인수분해]",
                "short_explanation": "이차항의 계수와 상수항의 두 약수를 대각선으로 곱해 더했을 때 일차항의 계수와 같아지도록 묶는 방법입니다.",
                "core_formula": "$ac x^2 + (ad + bc)x + bd = (ax + b)(cx + d)$",
                "symbol_meanings": [
                    {"symbol": "$a, c$", "meaning": "이차항 계수의 두 약수"},
                    {"symbol": "$b, d$", "meaning": "상수항의 두 약수"},
                    {"symbol": "$ad + bc$", "meaning": "일차항의 계수"}
                ],
                "visual_type": "math_factor",
                "prerequisites": [
                    {
                        "id": "poly_expand",
                        "name": "다항식의 전개와 분배법칙",
                        "curriculum": "2022 개정 [공통수학1 > Ⅰ. 다항식 > 다항식의 연산]",
                        "desc": "인수분해는 전개의 역과정입니다. $(ax+b)(cx+d) = acx^2 + (ad+bc)x + bd$ 임을 먼저 이해해야 합니다."
                    },
                    {
                        "id": "common_divisor",
                        "name": "공통인수로 묶기",
                        "curriculum": "2022 개정 [중등 수학 3-1 > 인수분해]",
                        "desc": "모든 항에 공통으로 들어 있는 인수를 분배법칙을 역으로 써서 괄호 밖으로 빼내는 가장 기초적인 과정입니다."
                    }
                ],
                "example": {
                    "question": "$x^2 - 5x + 6$ 을 인수분해하시오.",
                    "solution_steps": [
                        "합이 $-5$, 곱이 $+6$이 되는 두 정수를 찾습니다.",
                        "두 정수는 $-2$ 와 $-3$ 입니다. ($(-2) + (-3) = -5$, $(-2) \\times (-3) = 6$)",
                        "따라서 $(x - 2)(x - 3)$ 으로 인수분해됩니다."
                    ]
                },
                "quiz": {
                    "question": "$2x^2 + 7x + 3$ 을 인수분해할 때, 올바른 일차식의 곱은 무엇일까요?",
                    "options": [
                        "$(2x + 1)(x + 3)$",
                        "$(2x + 3)(x + 1)$",
                        "$(2x - 1)(x - 3)$",
                        "$(x + 2)(2x + 3)$"
                    ],
                    "correct_index": 0,
                    "explanation": "$(2x + 1)(x + 3) = 2x^2 + 6x + x + 3 = 2x^2 + 7x + 3$ 입니다. 대각선 곱에서 $2 \\times 3 + 1 \\times 1 = 7$ 이 성립합니다.",
                    "mistake_analysis": "전개했을 때 일차항의 계수가 $7$이 나오는지 대각선 곱 $2 \\times 3 + 1 = 7$을 반드시 확인해야 합니다. 2번 선택지는 일차항이 $5x$가 되므로 오답입니다."
                }
            },
            "zero_product_property": {
                "concept_name": "영인자 성질 ($AB = 0$ 이면 $A=0$ 또는 $B=0$)",
                "curriculum": "2022 개정 [공통수학1 > Ⅱ. 방정식과 부등식 > 복소수와 이차방정식]",
                "short_explanation": "실수의 기본 성질로, 두 수식의 곱이 $0$이라면 둘 중 최소 하나는 반드시 $0$이어야 합니다.",
                "core_formula": "$A \\cdot B = 0 \\iff A = 0 \\quad \\text{또는} \\quad B = 0$",
                "symbol_meanings": [
                    {"symbol": "$A, B$", "meaning": "임의의 대수식 또는 실수"}
                ],
                "visual_type": "math_logic",
                "prerequisites": [
                    {
                        "id": "linear_equation",
                        "name": "일차방정식의 풀이",
                        "curriculum": "2022 개정 [중등 수학 1-1 > 일차방정식]",
                        "desc": "$ax + b = 0 \\implies x = -b/a$ 형태로 이항하여 해를 구하는 방법입니다."
                    }
                ],
                "example": {
                    "question": "$(x - 4)(x + 7) = 0$ 의 해를 구하시오.",
                    "solution_steps": [
                        "곱이 $0$이므로 $x - 4 = 0$ 이거나 $x + 7 = 0$ 이어야 합니다.",
                        "$x - 4 = 0 \\implies x = 4$",
                        "$x + 7 = 0 \\implies x = -7$",
                        "따라서 해는 $x = 4$ 또는 $x = -7$ 입니다."
                    ]
                },
                "quiz": {
                    "question": "$(3x - 2)(x + 5) = 0$ 의 해로 올바른 것은?",
                    "options": [
                        "$x = \\frac{2}{3}$ 또는 $x = -5$",
                        "$x = -\\frac{2}{3}$ 또는 $x = 5$",
                        "$x = \\frac{3}{2}$ 또는 $x = -5$",
                        "$x = 2$ 또는 $x = -5$"
                    ],
                    "correct_index": 0,
                    "explanation": "$3x - 2 = 0 \\implies 3x = 2 \\implies x = \\frac{2}{3}$, $x + 5 = 0 \\implies x = -5$ 입니다.",
                    "mistake_analysis": "이항할 때 부호를 반대로 바꾸는 것을 깜빡하거나, 일차식 $3x-2$에서 계수 $3$으로 나누는 순서를 헷갈리지 않도록 주의하세요."
                }
            }
        }
    },
    "physics": {
        "id": "physics_demo_01",
        "subject": "physics",
        "title": "마찰이 없는 수평면 위의 물체에 작용하는 힘과 가속도",
        "curriculum_badge": "2022 개정 [물리학 > Ⅰ. 역학과 에너지 > 뉴턴 운동 법칙]",
        "problem_statement": "마찰이 없는 수평면 위에 질량 $m = 4\\,\\text{kg}$ 인 물체가 놓여 있다. 이 물체에 오른쪽 방향으로 $F_1 = 20\\,\\text{N}$, 왼쪽 방향으로 $F_2 = 8\\,\\text{N}$ 의 일정한 수평 힘이 동시에 작용할 때, 물체의 가속도의 크기와 방향을 구하시오.",
        "difficulty": "중급",
        "steps": [
            {
                "step_index": 1,
                "title": "1단계: 주어진 물리량과 구하려는 목표 파악",
                "core_formula": "$m = 4\\,\\text{kg}, \\quad F_1 = +20\\,\\text{N}, \\quad F_2 = -8\\,\\text{N} \\implies a = ?$",
                "description": "질량 $m$과 작용하는 힘들의 크기 및 방향을 부호($+$ 오른쪽, $-$ 왼쪽)를 정하여 정리합니다.",
                "domino_root": "phys_vector_sign"
            },
            {
                "step_index": 2,
                "title": "2단계: 자유물체도 작성 및 알짜힘(합력) 계산",
                "core_formula": "$\\Sigma F = F_1 - F_2 = 20\\,\\text{N} - 8\\,\\text{N} = 12\\,\\text{N} \\quad (\\text{오른쪽})$",
                "description": "수직 방향의 중력과 수직항력은 평형을 이루므로 상쇄되고, 수평 방향 힘의 벡터 합(알짜힘)을 구합니다.",
                "domino_root": "net_force_concept"
            },
            {
                "step_index": 3,
                "title": "3단계: 뉴턴의 제2법칙 (가속도 법칙) 적용",
                "core_formula": "$\\Sigma F = m a \\implies a = \\frac{\\Sigma F}{m}$",
                "description": "물체의 질량과 알짜힘 사이의 인과 관계를 나타내는 뉴턴 운동 제2법칙 방정식을 세웁니다.",
                "domino_root": "newton_second_law"
            },
            {
                "step_index": 4,
                "title": "4단계: 가속도 계산 및 단위/물리적 타당성 검증",
                "core_formula": "$a = \\frac{12\\,\\text{N}}{4\\,\\text{kg}} = 3\\,\\text{m/s}^2 \\quad (\\text{오른쪽})$",
                "description": "알짜힘과 가속도의 방향이 일치하는지 확인하고, 단위 $\\text{N}/\\text{kg} = \\text{m/s}^2$ 의 일관성을 검증합니다.",
                "domino_root": "physics_unit_verification"
            }
        ],
        "domino_tree": {
            "net_force_concept": {
                "concept_name": "알짜힘(합력, $\\Sigma F$)과 자유물체도",
                "curriculum": "2022 개정 [물리학 > Ⅰ. 역학과 에너지 > 뉴턴 운동 법칙]",
                "short_explanation": "한 물체에 작용하는 모든 외력을 방향을 고려하여 벡터적으로 더한 유효한 힘의 합입니다.",
                "core_formula": "$\\vec{F}_{\\text{net}} = \\sum \\vec{F} = \\vec{F}_1 + \\vec{F}_2 + \\dots$",
                "symbol_meanings": [
                    {"symbol": "$\\vec{F}_{\\text{net}}$", "meaning": "알짜힘 (단위: $\\text{N}$)"},
                    {"symbol": "$\\vec{F}_1, \\vec{F}_2$", "meaning": "물체에 작용하는 개별 외력들"}
                ],
                "visual_type": "fbd_canvas",
                "fbd_data": {
                    "mass": 4,
                    "forces": [
                        {"name": "수직항력 (N)", "magnitude": 39.2, "angle": 90, "color": "#10B981"},
                        {"name": "중력 (mg)", "magnitude": 39.2, "angle": 270, "color": "#6B7280"},
                        {"name": "F1 (외력1)", "magnitude": 20, "angle": 0, "color": "#3B82F6"},
                        {"name": "F2 (외력2)", "magnitude": 8, "angle": 180, "color": "#EF4444"}
                    ]
                },
                "prerequisites": [
                    {
                        "id": "vector_direction",
                        "name": "벡터의 크기와 방향 (부호 규약)",
                        "curriculum": "2022 개정 [물리학 > Ⅰ. 역학과 에너지 > 물체의 운동]",
                        "desc": "힘은 크기뿐만 아니라 방향을 갖는 물리량이므로, 1차원 직선 운동에서는 오른쪽을 $(+)$, 왼쪽을 $(-)$로 설정해 더해야 합니다."
                    },
                    {
                        "id": "force_balance",
                        "name": "힘의 평형",
                        "curriculum": "2022 개정 [중등 과학 > 여러 가지 힘과 운동]",
                        "desc": "한 물체에 작용하는 힘들의 합이 $0$일 때 알짜힘이 $0$이 되어 운동 상태가 변하지 않는 원리입니다."
                    }
                ],
                "example": {
                    "question": "오른쪽으로 $15\\,\\text{N}$, 왼쪽으로 $5\\,\\text{N}$의 힘이 동시에 작용할 때 알짜힘은?",
                    "solution_steps": [
                        "기준 방향을 오른쪽 $(+)$로 설정합니다.",
                        "$\\Sigma F = (+15\\,\\text{N}) + (-5\\,\\text{N}) = +10\\,\\text{N}$ 입니다.",
                        "따라서 알짜힘은 오른쪽 방향으로 $10\\,\\text{N}$ 입니다."
                    ]
                },
                "quiz": {
                    "question": "어떤 상자에 동쪽으로 $30\\,\\text{N}$, 서쪽으로 $12\\,\\text{N}$의 힘이 작용할 때 알짜힘의 크기와 방향은?",
                    "options": [
                        "동쪽으로 $18\\,\\text{N}$",
                        "서쪽으로 $18\\,\\text{N}$",
                        "동쪽으로 $42\\,\\text{N}$",
                        "$0\\,\\text{N}$ (힘의 평형)"
                    ],
                    "correct_index": 0,
                    "explanation": "동쪽을 $(+)$로 두면 $+30\\,\\text{N} - 12\\,\\text{N} = +18\\,\\text{N}$ 이므로 동쪽으로 $18\\,\\text{N}$ 입니다.",
                    "mistake_analysis": "반대 방향으로 작용하는 두 힘은 크기를 빼야 합니다. 두 힘을 무조건 더해 $42\\,\\text{N}$으로 계산하는 실수를 주의하세요."
                }
            },
            "newton_second_law": {
                "concept_name": "뉴턴 운동 제2법칙 (가속도 법칙, $F=ma$)",
                "curriculum": "2022 개정 [물리학 > Ⅰ. 역학과 에너지 > 뉴턴 운동 법칙]",
                "short_explanation": "물체의 가속도는 작용하는 알짜힘의 크기에 비례하고, 물체의 질량에 반비례하며, 알짜힘과 같은 방향으로 발생합니다.",
                "core_formula": "$\\vec{a} = \\frac{\\Sigma \\vec{F}}{m} \\quad \\Longleftrightarrow \\quad \\Sigma \\vec{F} = m \\vec{a}$",
                "symbol_meanings": [
                    {"symbol": "$a$", "meaning": "가속도 (단위: $\\text{m/s}^2$)"},
                    {"symbol": "$F$", "meaning": "알짜힘 (단위: $\\text{N} = \\text{kg}\\cdot\\text{m/s}^2$)"},
                    {"symbol": "$m$", "meaning": "물체의 질량 (관성의 크기, 단위: $\\text{kg}$)"}
                ],
                "visual_type": "fbd_canvas",
                "prerequisites": [
                    {
                        "id": "acceleration_concept",
                        "name": "가속도의 물리적 의미",
                        "curriculum": "2022 개정 [물리학 > Ⅰ. 역학과 에너지 > 물체의 운동]",
                        "desc": "가속도는 단위 시간($1$초)당 속도의 변화량을 의미하며, 속도가 얼마나 빠르게 변하는지를 나타냅니다."
                    },
                    {
                        "id": "mass_inertia",
                        "name": "질량과 관성",
                        "curriculum": "2022 개정 [중등 과학 > 여러 가지 힘과 운동]",
                        "desc": "질량은 물체가 자신의 운동 상태를 유지하려는 성질(관성)의 크기를 나타내는 고유한 물리량입니다."
                    }
                ],
                "example": {
                    "question": "질량 $2\\,\\text{kg}$인 물체에 $6\\,\\text{N}$의 알짜힘이 작용할 때 가속도는?",
                    "solution_steps": [
                        "뉴턴 제2법칙 공식 $a = \\frac{F}{m}$을 적용합니다.",
                        "$a = \\frac{6\\,\\text{N}}{2\\,\\text{kg}} = 3\\,\\text{m/s}^2$ 입니다."
                    ]
                },
                "quiz": {
                    "question": "질량이 $5\\,\\text{kg}$인 수레에 $20\\,\\text{N}$의 일정한 알짜힘이 가해질 때, 수레가 얻는 가속도의 크기는?",
                    "options": [
                        "$4\\,\\text{m/s}^2$",
                        "$100\\,\\text{m/s}^2$",
                        "$0.25\\,\\text{m/s}^2$",
                        "$15\\,\\text{m/s}^2$"
                    ],
                    "correct_index": 0,
                    "explanation": "$a = \\frac{F}{m} = \\frac{20\\,\\text{N}}{5\\,\\text{kg}} = 4\\,\\text{m/s}^2$ 입니다.",
                    "mistake_analysis": "$a = F/m$ 관계식에서 곱셈($F \\times m = 100$)을 하지 않도록 유의하세요. 질량이 클수록 가속도는 작아져야(반비례) 정상입니다."
                }
            }
        }
    },
    "chemistry": {
        "id": "chem_demo_01",
        "subject": "chemistry",
        "title": "메테인($\\mathrm{CH_4}$) 연소 반응의 양적 관계와 생성물의 양 계산",
        "curriculum_badge": "2022 개정 [화학 > Ⅳ. 화학 반응과 에너지 > 화학 반응식과 양적 관계]",
        "problem_statement": "메테인($\\mathrm{CH_4}$) $16\\,\\text{g}$ 이 산소($\\mathrm{O_2}$) 기체와 충분히 반응하여 완전 연소할 때, 생성되는 이산화 탄소($\\mathrm{CO_2}$)의 질량($\\text{g}$)과 $0^\\circ\\mathrm{C}$, $1\\,\\text{atm}$에서 생성되는 수증기($\\mathrm{H_2O}$)의 몰수($\\text{mol}$)를 구하시오. (단, 원자량은 $\\mathrm{H}=1, \\mathrm{C}=12, \\mathrm{O}=16$ 이다.)",
        "difficulty": "중상급",
        "steps": [
            {
                "step_index": 1,
                "title": "1단계: 화학 반응식 작성 및 계수 맞추기 (원자 수 보존)",
                "core_formula": "$\\mathrm{CH_4(g) + 2O_2(g) \\longrightarrow CO_2(g) + 2H_2O(g)}$",
                "description": "반응 전후 탄소($\\mathrm{C}$), 수소($\\mathrm{H}$), 산소($\\mathrm{O}$) 원자 수가 보존되도록 최소 정수 계수를 맞춥니다.",
                "domino_root": "chemical_equation_balancing"
            },
            {
                "step_index": 2,
                "title": "2단계: 반응물의 분자량 계산 및 질량을 몰(mol)수로 변환",
                "core_formula": "$M(\\mathrm{CH_4}) = 12 + 1 \\times 4 = 16\\,\\text{g/mol} \\implies n(\\mathrm{CH_4}) = \\frac{16\\,\\text{g}}{16\\,\\text{g/mol}} = 1.0\\,\\text{mol}$",
                "description": "화학 반응은 질량이 아닌 입자 수(몰수)의 비율로 진행되므로, 주어진 질량을 몰질량으로 나누어 몰수를 구합니다.",
                "domino_root": "mass_to_mole_conversion"
            },
            {
                "step_index": 3,
                "title": "3단계: 화학 반응식 계수비 = 몰비 관계 적용",
                "core_formula": "$\\mathrm{CH_4 : O_2 : CO_2 : H_2O} = 1 : 2 : 1 : 2 \\implies n(\\mathrm{CO_2}) = 1.0\\,\\text{mol}, \\ n(\\mathrm{H_2O}) = 2.0\\,\\text{mol}$",
                "description": "반응식의 계수비는 반응하고 생성되는 분자들의 몰수 비와 완전히 일치합니다.",
                "domino_root": "stoichiometric_mole_ratio"
            },
            {
                "step_index": 4,
                "title": "4단계: 생성물의 물리량(질량 및 몰수) 계산 및 검증",
                "core_formula": "$m(\\mathrm{CO_2}) = 1.0\\,\\text{mol} \\times 44\\,\\text{g/mol} = 44\\,\\text{g}, \\quad n(\\mathrm{H_2O}) = 2.0\\,\\text{mol}$",
                "description": "생성된 $\\mathrm{CO_2}$의 분자량($12 + 16 \\times 2 = 44$)을 곱해 최종 질량을 구하고 단위를 확인합니다.",
                "domino_root": "chemical_result_validation"
            }
        ],
        "domino_tree": {
            "stoichiometric_mole_ratio": {
                "concept_name": "화학 반응식의 계수비와 몰비의 관계",
                "curriculum": "2022 개정 [화학 > Ⅳ. 화학 반응과 에너지 > 화학 반응식과 양적 관계]",
                "short_explanation": "화학 반응식 앞에 붙은 계수의 비는 반응물과 생성물이 반응하고 생성되는 '입자 수의 비 = 몰수 비'를 의미합니다. (단, 질량비와는 절대 같지 않습니다!)",
                "core_formula": "$\\text{계수비} = \\text{몰수비} = \\text{분자수비} = \\text{기체 부피비(동온, 동압)} \\neq \\text{질량비}$",
                "symbol_meanings": [
                    {"symbol": "계수", "meaning": "반응식 각 화학종 앞의 정수 비율"},
                    {"symbol": "$n$", "meaning": "물질의 양 (단위: $\\text{mol}$)"},
                    {"symbol": "$N$", "meaning": "입자 수 ($1\\,\\text{mol} = 6.02 \\times 10^{23}$개)"}
                ],
                "visual_type": "chemistry_reaction",
                "reaction_data": {
                    "reactants": [{"formula": "CH4", "coeff": 1, "moles": 1}, {"formula": "O2", "coeff": 2, "moles": 2}],
                    "products": [{"formula": "CO2", "coeff": 1, "moles": 1}, {"formula": "H2O", "coeff": 2, "moles": 2}]
                },
                "prerequisites": [
                    {
                        "id": "mole_definition",
                        "name": "몰(mol)과 아보가드로수($N_A$)",
                        "curriculum": "2022 개정 [화학 > Ⅰ. 물질의 구성과 화학식량 > 물질의 양]",
                        "desc": "원자나 분자처럼 매우 작은 입자를 세기 위해 $6.02 \\times 10^{23}$개의 묶음을 $1\\,\\text{mol}$로 정의합니다."
                    },
                    {
                        "id": "law_of_conservation_of_mass",
                        "name": "질량 보존 법칙과 원자 보존",
                        "curriculum": "2022 개정 [중등 과학 > 물질의 변화]",
                        "desc": "화학 반응이 일어날 때 원자의 종류와 개수는 새로 생기거나 사라지지 않고 재배열될 뿐입니다."
                    }
                ],
                "example": {
                    "question": "$\\mathrm{2H_2 + O_2 \\longrightarrow 2H_2O}$ 반응에서 수소($\\mathrm{H_2}$) $4\\,\\text{mol}$이 모두 반응하면 생성되는 물($\\mathrm{H_2O}$)의 몰수는?",
                    "solution_steps": [
                        "화학 반응식의 계수비를 확인합니다. $\\mathrm{H_2 : H_2O} = 2 : 2 = 1 : 1$ 입니다.",
                        "계수비가 $1:1$이므로 수소 $4\\,\\text{mol}$이 반응하면 물도 똑같이 $4\\,\\text{mol}$이 생성됩니다."
                    ]
                },
                "quiz": {
                    "question": "암모니아 합성 반응식 $\\mathrm{N_2(g) + 3H_2(g) \\longrightarrow 2NH_3(g)}$ 에서 질소 기체($\\mathrm{N_2}$) $2\\,\\text{mol}$이 충분한 양의 수소와 모두 반응할 때 생성되는 $\\mathrm{NH_3}$의 몰수는?",
                    "options": [
                        "$4\\,\\text{mol}$",
                        "$2\\,\\text{mol}$",
                        "$6\\,\\text{mol}$",
                        "$1\\,\\text{mol}$"
                    ],
                    "correct_index": 0,
                    "explanation": "반응식에서 $\\mathrm{N_2}$와 $\\mathrm{NH_3}$의 계수비는 $1 : 2$ 입니다. 따라서 질소 $2\\,\\text{mol}$이 반응하면 생성되는 암모니아는 $2 \\times 2 = 4\\,\\text{mol}$ 입니다.",
                    "mistake_analysis": "반응물의 몰수에 계수비를 정확히 곱해야 합니다. 계수비 $1:2$를 간과하고 질소 몰수 그대로 $2\\,\\text{mol}$이라고 답하지 않도록 주의하세요."
                }
            },
            "mass_to_mole_conversion": {
                "concept_name": "몰질량($M$)과 질량-몰수 변환 ($n = m/M$)",
                "curriculum": "2022 개정 [화학 > Ⅰ. 물질의 구성과 화학식량 > 물질의 양]",
                "short_explanation": "어떤 물질의 질량($\\text{g}$)을 그 물질의 화학식량(몰질량, $\\text{g/mol}$)으로 나누면 물질의 입자 묶음 수인 몰수($\\text{mol}$)를 얻습니다.",
                "core_formula": "$n = \\frac{m}{M} \\quad \\Longleftrightarrow \\quad m = n \\times M$",
                "symbol_meanings": [
                    {"symbol": "$n$", "meaning": "물질의 양 (몰수, $\\text{mol}$)"},
                    {"symbol": "$m$", "meaning": "물질의 질량 ($\\text{g}$)"},
                    {"symbol": "$M$", "meaning": "몰질량 (화학식량 뒤에 $\\text{g/mol}$을 붙인 값)"}
                ],
                "visual_type": "chemistry_mole_calc",
                "prerequisites": [
                    {
                        "id": "atomic_weight",
                        "name": "원자량과 화학식량 계산",
                        "curriculum": "2022 개정 [화학 > Ⅰ. 물질의 구성과 화학식량 > 화학식량]",
                        "desc": "탄소($^{12}\\mathrm{C}=12$)를 기준으로 정한 원자들의 상대적 질량이며, 화학식에 포함된 모든 원자량을 합한 값이 화학식량입니다."
                    }
                ],
                "example": {
                    "question": "물($\\mathrm{H_2O}$) $36\\,\\text{g}$은 몇 $\\text{mol}$인가? (단, $\\mathrm{H}=1, \\mathrm{O}=16$)",
                    "solution_steps": [
                        "물의 분자량은 $1 \\times 2 + 16 = 18\\,\\text{g/mol}$ 입니다.",
                        "몰수 $n = \\frac{m}{M} = \\frac{36\\,\\text{g}}{18\\,\\text{g/mol}} = 2.0\\,\\text{mol}$ 입니다."
                    ]
                },
                "quiz": {
                    "question": "이산화 탄소($\\mathrm{CO_2}$) $22\\,\\text{g}$의 몰수는? (단, $\\mathrm{C}=12, \\mathrm{O}=16$)",
                    "options": [
                        "$0.5\\,\\text{mol}$",
                        "$1.0\\,\\text{mol}$",
                        "$2.0\\,\\text{mol}$",
                        "$44\\,\\text{mol}$"
                    ],
                    "correct_index": 0,
                    "explanation": "$\\mathrm{CO_2}$의 분자량은 $12 + 16 \\times 2 = 44\\,\\text{g/mol}$ 입니다. $n = \\frac{22\\,\\text{g}}{44\\,\\text{g/mol}} = 0.5\\,\\text{mol}$ 입니다.",
                    "mistake_analysis": "분자량 $44$로 질량 $22$를 나누어야 합니다. 순서를 거꾸로 하여 $44/22 = 2$로 계산하지 않도록 공식 $n = m/M$을 확인하세요."
                }
            }
        }
    }
}
