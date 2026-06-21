import time
import json
import os
import socket
from mcstatus import JavaServer

# Wir nutzen das v4-zu-v6-Gateway direkt als feste IP, um GitHubs DNS-Hänger komplett zu umgehen
# play.schnitzelsmp.eu über das v4-only.v6.rocks Gateway
TARGET_IP = "play.schnitzelsmp.eu" 
TARGET_PORT = 25565
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "serverstatus.json")

def update_status():
    # Setzt ein globales Timeout für alle Netzwerkverbindungen in diesem Skript
    socket.setdefaulttimeout(3.0)
    
    try:
        # Direkte Verbindung ohne DNS-Lookup
        server = JavaServer(TARGET_IP, TARGET_PORT)
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
        print(f"Status aktualisiert (Fehler sicher abgefangen): Server offline. Details: {e}")
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    print("Minecraft Status-Worker startet harte Abfrage für GitHub Actions...")
    update_status()
