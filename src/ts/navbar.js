const frLangImg = "../images/FR.png";
const deLangImg = "../images/DE.png";
const enLangImg = "../images/US.png";
const frLangCode = "fr";
const deLangCode = "de";
const enLangCode = "en";
$("#home-button").on("click", function () {
    window.location.href = 'index.html';
});
$("#maps-button").on("click", function () {
    window.location.href = 'maps.html';
});
$("#summits-button").on("click", function () {
    window.location.href = 'summits.html';
});
$("#about-button").on("click", function () {
    window.location.href = 'about.html';
});
// Append the language selector to the navigation bar
$('#navbar').append(`
<div id="langage-select-menu" class="langage-select-menu">
      <div id="lang-0" class="langage-option top">
        <img id="lang-0-img" src="../images/US.png">
      </div>
      <div id="lang-1" class="langage-option" style="display: none;">
        <img id="lang-1-img" src="../images/FR.png">
      </div>
      <div id="lang-2" class="langage-option bottom" style="display: none;">
        <img id="lang-2-img" src="../images/DE.png">
      </div>
    </div>
`);
//Update the language menu with the language saved in browser
UpdateLangageMenu(localStorage.getItem('lang'));
$('#lang-0').on('mouseenter', function () {
    $('#lang-1').css("display", "flex");
    $('#lang-2').css("display", "flex");
});
$('#langage-select-menu').on('mouseleave', function () {
    $('#lang-1').css("display", "none");
    $('#lang-2').css("display", "none");
});
$('.langage-option').on('click', function () {
    if (this.id === 'lang-0')
        return;
    let langImgNew = $('#' + this.id + '-img');
    let langImg = $('#lang-0-img');
    let srcNew = langImgNew.attr('src');
    let srcOld = langImg.attr('src');
    let selectedLang = SrcToLangCode(srcNew);
    localStorage.setItem('lang', selectedLang);
    langImgNew.attr('src', srcOld);
    langImg.attr('src', srcNew);
    $('#lang-1').css("display", "none");
    $('#lang-2').css("display", "none");
});
/**
 * Create the language code selector menu
 * and set the given lang as selected
 * @param selectedLang
 */
function UpdateLangageMenu(selectedLang) {
    if (selectedLang == null || selectedLang == 'undefined')
        selectedLang = enLangCode;
    let lang0img = LangCodeToSrc(selectedLang);
    let lang1img = "";
    let lang2img = "";
    switch (selectedLang.toLowerCase()) {
        case enLangCode: {
            lang1img = frLangImg;
            lang2img = deLangImg;
            break;
        }
        case frLangCode: {
            lang1img = enLangImg;
            lang2img = deLangImg;
            break;
        }
        case deLangCode: {
            lang1img = frLangImg;
            lang2img = enLangImg;
            break;
        }
    }
    $('#lang-0-img').attr('src', lang0img);
    $('#lang-1-img').attr('src', lang2img);
    $('#lang-2-img').attr('src', lang1img);
}
/**
 * Convert the given language code into src image path
 * Works only for supported languages
 * @param langCode language code: example English: "EN"
 * @returns
 */
function LangCodeToSrc(langCode) {
    switch (langCode.toLowerCase()) {
        case frLangCode: {
            return frLangImg;
        }
        case deLangCode: {
            return deLangImg;
        }
        case enLangCode: {
            return enLangImg;
        }
    }
}
/**
 * Converts the source path of the langage image into
 * the langage code
 * @param srcPath Source path
 * @returns Langage code
 */
function SrcToLangCode(srcPath) {
    switch (srcPath) {
        case frLangImg: {
            return frLangCode;
        }
        case deLangImg: {
            return deLangCode;
        }
        case enLangImg: {
            return enLangCode;
        }
    }
}
//# sourceMappingURL=navbar.js.map