"use strict"

const buttons = {
    actionButtons: getActionButtons(),
    actionCloseButtons: getActionCloseButtons(),
    consoleClearButton: document.getElementsByClassName("console__button_clear")[0],
    consoleCloseButton: document.getElementsByClassName("console__button_close")[0],
    consoleButton: document.getElementsByClassName("footer__button_console")[0],
    downloadButtons: document.querySelectorAll("button.dropdown__button"),
    dropdownButtons: document.getElementsByClassName("button_dropdown"),
    exportButton: document.getElementsByClassName("footer__button_export")[0],
    formHelpButtons: document.getElementsByClassName("form__help-button"),
    formHelpCloseButtons: document.getElementsByClassName("form-help__close-button"),
    mainNavButtons: document.getElementsByClassName("main-nav__button"),
    modalButtons: document.getElementsByClassName("modal__button"),
    runButton: document.getElementsByClassName("nav__button_run")[0],
    shortcutsButton: document.getElementsByClassName("footer__button_shortcuts")[0],
    toggleButton: document.getElementsByClassName("toggle-button")[0]
};
const disableSelection = () => false;
const enableSelection = () => true;
const navActionsTransitionDuration = 200;
const pageElements = {
    addedForms: [],
    codeMirrors: document.getElementsByClassName("CodeMirror"),
    console: document.getElementsByClassName("console")[0],
    consoleEntries: document.getElementsByClassName("console__entries")[0],
    consoleTextArea: document.getElementsByClassName("command-line__textarea")[0],
    dropdowns: document.getElementsByClassName("dropdown"),
    editor: createEditor(document.getElementsByClassName("editor")[0]),
    editorContainers: document.getElementsByClassName("main__editor-container"),
    footer: document.getElementsByClassName("footer")[0],
    footerExport: document.getElementsByClassName("footer__export")[0],
    formHelps: document.getElementsByClassName("form-help"),
    formTemplate: document.querySelector("template"),
    horizontalResizer: document.getElementsByClassName("separator_resizer")[0],
    loadFileInput: document.getElementsByClassName("dropdown__input")[0],
    mainSection: document.getElementsByClassName("main__inner-container")[0],
    modal: document.getElementsByClassName("modal")[0],
    modalForms: document.getElementsByClassName("modal__form"),
    modalTabs: document.getElementsByClassName("modal__tab"),
    navActions: document.getElementsByClassName("nav__actions")[0],
    overlay: document.getElementsByClassName("overlay")[0],
    result: createEditor(document.getElementsByClassName("editor")[1]),
    resultParentElement: document.querySelector(".editor[data-editor='result']"),
    resultTooltip: ["Try the following:", "", "1. Use different phrasing or notations", "2. Enter whole words instead of abbreviations", "3. Avoid mixing mathematical and other notations", "4. Check your spelling", "5. Give your input in English"],
    shortcuts: document.getElementsByClassName("key-commands")[0],
    verticalResizer: document.getElementsByClassName("separator_vertical")[0],
    zoom: document.getElementsByClassName("footer__button_zoom")[0]
};
const resultFadeInDuration = 1000;
const spinnerAnimationTime = 2000;


/** Создание редактора. */

function createEditor(element) {
    const attribute = element.getAttribute("data-editor");

    switch (attribute) {
        case "editor":
            const editor = CodeMirror(element, {
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                lineWrapping: true,
                mode: "text/x-python",
                scrollbarStyle: "simple",
                theme: "twilight"
            });

            editor.focus();
            return editor;
        case "result":
            return CodeMirror(element, {
                cursorHeight: 0,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                lineWrapping: true,
                mode: "text/x-python",
                readOnly: true,
                scrollbarStyle: "simple",
                theme: "twilight"
            });
    }
}


/** Открытие/сокрытие навигации для мобильных устройств. */

buttons.toggleButton.addEventListener("click", openMobileNavigation);

