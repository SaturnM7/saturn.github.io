document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.expand-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.icon');
            
            // Check if open
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

            if (isOpen) {
                content.style.maxHeight = '0px';
                icon.innerText = '+';
            } else {
                // If it's the MC button, load status
                if (btn.innerText.includes("Minecraft")) {
                    loadLocalServerStatus();
                }
                content.style.maxHeight = '500px'; 
                icon.innerText = '-';
            }
        });
    });

    // Auto-refresh every 30s if open
    setInterval(() => {
        const mcContent = document.querySelector('.expand-content');
        if (mcContent.style.maxHeight && mcContent.style.maxHeight !== '0px') {
            loadLocalServerStatus();
        }
    }, 30000);
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
                statusEl.style.color = "#a6e3a1"; // Catppuccin Green
                playerCount.innerText = data.players.online;
                maxPlayers.innerText = data.players.max;
                playerWrapper.style.display = "block";
            } else {
                statusEl.innerText = "Offline";
                statusEl.style.color = "#f38ba8"; // Catppuccin Red
                playerWrapper.style.display = "none";
            }
        })
        .catch(() => {
            statusEl.innerText = "Offline";
            statusEl.style.color = "#f38ba8";
        });
}
