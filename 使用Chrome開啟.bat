@echo off
echo ==============================================
echo    啟動 Chrome (允許本地檔案)
echo ==============================================
echo.
echo 正在使用特殊模式啟動 Chrome 瀏覽器...
echo 此模式允許從本地檔案載入網頁應用
echo.
echo 5秒後自動開啟...
timeout /t 5 /nobreak >nul
echo.

start chrome --disable-web-security --allow-file-access-from-files --user-data-dir="%TEMP%\chrome_dev" "file:///%CD%\index.html"

echo.
echo Chrome 已啟動！
echo.
echo 注意：此視窗可以關閉，Chrome 會繼續執行
echo.
pause
