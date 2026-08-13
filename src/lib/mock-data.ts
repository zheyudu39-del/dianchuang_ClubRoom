// ============================================
// 网站内容数据源(唯一事实源)
// 直接修改此文件保存后,网站内容立即更新(dev 热更新)
// 管理后台的「保存」操作也会写回此文件
// ============================================

export interface HonorItem {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
}

export const departments = [
  {
    "id": "frontend",
    "name": "前端开发",
    "icon": "Code2",
    "color": "",
    "desc": "用 TypeScript 构建流畅的 Web 体验，让界面与交互都恰到好处",
    "skills": [
      "TypeScript",
      "React",
      "Vue",
      "Next.js",
      "Tailwind"
    ]
  },
  {
    "id": "backend",
    "name": "后端开发",
    "icon": "Server",
    "color": "",
    "desc": "以 Go / Java / Python 打造高可用服务，让数据稳定流转",
    "skills": [
      "Go",
      "Java",
      "Python",
      "Node.js",
      "PostgreSQL"
    ]
  },
  {
    "id": "fullstack",
    "name": "全栈开发",
    "icon": "Layers",
    "color": "",
    "desc": "打通前后端与云原生，独立交付完整产品",
    "skills": [
      "TypeScript",
      "Node.js",
      "微服务",
      "云原生",
      "Docker"
    ]
  },
  {
    "id": "security",
    "name": "网络安全",
    "icon": "Shield",
    "color": "",
    "desc": "攻防实战与代码审计，守护系统与数据安全",
    "skills": [
      "渗透测试",
      "逆向工程",
      "CTF",
      "Python",
      "Web 安全"
    ]
  },
  {
    "id": "systems",
    "name": "系统与算法",
    "icon": "Cpu",
    "color": "",
    "desc": "以 C++ 打磨底层与高性能计算，向效率极致进军",
    "skills": [
      "C++",
      "数据结构",
      "算法",
      "操作系统",
      "网络编程"
    ]
  },
  {
    "id": "ai",
    "name": "人工智能",
    "icon": "Brain",
    "color": "",
    "desc": "用 Python 与机器学习探索智能边界，驱动数据价值",
    "skills": [
      "Python",
      "机器学习",
      "数据分析",
      "PyTorch",
      "LLM"
    ]
  },
  {
    "id": "mobile",
    "name": "移动开发",
    "icon": "Smartphone",
    "color": "",
    "desc": "将体验装进口袋，让创意随触可及",
    "skills": [
      "Flutter",
      "Android",
      "iOS",
      "Kotlin",
      "Swift"
    ]
  },
  {
    "id": "design",
    "name": "产品设计",
    "icon": "Palette",
    "color": "",
    "desc": "洞察需求、打磨交互，让产品有灵魂",
    "skills": [
      "UI/UX",
      "Figma",
      "原型设计",
      "用户调研",
      "品牌"
    ]
  }
] as const;

export const members = [
  {
    "id": "4",
    "name": "周慕云",
    "avatar": "/avatars/4.svg",
    "role": "MEMBER",
    "department": "backend",
    "position": "后端工程师",
    "bio": "深耕 Go 与 Java 服务端，玩转高并发与微服务架构。",
    "skills": [
      "Go",
      "Java",
      "PostgreSQL"
    ],
    "github": "muyun",
    "joinedAt": "2024-03",
    "isActive": true,
    "order": 4
  },
  {
    "id": "6",
    "name": "王小帆",
    "avatar": "/avatars/6.svg",
    "role": "MEMBER",
    "department": "systems",
    "position": "算法工程师",
    "bio": "以 C++ 为伴，沉迷数据结构的精妙与算法的优雅。",
    "skills": [
      "C++",
      "数据结构",
      "算法"
    ],
    "github": "xiaofan",
    "joinedAt": "2024-09",
    "isActive": true,
    "order": 6
  },
  {
    "id": "7",
    "name": "高远舟",
    "avatar": "/avatars/7.svg",
    "role": "MEMBER",
    "department": "security",
    "position": "安全工程师",
    "bio": "专注渗透测试与逆向工程，乐于在攻防博弈中成长。",
    "skills": [
      "渗透测试",
      "逆向工程",
      "Python"
    ],
    "github": "yuanzhou",
    "joinedAt": "2024-09",
    "isActive": true,
    "order": 7
  },
  {
    "id": "8",
    "name": "韩子墨",
    "avatar": "/avatars/8.svg",
    "role": "MEMBER",
    "department": "fullstack",
    "position": "全栈工程师",
    "bio": "TypeScript 布道者，痴迷于从零到一交付完整产品。",
    "skills": [
      "TypeScript",
      "Node.js",
      "云原生"
    ],
    "github": "zimo",
    "joinedAt": "2024-09",
    "isActive": true,
    "order": 8
  }
] as const;

