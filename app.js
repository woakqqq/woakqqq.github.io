import { config } from './config.js';

// 学生数据
let students = [...config.defaultStudents];
let currentStudentId = students.length;

// DOM 元素
const studentTable = document.getElementById('studentTable');
const addStudentForm = document.getElementById('addStudentForm');
const newStudentName = document.getElementById('newStudentName');
const saveDataBtn = document.getElementById('saveData');
const loadDataBtn = document.getElementById('loadData');
const pointsModal = document.getElementById('pointsModal');
const modalStudentName = document.getElementById('modalStudentName');
const pointButtons = document.querySelectorAll('.point-btn');
const customPointsInput = document.getElementById('customPoints');
const addCustomPointsBtn = document.getElementById('addCustomPoints');
const closeModalBtn = document.querySelector('.close');
const backgroundAnimation = document.getElementById('backgroundAnimation');
let currentSortOrder = 'desc'; // 默认降序

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
    // Sort students by points
    const sortedStudents = [...students].sort((a, b) => {
        return currentSortOrder === 'desc' ? b.points - a.points : a.points - b.points;
    });
    
    // Clear the container
    studentTable.innerHTML = '';
    
    // Create student cards
    sortedStudents.forEach((student, index) => {
        const card = document.createElement('div');
        card.className = 'student-card';
        
        // Rank badge
        const rankDiv = document.createElement('div');
        rankDiv.className = `rank ${index < 3 ? `rank-${index + 1}` : ''}`;
        rankDiv.textContent = index + 1;
        
        // Student info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'student-info';
        
        const nameSpan = document.createElement('div');
        nameSpan.className = 'student-name';
        nameSpan.textContent = student.name;
        
        const pointsSpan = document.createElement('span');
        pointsSpan.className = 'student-points';
        if (student.points > config.pointsThresholds.positive) {
            pointsSpan.classList.add('positive');
        } else if (student.points < config.pointsThresholds.negative) {
            pointsSpan.classList.add('negative');
        }
        pointsSpan.textContent = student.points;
        
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(pointsSpan);
        
        // Controls section
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'student-controls';
        
        const evaluateBtn = document.createElement('button');
        evaluateBtn.textContent = '评分';
        evaluateBtn.addEventListener('click', () => openPointsModal(student));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.style.backgroundColor = '#f44336';
        deleteBtn.addEventListener('click', () => deleteStudent(student.id));
        
        controlsDiv.appendChild(evaluateBtn);
        controlsDiv.appendChild(deleteBtn);
        
        // Assemble the card
        card.appendChild(rankDiv);
        card.appendChild(infoDiv);
        card.appendChild(controlsDiv);
        
        studentTable.appendChild(card);
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
    const name = newStudentName.value.trim();
    
    if (name !== '') {
        currentStudentId++;
        students.push({
            id: currentStudentId,
            name: name,
            points: 0
        });
        renderStudentTable();
        newStudentName.value = ''; // 清空输入框
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
    addStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewStudent();
    });
    
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
    
    // Add new close modal button event listener
    document.getElementById('closeModal').addEventListener('click', closePointsModal);
    
    // Keep the ESC key listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pointsModal.style.display === 'block') {
            closePointsModal();
        }
    });
    
    // 添加排序按钮点击事件
    const sortBtn = document.getElementById('sortToggle');
    sortBtn.addEventListener('click', () => {
        currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
        sortBtn.textContent = currentSortOrder === 'desc' ? '📊 切换升序' : '📊 切换降序';
        renderStudentTable();
    });
}

// 启动应用
init();