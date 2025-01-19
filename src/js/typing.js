document.addEventListener('DOMContentLoaded', () => {
    const startPage = document.querySelector('#ty-start-page');
    const typingGame = document.querySelector('#ty-game');
    const titleTime = document.querySelector('#ty-title-time');
    const timerDisplay = document.querySelector('#ty-timer');
    const timeSelectEl = document.querySelector('.ty-time-select');
    const typing = document.querySelector('#typing');
    const backToStart = document.querySelector('#ty-back-to-start');
    const resultContainer = document.querySelector('#ty-result-container');
    const textarea = document.querySelector('#ty-textarea');
    const quote = document.querySelector('#ty-quote');
    const LPM = document.querySelector('#ty-LPM');

    let timelimit = 30;
    let remainingTime;
    let isPlaying = false;
    let intervalId = null;
    let totalCorrectCount = 0; // 累計正しい文字数を保持

    const quotesArray = [
        "The quick brown fox jumps over the lazy dog.",
        "Practice makes perfect.",
        "Hello, world!",
        "JavaScript is fun.",
        "Typing games improve speed."
    ];

    // タイムリミットの変更処理
    timeSelectEl.addEventListener('change', () => {
        timelimit = parseInt(timeSelectEl.value, 10);
    });

    window.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !isPlaying) {
            start();
        }
    });

    async function start() {
        if (intervalId) {
            clearInterval(intervalId);
        }

        startPage.classList.remove('show');
        typingGame.classList.add('show');
        titleTime.textContent = timelimit;
        remainingTime = timelimit;
        timerDisplay.textContent = remainingTime;
        textarea.disabled = false;
        textarea.value = ''; // 入力欄をリセット
        textarea.focus();
        isPlaying = true;
        totalCorrectCount = 0; // 累計をリセット
        LPM.textContent = 0;

        renderQuote();

        intervalId = setInterval(() => {
            remainingTime--;
            timerDisplay.textContent = remainingTime;
            if (remainingTime <= 0) {
                clearInterval(intervalId);
                intervalId = null;
                showResult();
            }
        }, 1000);
    }

    backToStart.addEventListener('click', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        typingGame.classList.remove('show');
        startPage.classList.add('show');
        resultContainer.classList.remove('show');
        isPlaying = false;
    });

    function showResult() {
        textarea.disabled = true;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        resultContainer.classList.add('show');

        // 最終結果に正しく入力した文字数を表示
        quote.innerHTML = `Total Correct Characters: ${totalCorrectCount}`;
    }

    function renderQuote() {
        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        const selectedQuote = quotesArray[randomIndex];
        quote.innerHTML = ''; // 既存の内容をクリア

        // 各文字を `<span>` に分割して表示
        selectedQuote.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            quote.appendChild(span);
        });
    }

    textarea.addEventListener('input', () => {
        const inputValue = textarea.value;
        const spans = quote.querySelectorAll('span');
        let correctCount = 0;

        spans.forEach((span, index) => {
            const inputChar = inputValue[index];

            // 入力文字と一致した場合
            if (inputChar === span.textContent) {
                span.classList.add('correct'); // 赤くするクラスを追加
                correctCount++;
            } else {
                span.classList.remove('correct'); // 一致しない場合クラスを削除
            }
        });

        // 更新された一致した文字数をLPMに反映
        LPM.textContent = correctCount;

        // すべての文字を打ち終わった場合
        if (inputValue.length === spans.length && correctCount === spans.length) {
            totalCorrectCount += correctCount; // 累計文字数を更新
            textarea.value = ''; // 入力欄をリセット
            renderQuote(); // 新しい文字列を表示
        }
    });
});
