document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.getElementById('expandBtn');
    const expandContent = document.getElementById('expandContent');
    const icon = expandBtn.querySelector('.icon');

    // Toggle logic
    expandBtn.addEventListener('click', () => {
        const isExpanded = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';

        if (isExpanded) {
            expandContent.style.maxHeight = '0px';
            icon.innerText = '+';
        } else {
            // Load status before opening for better UX
            loadLocalServerStatus();
            expandContent.style.maxHeight = expandContent.scrollHeight + 'px';
            icon.innerText = '-';
        }
    });

    // Auto-refresh if the panel is open
    setInterval(() => {
        if (expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px') {
            loadLocalServerStatus();
        }
    }, 30000);
});

function loadLocalServerStatus() {
    const statusElement = document.getElementById('server-status');
    const playerWrapper = document.getElementById('player-count-wrapper');
    const playerCount = document.getElementById('player-count');
    const maxPlayers = document.getElementById('max-players');

    // ?t= avoids browser caching the old status
    fetch('serverstatus.json?t=' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error('Status file not ready');
            return response.json();
        })
        .then(data => {
            if (data.online) {
                statusElement.innerText = "Online";
                statusElement.style.color = "#2ecc71"; // Green
                playerCount.innerText = data.players.online;
                maxPlayers.innerText = data.players.max;
                playerWrapper.style.display = "block";
            } else {
                setServerOffline(statusElement, playerWrapper);
            }
        })
        .catch(error => {
            console.log("Waiting for status update...", error);
            setServerOffline(statusElement, playerWrapper);
        });
}

function setServerOffline(el, wrapper) {
    el.innerText = "Offline";
    el.style.color = "#e74c3c"; // Red
    wrapper.style.display = "none";
}