function openMobileNavigation() {
    buttons.toggleButton.classList.toggle("toggle-button_expanded");
    pageElements.navActions.classList.toggle("nav__actions_open");
    toggleFastTransition();
    document.addEventListener("click", closeMobileNavigation);
}
function closeMobileNavigation(event) {
    if (event.target.classList[0] && !isNavActions(event.target.classList[0])) {
        buttons.toggleButton.classList.remove("toggle-button_expanded");
        pageElements.navActions.classList.remove("nav__actions_open");
        toggleFastTransition();
        document.removeEventListener("click", closeMobileNavigation);
    }
}
function isNavActions(className) {
    return className.includes("toggle-button") || className.includes("nav__actions");
}
function toggleFastTransition() {
    if (pageElements.navActions.classList.contains("nav__actions_open")) {
        pageElements.navActions.classList.remove("nav__actions_fast-transition");
    } else {
        setTimeout(() => pageElements.navActions.classList.add("nav__actions_fast-transition"), navActionsTransitionDuration);
    }
}


/** Анимация кнопки Run. */

buttons.runButton.addEventListener("animationstart", () => {
    if (window.matchMedia("(min-width: 767px) and (min-height: 440px)").matches) {
        buttons.runButton.disabled = true;
    }
});
buttons.runButton.addEventListener("animationend", () => buttons.runButton.disabled = false);
buttons.runButton.addEventListener("click", startRunButtonAnimation);

function startRunButtonAnimation() {
    if (window.matchMedia("(min-width: 767px) and (min-height: 440px)").matches) {
        buttons.runButton.classList.add("nav__button_loading");
        buttons.runButton.addEventListener("animationend", endRunButtonAnimation);
    }
}
function endRunButtonAnimation() {
    buttons.runButton.classList.remove("nav__button_loading");
    buttons.runButton.removeEventListener("animationend", endRunButtonAnimation);
}


/** Анимация вкладки Result. */

buttons.runButton.addEventListener("click", hideResult);

function hideResult() {
    pageElements.resultParentElement.classList.add("editor_hidden");
    setTimeout(showResult, spinnerAnimationTime);
}
function showResult() {
    pageElements.resultParentElement.classList.add("editor_animated");
    pageElements.resultParentElement.classList.remove("editor_hidden");
    setTimeout(() => pageElements.resultParentElement.classList.remove("editor_animated"), resultFadeInDuration);
}


/** Работа вкладки Result. */

buttons.runButton.addEventListener("click", updateResult);

function updateResult() {
    pageElements.result.setOption("lineNumbers", true);
    addTooltip();
}
function addTooltip() {
    pageElements.result.setOption("lineNumbers", false);
    pageElements.result.setValue(pageElements.resultTooltip.join("\n"));
}


/** Открытие/сокрытие модального окна. */

function getActionButtons() {
    const mainActionButtons = Array.from(document.getElementsByClassName("main__button_settings"));
    const navActionButtons = Array.from(document.getElementsByClassName("nav__button_settings"));

    return [...mainActionButtons, ...navActionButtons];
}
function getActionCloseButtons() {
    const headerCloseButtons = Array.from(document.getElementsByClassName("modal-header__close-button"));
    const footerCloseButtons = Array.from(document.getElementsByClassName("modal-footer__close-input"));

    return [...headerCloseButtons, ...footerCloseButtons];
}

buttons.actionButtons.forEach((button) => button.addEventListener("click", openModal));

function openModal(event) {
    showOverlay(closeModal);
    selectModalTab(event.target);
    pageElements.modal.classList.add("modal_open");
    buttons.actionCloseButtons.forEach((button) => button.addEventListener("click", closeModal));
}
function closeModal() {
    hideOverlay(closeModal);
    pageElements.modal.classList.remove("modal_open");
    buttons.actionCloseButtons.forEach((button) => button.removeEventListener("click", closeModal));
}
function selectModalTab(target) {
    if (target.hasAttribute("data-editor")) {
        const attribute = target.getAttribute("data-editor");

        switch (attribute) {
            case "editor":
                changeActiveTab(buttons.modalButtons[0], pageElements.modalTabs[0], true);
                break;
            case "result":
                changeActiveTab(buttons.modalButtons[1], pageElements.modalTabs[1], true);
                break;
        }
    }
}


