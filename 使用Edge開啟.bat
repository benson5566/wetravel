@echo off
echo ==============================================
echo    啟動 Edge (允許本地檔案)
echo ==============================================
echo.
echo 正在使用特殊模式啟動 Edge 瀏覽器...
echo 此模式允許從本地檔案載入網頁應用
echo.
echo 5秒後自動開啟...
timeout /t 5 /nobreak >nul
echo.

start msedge --disable-web-security --allow-file-access-from-files --user-data-dir="%TEMP%\edge_dev" "file:///%CD%\index.html"

echo.
echo Edge 已啟動！
echo.
echo 注意：此視窗可以關閉，Edge 會繼續執行
echo.
pause
