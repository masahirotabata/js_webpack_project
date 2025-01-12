document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.querySelector('.td-add-form');
    const addInput = document.querySelector('.td-add-input');
    const todosUl = document.querySelector('.todos');
    const donesUl = document.querySelector('.dones');
    const searchForm = document.querySelector('.td-search-form');
    const searchInput = document.querySelector('.td-search-input');

    let todoData = getTodoData(); // ローカルストレージからデータを取得

    // 初期データの読み込み
    if (todoData.length === 0) {
        todoData.push({ content: 'remains to do', isDone: false });
        todoData.push({ content: 'already done', isDone: true });
        updateLS();
    }
    updateTodo();

    // フォームの送信処理
    addForm.addEventListener('submit', e => {
        e.preventDefault(); // フォームのデフォルト動作を抑制
        const content = addInput.value.trim();
        if (content) {
            todoData.push({ content, isDone: false }); // 配列に追加
            addInput.value = ''; // 入力値をリセット
            updateLS();
            updateTodo();
        }
    });

    // ローカルストレージを更新
    function updateLS() {
        localStorage.setItem('myTodo', JSON.stringify(todoData));
    }

    // ローカルストレージからデータを取得
    function getTodoData() {
        return JSON.parse(localStorage.getItem('myTodo')) || [];
    }

    // タスクのリストを更新
    function updateTodo() {
        todosUl.innerHTML = ''; // タスクリストをクリア
        donesUl.innerHTML = '';
        todoData.forEach(todo => createTodoElement(todo)); // 各タスクを再描画
    }

    // タスク要素を作成
    function createTodoElement(todo) {
        const todoItem = document.createElement('li');
        todoItem.classList.add('td-item');
        const todoContent = document.createElement('p');
        todoContent.textContent = todo.content;
        todoItem.appendChild(todoContent);

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('td-btn-container');
        const btn = document.createElement('img');
        btn.classList.add('td-btn');
        const upBtn = btn.cloneNode(false);
        upBtn.setAttribute('src', './images/todo_button/up.png');

        if (!todo.isDone) {
            upBtn.classList.add('edit-btn');
            btn.classList.add('isDone-btn');
            btn.setAttribute('src', './images/todo_button/ok.png');
            btnContainer.appendChild(btn);
            btnContainer.appendChild(upBtn);
            todoItem.appendChild(btnContainer);
            todosUl.appendChild(todoItem);
        } else {
            upBtn.classList.add('undo-btn');
            btn.classList.add('delete-btn');
            btn.setAttribute('src', './images/todo_button/cancel.png');
            btnContainer.appendChild(btn);
            btnContainer.appendChild(upBtn);
            todoItem.appendChild(btnContainer);
            donesUl.appendChild(todoItem);
        }

        // イベントリスナーを設定
        btn.addEventListener('click', e => {
            if (e.target.classList.contains('isDone-btn')) {
                todo.isDone = true; // 完了に変更
            } else if (e.target.classList.contains('undo-btn')) {
                todo.isDone = false; // 未完了に変更
            } else if (e.target.classList.contains('delete-btn')) {
                todoData = todoData.filter(data => data !== todo); // 削除
            }
            updateLS();
            updateTodo();
        });

        upBtn.addEventListener('click', e => {
            if (e.target.classList.contains('edit-btn')) {
                addInput.value = todo.content; // 編集のために入力欄にセット
                todoData = todoData.filter(data => data !== todo); // 編集時に一時削除
                addInput.focus();
            }
        });
    }

    // 検索機能
    searchInput.addEventListener('keyup', () => {
        const searchWord = searchInput.value.trim().toLowerCase();
        const todoItems = document.querySelectorAll('.td-item');
        todoItems.forEach(todoItem => {
            todoItem.classList.remove('hide'); // 最初に非表示を解除
            if (!todoItem.textContent.toLowerCase().includes(searchWord)) {
                todoItem.classList.add('hide'); // 検索ワードに一致しないものを非表示にする
            }
        });
    });
});
