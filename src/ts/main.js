import * as Common from './common.js';
// RETURN BUTTON Click
$("#navbar-menu").on("click", "#return-button", function () {
    //Scroll up
    $("#content").animate({ scrollTop: 0 }, "smooth");
    $('#content').css({ "overflow": "auto" });
    ToggleExploreMapText();
    $(".iframe").css({ "pointer-events": "none" });
    RestoreMapHeight();
    ChangeNavBarMenuItems(`
    <a id="home-button">Home</a>
    <a id="maps-button">Maps</a>
    <a id="82x400-button">82x4000</a>
    <a id="about-button">About</a>
  `);
});
window.onload = function () {
    Common.HideLoadingScreen();
};
$("#explore-map-section").on("click", function () {
    //Scroll to focus element
    ScrollContentToElement("explore-map-section");
    ShowMapFullScreen();
    //Hide scrollbar 
    $('#content').css({ "overflow": "hidden" });
    NavBarMenuMapMode();
    //Toggle
    ToggleExploreMapText();
    $(".iframe").css({ "pointer-events": "auto" });
});
export function ToggleExploreMapText() {
    let width = $('#explore-map-text').width();
    let left = $('#explore-map-text').position().left;
    let total = width + left;
    $('#explore-map-text').css({
        "transform": "translate(-" + total + "px)",
        "transition": "transform 1000ms ease-in-out"
    });
}
export function ScrollContentToElement(elementName) {
    $("#" + elementName).get(0).scrollIntoView({ behavior: 'smooth' });
}
export function ShowMapFullScreen() {
    let mapFrame = $("iframe");
    mapFrame.height($("#content").height());
}
export function RestoreMapHeight() {
    let mapFrame = $("iframe");
    mapFrame.height("");
}
export function NavBarMenuMapMode() {
    ChangeNavBarMenuItems(`
    <a id="return-button">Return</a>
    <a id="find-4000-button">Find a 4000</a>
  `);
}
export function ChangeNavBarMenuItems(htmlMenuItems) {
    //Hide the navbar menu
    let navbarMenu = $('#navbar-menu');
    let width = navbarMenu.width();
    let left = navbarMenu.position().left;
    let total = width + left;
    //Hide the old content of the menu
    navbarMenu.css({
        "transform": "translate(-" + total + "px)",
    });
    let count = 0;
    //When the hiding animation is over, show the new menu
    navbarMenu.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
        console.log("Triggered " + count);
        if (count == 0) {
            navbarMenu.html(htmlMenuItems);
            navbarMenu.css({
                "transform": "translate(0)",
            });
        }
        count++;
    });
}
export function ResetNavBarMenu() {
    $("#nav-menu").html(`
  <a id="home-button">Home</a>
  <a id="maps-button">Maps</a>
  <a id="82x400-button">82x4000</a>
  <a id="about-button">About</a>
`);
}
//# sourceMappingURL=main.js.map
//# sourceMappingURL=main.js.map