/** Переключение между вкладками модального окна. */

const changeActiveTab = changeActiveTabClosure();

[...buttons.modalButtons].forEach((link) => link.addEventListener("click", modalButtonMapping));

function modalButtonMapping(event) {
    switch (event.target) {
        case buttons.modalButtons[0]:
            changeActiveTab(buttons.modalButtons[0], pageElements.modalTabs[0]);
            break;
        case buttons.modalButtons[1]:
            changeActiveTab(buttons.modalButtons[1], pageElements.modalTabs[1]);
            break;
    }
}
function changeActiveTabClosure() {
    let activeButton = buttons.modalButtons[0];
    let activeTab = pageElements.modalTabs[0];

    return function(button, tab, fastTransition = false) {
        if (fastTransition) {
            activeButton.classList.add("modal__button_fast-transition");
            button.classList.add("modal__button_fast-transition");
        } else {
            activeButton.classList.remove("modal__button_fast-transition");
        }
        activeButton.classList.remove("modal__button_active");
        activeButton = button;
        activeButton.classList.add("modal__button_active");

        activeTab.classList.remove("modal__tab_active");
        activeTab = tab;
        activeTab.classList.add("modal__tab_active");
    }
}


/** Работа форм модального окна. */

[...pageElements.modalForms].forEach((form) => form.addEventListener("submit", formInput));

function formInput(event) {
    event.preventDefault();
}


/** Добавление форм для начальных значений (guess values). */

function addForms(guessValues) {
    removeOldForms();
    for (const element of guessValues) {
        const form = createForm(element.name, element.value);

        pageElements.formTemplate.parentNode.append(form);
        pageElements.formTemplate.parentNode.lastElementChild.addEventListener("submit", formInput);
        pageElements.addedForms.push(pageElements.formTemplate.parentNode.lastElementChild);
        setTimeout(showForm, spinnerAnimationTime, pageElements.formTemplate.parentNode.lastElementChild);
    }
}
function createForm(name, value) {
    const form = pageElements.formTemplate.content.cloneNode(true);
    const input = form.querySelector(".form__input");
    const label = form.querySelector(".form__label");

    input.setAttribute("id", `input-${name}`);
    input.setAttribute("value", value);
    label.setAttribute("for", `input-${name}`);
    label.textContent = `Input ${name}`;
    return form;
}
function removeOldForms() {
    for (const form of pageElements.addedForms) {
        form.remove();
    }
    pageElements.addedForms = [];
}
function showForm(form) {
    form.classList.add("form_animated");
    form.classList.remove("form_hidden");
    setTimeout(() => form.classList.remove("form_animated"), resultFadeInDuration);
}

/** Открытие/сокрытие подсказок. */

let formHelp, previousFormHelp;

[...buttons.formHelpButtons].forEach((button) => button.addEventListener("click", showFormHelp));

function showFormHelp(event) {
    const attribute = event.target.getAttribute("data-form-help");

    formHelp = formHelpMapping(attribute, pageElements.formHelps);
    if (previousFormHelp !== undefined && previousFormHelp !== formHelp) {
        hidePreviousFormHelp();
    }
    formHelp.classList.toggle("form-help_display");
    previousFormHelp = formHelp;
    Array.from(buttons.formHelpCloseButtons).forEach((button) => button.addEventListener("click", hideFormHelp));
}
function hideFormHelp() {
    formHelp.classList.remove("form-help_display");
    Array.from(buttons.formHelpCloseButtons).forEach((button) => button.removeEventListener("click", hideFormHelp));
}
function hidePreviousFormHelp() {
    previousFormHelp.classList.remove("form-help_display");
}
function formHelpMapping(attribute, formHelp) {
    switch (attribute) {
        case "trigonometry-mode":
            return formHelp[0];
        case "tolerance":
            return formHelp[1];
        case "maximum-iterations":
            return formHelp[2]
        case "finite-difference-step":
            return formHelp[3];
        case "decimal-places":
            return formHelp[4];
        case "guess-values":
            return formHelp[5];
    }
}


