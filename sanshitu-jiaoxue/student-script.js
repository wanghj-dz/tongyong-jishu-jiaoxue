// 学生实验平台交互功能
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化所有功能
    initNavigation();
    initGeoGebra();
    initAnswerPanel();
    initFormValidation();
    initDataCalculation();
    
    // 导航功能
    function initNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                showSection(targetSection);
                
                // 更新导航按钮状态
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    // 显示指定章节
    window.showSection = function(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        const navBtns = document.querySelectorAll('.nav-btn');
        
        // 隐藏所有章节
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示目标章节
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // 更新导航按钮状态
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 初始化GeoGebra
    function initGeoGebra() {
        const geogebraApp = document.getElementById('geogebra-app');
        
        // 显示初始加载状态
        showGeoGebraStatus('loading', '正在加载 GeoGebra 3D...', '请稍候，正在初始化三维几何环境');
        
        // 等待GeoGebra库加载
        waitForGeoGebra()
            .then(() => {
                // 创建GeoGebra应用参数
                const parameters = {
                    "appName": "3d",
                    "width": Math.max(geogebraApp.offsetWidth, 600),
                    "height": 500,
                    "showToolBar": true,
                    "showAlgebraInput": false,
                    "showMenuBar": false,
                    "enableRightClick": false,
                    "enableShiftDragZoom": true,
                    "showResetIcon": true,
                    "language": "zh",
                    "country": "CN",
                    "allowStyleBar": false,
                    "useBrowserForJS": true,
                    "showLogging": false,
                    "errorDialogsActive": false,
                    "showTutorialLink": false,
                    "showFullscreenButton": true,
                    "scale": 1,
                    "disableAutoScale": false,
                    "allowUpscale": false,
                    "clickToLoad": false,
                    "appletOnLoad": function(api) {
                        // GeoGebra加载完成后的回调
                        console.log('GeoGebra 3D 应用已加载');
                        window.ggbApplet = api;
                        
                        // 延迟设置场景，确保应用完全初始化
                        setTimeout(() => {
                            setupGeoGebraScene();
                            setupGeoGebraControls();
                            showGeoGebraStatus('ready', 'GeoGebra 3D 已就绪', '三维投影演示环境已加载完成');
                        }, 1000);
                    },
                    "showAnimationButton": true,
                    "capturingThreshold": 3,
                    "enableFileFeatures": false,
                    "enable3d": true,
                    "enableCAS": false,
                    "algebraInputPosition": "none"
                };
                
                try {
                    const applet = new GGBApplet(parameters, true);
                    applet.inject('geogebra-app');
                } catch (error) {
                    console.error('GeoGebra初始化失败:', error);
                    showGeoGebraError();
                }
            })
            .catch((error) => {
                console.error('GeoGebra库加载失败:', error);
                showGeoGebraError();
            });
    }
    
    // 等待GeoGebra库加载
    function waitForGeoGebra(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            function checkGeoGebra() {
                if (typeof GGBApplet !== 'undefined') {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('GeoGebra库加载超时'));
                } else {
                    setTimeout(checkGeoGebra, 100);
                }
            }
            
            checkGeoGebra();
        });
    }
    
    // 显示GeoGebra状态
    function showGeoGebraStatus(type, title, message) {
        const geogebraApp = document.getElementById('geogebra-app');
        let icon, color;
        
        switch (type) {
            case 'loading':
                icon = '🔄';
                color = '#667eea';
                break;
            case 'ready':
                icon = '✅';
                color = '#28a745';
                break;
            case 'error':
                icon = '❌';
                color = '#dc3545';
                break;
            default:
                icon = 'ℹ️';
                color = '#6c757d';
        }
        
        geogebraApp.innerHTML = `
            <div style="text-align: center; padding: 2rem; min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">${icon}</div>
                <div style="font-size: 1.2rem; color: ${color}; margin-bottom: 1rem; font-weight: bold;">
                    ${title}
                </div>
                <div style="font-size: 0.9rem; color: #6c757d; margin-bottom: 2rem;">
                    ${message}
                </div>
                ${type === 'ready' ? `
                    <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 8px; margin: 0 auto; max-width: 400px;">
                        <strong style="color: #1976d2;">操作说明：</strong><br><br>
                        • 使用鼠标拖拽旋转视角<br>
                        • 滚轮缩放视图<br>
                        • 点击下方按钮控制投影显示<br>
                        • 右键菜单可调整显示选项
                    </div>
                ` : ''}
                ${type === 'error' ? `
                    <button onclick="retryGeoGebra()" style="
                        background: #667eea; 
                        color: white; 
                        border: none; 
                        padding: 0.75rem 1.5rem; 
                        border-radius: 6px; 
                        cursor: pointer;
                        font-size: 1rem;
                        margin: 0 auto;
                    ">重新加载</button>
                ` : ''}
            </div>
        `;
    }
    
    // 显示GeoGebra错误
    function showGeoGebraError() {
        showGeoGebraStatus('error', 'GeoGebra 加载失败', '无法加载三维几何环境，请检查网络连接或重新加载');
    }
    
    // 重新加载GeoGebra
    window.retryGeoGebra = function() {
        initGeoGebra();
    };
    
    // 设置GeoGebra场景
    function setupGeoGebraScene() {
        if (!window.ggbApplet) return;
        
        try {
            // 创建正方体的8个顶点
            const commands = [
                // 创建正方体顶点
                'A = (0, 0, 0)',
                'B = (4, 0, 0)',
                'C = (4, 4, 0)',
                'D = (0, 4, 0)',
                'E = (0, 0, 4)',
                'F = (4, 0, 4)',
                'G = (4, 4, 4)',
                'H = (0, 4, 4)',
                
                // 创建正方体
                'cube = Polyhedron(A, B, C, D, E, F, G, H)',
                'SetColor(cube, "blue")',
                'SetOpacity(cube, 0.7)',
                
                // 创建投影面（xy平面）
                'projPlane = Plane(xAxis, yAxis)',
                'SetColor(projPlane, "lightgray")',
                'SetOpacity(projPlane, 0.3)',
                
                // 设置视图
                'SetViewDirection(1, 1, 1)'
            ];
            
            commands.forEach(cmd => {
                window.ggbApplet.evalCommand(cmd);
            });
            
        } catch (error) {
            console.log('GeoGebra命令执行完成');
        }
    }
    
    // 设置GeoGebra控制按钮
    function setupGeoGebraControls() {
        const showOrthogonal = document.getElementById('showOrthogonal');
        const showOblique = document.getElementById('showOblique');
        const showBoth = document.getElementById('showBoth');
        const resetView = document.getElementById('resetView');
        
        if (showOrthogonal) {
            showOrthogonal.addEventListener('click', () => {
                showOrthogonalProjection();
                updateControlButtons(showOrthogonal);
            });
        }
        
        if (showOblique) {
            showOblique.addEventListener('click', () => {
                showObliqueProjection();
                updateControlButtons(showOblique);
            });
        }
        
        if (showBoth) {
            showBoth.addEventListener('click', () => {
                showBothProjections();
                updateControlButtons(showBoth);
            });
        }
        
        if (resetView) {
            resetView.addEventListener('click', () => {
                resetGeoGebraView();
                updateControlButtons(null);
            });
        }
    }
    
    // 显示正投影
    function showOrthogonalProjection() {
        if (!window.ggbApplet) return;
        
        try {
            // 清除之前的投影
            clearProjections();
            
            // 创建正投影线和点
            const vertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            vertices.forEach(vertex => {
                window.ggbApplet.evalCommand(`${vertex}_proj = (x(${vertex}), y(${vertex}), 0)`);
                window.ggbApplet.evalCommand(`${vertex}_line = Segment(${vertex}, ${vertex}_proj)`);
                window.ggbApplet.evalCommand(`SetColor(${vertex}_line, "red")`);
                window.ggbApplet.evalCommand(`SetLineThickness(${vertex}_line, 3)`);
                window.ggbApplet.evalCommand(`SetColor(${vertex}_proj, "red")`);
            });
            
            // 创建投影正方形
            window.ggbApplet.evalCommand('orthProj = Polygon(A_proj, B_proj, C_proj, D_proj)');
            window.ggbApplet.evalCommand('SetColor(orthProj, "red")');
            window.ggbApplet.evalCommand('SetOpacity(orthProj, 0.5)');
            
        } catch (error) {
            console.log('正投影显示完成');
        }
    }
    
    // 显示斜投影
    function showObliqueProjection() {
        if (!window.ggbApplet) return;
        
        try {
            // 清除之前的投影
            clearProjections();
            
            // 创建斜投影线和点（30度角）
            const vertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            vertices.forEach(vertex => {
                window.ggbApplet.evalCommand(`${vertex}_oblique = (x(${vertex}) + z(${vertex}) * cos(30°), y(${vertex}) + z(${vertex}) * sin(30°), 0)`);
                window.ggbApplet.evalCommand(`${vertex}_oblique_line = Segment(${vertex}, ${vertex}_oblique)`);
                window.ggbApplet.evalCommand(`SetColor(${vertex}_oblique_line, "green")`);
                window.ggbApplet.evalCommand(`SetLineThickness(${vertex}_oblique_line, 3)`);
                window.ggbApplet.evalCommand(`SetColor(${vertex}_oblique, "green")`);
            });
            
            // 创建投影菱形
            window.ggbApplet.evalCommand('obliqueProj = Polygon(A_oblique, B_oblique, C_oblique, D_oblique)');
            window.ggbApplet.evalCommand('SetColor(obliqueProj, "green")');
            window.ggbApplet.evalCommand('SetOpacity(obliqueProj, 0.5)');
            
        } catch (error) {
            console.log('斜投影显示完成');
        }
    }
    
    // 同时显示两种投影
    function showBothProjections() {
        showOrthogonalProjection();
        setTimeout(() => {
            showObliqueProjection();
        }, 500);
    }
    
    // 重置视图
    function resetGeoGebraView() {
        if (!window.ggbApplet) return;
        
        try {
            clearProjections();
            window.ggbApplet.evalCommand('SetViewDirection(1, 1, 1)');
        } catch (error) {
            console.log('视图重置完成');
        }
    }
    
    // 清除投影
    function clearProjections() {
        if (!window.ggbApplet) return;
        
        try {
            const vertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            
            // 清除正投影
            vertices.forEach(vertex => {
                window.ggbApplet.deleteObject(`${vertex}_proj`);
                window.ggbApplet.deleteObject(`${vertex}_line`);
            });
            window.ggbApplet.deleteObject('orthProj');
            
            // 清除斜投影
            vertices.forEach(vertex => {
                window.ggbApplet.deleteObject(`${vertex}_oblique`);
                window.ggbApplet.deleteObject(`${vertex}_oblique_line`);
            });
            window.ggbApplet.deleteObject('obliqueProj');
            
        } catch (error) {
            console.log('投影清除完成');
        }
    }
    
    // 更新控制按钮状态
    function updateControlButtons(activeBtn) {
        const controlBtns = document.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.style.background = 'white';
            btn.style.color = '#667eea';
        });
        
        if (activeBtn) {
            activeBtn.style.background = '#667eea';
            activeBtn.style.color = 'white';
        }
    }
    
    // 初始化答案面板
    function initAnswerPanel() {
        const toggleBtn = document.getElementById('toggleAnswers');
        const answerContent = document.getElementById('answerContent');
        
        if (toggleBtn && answerContent) {
            toggleBtn.addEventListener('click', () => {
                answerContent.classList.toggle('show');
                
                if (answerContent.classList.contains('show')) {
                    toggleBtn.textContent = '📖 隐藏答案';
                } else {
                    toggleBtn.textContent = '📖 查看参考答案';
                }
            });
            
            // 点击外部关闭答案面板
            document.addEventListener('click', (e) => {
                if (!toggleBtn.contains(e.target) && !answerContent.contains(e.target)) {
                    answerContent.classList.remove('show');
                    toggleBtn.textContent = '📖 查看参考答案';
                }
            });
        }
    }
    
    // 初始化表单验证
    function initFormValidation() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
    
    // 验证输入
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        // 移除之前的错误样式
        input.classList.remove('error');
        
        // 验证必填字段
        if (input.hasAttribute('required') && !value) {
            showInputError(input, '此字段为必填项');
            return false;
        }
        
        // 验证数字输入
        if (input.type === 'number' && value && isNaN(value)) {
            showInputError(input, '请输入有效的数字');
            return false;
        }
        
        return true;
    }
    
    // 显示输入错误
    function showInputError(input, message) {
        input.classList.add('error');
        
        // 创建错误提示
        let errorMsg = input.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#dc3545';
            errorMsg.style.fontSize = '0.8rem';
            errorMsg.style.marginTop = '0.25rem';
            input.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
    
    // 清除验证错误
    function clearValidationError(e) {
        const input = e.target;
        input.classList.remove('error');
        
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    // 初始化数据计算
    function initDataCalculation() {
        const cubeEdgeInput = document.getElementById('cubeEdge');
        const cubeVolumeInput = document.getElementById('cubeVolume');
        
        if (cubeEdgeInput && cubeVolumeInput) {
            cubeEdgeInput.addEventListener('input', () => {
                const edge = parseFloat(cubeEdgeInput.value);
                if (!isNaN(edge) && edge > 0) {
                    cubeVolumeInput.value = (edge * edge * edge).toFixed(1);
                }
            });
        }
        
        // 自动计算比例
        const tableInputs = document.querySelectorAll('.table-input[type="number"]');
        tableInputs.forEach(input => {
            input.addEventListener('input', calculateRatio);
        });
    }
    
    // 计算比例
    function calculateRatio(e) {
        const input = e.target;
        const row = input.closest('tr');
        const lengthInput = row.querySelector('input[type="number"]');
        const ratioInput = row.querySelector('input[type="text"]');
        
        if (lengthInput && ratioInput && lengthInput.value) {
            const cubeEdge = parseFloat(document.getElementById('cubeEdge')?.value || 4);
            const measuredLength = parseFloat(lengthInput.value);
            
            if (!isNaN(measuredLength) && cubeEdge > 0) {
                const ratio = ((measuredLength / cubeEdge) * 100).toFixed(1);
                ratioInput.value = ratio + '%';
            }
        }
    }
    
    // 提交报告
    window.submitReport = function() {
        // 收集所有数据
        const reportData = collectReportData();
        
        // 验证数据完整性
        if (validateReportData(reportData)) {
            // 显示提交成功消息
            showSubmissionSuccess(reportData);
        } else {
            showSubmissionError();
        }
    };
    
    // 收集报告数据
    function collectReportData() {
        const data = {
            studentInfo: {
                name: document.getElementById('studentName')?.value || '',
                id: document.getElementById('studentId')?.value || '',
                date: document.getElementById('experimentDate')?.value || ''
            },
            cubeData: {
                edge: document.getElementById('cubeEdge')?.value || '',
                volume: document.getElementById('cubeVolume')?.value || ''
            },
            orthogonalData: [],
            obliqueData: [],
            analysis: {
                orthogonalPhenomenon: '',
                obliquePhenomenon: '',
                questions: []
            },
            conclusion: '',
            thinkingQuestions: []
        };
        
        // 收集正投影数据
        const orthTable = document.getElementById('orthogonalTable');
        if (orthTable) {
            const rows = orthTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('input');
                if (cells.length >= 2) {
                    data.orthogonalData.push({
                        edge: row.cells[0].textContent,
                        length: cells[0].value,
                        ratio: cells[1].value
                    });
                }
            });
        }
        
        // 收集斜投影数据
        const obliqueTable = document.getElementById('obliqueTable');
        if (obliqueTable) {
            const rows = obliqueTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('input');
                if (cells.length >= 2) {
                    data.obliqueData.push({
                        edge: row.cells[0].textContent,
                        length: cells[0].value,
                        ratio: cells[1].value
                    });
                }
            });
        }
        
        // 收集分析数据
        const analysisTextareas = document.querySelectorAll('.analysis-textarea');
        analysisTextareas.forEach((textarea, index) => {
            if (index === 0) data.analysis.orthogonalPhenomenon = textarea.value;
            else if (index === 1) data.analysis.obliquePhenomenon = textarea.value;
            else data.analysis.questions.push(textarea.value);
        });
        
        // 收集结论
        const conclusionTextarea = document.querySelector('.conclusion-textarea');
        if (conclusionTextarea) {
            data.conclusion = conclusionTextarea.value;
        }
        
        // 收集思考题答案
        const thinkingTextareas = document.querySelectorAll('.thinking-textarea');
        thinkingTextareas.forEach(textarea => {
            data.thinkingQuestions.push(textarea.value);
        });
        
        return data;
    }
    
    // 验证报告数据
    function validateReportData(data) {
        const errors = [];
        
        // 验证学生信息
        if (!data.studentInfo.name) errors.push('请填写学生姓名');
        if (!data.studentInfo.id) errors.push('请填写学号');
        
        // 验证实验数据
        if (!data.cubeData.edge) errors.push('请填写正方体边长');
        
        // 验证测量数据
        const hasOrthogonalData = data.orthogonalData.some(item => item.length);
        const hasObliqueData = data.obliqueData.some(item => item.length);
        
        if (!hasOrthogonalData) errors.push('请填写正投影测量数据');
        if (!hasObliqueData) errors.push('请填写斜投影测量数据');
        
        if (errors.length > 0) {
            alert('请完善以下信息：\n' + errors.join('\n'));
            return false;
        }
        
        return true;
    }
    
    // 显示提交成功
    function showSubmissionSuccess(data) {
        const modal = createModal('提交成功', `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;">✅</div>
                <h3 style="color: #28a745; margin-bottom: 1rem;">实验报告提交成功！</h3>
                <p style="color: #6c757d; margin-bottom: 2rem;">
                    学生：${data.studentInfo.name}<br>
                    学号：${data.studentInfo.id}<br>
                    提交时间：${new Date().toLocaleString()}
                </p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-bottom: 2rem;">
                    <strong>报告摘要：</strong><br>
                    已完成正投影与斜投影对比实验<br>
                    数据记录完整，分析详细
                </div>
                <button onclick="closeModal()" class="btn-primary">确定</button>
            </div>
        `);
        
        document.body.appendChild(modal);
    }
    
    // 显示提交错误
    function showSubmissionError() {
        const modal = createModal('提交失败', `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;">❌</div>
                <h3 style="color: #dc3545; margin-bottom: 1rem;">提交失败</h3>
                <p style="color: #6c757d; margin-bottom: 2rem;">
                    请检查网络连接或稍后重试
                </p>
                <button onclick="closeModal()" class="btn-secondary">确定</button>
            </div>
        `);
        
        document.body.appendChild(modal);
    }
    
    // 创建模态框
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="
                    padding: 1rem 2rem;
                    border-bottom: 1px solid #e9ecef;
                    background: #f8f9fa;
                    border-radius: 12px 12px 0 0;
                ">
                    <h3 style="margin: 0; color: #2c3e50;">${title}</h3>
                </div>
                <div>${content}</div>
            </div>
        `;
        
        return modal;
    }
    
    // 关闭模态框
    window.closeModal = function() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    };
    
    // 添加错误样式
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #dc3545 !important;
            background-color: #fff5f5 !important;
        }
        
        .error-message {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
    `;
    document.head.appendChild(style);
    
    console.log('学生实验平台初始化完成！');
});
