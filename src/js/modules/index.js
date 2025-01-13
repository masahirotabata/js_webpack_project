import * as Todo from './modules/todo.js';
import * as Typing from './modules/typing.js';
import * as Slide from './modules/slide.js';

document.addEventListener('DOMContentLoaded', () => {
    const navMenus = document.querySelectorAll('.nav-menu');
    const sections = document.querySelectorAll('section');

    // メニュークリック時の動作を設定
    navMenus.forEach(menu => {
        menu.addEventListener('click', () => {
            // 現在のアクティブクラスをリセット
            navMenus.forEach(m => m.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // 対象のセクションを表示
            menu.classList.add('active');
            const targetId = menu.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});
