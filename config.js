// 系统配置参数
export const config = {
    // 默认学生列表，可以预设一些学生
    defaultStudents: [
        { id: 1, name: "张三", points: 0 },
        { id: 2, name: "李四", points: 0 },
        { id: 3, name: "王五", points: 0 }
    ],
    
    // 积分阈值，用于决定积分显示颜色
    pointsThresholds: {
        positive: 0,  // 积分大于此值显示为绿色
        negative: 0   // 积分小于此值显示为红色
    },
    
    // 本地存储键名
    storageKey: "classroomPoints"
};

