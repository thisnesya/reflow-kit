// (() => {
//     class VisuallyImpairedMode {
//         constructor(modules = []) {
//             this.modules = modules;
//             this.template = getTemplate('vi-panel');
//             this.enabled = false;

//             const that = this;
//             this.template
//                 .querySelector('#vi__disable-mode')
//                 ?.addEventListener('click', that.disable.bind(this));
//         }

//         enable() {
//             if (this.enabled) return;

//             const modules = this.modules;
//             const template = this.template;

//             modules.forEach((module) => module.init(template));
//             document.body.prepend(template);

//             document.body.classList.add('vi__enabled');

//             this.enabled = true;
//             localStorage.setItem('vi:enabled', true);
//         }

//         disable() {
//             if (!this.enabled) return;

//             const modules = this.modules;
//             const template = this.template;

//             modules.forEach((module) => module.destroy());
//             template.remove();

//             document.body.classList.remove('vi__enabled');

//             this.enabled = false;
//             localStorage.removeItem('vi:enabled');
//         }

//         getOptions() {
//             const modules = this.modules;
//             const options = {};

//             modules.forEach((m) => (options[m.name] = m.getCurrent()));

//             return options;
//         }
//     }

//     function FontSizeModule() {
//         let current = parseInt(getComputedStyle(document.documentElement).fontSize);
//         let inputs;

//         function init(template) {
//             inputs = template.querySelectorAll('[name="vi__fontSize"]');
//             current = localStorage.getItem('vi:fontSize') || current;

//             document.documentElement.style.fontSize = `${current}px`;

//             inputs.forEach((input) => {
//                 if (input.value === current.toString()) input.checked = true;
//                 input.addEventListener('change', inputListener);
//             });
//         }

//         function destroy() {
//             inputs.forEach((input) => {
//                 input.removeEventListener('change', inputListener);
//             });

//             document.documentElement.style.fontSize = ``;
//         }

//         function inputListener(evt) {
//             const size = evt.target.value;
//             document.documentElement.style.fontSize = `${size}px`;

//             current = size;
//             localStorage.setItem('vi:fontSize', size);
//         }

//         function getCurrent() {
//             return current;
//         }

//         return {
//             name: 'fontSize',
//             init,
//             destroy,
//             getCurrent
//         };
//     }

//     function ThemeModule() {
//         const tokens = {
//             WhiteBlack: {
//                 name: 'WhiteBlack',
//                 token: 'vi__white-black'
//             },
//             BlackWhite: {
//                 name: 'BlackWhite',
//                 token: 'vi__black-white'
//             },
//             BlueBlack: {
//                 name: 'BlueBlack',
//                 token: 'vi__blue-black'
//             },
//             YellowBlack: {
//                 name: 'YellowBlack',
//                 token: 'vi__yellow-black'
//             },
//             BlackGreen: {
//                 name: 'BlackGreen',
//                 token: 'vi__black-green'
//             }
//         };

//         let current;
//         let inputs;

//         function init(template) {
//             inputs = template.querySelectorAll('[name="vi__theme"]');
//             current = localStorage.getItem('vi:theme') || tokens.WhiteBlack.name;

//             document.body.classList.add(tokens[current].token);

//             inputs.forEach((input) => {
//                 if (input.value === current.toString()) input.checked = true;
//                 input.addEventListener('change', inputListener);
//             });
//         }

//         function destroy() {
//             inputs.forEach((input) => {
//                 input.removeEventListener('change', inputListener);
//             });

//             document.body.classList.remove(tokens[current].token);
//         }

//         function inputListener(evt) {
//             const theme = evt.target.value;
//             document.body.classList.replace(tokens[current].token, tokens[theme].token);

//             current = theme;
//             localStorage.setItem('vi:theme', theme);
//         }

//         function getCurrent() {
//             return current;
//         }

//         return {
//             name: 'theme',
//             init,
//             destroy,
//             getCurrent
//         };
//     }

//     function ImagesModule() {
//         let current;
//         let inputs;

//         function init(template) {
//             inputs = template.querySelectorAll('[name="vi__images"]');
//             current = 'true' === localStorage.getItem('vi:images');

//             toggle();

//             inputs.forEach((input) => {
//                 if (input.value === current.toString()) input.checked = true;
//                 input.addEventListener('change', inputListener);
//             });
//         }

//         function destroy() {
//             document.body.classList.remove('vi__disable-image');

//             inputs.forEach((input) => {
//                 input.removeEventListener('change', inputListener);
//             });
//         }

//         function toggle() {
//             if (current) document.body.classList.remove('vi__disable-image');
//             else document.body.classList.add('vi__disable-image');
//         }

//         function inputListener(evt) {
//             const state = 'true' === evt.target.value;
//             current = state;
//             localStorage.setItem('vi:images', state);

//             toggle();
//         }

//         function getCurrent() {
//             return current;
//         }

//         return {
//             name: 'images',
//             init,
//             destroy,
//             getCurrent
//         };
//     }

//     function SpeechModule() {
//         const textLang = 'ru-RU';
//         const textRate = 1.1;
//         let speakTimer = false;
//         let isActive;
//         let inputs;

//         function init(template) {
//             inputs = template.querySelectorAll('[name="vi__speech"]');
//             isActive = 'true' === localStorage.getItem('vi:speech');

