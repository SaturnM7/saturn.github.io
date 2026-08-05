// Universelle Akkordeon-Steuerung für alle Kacheln
function toggleExpand(button) {
    const container = button.parentElement;
    const content = container.querySelector('.expand-content');
    const icon = button.querySelector('.icon');
    
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        if (icon) icon.innerText = '+';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.innerText = '−';
    }
}

// Event-Listener nach dem Laden der Seite binden
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    
    // Prüfen, ob der User bereits eine Präferenz gespeichert hat
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeBtn) themeBtn.innerText = "🌑 Dark Mode";
    }

    // Klick-Event hinzufügen
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeBtn.innerText = "☀️ Light Mode";
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeBtn.innerText = "🌑 Dark Mode";
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
