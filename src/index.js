const buttons = {
    actionButtons: getActionButtons(),
    actionCloseButtons: getActionCloseButtons(),
    consoleClearButton: document.getElementsByClassName("console__button_clear")[0],
    consoleCloseButton: document.getElementsByClassName("console__button_close")[0],
    consoleButton: document.getElementsByClassName("footer__button_console")[0],
    dropdownButtons: document.getElementsByClassName("button_dropdown"),
    exportButton: document.getElementsByClassName("footer__button_export")[0],
    formHelpButtons: document.getElementsByClassName("form__help-button"),
    formHelpCloseButtons: document.getElementsByClassName("form-help__close-button"),
    mainNavButtons: document.getElementsByClassName("main-nav__button"),
    modalButtons: document.getElementsByClassName("modal__button"),
    navActions: document.getElementsByClassName("nav__actions")[0],
    runButton: document.getElementsByClassName("nav__button_run")[0],
    shortcutsButton: document.getElementsByClassName("footer__button_shortcuts")[0],
    toggleButton: document.getElementsByClassName("toggle-button")[0]
};
const pageElements = {
    console: document.getElementsByClassName("console")[0],
    consoleEntries: document.getElementsByClassName("console__entries")[0],
    consoleTextArea: document.getElementsByClassName("command-line__textarea")[0],
    dropdowns: document.getElementsByClassName("dropdown"),
    editors: document.getElementsByClassName("main__editor-container"),
    footerExport: document.getElementsByClassName("footer__export")[0],
    formsHelp: document.getElementsByClassName("form-help"),
    horizontalResizer: document.getElementsByClassName("separator_resizer")[0],
    mainSection: document.getElementsByClassName("main__inner-container")[0],
    modal: document.getElementsByClassName("modal")[0],
    modalTabs: document.getElementsByClassName("modal__tab"),
    overlay: document.getElementsByClassName("overlay")[0],
    shortcuts: document.getElementsByClassName("key-commands")[0],
    verticalResizer: document.getElementsByClassName("separator_vertical")[0]
};

function disableSelection () {
    return false;
}


/** Анимация кнопки Run. */

buttons.runButton.addEventListener("click", startRunButtonAnimation);

function startRunButtonAnimation() {
    if (window.matchMedia("(min-width: 767px) and (min-height: 440px)").matches) {
        buttons.runButton.disabled = true;
        buttons.runButton.addEventListener("animationend", endRunButtonAnimation);
        buttons.runButton.classList.add("nav__button_loading");
    }
}
function endRunButtonAnimation() {
    buttons.runButton.disabled = false;
    buttons.runButton.removeEventListener("animationend", endRunButtonAnimation);
    buttons.runButton.classList.remove("nav__button_loading");
}


/** Открытие/сокрытие навигации для мобильных устройств. */

buttons.toggleButton.addEventListener("click", openMobileNavigation);

function openMobileNavigation() {
    document.addEventListener("click", closeMobileNavigation);
    buttons.toggleButton.classList.toggle("toggle-button_expanded");
    buttons.navActions.classList.toggle("nav__actions_open");
}
function closeMobileNavigation(event) {
    if (!isNavActions(event.target.className)) {
        document.removeEventListener("click", closeMobileNavigation);
        buttons.toggleButton.classList.remove("toggle-button_expanded");
        buttons.navActions.classList.remove("nav__actions_open")
    }
}
function isNavActions(className) {
    return className.includes("toggle-button") || className.includes("nav__actions");
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
    buttons.actionCloseButtons.forEach((button) => button.addEventListener("click", closeModal));
    selectModalTab(event.target);
    pageElements.modal.classList.add("modal_open");
}
function closeModal() {
    hideOverlay(closeModal);
    buttons.actionCloseButtons.forEach((button) => button.removeEventListener("click", closeModal));
    pageElements.modal.classList.remove("modal_open");
}
function selectModalTab(target) {
        if (target.hasAttribute("data-settings")) {
            const attribute = target.getAttribute("data-settings");

            switch (attribute) {
                case "editor":
                    changeActiveTab(buttons.modalButtons[0], pageElements.modalTabs[0]);
                    break;
                case "result":
                    changeActiveTab(buttons.modalButtons[1], pageElements.modalTabs[1]);
                    break;
            }
        }
    }


/** Переключение между вкладками модального окна. */

const changeActiveTab = changeActiveTabClosure();

