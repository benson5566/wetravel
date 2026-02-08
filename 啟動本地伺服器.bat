@echo off
echo 正在啟動本地伺服器...
echo.
echo 請在瀏覽器中開啟: http://localhost:8000
echo.
echo 按 Ctrl+C 可以停止伺服器
echo.
python -m http.server 8000
pause
