document.addEventListener('DOMContentLoaded', () => {
    const menuCover = document.querySelector('.sp-cover');
    const menu = document.querySelectorAll('.sp-menu > li');
    const backToMenu = document.querySelector('.sp-back-to-menu');
    const originalImage = document.querySelector('#sp-original-image');
    const showOriginalBtn = document.querySelector('#sp-show-original-btn');
    const screen = document.querySelector('#sp-screen');
    const counter = document.querySelector('.sp-counter');
    const testTile = document.querySelector('#test-tile'); // 新しく追加
    const originalButton = document.querySelector('#sp-show-original-btn');
    if (originalButton) {
        originalButton.classList.remove('show'); // 初期状態を非表示に
    }
    let level;
    let size;
    let orderedArray = [];
    let hiddenTileIndex;
    let tilesArray = [];
    const images = ['space', 'veges'];
    let selectedImage;
    let count = 0;

    const levelMap = {
        easy: { grid: 'repeat(2, 1fr)', size: 2 },
        medium: { grid: 'repeat(3, 1fr)', size: 3 },
        difficult: { grid: 'repeat(4, 1fr)', size: 4 }
    };

    menu.forEach(item => {
        item.addEventListener('click', () => {
            menuCover.classList.add('hide');
            level = item.dataset.level;
            size = levelMap[level].size;

            orderedArray = [];
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let tileXY = `${x}${y}`;
                    orderedArray.push(tileXY);
                }
            }

            hiddenTileIndex = Math.floor(Math.random() * size ** 2);

            screen.style.gridTemplateColumns = levelMap[level].grid;
            screen.style.gridTemplateRows = levelMap[level].grid;

            start();
        });
    });

    backToMenu.addEventListener('click', () => {
        menuCover.classList.remove('hide');
        screen.classList.remove('zoom');
        screen.innerHTML = '';
    });

    function setOriginalImage() {
        selectedImage = images[Math.floor(Math.random() * images.length)];
        originalImage.setAttribute('src', `./images/slide_puzzle/${selectedImage}/${selectedImage}.png`);
    }

    originalImage.onload = () => {
        const naturalWidth = originalImage.naturalWidth;
        const naturalHeight = originalImage.naturalHeight;
        const ratio = Math.floor(naturalHeight / naturalWidth * 1000) / 1000;
        screen.style.width = "480px";
        screen.style.height = `${Math.floor(480 * ratio)}px`;
    };

    showOriginalBtn.addEventListener('mouseover', () => {
        originalImage.classList.add('show');
    });

    showOriginalBtn.addEventListener('mouseleave', () => {
        originalImage.classList.remove('show');
    });

    // renderTilesの改良
    function renderTiles(arr) {
        screen.innerHTML = '';
        arr.forEach((tile, index) => {
            const div = document.createElement('div');
            div.classList.add('sp-tile');
            if (index === hiddenTileIndex) {
                div.classList.add('hidden'); // 空白タイルを設定
            } else {
                div.style.backgroundImage = `url(./images/slide_puzzle/${selectedImage}/${level}/tile${tile}.png)`;
            }
            div.addEventListener('click', () => {
                if (isAdjacent(index, hiddenTileIndex)) {
                    updateTiles(index);
                }
            });
            screen.appendChild(div);
        });
    }

    function start() {
        setOriginalImage();
        tilesArray = generateShuffledArray(orderedArray);
        renderTiles(tilesArray);
        updateScreen();
    }

    function generateShuffledArray(arr) {
        let shuffledArray = arr.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
        }
        return shuffledArray;
    }

    function updateTiles(index) {
        tilesArray = generateNewArray(tilesArray, index, hiddenTileIndex);
        hiddenTileIndex = index;
        renderTiles(tilesArray);
        count++;
        if (counter) {
            counter.textContent = count;
            // 完成条件のチェック
            const isCompleted = checkCompletion();
            if (isCompleted) {
                setTimeout(() => {
                    autoCompletePuzzle(); // 自動で最後のタイルを埋める処理
                }, 500);
            }
        } else {
            console.error('Counter element not found');
        }
    }

    function generateNewArray(arr, index, hiddenTileIndex) {
        const tempValue = arr[index];
        arr[index] = arr[hiddenTileIndex];
        arr[hiddenTileIndex] = tempValue;
        return arr;
    }

    function updateScreen() {
        const tiles = document.querySelectorAll('.sp-tile');
    }

    function isAdjacent(index1, index2) {
        const x1 = index1 % size, y1 = Math.floor(index1 / size);
        const x2 = index2 % size, y2 = Math.floor(index2 / size);
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
    }

    function checkCompletion() {
        // hidden タイル以外が正しい順序で揃っているか確認
        for (let i = 0; i < tilesArray.length; i++) {
            if (i !== hiddenTileIndex && tilesArray[i] !== orderedArray[i]) {
                return false; // 揃っていない場合
            }
        }
        // 完成した場合、自動でアニメーションを呼び出し
        setTimeout(() => {
            complete(); // アニメーションの起動
        }, 500); // 遅延を加える
        return true; // 揃った場合
    }
    
    // 完成後のアニメーション処理
    function complete() {
        const tiles = document.querySelectorAll('.sp-tile');
        tiles[hiddenTileIndex].classList.remove('hidden'); // 空白タイルを可視化
        screen.classList.add('zoom'); // ズームアニメーションを追加
        tiles.forEach(tile => {
            tile.classList.add('complete'); // 完成タイルのスタイルを適用
            tile.style.pointerEvents = 'none'; // タイルをクリック不可に
        });
    }

    // 新しく追加：自動でパズルを完成させる
    // 自動で最後のタイルを埋める処理
    function autoCompletePuzzle() {
        if (hiddenTileIndex !== orderedArray.length - 1) {
            // 空白タイルを最後の位置に移動
            tilesArray[hiddenTileIndex] = tilesArray[orderedArray.length - 1];
            tilesArray[orderedArray.length - 1] = null; // 空白タイルに設定
            hiddenTileIndex = orderedArray.length - 1;
        }

        renderTiles(tilesArray); // タイルを再描画

        // 完成したタイルを元に戻し、アニメーションを起動
        setTimeout(() => {
            complete(); // アニメーションの起動
        }, 300); // アニメーション用の遅延
    }

    // sp-show-original-btn に表示されるタイルの更新処理
    function updateOriginalButton() {
        const originalButton = document.querySelector('#sp-show-original-btn');
        if (originalButton) {
            originalButton.style.backgroundImage = `url(./images/slide_puzzle/${selectedImage}/${selectedImage}.png)`;
            originalButton.classList.add('show');
        }
    }

    // 新しいタイルを追加
    function addTestTile() {
        if (testTile) {
            testTile.addEventListener('click', () => {
                alert("Test Tile clicked!");
            });
        }
    }

    addTestTile(); // 新しいタイルの追加処理を実行
});