Array.from(buttons.modalButtons).forEach((link) => link.addEventListener("click", modalButtonMapping));

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

    return function(button, tab) {
        activeButton.classList.remove("modal__button_active");
        activeButton = button;
        activeButton.classList.add("modal__button_active");

        activeTab.classList.remove("modal__tab_active");
        activeTab = tab;
        activeTab.classList.add("modal__tab_active");
    }
}


/** Открытие/сокрытие подсказок. */

let previousFormHelp = null, formHelp = null;

Array.from(buttons.formHelpButtons).forEach((button) => button.addEventListener("click", showFormHelp));
Array.from(buttons.formHelpCloseButtons).forEach((button) => button.addEventListener("click", hideFormHelp));

function showFormHelp(event) {
    const attribute = event.target.getAttribute("data-form-help");

    formHelp = formHelpMapping(attribute, pageElements.formsHelp);
    if (previousFormHelp !== null && previousFormHelp !== formHelp) {
        hidePreviousFormHelp();
    }
    formHelp.classList.toggle("form-help_display");
    previousFormHelp = formHelp;
}
function hideFormHelp() {
    formHelp.classList.remove("form-help_display");
}
function hidePreviousFormHelp() {
    previousFormHelp.classList.remove("form-help_display");
}
function formHelpMapping(attribute, formsHelp) {
    switch (attribute) {
        case "trigonometry-mode":
            return formsHelp[0];
        case "x-tolerance":
            return formsHelp[1];
        case "max-iterations":
            return formsHelp[2]
        case "finite-difference-step":
            return formsHelp[3];
        case "decimal-places":
            return formsHelp[4];
        case "input-a":
            return formsHelp[5];
    }
}


/** Переключение между вкладками для мобильных устройств. */

const changeSelectedEditor = changeSelectedEditorClosure();

Array.from(buttons.mainNavButtons).forEach((button) => button.addEventListener("click", buttonMapping));

function buttonMapping(event) {
    switch (event.target) {
        case buttons.mainNavButtons[0]:
            changeSelectedEditor(buttons.mainNavButtons[0], pageElements.editors[0]);
            break;
        case buttons.mainNavButtons[1]:
            changeSelectedEditor(buttons.mainNavButtons[1], pageElements.editors[1]);
            break;
    }
}
function changeSelectedEditorClosure() {
    let selectedButton = buttons.mainNavButtons[0];
    let selectedEditor = pageElements.editors[0];

    return function(button, editor) {
        selectedButton.classList.remove("main-nav__button_selected");
        selectedButton = button;
        selectedButton.classList.add("main-nav__button_selected");

        selectedEditor.classList.remove("main__editor-container_selected");
        selectedEditor = editor;
        selectedEditor.classList.add("main__editor-container_selected");
    }
}


/** Изменение размеров окна редактора. TODO: Дописать. Отключение кнопки. Переписать для процентов. */

let previousElement, nextElement;
let originalMousePositionX, previousElementWidth, nextElementWidth;

pageElements.horizontalResizer.addEventListener("mousedown", mouseStartX);

