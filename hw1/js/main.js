let buttonHome = document.querySelector("#buttonHome");
let buttonThreats = document.querySelector("#buttonThreats");
let buttonTools = document.querySelector("#buttonTools");
let buttonTrends = document.querySelector("#buttonTrends");
let theOne = document.querySelector("#oneImage");

buttonHome.addEventListener("click", function() {
    window.location.href = "index.html";
});

buttonThreats.addEventListener("click", function() {
    window.location.href = "threats.html";
});

buttonTools.addEventListener("click", function() {
    window.location.href = "tools.html";
});

buttonTrends.addEventListener("click", function() {
    window.location.href = "trends.html";
});

theOne.addEventListener("click", function() {
    window.scrollTo(0, 0);
    theOne.style.display = "none";
    document.body.style.height = "3000px";
});