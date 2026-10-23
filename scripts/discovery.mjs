const content = {
  "spin": {
    "paths": [
      "name-picker",
      "classroom",
      "team-generator",
      "presentation-order"
    ],
    "qa": [
      [
        [
          "How do I draw without repeats?",
          "중복 없이 추첨하려면?",
          "重複せずに抽選するには？",
          "¿Cómo sortear sin repeticiones?"
        ],
        [
          "Use the batch draw for different entries in one draw. For sequential spins, remove each winner before spinning again. Remove duplicate labels first if each person should appear only once.",
          "여러 명 동시 추첨은 서로 다른 항목을 뽑습니다. 한 명씩 뽑을 때는 당첨자를 제거한 뒤 다시 돌리세요. 한 사람당 한 번만 참여하려면 먼저 중복 이름을 정리하세요.",
          "複数抽選は異なる項目を選びます。1人ずつなら当選者を削除してから再抽選します。1人1枠にするには重複名を先に整理してください。",
          "El sorteo múltiple elige entradas distintas. En sorteos sucesivos, elimina al ganador antes de volver a girar. Quita nombres duplicados para dar una entrada a cada persona."
        ]
      ],
      [
        [
          "Can I keep a class list private?",
          "학급 명단을 비공개로 사용할 수 있나요?",
          "名簿を公開せずに使えますか？",
          "¿Puedo mantener privada una lista?"
        ],
        [
          "The picker runs in your browser. Saving keeps the list on this device. A share link contains your entries, so share only names you have permission to disclose.",
          "추첨은 브라우저에서 실행되며 저장한 명단은 이 기기에 남습니다. 공유 링크에는 입력 항목이 포함되므로 공개해도 되는 이름만 공유하세요.",
          "抽選はブラウザ内で実行され、保存先はこの端末です。共有リンクには入力内容が含まれるため、公開してよい名前だけ共有してください。",
          "El selector funciona en tu navegador y guarda la lista en este dispositivo. El enlace compartido contiene las entradas; comparte solo nombres que puedas divulgar."
        ]
      ]
    ]
  },
  "type": {
    "paths": [
      "one-minute",
      "beginner",
      "custom",
      "punctuation"
    ],
    "qa": [
      [
        [
          "How are WPM and accuracy calculated?",
          "WPM과 정확도는 어떻게 계산하나요?",
          "WPMと正確さの計算方法は？",
          "¿Cómo se calculan WPM y precisión?"
        ],
        [
          "WPM is correctly matched characters divided by five and by elapsed minutes. Accuracy is matching characters divided by typed characters. Correcting an error changes the current result; this is not a count of every historical keystroke.",
          "WPM은 위치가 일치하는 글자 수를 5와 경과 시간(분)으로 나눈 값입니다. 정확도는 입력 글자 중 일치하는 글자의 비율입니다. 오타를 고치면 현재 결과가 바뀌며 과거의 모든 키 입력을 누적 계산하지는 않습니다.",
          "WPMは一致した文字数を5と経過分数で割った値です。正確さは入力文字のうち一致した割合です。修正すると現在の結果が変わり、過去の全打鍵を累積する指標ではありません。",
          "WPM divide los caracteres coincidentes entre cinco y entre los minutos transcurridos. La precisión es la proporción coincidente del texto escrito. Corregir cambia el resultado actual; no cuenta todas las pulsaciones históricas."
        ]
      ],
      [
        [
          "How should I compare practice results?",
          "연습 결과는 어떻게 비교하나요?",
          "練習結果を比べるには？",
          "¿Cómo comparar mis resultados?"
        ],
        [
          "Use the same language, duration and passage difficulty. Finish a full timed run for a duration record. Review missed words before increasing speed; scores from different scripts are not directly equivalent.",
          "언어·제한 시간·문장 난이도를 같게 맞추세요. 제한 시간 기록은 시간을 끝까지 채워 측정하세요. 속도를 올리기 전에 틀린 단어를 복습하고, 서로 다른 문자 체계의 점수는 직접 비교하지 마세요.",
          "言語・制限時間・文章の難度をそろえましょう。時間別の記録は最後まで計測します。速さより先に間違えた語を復習し、異なる文字体系のスコアを直接比較しないでください。",
          "Mantén idioma, duración y dificultad. Completa el tiempo para registrar esa duración. Repasa los errores antes de acelerar; los resultados de distintos sistemas de escritura no son equivalentes."
        ]
      ]
    ]
  },
  "bracket": {
    "paths": [
      "8-team",
      "16-team",
      "round-robin",
      "7-player-league"
    ],
    "qa": [
      [
        [
          "Knockout or round robin: which format fits?",
          "토너먼트와 리그 중 무엇을 선택하나요?",
          "勝ち抜きと総当たりの違いは？",
          "¿Eliminatoria o liga?"
        ],
        [
          "A knockout needs n−1 matches to find one winner. A single round robin needs n(n−1)/2 matches so everyone meets once. Eight players need seven knockout matches or 28 league matches; choose according to available court time.",
          "토너먼트는 우승자 결정까지 n−1경기, 단일 리그는 모두 한 번씩 만나므로 n(n−1)/2경기가 필요합니다. 8명은 토너먼트 7경기, 리그 28경기입니다. 코트 사용 시간에 맞춰 선택하세요.",
          "勝ち抜きは優勝決定までn−1試合、1回総当たりはn(n−1)/2試合です。8人なら7試合または28試合。使えるコート時間に合わせて選びましょう。",
          "Una eliminatoria necesita n−1 partidos; una liga a una vuelta, n(n−1)/2. Con ocho participantes son siete o 28 partidos. Elige según el tiempo disponible."
        ]
      ],
      [
        [
          "What happens with an odd number of players?",
          "참가자가 홀수이면 어떻게 되나요?",
          "参加人数が奇数の場合は？",
          "¿Qué pasa con un número impar?"
        ],
        [
          "A round robin gives one participant a rest each round. A knockout fills the next power-of-two bracket with byes. For seven players, the league has seven rounds and 21 matches; the knockout has one first-round bye and six played matches.",
          "리그는 매 라운드 한 명이 쉽니다. 토너먼트는 다음 2의 거듭제곱 인원까지 빈 자리를 부전승으로 채웁니다. 7명 리그는 7라운드 21경기, 토너먼트는 첫 라운드 부전승 1명과 실제 경기 6개입니다.",
          "総当たりは毎ラウンド1人休みます。勝ち抜きは次の2の累乗まで不戦勝を入れます。7人のリーグは7ラウンド21試合、勝ち抜きは初戦の不戦勝1人と実戦6試合です。",
          "En liga descansa una persona por ronda. La eliminatoria completa la siguiente potencia de dos con pases libres. Siete jugadores: siete rondas y 21 partidos de liga, o un pase libre inicial y seis partidos eliminatorios."
        ]
      ]
    ]
  },
  "print": {
    "paths": [
      "bingo/ocean/",
      "word-search/animals/",
      "maze/easy/",
      "bingo/breakfast-drinks/"
    ],
    "qa": [
      [
        [
          "How do I print a puzzle and a separate answer key?",
          "문제와 정답지를 따로 인쇄하려면?",
          "問題と解答を別に印刷するには？",
          "¿Cómo imprimir una clave por separado?"
        ],
        [
          "Generate the worksheet and print it with answers hidden. Reveal the answers and print again for the teaching copy. The edition number reproduces the same puzzle; increase it for a different sheet.",
          "활동지를 만든 뒤 정답을 숨긴 상태로 인쇄하세요. 이어서 정답을 표시하고 다시 인쇄하면 교사용 정답지가 됩니다. 같은 판 번호는 같은 문제를 만들며, 번호를 바꾸면 새 활동지가 됩니다.",
          "解答を隠して問題を印刷し、次に解答を表示して教師用を印刷します。同じ版番号なら同じ問題、番号を変えると別の問題になります。",
          "Imprime la ficha con las respuestas ocultas. Muéstralas e imprime otra copia para el docente. El número de edición reproduce el mismo ejercicio; cámbialo para obtener otro."
        ]
      ],
      [
        [
          "Which languages work in each worksheet?",
          "활동지마다 어떤 언어를 지원하나요?",
          "教材で使える言語は？",
          "¿Qué idiomas admite cada actividad?"
        ],
        [
          "Bingo supports your own words and the four localized theme lists. Word search uses English A–Z words, 3–12 entries of up to 12 letters. A translated interface does not turn the word-search grid into a Korean or Japanese puzzle.",
          "빙고는 직접 입력한 단어와 4개 언어 주제 목록을 지원합니다. 단어찾기는 영문 A–Z 단어 3~12개, 단어당 최대 12글자를 사용합니다. 화면 언어를 바꿔도 단어찾기 격자가 한글·일본어로 바뀌지는 않습니다.",
          "ビンゴは自由入力と4言語のテーマに対応。単語探しは英字A–Z、3〜12語、各12文字以内です。画面言語を変えても日本語の単語探しにはなりません。",
          "El bingo admite palabras propias y temas en cuatro idiomas. La sopa de letras usa A–Z: de 3 a 12 palabras de hasta 12 letras. Traducir la interfaz no cambia el alfabeto del tablero."
        ]
      ]
    ]
  },
  "daily": {
    "paths": [
      "practice/world/",
      "practice/europe/",
      "practice/asia/",
      "practice/focus-kr/"
    ],
    "qa": [
      [
        [
          "Does practice change my daily streak?",
          "연습하면 일일 연속 기록이 바뀌나요?",
          "練習で連続記録は変わりますか？",
          "¿La práctica cambia mi racha?"
        ],
        [
          "No. Practice rounds are separate from the daily challenge. Complete all five daily questions to count that day. The date changes at 00:00 UTC, which may differ from your local midnight.",
          "아니요. 연습 라운드와 일일 도전은 별개입니다. 오늘의 문제 5개를 모두 풀어야 그날이 기록됩니다. 날짜는 UTC 0시에 바뀌므로 현지 자정과 다를 수 있습니다.",
          "いいえ。練習と毎日の挑戦は別です。毎日の5問を完了するとその日が記録されます。日付はUTC午前0時に変わり、現地の深夜とは異なる場合があります。",
          "No. La práctica es independiente del reto diario. Completa las cinco preguntas diarias para contar ese día. La fecha cambia a las 00:00 UTC, no necesariamente a tu medianoche."
        ]
      ],
      [
        [
          "Where are my scores saved?",
          "점수는 어디에 저장되나요?",
          "スコアはどこに保存されますか？",
          "¿Dónde se guardan las puntuaciones?"
        ],
        [
          "Daily progress is stored in this browser. Clearing site data, switching devices or private browsing can lose the record. Practice does not update the daily score. Flag emoji artwork can vary by device.",
          "일일 진행 상황은 이 브라우저에 저장됩니다. 사이트 데이터 삭제, 기기 변경, 시크릿 모드에서는 기록이 유지되지 않을 수 있습니다. 연습은 일일 점수를 바꾸지 않으며 국기 이모지 모양은 기기에 따라 다릅니다.",
          "毎日の進捗はこのブラウザに保存されます。データ削除・端末変更・プライベート閲覧で失われる場合があります。練習は日次スコアを更新せず、旗の絵柄は端末によって異なります。",
          "El progreso diario se guarda en este navegador. Borrar datos, cambiar de dispositivo o usar navegación privada puede perderlo. La práctica no modifica la puntuación diaria. Los emojis varían según el dispositivo."
        ]
      ]
    ]
  },
  "compare": {
    "paths": [
      "area/kor-vs-jpn/",
      "space/earth-vs-jupiter/",
      "duration/hour-vs-week/",
      "volume/ml-vs-l/"
    ],
    "qa": [
      [
        [
          "Are the shapes real country maps?",
          "도형이 실제 나라 지도인가요?",
          "図形は実際の国の地図ですか？",
          "¿Las figuras son mapas reales?"
        ],
        [
          "No. Country area is represented by equal-area squares. If one country has four times the area, its square is twice as wide. Planet circles compare diameters; the bars compare one measurement, not silhouettes or object volume.",
          "아니요. 국가 면적은 면적 비율이 같은 정사각형으로 나타냅니다. 면적이 4배면 변 길이는 2배입니다. 행성 원은 지름을 비교하며 막대는 한 가지 수치를 비교하므로 실제 윤곽이나 물체 부피가 아닙니다.",
          "いいえ。国土面積は面積比を保つ正方形で表します。面積4倍なら幅2倍。惑星の円は直径、棒は単一の量を比較し、実際の輪郭や体積ではありません。",
          "No. La superficie de los países se representa con cuadrados proporcionales: cuatro veces el área implica el doble de ancho. Los círculos comparan diámetros y las barras una magnitud, no siluetas ni volúmenes físicos."
        ]
      ],
      [
        [
          "Can I verify or reuse the comparison?",
          "비교 근거를 확인하거나 재사용할 수 있나요?",
          "根拠の確認や再利用はできますか？",
          "¿Puedo comprobar o reutilizar la comparación?"
        ],
        [
          "Each comparison page lists the values, units, division and source. Use Swap for the reciprocal ratio. Download SVG to preserve labels and values, or share the settings link. A custom second value is your own assumption, not a sourced measurement.",
          "각 비교 페이지에 값·단위·나눗셈·출처가 있습니다. 순서 바꾸기는 역비율을 보여줍니다. SVG로 이름과 수치를 보존하거나 설정 링크를 공유하세요. 직접 입력한 두 번째 값은 출처가 있는 측정치가 아니라 사용자가 정한 기준입니다.",
          "各ページで値・単位・計算・出典を確認できます。入れ替えで逆比を表示。SVGでラベルと値を保存し、設定リンクも共有できます。自由入力値は出典のある測定値ではなく自分の基準です。",
          "Cada página muestra valores, unidades, división y fuente. Intercambia para ver la razón inversa. Descarga el SVG o comparte el enlace de configuración. Un valor personalizado es una referencia propia, no una medición documentada."
        ]
      ]
    ]
  }
};
export function related(items, current, limit = 6) {
  const key = p => p.slug || p.path;
  const tokens = value => new Set(value.split(/[-/]/).filter(x=>x && !["tools","practice","focus","vs","player","wheel","typing","sentences","punctuation","draw","story","prompts","league","knockout","team","bingo","word","search"].includes(x)));
  const target = tokens(key(current));
  const score = p => [...tokens(key(p))].reduce((n,x)=>n+(target.has(x)? (/^\d+$/.test(x)?3:2):0),0) + (current.mode && p.mode===current.mode ? 1:0);
  return items.filter(p=>key(p)!==key(current)).map((p,i)=>({p,i,score:score(p)})).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,limit).map(x=>x.p);
}
export function discovery(kind, lang, items, href) {
 const i=["en","ko","ja","es"].indexOf(lang), d=content[kind];
 const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
 const heading=["Choose your task","목적에 맞게 시작하기","目的から選ぶ","Elige tu actividad"][i];
 const questions=["Questions and methods","자주 묻는 질문과 계산 방법","よくある質問と仕組み","Preguntas y métodos"][i];
 const selected=d.paths.map(path=>items.find(p=>(p.slug||p.path)===path)).filter(Boolean);
 const title=p=>Array.isArray(p.title)?p.title[i]:p.title;
 return `<section class="discovery"><h2>${heading}</h2><nav class="discovery-links" aria-label="${heading}">${selected.map(p=>`<a data-discovery-link href="${href(p)}">${esc(title(p))} →</a>`).join("")}</nav><h2>${questions}</h2>${d.qa.map(([q,a])=>`<details><summary>${esc(q[i])}</summary><p>${esc(a[i])}</p></details>`).join("")}</section>`;
}
