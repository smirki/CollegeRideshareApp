@echo off
SET /P TUNNEL_UUID=Enter your Cloudflared Tunnel UUID: 
SET /P PREFIX=Enter your desired prefix: 

cloudflared tunnel route dns %TUNNEL_UUID% %PREFIX%-chatme
cloudflared tunnel route dns %TUNNEL_UUID% %PREFIX%-pelias
cloudflared tunnel route dns %TUNNEL_UUID% %PREFIX%-login
cloudflared tunnel route dns %TUNNEL_UUID% %PREFIX%-expo
cloudflared tunnel route dns %TUNNEL_UUID% %PREFIX%-routing
cloudflared tunnel route dns %TUNNEL_UUID% %PREFIX%-matching

echo Done setting up DNS routes for tunnels.
pause
