#!/usr/bin/env python3
"""
简单的 HTTP 服务器，用于测试 GeoGebra 离线部署
使用方法：python start-server.py
然后在浏览器中访问 http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 CORS 头部，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # 确保在正确的目录中运行
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print(f"🚀 启动 GeoGebra 离线部署测试服务器...")
    print(f"📁 服务目录: {script_dir}")
    print(f"🌐 服务地址: http://localhost:{PORT}")
    print(f"📋 主页面: http://localhost:{PORT}/geogebra-offline.html")
    print(f"⏹️  按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"✅ 服务器已启动，端口: {PORT}")
            
            # 自动打开浏览器
            try:
                webbrowser.open(f'http://localhost:{PORT}/geogebra-offline.html')
                print("🌐 已自动打开浏览器")
            except:
                print("⚠️  无法自动打开浏览器，请手动访问上述地址")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {PORT} 已被占用，请尝试其他端口或关闭占用该端口的程序")
        else:
            print(f"❌ 启动服务器时出错: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
