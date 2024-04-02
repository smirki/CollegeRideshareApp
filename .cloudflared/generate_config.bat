@echo off
SET /P TUNNEL_UUID=Enter your Cloudflared Tunnel UUID: 
SET /P CREDENTIALS_FILE=Enter your Cloudflared credentials file name: 
SET /P PREFIX=Enter your desired prefix: 

(
echo tunnel: %TUNNEL_UUID%
echo credentials-file: %CREDENTIALS_FILE%

echo ingress:
echo   - hostname: %PREFIX%-chatme.saipriya.org
echo     service: ws://localhost:2053
echo   - hostname: %PREFIX%-pelias.saipriya.org
echo     service: http://localhost:4000
echo   - hostname: %PREFIX%-login.saipriya.org
echo     service: http://localhost:8000
echo   - hostname: %PREFIX%-expo.saipriya.org
echo     service: http://localhost:8081
echo   - hostname: %PREFIX%-routing.saipriya.org
echo     service: http://localhost:8080
echo   - hostname: %PREFIX%-matching.saipriya.org
echo     service: ws://localhost:3000
echo   - service: http_status:404 # Catch-all rule
echo logfile: cloudflared.log
) > config.yml

echo config.yml file has been created.
pause
