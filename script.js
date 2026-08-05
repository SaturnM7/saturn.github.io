// 1. Universelle Steuerung für alle ausklappbaren Akkordeons
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

// 2. Fehlerfreie Bindung des Theme-Umschalters beim Laden
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('theme');
    
    // Vorabgespeicherten Status direkt laden
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeBtn) themeBtn.innerText = "Dark";
    }

    // Klick-Logik für den Modus-Wechsel
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeBtn.innerText = "Light";
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeBtn.innerText = "Dark";
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