/** Переключение между вкладками редактора для мобильных устройств. */

const changeSelectedEditor = changeSelectedEditorClosure();

[...buttons.mainNavButtons].forEach((button) => button.addEventListener("click", buttonMapping));

function buttonMapping(event) {
    switch (event.target) {
        case buttons.mainNavButtons[0]:
            changeSelectedEditor(buttons.mainNavButtons[0], pageElements.editorContainers[0]);
            break;
        case buttons.mainNavButtons[1]:
            changeSelectedEditor(buttons.mainNavButtons[1], pageElements.editorContainers[1]);
            break;
    }
}
function changeSelectedEditorClosure() {
    let selectedButton = buttons.mainNavButtons[0];
    let selectedEditor = pageElements.editorContainers[0];

    return function(button, editor) {
        selectedButton.classList.remove("main-nav__button_selected");
        selectedButton = button;
        selectedButton.classList.add("main-nav__button_selected");

        selectedEditor.classList.remove("main__editor-container_selected");
        selectedEditor = editor;
        selectedEditor.classList.add("main__editor-container_selected");
        refreshEditor(selectedEditor.getAttribute("data-editor"));
    }
}
function refreshEditor(attribute) {
    switch (attribute) {
        case "editor":
            pageElements.editor.refresh();
            break;
        case "result":
            pageElements.result.refresh();
            break;
    }
}


/** Открытие/сокрытие выпадающих окон. */

let dropdown, previousDropdown;

[...buttons.dropdownButtons].forEach((button) => button.addEventListener("click", showDropdown));

function showDropdown(event) {
    const attribute = event.target.getAttribute("data-dropdown");

    dropdown = dropdownMapping(attribute, pageElements.dropdowns);
    if (previousDropdown !== undefined && previousDropdown !== dropdown) {
        hidePreviousDropdown();
    }
    dropdown.classList.toggle("dropdown_dropped");
    previousDropdown = dropdown;
    document.addEventListener("click", hideDropdown);
}
function hideDropdown(event) {
    if (!isDropdownButton(event.target)) {
        dropdown.classList.remove("dropdown_dropped");
        document.removeEventListener("click", hideDropdown);
    }
}
function hidePreviousDropdown() {
    previousDropdown.classList.remove("dropdown_dropped");
    document.removeEventListener("click", hideDropdown);
}
function dropdownMapping(attribute, dropdowns) {
    switch (attribute) {
        case "editor":
            return dropdowns[0];
        case "result":
            return dropdowns[1];
    }
}
function isDropdownButton(target) {
    return target.hasAttribute("data-dropdown");
}


/** Загрузка текстовых файлов. */

pageElements.loadFileInput.addEventListener("change", loadFile);

function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => pageElements.editor.setValue(reader.result));
    reader.readAsText(file);
}


/** Сохранение текстовых файлов. */

[...buttons.downloadButtons].forEach((button) => button.addEventListener("click", downloadFile));

function downloadFile(event) {
    const attribute = event.target.getAttribute("data-editor");
    const file = createFile(attribute);
    const link = document.createElement("a");
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
}
function createFile(attribute) {
    if (attribute === "editor") {
        return new File([pageElements.editor.getValue()], "editor.txt", {type: "text/plain"});
    } else {
        return new File([pageElements.result.getValue()], "result.txt", {type: "text/plain"});
    }
}


/** Изменение размеров окна редактора. */

