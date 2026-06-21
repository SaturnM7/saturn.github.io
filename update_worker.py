import time
import json
import os
from mcstatus import JavaServer

SERVER_ADDRESS = "play.schnitzelsmp.eu:25565"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "serverstatus.json")

def get_server_data():
    """Attempts to fetch server data. Returns dict on success, None on failure."""
    try:
        # mcstatus handles SRV records automatically
        server = JavaServer.lookup(SERVER_ADDRESS)
        # .status() in this version does not take 'timeout' as a keyword argument
        status = server.status()
        
        return {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            },
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        print(f"Abfrage fehlgeschlagen: {e}", flush=True)
        return None

if __name__ == "__main__":
    print(f"Starte Status-Check für {SERVER_ADDRESS}...", flush=True)
    
    final_data = None
    
    # We try up to 3 times to get an "Online" status
    # This prevents temporary network blips from showing the server as offline
    for i in range(3):
        result = get_server_data()
        if result:
            final_data = result
            print(f"Erfolg! Spieler: {result['players']['online']}/{result['players']['max']}", flush=True)
            break
        
        if i < 2:
            print("Server nicht erreichbar. Erneuter Versuch in 10 Sekunden...", flush=True)
            time.sleep(10)

    # If all 3 tries failed, set data to offline
    if not final_data:
        final_data = {
            "online": False,
            "players": {"online": 0, "max": 0},
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "offline"
        }
        print("Server konnte nach 3 Versuchen nicht erreicht werden.", flush=True)

    # Write the result to the file
    with open(OUTPUT_FILE, "w") as f:
        json.dump(final_data, f, indent=4)
        
    print("Script beendet. GitHub Action übernimmt nun den Push.", flush=True)