function mouseStartX(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    previousElement = event.target.previousElementSibling;
    nextElement = event.target.nextElementSibling;

    originalMousePositionX = event.pageX;
    previousElementWidth = width(previousElement);
    nextElementWidth = width(nextElement);

    document.addEventListener("mousemove", mouseDragX);
    document.addEventListener("mouseup", mouseStopX)
}
function width(element) {
    return parseFloat(document.defaultView.getComputedStyle(element).width);
}
function mouseDragX(event) {
    const pageWidth = document.documentElement.scrollWidth;
    let dx = event.pageX - originalMousePositionX;
    if (event.pageX - 16 < 0) {
        dx = -previousElementWidth;
    }
    if (event.pageX + 16 > pageWidth) {
        dx = nextElementWidth;
    }
    previousElement.style.width = (previousElementWidth + dx) + "px";
    nextElement.style.width = (nextElementWidth - dx) + "px";

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
function mouseStopX() {
    document.removeEventListener("mousemove", mouseDragX);
    document.removeEventListener("mouseup", mouseStopX);
}


/** Открытие/сокрытие выпадающего меню. */

let previousDropdown = null, dropdown = null;

Array.from(buttons.dropdownButtons).forEach((button) => button.addEventListener("click", showDropdown));

function showDropdown(event) {
    const attribute = event.target.getAttribute("data-dropdown");

    dropdown = dropdownMapping(attribute, pageElements.dropdowns);
    if (previousDropdown !== null && previousDropdown !== dropdown) {
        hidePreviousDropdown();
    }
    dropdown.classList.toggle("dropdown_dropped");
    document.addEventListener("click", hideDropdown);
    previousDropdown = dropdown;
}
function hidePreviousDropdown() {
    previousDropdown.classList.remove("dropdown_dropped");
    document.removeEventListener("click", hideDropdown);
}
function hideDropdown(event) {
    if (!isDropdownButton(event.target)) {
        dropdown.classList.remove("dropdown_dropped");
        document.removeEventListener("click", hideDropdown);
    }
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


/** Открытие/сокрытие консоли. */

let consoleSectionMinHeight;

buttons.consoleButton.addEventListener("click", openConsole);
buttons.consoleCloseButton.addEventListener("click", closeConsole);

function openConsole() {
    pageElements.console.classList.toggle("console_display");
    pageElements.verticalResizer.classList.toggle("separator_console-open");
    consoleSectionMinHeight = document.getElementsByClassName("console__actions-container")[0].offsetHeight;
}
function closeConsole() {
    pageElements.console.classList.remove("console_display");
    pageElements.verticalResizer.classList.remove("separator_console-open");
}


/** Работа консоли. TODO: Добавить прокрутку после ввода. */

buttons.consoleClearButton.addEventListener("click", clearConsole);
pageElements.consoleTextArea.addEventListener("keypress", consoleInput);

function clearConsole() {
    const entries = document.getElementsByClassName("console__message");

    Array.from(entries).forEach((currentValue) => currentValue.parentNode.removeChild(currentValue));
}
function consoleInput(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewEntry(pageElements.consoleTextArea.value);
        pageElements.consoleTextArea.value = "";
    }
}
function addNewEntry(value) {
    const message = createMessage("echo", value);
    pageElements.consoleEntries.appendChild(message);

    if (true) {
        const errorMessage = createMessage("error", value);

        pageElements.consoleEntries.appendChild(errorMessage);
    }
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
            message.textContent = '"' + value + ' is not defined"';
            break;
        case "log":
            message.classList.add("console__message", "console__message_log");
            message.textContent = value;
            break;
    }
    return message;
}


/** Изменение размеров окна консоли. */

const mainSectionMinHeight = parseFloat(window.getComputedStyle(pageElements.mainSection).minHeight);
let originalMousePositionY, mainSectionHeight, consoleSectionHeight;

pageElements.verticalResizer.addEventListener("mousedown", mouseStartY);

function mouseStartY(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    previousElement = event.target.previousElementSibling;
    nextElement = event.target.nextElementSibling;

    originalMousePositionY = event.pageY;
    mainSectionHeight = getElementHeight(previousElement);
    consoleSectionHeight = getElementHeight(nextElement);

    document.addEventListener("mousemove", mouseDragY);
    document.addEventListener("mouseup", mouseStopY)
}
function getElementHeight(element) {
    return parseFloat(window.getComputedStyle(element).height);
}
function mouseDragY(event) {
    const dy = (event.pageY - originalMousePositionY) || 0;

    if (consoleSectionHeight - dy > consoleSectionMinHeight && mainSectionHeight + dy > mainSectionMinHeight) {
        previousElement.style.height = (mainSectionHeight + dy) + "px";
        nextElement.style.height = (consoleSectionHeight - dy) + "px";
    }
}
function mouseStopY() {
    document.removeEventListener("mousemove", mouseDragY);
    document.removeEventListener("mouseup", mouseStopY);
}


/** Открытие/сокрытие окна Export. */

buttons.exportButton.addEventListener("click", showExport);

function isExport(className) {
    return className.includes("export");
}
function showExport() {
    document.addEventListener("click", hideExport);
    pageElements.footerExport.classList.toggle("export_visible");
}
function hideExport(event) {
    if (!isExport(event.target.className)) {
        document.removeEventListener("click", hideExport);
        pageElements.footerExport.classList.remove("export_visible");
    }
}


/** Открытие/сокрытие окна Shortcuts. */

buttons.shortcutsButton.addEventListener("click", showShortcuts);

function showShortcuts() {
    showOverlay(hideShortcuts);
    pageElements.shortcuts.classList.add("key-commands_display");
}
function hideShortcuts() {
    hideOverlay(hideShortcuts);
    pageElements.shortcuts.classList.remove("key-commands_display");
}


/** Открытие/сокрытие overlay. */

function showOverlay(callback) {
    pageElements.overlay.addEventListener("click", callback);
    pageElements.overlay.classList.add("overlay_display");
}
function hideOverlay(callback) {
    pageElements.overlay.removeEventListener("click", callback);
    pageElements.overlay.classList.remove("overlay_display");
}


/** TODO: Добавить изменение размеров шрифта. */