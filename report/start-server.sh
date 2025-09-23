#!/bin/bash

# 数据分析报告服务器启动脚本

echo "🚀 启动数据分析报告服务器..."
echo ""

# 检查 Python 是否可用
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python3 启动 HTTP 服务器"
    echo "📂 工作目录: $(pwd)"
    echo "🌐 访问地址: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "=================================="
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 启动 HTTP 服务器"
    echo "📂 工作目录: $(pwd)"
    echo "🌐 访问地址: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "=================================="
    python -m http.server 8000
else
    echo "❌ 未找到 Python，请安装 Python 或使用其他方法启动服务器"
    echo ""
    echo "其他启动方法："
    echo "1. 使用 Node.js: npx http-server -p 8000"
    echo "2. 使用 VS Code Live Server 扩展"
    echo "3. 使用其他 Web 服务器"
fi
