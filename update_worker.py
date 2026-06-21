import time
import json
import os
from mcstatus import JavaServer

SERVER_ADDRESS = "play.schnitzelsmp.eu:25565"
# Get the absolute path to the directory where the script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "serverstatus.json")

def update_status():
    try:
        server = JavaServer.lookup(SERVER_ADDRESS)
        status = server.status(timeout=10)
        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            },
            # This timestamp forces Git to see a change even if player count is the same
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        print(f"Status: Online ({status.players.online}/{status.players.max}) - {data['last_updated']}", flush=True)
    except Exception as e:
        data = {
            "online": False,
            "players": {"online": 0, "max": 0},
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
            "error": str(e)
        }
        print(f"Status: Offline. Error: {e}", flush=True)
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # We only run ONCE for GitHub Actions. 
    # Since your YAML runs every 5 minutes, there is no need to loop inside the script.
    # This ensures the script finishes immediately and the YAML can push the changes.
    update_status()
    print("Update complete. Exiting script to allow GitHub Push.")
