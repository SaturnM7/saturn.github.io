document.addEventListener('DOMContentLoaded', () => {
    // Setup for the first button
    setupExpandable('expandBtn', 'expandContent', 'server-status', 'player-count-wrapper', 'player-count', 'max-players');
    
    // Setup for the second button
    setupExpandable('expandBtn2', 'expandContent2', 'server-status2', 'player-count-wrapper2', 'player-count2', 'max-players2');
});

function setupExpandable(btnId, contentId, statusId, wrapperId, currentId, maxId) {
    const expandBtn = document.getElementById(btnId);
    const expandContent = document.getElementById(contentId);
    const icon = expandBtn.querySelector('.icon');

    const updateUI = () => loadLocalServerStatus(statusId, wrapperId, currentId, maxId, expandContent);

    expandBtn.addEventListener('click', () => {
        const isExpanded = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';

        if (isExpanded) {
            expandContent.style.maxHeight = '0px';
            icon.innerText = '+';
        } else {
            expandContent.style.maxHeight = expandContent.scrollHeight + 'px';
            icon.innerText = '-';
            updateUI();
        }
    });

    setInterval(() => {
        const isExpanded = expandContent.style.maxHeight && expandContent.style.maxHeight !== '0px';
        if (isExpanded) {
            updateUI();
        }
    }, 30000);
}

function loadLocalServerStatus(statusId, wrapperId, currentId, maxId, expandContent) {
    const statusElement = document.getElementById(statusId);
    const playerWrapper = document.getElementById(wrapperId);
    const playerCount = document.getElementById(currentId);
    const maxPlayers = document.getElementById(maxId);

    fetch('serverstatus.json?t=' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error('Datei nicht gefunden');
            return response.json();
        })
        .then(data => {
            if (data && data.online === true) {
                statusElement.innerText = "Online";
                statusElement.style.color = "#2ecc71"; 
                
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
    statusElement.style.color = "#e74c3c"; 
    playerWrapper.style.display = "none";
}

function recalculateContainerHeight(container) {
    if (container.style.maxHeight && container.style.maxHeight !== '0px') {
        container.style.maxHeight = container.scrollHeight + 'px';
    }
}
