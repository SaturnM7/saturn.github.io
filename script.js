document.addEventListener('DOMContentLoaded', () => {
    // Select ALL buttons with the class 'expand-btn'
    const buttons = document.querySelectorAll('.expand-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling; // The content div below the button
            const icon = btn.querySelector('.icon');

            // Toggle Open/Closed
            if (content.style.maxHeight && content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
                icon.innerText = '+';
            } else {
                // If it's the Minecraft button, refresh status
                if (btn.innerText.includes("Minecraft")) {
                    loadLocalServerStatus();
                }
                
                content.style.maxHeight = '500px'; // Set to a height large enough for your text
                icon.innerText = '-';
            }
        });
    });
});

function loadLocalServerStatus() {
    const statusEl = document.getElementById('server-status');
    const playerWrapper = document.getElementById('player-count-wrapper');
    const playerCount = document.getElementById('player-count');
    const maxPlayers = document.getElementById('max-players');

    if (!statusEl) return;

    fetch('serverstatus.json?t=' + Date.now())
        .then(r => r.json())
        .then(data => {
            if (data.online) {
                statusEl.innerText = "Online";
                statusEl.style.color = "#2ecc71";
                playerCount.innerText = data.players.online;
                maxPlayers.innerText = data.players.max;
                playerWrapper.style.display = "block";
            } else {
                statusEl.innerText = "Offline";
                statusEl.style.color = "#e74c3c";
                playerWrapper.style.display = "none";
            }
        })
        .catch(() => {
            statusEl.innerText = "Offline";
            statusEl.style.color = "#e74c3c";
        });
}
