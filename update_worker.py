import time
import json
import os
from mcstatus import JavaServer

SERVER_ADDRESS = "play.schnitzelsmp.eu:25565"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "serverstatus.json")

def update_status():
    try:
        # Added a 10s timeout so it doesn't hang if the server is laggy
        server = JavaServer.lookup(SERVER_ADDRESS)
        status = server.status(timeout=10)
        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            }
        }
        print(f"Status aktualisiert: Online ({status.players.online}/{status.players.max})", flush=True)
    except Exception as e:
        data = {
            "online": False,
            "players": {
                "online": 0,
                "max": 0
            }
        }
        print(f"Status aktualisiert: Server ist Offline. ({e})", flush=True)
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # We will fetch 3 times then STOP so the YAML can commit the changes
    for i in range(3):
        update_status()
        
        # Wait 30 seconds before the next fetch, but NOT after the last one
        if i < 2:
            time.sleep(30)

    # Script ends here, GitHub Action will now move to "Commit and push changes"
    print("Worker beendet. Starte GitHub Commit...", flush=True)
