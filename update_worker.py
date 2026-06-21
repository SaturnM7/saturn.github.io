import json
import os
from mcstatus import JavaServer

# Address matching exactly what you use in terminal
SERVER_ADDRESS = "play.schnitzelsmp.eu:25565"
# Ensures the JSON is saved in the same folder as the script
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "serverstatus.json")

def update_status():
    try:
        # Performs a lookup and status check exactly like the CLI
        server = JavaServer.lookup(SERVER_ADDRESS)
        status = server.status()
        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            }
        }
        print(f"Status updated: Online ({status.players.online}/{status.players.max})")
    except Exception as e:
        # If the lookup fails (like in an IPv4-only environment), it returns offline
        data = {
            "online": False,
            "players": {
                "online": 0,
                "max": 0
            }
        }
        print(f"Status updated: Server is Offline. (Error: {e})")
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # Runs once and terminates
    update_status()