export const works = [
  {
    "id": "1",
    "title": "Nimbus 云笔记",
    "description": "基于 Next.js 15 + PostgreSQL 的全栈云笔记应用，支持 Markdown、AI 总结、协同编辑。已上线运营 1 年。",
    "cover": "/works/nimbus.svg",
    "techStack": [
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "OpenAI"
    ],
    "category": "Web 应用",
    "githubUrl": "#",
    "demoUrl": "#",
    "teamMembers": [
      "1",
      "4"
    ],
    "isPublished": true
  },
  {
    "id": "2",
    "title": "Echo 智能客服",
    "description": "基于 RAG 架构的智能客服系统，毫秒级响应，准确率 95%+。已服务 3 家企业客户。",
    "cover": "/works/echo.svg",
    "techStack": [
      "Python",
      "FastAPI",
      "LangChain",
      "Milvus"
    ],
    "category": "AI 产品",
    "githubUrl": "#",
    "demoUrl": "#",
    "teamMembers": [
      "2",
      "7"
    ],
    "isPublished": true
  },
  {
    "id": "3",
    "title": "Pulse 心率监测",
    "description": "Flutter 移动端应用，结合 Apple HealthKit，实时监测心率并生成健康报告。",
    "cover": "/works/pulse.svg",
    "techStack": [
      "Flutter",
      "Dart",
      "HealthKit"
    ],
    "category": "移动应用",
    "githubUrl": "#",
    "demoUrl": "#",
    "teamMembers": [
      "5"
    ],
    "isPublished": true
  },
  {
    "id": "4",
    "title": "Aurora 校园社交",
    "description": "面向大学生的兴趣社交平台，话题、活动、二手交易一站式。DAU 突破 5000。",
    "cover": "/works/aurora.svg",
    "techStack": [
      "Vue 3",
      "Go",
      "Redis",
      "WebSocket"
    ],
    "category": "Web 应用",
    "githubUrl": "#",
    "demoUrl": "#",
    "teamMembers": [
      "1",
      "8",
      "6"
    ],
    "isPublished": true
  },
  {
    "id": "5",
    "title": "Vivid 设计系统",
    "description": "面向中后台的 React 组件库，50+ 高质量组件，支持主题定制。GitHub 600+ star。",
    "cover": "/works/vivid.svg",
    "techStack": [
      "React",
      "TypeScript",
      "Storybook"
    ],
    "category": "开源项目",
    "githubUrl": "#",
    "demoUrl": "#",
    "teamMembers": [
      "1",
      "3"
    ],
    "isPublished": true
  },
  {
    "id": "6",
    "title": "Mirage 图像生成",
    "description": "基于 Stable Diffusion 的二次元图像生成 Web 应用，文生图、图生图双模式。",
    "cover": "/works/mirage.svg",
    "techStack": [
      "Next.js",
      "Python",
      "Stable Diffusion"
    ],
    "category": "AI 产品",
    "githubUrl": "#",
    "demoUrl": "#",
    "teamMembers": [
      "2",
      "7"
    ],
    "isPublished": true
  }
] as const;

export const timeline = [
  {
    "year": "2015",
    "title": "典创工作室成立",
    "desc": "由 3 名计算机系同学发起，最初定位为前端技术小组。"
  },
  {
    "year": "2022",
    "title": "首个产品上线",
    "desc": "校园失物招领系统「FoundYou」正式上线，注册用户突破 3000。"
  },
  {
    "year": "2023",
    "title": "工作室扩招",
    "desc": "多位优秀的团队成员加入工作室，团队规模达到 15 人。"
  },
  {
    "year": "2024",
    "title": "国家级A类赛事",
    "desc": "工作室成员全员荣获多项A类赛事的省级以上奖项。"
  },
  {
    "year": "2025末",
    "title": "首位学长保研",
    "desc": "毕金成学长以专业第一的优异成绩保研至苏州大学。"
  },
  {
    "year": "2026",
    "title": "全新官网",
    "desc": "你正在浏览的官网 v2.0 正式上线！欢迎加入我们。"
  }
] as const;

export const faqs = [
  {
    "q": "我没有太多经验，可以加入吗？",
    "a": "当然可以！我们更看重你的学习热情和成长潜力。每位新成员都会有学长学姐 1v1 带教。"
  },
  {
    "q": "工作室有考核吗？",
    "a": "我们有月度项目考核，但氛围轻松，目的是互相督促、共同成长。"
  },
  {
    "q": "加入工作室能学习到什么？",
    "a": "我们工作室是以技术为核心的成员，主要是寻求渴望学习技术的成员加入"
  },
  {
    "q": "有实习或工作内推机会吗？",
    "a": "目前没有，工作室还在积极寻找企业合作。"
  },
  {
    "q": "工作室有报酬吗？",
    "a": "没有任何报酬，加入工作室主要还是提升自己，对找工作和考研保研都有很大的帮助。"
  }
] as const;

export const stats = [
  {
    "label": "活跃成员",
    "value": 48,
    "suffix": "+"
  },
  {
    "label": "代码提交",
    "value": 12500,
    "suffix": "+"
  },
  {
    "label": "获奖项目",
    "value": 12,
    "suffix": " 项"
  },
  {
    "label": "上线产品",
    "value": 8,
    "suffix": " 款"
  }
] as const;

export const honors: HonorItem[] = [
  {
    "title": "345",
    "description": "",
    "image": "/honors/1786592127967-9hvw6t.jpg",
    "year": "",
    "id": "0b43db39"
  },
  {
    "title": "456",
    "description": "",
    "image": "/honors/1786592163039-kmz8ww.png",
    "year": "",
    "id": "29bac497"
  },
  {
    "title": "5546",
    "description": "",
    "image": "/honors/1786592203067-s6rzjr.png",
    "year": "",
    "id": "48bacbd4"
  },
  {
    "title": "456",
    "description": "",
    "image": "/honors/1786592217387-rbz27z.png",
    "year": "",
    "id": "fce0c515"
  },
  {
    "title": "546",
    "description": "",
    "image": "/honors/1786592229860-8ug3xa.png",
    "year": "",
    "id": "a902efab"
  },
  {
    "title": "546",
    "description": "",
    "image": "/honors/1786592267183-u51l9u.png",
    "year": "",
    "id": "af06d721"
  },
  {
    "title": "324",
    "description": "",
    "image": "/honors/1786593476379-xmizrd.png",
    "year": "",
    "id": "7a3d8727"
  }
];
