document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons
    const buttons = document.querySelectorAll('.expand-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.icon');
            
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

            if (isOpen) {
                content.style.maxHeight = '0px';
                icon.innerText = '+';
            } else {
                // Only load status if it's the Minecraft button
                if (btn.innerText.includes("Minecraft")) {
                    loadLocalServerStatus();
                }
                content.style.maxHeight = '500px'; 
                icon.innerText = '-';
            }
        });
    });

    // Refresh status every 30 seconds
    setInterval(() => {
        const mcButton = document.querySelector('.expand-btn'); // First button
        const mcContent = mcButton.nextElementSibling;
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
                statusEl.style.color = "#2ecc71"; // Your Green
                playerCount.innerText = data.players.online;
                maxPlayers.innerText = data.players.max;
                playerWrapper.style.display = "block";
            } else {
                statusEl.innerText = "Offline";
                statusEl.style.color = "#e74c3c"; // Your Red
                playerWrapper.style.display = "none";
            }
        })
        .catch(() => {
            statusEl.innerText = "Offline";
            statusEl.style.color = "#e74c3c";
        });
}
