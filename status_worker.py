import time
import json
import os
from mcstatus import JavaServer

SERVER_ADDRESS = "play.schnitzelsmp.eu:25565"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "serverstatus.json")

def update_status():
    try:
        # Ersetzt lookup durch die direkte Verbindung, um DNS-Hänger in der Cloud zu vermeiden
        server = JavaServer.lookup(SERVER_ADDRESS, timeout=5)
        status = server.status()

        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            }
        }
        print(f"Status aktualisiert: Online ({status.players.online}/{status.players.max})")
    except Exception as e:
        data = {
            "online": False,
            "players": {
                "online": 0,
                "max": 0
            }
        }
        print("Status aktualisiert: Server ist Offline.")
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    print("Minecraft Status-Worker aktiv. Drücke Strg+C zum Beenden...")
    while True:
        update_status()
        time.sleep(30)
