import json
from mcstatus import JavaServer

# We define the host and port explicitly
TARGET_HOST = "play.schnitzelsmp.eu"
TARGET_PORT = 25565
OUTPUT_FILE = "serverstatus.json"

def update_status():
    try:
        # We create the server object directly. 
        # For IPv6, mcstatus handles the address resolution.
        server = JavaServer(TARGET_HOST, TARGET_PORT)
        
        # We use a longer timeout (10s) because home IPv6 routes 
        # from GitHub/Azure can sometimes be slower.
        status = server.status(timeout=10)
        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            }
        }
        print(f"Success! Online: {status.players.online}/{status.players.max}")
        
    except Exception as e:
        # This will print the exact error in your GitHub Actions log
        print(f"Error connecting to {TARGET_HOST}: {e}")
        data = {
            "online": False,
            "players": {
                "online": 0,
                "max": 0
            }
        }
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    update_status()