let nextElement, previousElement;
let nextElementWidth, originalMousePositionX, pageWidth, previousElementWidth;

pageElements.horizontalResizer.addEventListener("mousedown", mouseStartX);

function mouseStartX(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    originalMousePositionX = event.pageX;

    nextElement = event.target.nextElementSibling;
    previousElement = event.target.previousElementSibling;

    nextElementWidth = getElementWidth(nextElement);
    pageWidth = document.documentElement.scrollWidth;
    previousElementWidth = getElementWidth(previousElement);

    document.addEventListener("mousemove", mouseDragX);
    document.addEventListener("mouseup", mouseStopX);
}
function mouseDragX(event) {
    let dx = event.pageX - originalMousePositionX;

    if (event.pageX - 16 < 0) {
        dx = -previousElementWidth;
    }
    if (event.pageX + 16 > pageWidth) {
        dx = nextElementWidth;
    }
    previousElement.style.width = `${previousElementWidth + dx}px`;
    nextElement.style.width = `${nextElementWidth - dx}px`;
    changeTitleOrientation(dx);
}
function mouseStopX() {
    document.body.onselectstart = enableSelection;
    document.removeEventListener("mousemove", mouseDragX);
    document.removeEventListener("mouseup", mouseStopX);
}
function changeTitleOrientation(dx) {
    const editorSeparatorTitle = document.getElementsByClassName("separator__title")[0];
    const resultSeparatorTitle = document.getElementsByClassName("separator__title")[1];

    if (previousElementWidth + dx < 150) {
        editorSeparatorTitle.classList.add("separator__title_vertical");
    } else {
        editorSeparatorTitle.classList.remove("separator__title_vertical");
    }
    if (pageWidth - (previousElementWidth + dx) < 150) {
        resultSeparatorTitle.classList.add("separator__title_vertical");
    } else {
        resultSeparatorTitle.classList.remove("separator__title_vertical");
    }
}
function getElementWidth(element) {
    return parseFloat(document.defaultView.getComputedStyle(element).width);
}


/** Изменение размеров окна консоли. */

const mainMinHeight = parseFloat(window.getComputedStyle(pageElements.mainSection).minHeight);
const verticalResizerHeight = getElementHeight(pageElements.verticalResizer);
let consoleHeight, footerHeight, mainHeight, originalMousePositionY, pageHeight;

function mouseStartY(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    originalMousePositionY = event.pageY;

    nextElement = event.target.nextElementSibling;
    previousElement = event.target.previousElementSibling;

    consoleHeight = getElementHeight(nextElement);
    footerHeight = getElementHeight(pageElements.footer);
    mainHeight = getElementHeight(previousElement);
    pageHeight = document.documentElement.scrollHeight;

    document.addEventListener("mousemove", mouseDragY);
    document.addEventListener("mouseup", mouseStopY)
}
function mouseDragY(event) {
    let dy = event.pageY - originalMousePositionY;

    if (event.pageY + verticalResizerHeight + footerHeight > pageHeight) {
        dy = consoleHeight;
    }
    if (mainHeight + dy > mainMinHeight) {
        previousElement.style.height = `${mainHeight + dy}px`;
        nextElement.style.height = `${consoleHeight - dy}px`;
    }
}
function mouseStopY() {
    document.removeEventListener("mousemove", mouseDragY);
    document.removeEventListener("mouseup", mouseStopY);
}
function getElementHeight(element) {
    return parseFloat(window.getComputedStyle(element).height);
}


/** Изменение размеров окна консоли при изменении размеров окна страницы. */

window.matchMedia("(max-width: 767px) or (max-height: 440px)").addEventListener("change", () => {
    pageElements.console.style.height = "195px";
    refreshEditor("editor");
    refreshEditor("result");
});


/** Очистка консоли. */

buttons.consoleClearButton.addEventListener("click", clearConsole);

