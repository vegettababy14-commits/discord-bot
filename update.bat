git add .
git commit -m "Cambios del bot"
git push origin main
ssh root@SERVIDOR "cd /root/bot && ./update_bot.sh"
