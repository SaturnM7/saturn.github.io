import time
import json
import os
from mcstatus import JavaServer

# Your server address
SERVER_ADDRESS = "play.schnitzelsmp.eu:25565"
# Ensure the file is written to the repository root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "serverstatus.json")

def update_status():
    try:
        # 1. Use the lookup method which handles SRV and different IP types
        server = JavaServer.lookup(SERVER_ADDRESS)
        
        # 2. Fetch the status (Removed the timeout argument to avoid the previous error)
        status = server.status()
        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            },
            # Added timestamp to ensure the file 'changes' so Git pushes it
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        print(f"Status: Online ({status.players.online}/{status.players.max})", flush=True)
        return data

    except Exception as e:
        print(f"Abfrage fehlgeschlagen: {e}", flush=True)
        return {
            "online": False,
            "players": {"online": 0, "max": 0},
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
            "error": str(e)
        }

if __name__ == "__main__":
    print(f"Starte Minecraft Status-Check für {SERVER_ADDRESS}...", flush=True)

    # Loop exactly 3 times as requested
    for i in range(3):
        result = update_status()
        
        # Save the data to the file
        with open(OUTPUT_FILE, "w") as f:
            json.dump(result, f, indent=4)
        
        # Wait 30 seconds before the next check, but not after the last one
        if i < 2:
            print("Warte 30 Sekunden bis zur nächsten Abfrage...", flush=True)
            time.sleep(30)

    print("Worker beendet. GitHub Action übernimmt nun den Push.", flush=True)