function clearConsole() {
    const entries = document.getElementsByClassName("console__message");

    [...entries].forEach((currentValue) => currentValue.parentNode.removeChild(currentValue));
}


/** Работа консоли. */

pageElements.consoleTextArea.addEventListener("keypress", consoleInput);

function consoleInput(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewEntry(pageElements.consoleTextArea.value);
        pageElements.consoleTextArea.value = "";
    }
}
function addNewEntry(value) {
    const echo = createMessage("echo", value);
    pageElements.consoleEntries.appendChild(echo);

    switch(value) {
        default:
            const errorMessage = createMessage("error", value);

            pageElements.consoleEntries.appendChild(errorMessage);
    }
    pageElements.consoleEntries.lastElementChild.scrollIntoView(false);
}
function createMessage(type, value) {
    const message = document.createElement("pre");

    switch (type) {
        case "echo":
            message.classList.add("console__message", "console__message_echo");
            message.textContent = value;
            break;
        case "error":
            message.classList.add("console__message", "console__message_error");
            message.textContent = `"${value} is not defined"`;
            break;
    }
    return message;
}


/** Открытие/сокрытие консоли. */

buttons.consoleButton.addEventListener("click", openConsole);

function openConsole() {
    pageElements.console.classList.add("console_display");
    pageElements.verticalResizer.classList.add("separator_console-open");

    buttons.consoleButton.addEventListener("click", closeConsole);
    buttons.consoleCloseButton.addEventListener("click", closeConsole);
    pageElements.verticalResizer.addEventListener("mousedown", mouseStartY);
}
function closeConsole() {
    pageElements.console.classList.remove("console_display");
    pageElements.verticalResizer.classList.remove("separator_console-open");

    buttons.consoleButton.removeEventListener("click", closeConsole);
    buttons.consoleCloseButton.removeEventListener("click", closeConsole);
    pageElements.verticalResizer.removeEventListener("mousedown", mouseStartY);
}


/** Отображение контура для кнопки zoom. */

pageElements.zoom.addEventListener("focus", showOutline);

function showOutline(event) {
    if (event.relatedTarget === buttons.consoleButton) {
        pageElements.zoom.classList.add("footer__button_zoom-outline");
        pageElements.zoom.addEventListener("blur", hideOutline);
    }
}
function hideOutline() {
    pageElements.zoom.classList.remove("footer__button_zoom-outline");
    pageElements.zoom.removeEventListener("blur", hideOutline);
}


/** Изменение размера шрифта в редакторе. */

pageElements.zoom.addEventListener("change", changeFontSize);

function changeFontSize(event) {
    for (const codeMirror of pageElements.codeMirrors) {
        removeStyleAttribute(codeMirror);
        codeMirror.style.fontSize = `${event.target.value * parseInt(window.getComputedStyle(codeMirror).fontSize)}px`;
    }
}
function removeStyleAttribute(element) {
    element.removeAttribute("style");
}


/** Изменение размера шрифта в редакторе при изменении размеров окна страницы. */

window.matchMedia("(min-width: 767px) and (min-height: 440px)").addEventListener("change", () => [...pageElements.codeMirrors].forEach(removeStyleAttribute));


/** Открытие/сокрытие окна Export. */

buttons.exportButton.addEventListener("click", showExport);

function showExport() {
    pageElements.footerExport.classList.toggle("export_visible");
    document.addEventListener("click", hideExport);
}
function hideExport(event) {
    if (!isExport(event.target.className)) {
        pageElements.footerExport.classList.remove("export_visible");
        document.removeEventListener("click", hideExport);
    }
}
function isExport(className) {
    return className.includes("export");
}


/** Открытие/сокрытие overlay. */

function showOverlay(callback) {
    pageElements.overlay.classList.add("overlay_display");
    pageElements.overlay.addEventListener("click", callback);
}
function hideOverlay(callback) {
    pageElements.overlay.classList.remove("overlay_display");
    pageElements.overlay.removeEventListener("click", callback);
}
