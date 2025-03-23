// 系统配置参数
export const config = {
    // 默认20个学生
    defaultStudents: [
        { id: 1, name: "张三", points: 0 },
        { id: 2, name: "李四", points: 0 },
        { id: 3, name: "王五", points: 0 },
        { id: 4, name: "赵六", points: 0 },
        { id: 5, name: "钱七", points: 0 },
        { id: 6, name: "孙八", points: 0 },
        { id: 7, name: "周九", points: 0 },
        { id: 8, name: "吴十", points: 0 },
        { id: 9, name: "郑十一", points: 0 },
        { id: 10, name: "王十二", points: 0 },
        { id: 11, name: "陈一", points: 0 },
        { id: 12, name: "刘二", points: 0 },
        { id: 13, name: "杨三", points: 0 },
        { id: 14, name: "黄四", points: 0 },
        { id: 15, name: "赵五", points: 0 },
        { id: 16, name: "周六", points: 0 },
        { id: 17, name: "吴七", points: 0 },
        { id: 18, name: "徐八", points: 0 },
        { id: 19, name: "孙九", points: 0 },
        { id: 20, name: "胡十", points: 0 }
    ],
    
    // 积分阈值，用于决定积分显示颜色
    pointsThresholds: {
        positive: 0,  // 积分大于此值显示为绿色
        negative: 0   // 积分小于此值显示为红色
    },
    
    // 本地存储键名
    storageKey: "classroomPoints",
    
    // 积分记录保存键名
    scoreLogKey: "scoreLog",
    
    // 每个学生最多显示的最近记录数
    maxRecentLogs: 5
};