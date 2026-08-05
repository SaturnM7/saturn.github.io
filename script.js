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

// Integrierter Dark / Light Mode Umschalter
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeBtn = document.getElementById('theme-btn');
    
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.innerText = "☀️ Light Mode";
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerText = "🌑 Dark Mode";
    }
}
