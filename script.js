document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.getElementById('expandBtn');
    const expandContent = document.getElementById('expandContent');
    const icon = expandBtn.querySelector('.icon');

    expandBtn.addEventListener('click', () => {
        const isExpanded = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';

        if (isExpanded) {
            expandContent.style.maxHeight = '0px';
            icon.innerText = '+';
        } else {
            expandContent.style.maxHeight = expandContent.scrollHeight + 'px';
            icon.innerText = '-';
            
            // Holt die Daten direkt aus deiner lokalen JSON-Datei
            loadLocalServerStatus();
        }
    });

    setInterval(() => {
        const isExpanded = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';
        if (isExpanded) {
            loadLocalServerStatus();
        }
    }, 30000);
});

function loadLocalServerStatus() {
    const statusElement = document.getElementById('server-status');
    const playerWrapper = document.getElementById('player-count-wrapper');
    const playerCount = document.getElementById('player-count');
    const maxPlayers = document.getElementById('max-players');
    const expandContent = document.getElementById('expandContent');

    // Korrigierter fetch-Befehl ohne Syntaxfehler
    fetch('serverstatus.json?t=' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error('Datei nicht gefunden');
            return response.json();
        })
        .then(data => {
            if (data && data.online === true) {
                statusElement.innerText = "Online";
                statusElement.style.color = "#2ecc71"; // Minecraft-Grün
                
                playerCount.innerText = data.players.online;
                maxPlayers.innerText = data.players.max;
                playerWrapper.style.display = "block";
            } else {
                setServerOffline(statusElement, playerWrapper);
            }
            recalculateContainerHeight(expandContent);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Status-Datei:", error);
            setServerOffline(statusElement, playerWrapper);
            recalculateContainerHeight(expandContent);
        });
}

function setServerOffline(statusElement, playerWrapper) {
    statusElement.innerText = "Offline";
    statusElement.style.color = "#e74c3c"; // Rot
    playerWrapper.style.display = "none";
}

function recalculateContainerHeight(container) {
    if (container.style.maxHeight && container.style.maxHeight !== '0px') {
        container.style.maxHeight = container.scrollHeight + 'px';
    }
}