//             if (getSynth()) {
//                 getSynth().oninterrupt = function (e) {};
//                 getSynth().onerror = function (e) {
//                     stopSpeak();
//                 };
//             }

//             if (isActive) bindEvents();

//             inputs.forEach((input) => {
//                 if (input.value === isActive.toString()) input.checked = true;
//                 input.addEventListener('change', inputListener);
//             });
//         }

//         function destroy() {
//             unbindEvents();

//             inputs.forEach((input) => {
//                 input.removeEventListener('change', inputListener);
//             });
//         }

//         function bindEvents() {
//             document.addEventListener('mouseover', onMouseOver);
//             document.addEventListener('mouseup', onMouseUp);
//             document.addEventListener('mousedown', onMouseDown);
//         }

//         function unbindEvents() {
//             document.removeEventListener('mouseover', onMouseOver);
//             document.removeEventListener('mouseup', onMouseUp);
//             document.removeEventListener('mousedown', onMouseDown);
//         }

//         function inputListener(evt) {
//             const state = 'true' === evt.target.value;

//             if (state) bindEvents();
//             else unbindEvents();

//             isActive = state;
//             localStorage.setItem('vi:speech', state);
//         }

//         function onMouseOver(evt) {
//             const { target } = evt;
//             if (!isActive) return;

//             if (target) {
//                 let overTimer = setInterval(function () {
//                     if (!speakTimer) {
//                         if (overTimer) {
//                             clearInterval(overTimer);
//                             overTimer = false;
//                         }

//                         let text = getNodeText(target);
//                         if (text.length) speak(text);
//                     }
//                 }, 100);

//                 const onMouseOut = function () {
//                     if (overTimer) {
//                         clearInterval(overTimer);
//                         overTimer = false;
//                     }

//                     target.removeEventListener('mouseout', onMouseOut);
//                 };

//                 target.addEventListener('mouseout', onMouseOut);
//             }
//         }

//         function onMouseUp() {
//             if (!isActive) return;

//             setTimeout(function () {
//                 let text = _getSelection();
//                 if (text && text.length) speak(text);
//                 else stopSpeak();
//             }, 100);
//         }

//         function onMouseDown() {
//             if (isActive) stopSpeak();
//         }

//         function speak(text) {
//             if (!isActive) return;

//             stopSpeak();

//             if (typeof text !== 'undefined' && text.length) {
//                 text = clearText(text);

//                 try {
//                     let msg = new SpeechSynthesisUtterance(text);
//                     msg.lang = textLang;
//                     msg.rate = textRate;

//                     msg.onerror = function (e) {
//                         throw e;
//                     };

//                     msg.onend = function (e) {
//                         if (speakTimer) {
//                             clearInterval(speakTimer);
//                             speakTimer = false;
//                         }
//                     };

//                     getSynth().speak(msg);

//                     speakTimer = setInterval(function () {
//                         if (getSynth().paused) {
//                             getSynth().resume();
//                         }
//                     }, 100);
//                 } catch (e) {
//                     console.error(e);
//                     stopSpeak();
//                 }
//             }
//         }

//         function stopSpeak() {
//             if (speakTimer) {
//                 clearInterval(speakTimer);
//                 speakTimer = false;
//             }

//             if (getSynth()) getSynth().cancel();
//         }

//         function _getSelection() {
//             return (
//                 (window.getSelection && window.getSelection().toString()) ||
//                 (document.selection && document.selection.createRange().text)
//             );
//         }

//         function getSynth() {
//             return (
//                 window.speechSynthesis || window.mozspeechSynthesis || window.webkitspeechSynthesis
//             );
//         }

//         function clearText(text) {
//             const regex = new RegExp('[0-9a-zа-я]', 'i');
//             text = text.replace(' *', '');

//             if (text.match(regex)) {
//                 return text;
//             } else return '';
//         }

//         function getNodeText(node) {
//             let text = '';

//             if (node && hasText(node)) {
//                 if (node.hasAttribute('title')) text = clearText(node.getAttribute('title').trim());
//                 if (!text.length && node.parentNode.hasAttribute('title'))
//                     text = clearText(node.parentNode.getAttribute('title').trim());
//                 if (!text.length) text = clearText(node.innerText.trim());
//             }

//             return text;
//         }

//         function hasText(node) {
//             const has =
//                 node.tagName === 'A' ||
//                 node.tagName === 'H1' ||
//                 node.tagName === 'H2' ||
//                 node.tagName === 'H3' ||
//                 node.tagName === 'H4' ||
//                 node.tagName === 'H5' ||
//                 node.tagName === 'H6' ||
//                 node.tagName === 'P' ||
//                 node.tagName === 'BUTTON';

//             const isText = node.firstChild ? '#text' === node.firstChild.nodeName : false;
//             const parentHasTitle = node.parentNode.hasAttribute('title');
//             return has || isText || node.hasAttribute('title') || parentHasTitle;
//         }

//         function getCurrent() {
//             return isActive;
//         }

//         return {
//             name: 'speech',
//             init,
//             destroy,
//             getCurrent
//         };
//     }

//     if (!window.__viModule) {
//         window.__viModule = new VisuallyImpairedMode([
//             FontSizeModule(),
//             ThemeModule(),
//             ImagesModule(),
//             SpeechModule()
//         ]);

//         if (localStorage.getItem('vi:enabled')) {
//             __viModule.enable();
//         }
//     }
// })();
