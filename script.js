document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.getElementById('expandBtn');
    const expandContent = document.getElementById('expandContent');
    const icon = expandBtn.querySelector('.icon');

    expandBtn.addEventListener('click', () => {
        const isOpen = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';

        if (isOpen) {
            expandContent.style.maxHeight = '0px';
            icon.innerText = '+';
        } else {
            loadLocalServerStatus();
            // Setting to a high number or scrollHeight allows it to grow
            expandContent.style.maxHeight = '500px'; 
            icon.innerText = '-';
        }
    });

    setInterval(() => {
        if (expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px') {
            loadLocalServerStatus();
        }
    }, 30000);
});

function loadLocalServerStatus() {
    const statusEl = document.getElementById('server-status');
    const playerWrapper = document.getElementById('player-count-wrapper');
    const playerCount = document.getElementById('player-count');
    const maxPlayers = document.getElementById('max-players');

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
