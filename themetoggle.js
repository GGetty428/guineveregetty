function updateThemeBtn(targetedTheme) {
	// Get the Icon so we can set it to Moon or Sun
	const icon = document.getElementById("themeIcon");

	// Clear existing animation 
	icon.classList.remove("rotate");

	// Update icon SVG content based on theme
	if (targetedTheme == 'light') {
		icon.outerHTML = `
						<svg id="themeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24" class="rotate">
							<circle cx="12" cy="12" r="5" stroke-width="2" stroke="currentColor"/>
							<line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" stroke-width="2"/>
							<line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
							<line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" stroke-width="2"/>
							<line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
							<line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="2"/>
							<line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
							<line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" stroke-width="2"/>
							<line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>
						</svg>
					`;
	}
	else {
		icon.outerHTML = `
						<svg id="themeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke="currentColor" width="32" height="32">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
						</svg>
					`;
	}
}

function toggleTheme() {
	const root = document.documentElement;
	// Check Theme & Toggle
	const currentTheme = root.getAttribute('data-bs-theme');
	const targetedTheme = currentTheme === 'light' ? 'dark' : 'light';

	root.setAttribute('data-bs-theme', targetedTheme);
	localStorage.setItem('theme', targetedTheme);
	updateThemeBtn(targetedTheme);
}

// Fade in when page loads
window.addEventListener("DOMContentLoaded", () => {
	const savedTheme = localStorage.getItem('theme');
	const root = document.documentElement;

	// Set theme on page load
	if (savedTheme) {
		root.setAttribute('data-bs-theme', savedTheme);
	}
	else {
		// Set default theme if nothing is saved
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const defaultTheme = prefersDark ? 'dark' : 'light';
		root.setAttribute('data-bs-theme', defaultTheme);
		localStorage.setItem('theme', defaultTheme);
	}

	updateThemeBtn(savedTheme);

	document.body.classList.add("fade-in");
});