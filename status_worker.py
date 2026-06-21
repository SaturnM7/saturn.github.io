import time
import json
import os
import socket
from mcstatus import JavaServer

# Wir nutzen die Domain des Gateways, lösen die IP aber sauber über Pythons socket-Modul auf
GATEWAY_DOMAIN = "play.schnitzelsmp.eu.v4-only.v6.rocks"
TARGET_PORT = 25565
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "serverstatus.json")

def update_status():
    # 5 Sekunden Zeit für die gesamte Verbindung, danach bricht es ab
    socket.setdefaulttimeout(5.0)
    
    try:
        # DNS-Auflösung über Pythons natives socket-Modul (verhindert den mcstatus-Hänger)
        resolved_ip = socket.gethostbyname(GATEWAY_DOMAIN)
        
        # Verbindung zum Server aufbauen
        server = JavaServer(resolved_ip, TARGET_PORT)
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
        print(f"Status aktualisiert (Fehler abgefangen): Server offline. Details: {e}")
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    print("Minecraft Status-Worker startet Abfrage für GitHub Actions...")
    update_status()
