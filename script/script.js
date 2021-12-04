let menuOpen = true;

document.querySelector(".menu-control").addEventListener("click", function() {
	document.querySelector(".menu").classList.toggle("visible", menuOpen)
	menuOpen = !menuOpen;
})