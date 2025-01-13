document.addEventListener('DOMContentLoaded', () => {
    const menuCover = document.querySelector('.sp-cover');
    const menu = document.querySelectorAll('.sp-menu > li');
    const backToMenu = document.querySelector('.sp-back-to-menu');
    const originalImage = document.querySelector('#sp-original-image');
    const showOriginalBtn = document.querySelector('#sp-show-original-btn');
    const screen = document.querySelector('#sp-screen');
    const counter = document.querySelector('.sp-counter');
    const testTile = document.querySelector('#test-tile'); // 新しく追加

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

    function renderTiles(arr) {
        screen.innerHTML = '';
        arr.forEach((tile, index) => {
            const div = document.createElement('div');
            div.classList.add('sp-tile');
            if (index === hiddenTileIndex) {
                div.classList.add('hidden');
            } else {
                div.style.backgroundImage = `url(./images/slide_puzzle/${selectedImage}/${level}/tile${tile}.png)`;
            }
            div.addEventListener('click', () => {
                if (isAdjacent(index, hiddenTileIndex)) {
                    updateTiles(index);
                }
                updateScreen();
            });
            screen.appendChild(div);

            // test-tileに画像を再表示するためのイベント
            div.addEventListener('click', () => {
                if (index !== hiddenTileIndex) {
                    const tileImage = `url(./images/slide_puzzle/${selectedImage}/${level}/tile${tile}.png)`;
                    // orderedArray にタイルが含まれているかチェック
                    if (orderedArray.includes(tile)) {
                        testTile.style.backgroundImage = tileImage;
                        testTile.classList.add('show'); // 必要ならCSSで制御
                    } else {
                        console.warn('This tile does not belong to the original image.');
                    }
                }
            });
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
            if (JSON.stringify(tilesArray) === JSON.stringify(orderedArray)) {
                setTimeout(() => {
                    complete();
                }, 500); // 完成時に遅延を追加
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

    function complete() {
        const tiles = document.querySelectorAll('.sp-tile'); // タイルを再取得
        tiles[hiddenTileIndex].classList.remove('hidden'); // 隠れたタイルを表示
        screen.classList.add('zoom'); // スクリーン全体をズーム
        tiles.forEach(tile => {
            tile.classList.add('complete'); // 完成した状態のクラスを追加
        });
    }
});
