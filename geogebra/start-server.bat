@echo off
chcp 65001 >nul
echo 🚀 启动 GeoGebra 离线部署测试服务器...
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Python
    echo 请先安装 Python 3.x 版本
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 启动服务器
python start-server.py

pause
