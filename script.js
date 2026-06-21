document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons with the class 'expand-btn'
    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const expandContent = btn.nextElementSibling; // The div right after the button
            const icon = btn.querySelector('.icon');

            // Check if it's currently open
            const isOpen = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';

            if (isOpen) {
                expandContent.style.maxHeight = '0px';
                icon.innerText = '+';
            } else {
                // If this is the Minecraft button, load the status
                // We check the text inside the button to identify it
                if (btn.innerText.includes("Minecraft Server")) {
                    loadLocalServerStatus();
                }

                // Smoothly expand (adjust 500px if your text is very long)
                expandContent.style.maxHeight = '500px'; 
                icon.innerText = '-';
            }
        });
    });

    // Refresh Minecraft status every 30 seconds only if it's visible
    setInterval(() => {
        const mcContent = document.querySelector('.expand-content'); // Assuming Minecraft is the first one
        if (mcContent && mcContent.style.maxHeight && mcContent.style.maxHeight !== '0px') {
            loadLocalServerStatus();
        }
    }, 30000);
});

function loadLocalServerStatus() {
    const statusEl = document.getElementById('server-status');
    const playerWrapper = document.getElementById('player-count-wrapper');
    const playerCount = document.getElementById('player-count');
    const maxPlayers = document.getElementById('max-players');

    // Added a check to make sure the elements exist before updating
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
