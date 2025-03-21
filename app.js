import { config } from './config.js';

// 学生数据
let students = [...config.defaultStudents];
let currentStudentId = students.length;

// DOM 元素
const studentTable = document.getElementById('studentTable');
const addStudentBtn = document.getElementById('addStudent');
const saveDataBtn = document.getElementById('saveData');
const loadDataBtn = document.getElementById('loadData');
const pointsModal = document.getElementById('pointsModal');
const modalStudentName = document.getElementById('modalStudentName');
const pointButtons = document.querySelectorAll('.point-btn');
const customPointsInput = document.getElementById('customPoints');
const addCustomPointsBtn = document.getElementById('addCustomPoints');
const closeModalBtn = document.querySelector('.close');
const backgroundAnimation = document.getElementById('backgroundAnimation');
const studentNameInput = document.getElementById('studentNameInput');

let selectedStudentId = null;

// 初始化
function init() {
    renderStudentTable();
    setupEventListeners();
    createBackgroundAnimation();
}

// 创建动态背景
function createBackgroundAnimation() {
    // 清除现有圆形
    backgroundAnimation.innerHTML = '';
    
    // 创建多个不同大小、位置的圆形
    const circleCount = window.innerWidth < 768 ? 8 : 15;
    
    for (let i = 0; i < circleCount; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        
        // 随机大小
        const size = Math.random() * 200 + 50;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        
        // 随机位置
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.top = `${Math.random() * 100}%`;
        
        // 随机动画延迟
        circle.style.animationDelay = `${Math.random() * 5}s`;
        
        // 随机动画持续时间
        circle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        
        // 随机透明度
        circle.style.opacity = Math.random() * 0.5 + 0.1;
        
        backgroundAnimation.appendChild(circle);
    }
}

// 窗口大小变化时重新创建背景
window.addEventListener('resize', createBackgroundAnimation);

// 渲染学生表格
function renderStudentTable() {
    studentTable.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
        
        const pointsCell = document.createElement('td');
        const pointsSpan = document.createElement('span');
        pointsSpan.classList.add('points');
        
        // 根据积分值添加颜色类
        if (student.points > config.pointsThresholds.positive) {
            pointsSpan.classList.add('positive');
        } else if (student.points < config.pointsThresholds.negative) {
            pointsSpan.classList.add('negative');
        }
        
        pointsSpan.textContent = student.points;
        pointsCell.appendChild(pointsSpan);
        row.appendChild(pointsCell);
        
        const actionsCell = document.createElement('td');
        actionsCell.classList.add('student-controls');
        
        const evaluateBtn = document.createElement('button');
        evaluateBtn.textContent = '评分';
        evaluateBtn.addEventListener('click', () => openPointsModal(student));
        actionsCell.appendChild(evaluateBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.style.backgroundColor = '#f44336';
        deleteBtn.addEventListener('click', () => deleteStudent(student.id));
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(actionsCell);
        
        studentTable.appendChild(row);
    });
}

// 打开评分模态框
function openPointsModal(student) {
    selectedStudentId = student.id;
    modalStudentName.textContent = student.name;
    pointsModal.style.display = 'block';
    customPointsInput.value = '';
}

// 关闭评分模态框
function closePointsModal() {
    pointsModal.style.display = 'none';
    selectedStudentId = null;
}

// 添加积分
function addPoints(points) {
    if (selectedStudentId === null) return;
    
    const studentIndex = students.findIndex(s => s.id === selectedStudentId);
    if (studentIndex !== -1) {
        students[studentIndex].points += points;
        renderStudentTable();
        
        // 更高级的动画效果
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.padding = '15px 25px';
        notification.style.backgroundColor = points >= 0 ? '#66bb6a' : '#f44336';
        notification.style.color = 'white';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.fontSize = '18px';
        notification.style.fontWeight = 'bold';
        notification.style.opacity = '0';
        notification.textContent = `${points >= 0 ? '+' : ''}${points} 分!`;
        
        document.body.appendChild(notification);
        
        // 动画进入
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
            notification.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // 动画退出
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 1500);
        }, 100);
    }
}

// 添加新学生
function addNewStudent() {
    const name = studentNameInput.value.trim();
    if (name) {
        currentStudentId++;
        students.push({
            id: currentStudentId,
            name,
            points: 0
        });
        renderStudentTable();
        studentNameInput.value = '';
        studentNameInput.focus();
    }
}

// 删除学生
function deleteStudent(id) {
    if (confirm('确定要删除此学生吗?')) {
        students = students.filter(student => student.id !== id);
        renderStudentTable();
    }
}

// 保存数据到本地
function saveData() {
    localStorage.setItem(config.storageKey, JSON.stringify(students));
    alert('数据已保存!');
}

// 从本地加载数据
function loadData() {
    const savedData = localStorage.getItem(config.storageKey);
    if (savedData) {
        try {
            students = JSON.parse(savedData);
            currentStudentId = Math.max(...students.map(s => s.id), 0);
            renderStudentTable();
            alert('数据已加载!');
        } catch (e) {
            alert('数据加载失败!');
            console.error(e);
        }
    } else {
        alert('没有找到保存的数据!');
    }
}

// 设置事件监听器
function setupEventListeners() {
    addStudentBtn.addEventListener('click', addNewStudent);
    saveDataBtn.addEventListener('click', saveData);
    loadDataBtn.addEventListener('click', loadData);
    
    // 模态框中的积分按钮
    pointButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const points = parseInt(btn.dataset.value);
            addPoints(points);
        });
    });
    
    // 自定义积分
    addCustomPointsBtn.addEventListener('click', () => {
        const points = parseInt(customPointsInput.value);
        if (!isNaN(points)) {
            addPoints(points);
            customPointsInput.value = '';
        }
    });
    
    // 回车键提交自定义积分
    customPointsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const points = parseInt(customPointsInput.value);
            if (!isNaN(points)) {
                addPoints(points);
                customPointsInput.value = '';
            }
        }
    });
    
    // 关闭模态框
    closeModalBtn.addEventListener('click', closePointsModal);
    window.addEventListener('click', (e) => {
        if (e.target === pointsModal) {
            closePointsModal();
        }
    });
    
    // 点击模态框外部关闭
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pointsModal.style.display === 'block') {
            closePointsModal();
        }
    });
    
    // 回车添加学生
    studentNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewStudent();
        }
    });
}

// 启动应用
init();