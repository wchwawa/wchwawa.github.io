export type Locale = 'en' | 'zh';
type Localized<T> = Record<Locale, T>;

export const profile = {
  name: 'Jason Wang',
  fullName: 'Changhao Wang',
  site: 'https://wchwawa.github.io',
  email: 'wch19961116@gmail.com',
  github: 'https://github.com/wchwawa',
  linkedin: 'https://www.linkedin.com/in/changhaow/',
  cv: '/cv/Jason_Wang_CV.pdf',
  portrait: '/images/jason-wang.jpg',
  repository: 'https://github.com/wchwawa/wchwawa.github.io',
} as const;

export const routes: Record<Locale, string> = { en: '/', zh: '/zh/' };

export const copy = {
  en: {
    title: 'Jason Wang | Engineer & open-source collaborator',
    description: 'Jason (Changhao) Wang is a Sydney-based, requirements-driven engineer working on agent infrastructure, applied AI and open-source software.',
    skip: 'Skip to content',
    navigation: 'Main navigation',
    home: 'Jason Wang, home',
    language: '中文版',
    languageCode: 'zh',
    theme: 'Dark theme',
    location: 'Sydney, Australia',
    profession: 'Engineer & open-source collaborator',
    introduction: 'I start with real needs, then build the right system.',
    summary: 'I work across agent infrastructure and applied AI. I enjoy understanding users, the systems around them and the constraints they face, then turning those needs into an architecture with fewer engineering tradeoffs.',
    contactAction: 'Get in touch',
    cvAction: 'Download CV',
    cvNote: 'English · PDF',
    portraitAlt: 'Jason Wang smiling and giving a thumbs-up',
    portraitCaption: 'Changhao (Jason) Wang',
    projects: 'Selected work',
    projectCount: 'Five projects, from infrastructure to applications.',
    about: 'About me',
    aboutTitle: 'Curiosity, carried into engineering.',
    aboutParagraphs: [
      'I came to software through journalism. Asking useful questions, checking assumptions and making complex ideas understandable still shape how I work. I later completed a Master of Computer Science at the University of Sydney.',
      'Today, I teach at the University of Sydney. Outside my day job, I build NoKV and work with open-source communities. I enjoy the whole process: finding a real problem, talking to the people it affects, and staying with it through design, implementation and collaboration.',
    ],
    teachingLabel: 'Alongside building',
    teachingTitle: 'Teaching at the University of Sydney',
    teachingBody: 'Five undergraduate and postgraduate units covering object-oriented programming, software design, testing and databases. Fourteen hours of teaching each week.',
    principle: 'For me, good engineering means understanding the requirement before committing to the architecture.',
    writing: 'Writing',
    writingDescription: 'Notes from building NoKV, published on the project website.',
    readArticle: 'Read on NoKV',
    contact: 'Contact',
    contactTitle: 'Let’s build something useful.',
    contactBody: 'If you’re working on agent infrastructure, a practical AI application or an open-source project, I’d be glad to compare notes.',
    footer: 'Built for reading. Hosted on GitHub Pages.',
    source: 'Site source',
    notFound: 'This page isn’t here.',
    notFoundBody: 'You can find my projects, writing and contact details on the homepage.',
    backHome: 'Back to the homepage',
  },
  zh: {
    title: 'Jason Wang | 需求导向的工程师与开源共建者',
    description: 'Jason（Changhao）Wang，常驻悉尼的需求导向工程师，专注于 Agent 基础设施、AI 应用与开源协作。',
    skip: '跳转到正文',
    navigation: '主导航',
    home: 'Jason Wang，首页',
    language: 'English',
    languageCode: 'en',
    theme: '深色主题',
    location: '澳大利亚 · 悉尼',
    profession: '需求导向的工程师与开源共建者',
    introduction: '从真实需求出发，把系统做扎实。',
    summary: '我主要做 Agent 基础设施与 AI 应用。我喜欢先理解用户、上下游和业务约束，再把这些需求转化成清晰的架构，尽可能减少实现过程中的工程妥协。',
    contactAction: '联系我',
    cvAction: '下载英文 CV',
    cvNote: '英文 · PDF',
    portraitAlt: 'Jason Wang 微笑着竖起拇指',
    portraitCaption: 'Changhao（Jason）Wang',
    projects: '精选项目',
    projectCount: '五个项目，从底层系统到实际应用。',
    about: '关于我',
    aboutTitle: '带着新闻人的好奇心，做工程。',
    aboutParagraphs: [
      '我从新闻学转向计算机，后来在悉尼大学取得计算机科学硕士学位。提出有用的问题、核实假设、把复杂的事情讲清楚，依然是我的工作习惯。',
      '目前我在悉尼大学承担教学工作。在主业之外，我持续投入 NoKV，与开源社区一起做事。我享受从发现需求、与用户交流，到架构设计、工程实现和协作落地的完整过程。',
    ],
    teachingLabel: '工程之外',
    teachingTitle: '悉尼大学课程教学',
    teachingBody: '参与五门本科与研究生课程的教学，涵盖面向对象编程、软件设计、测试和数据库，每周授课 14 小时。',
    principle: '对我来说，好的工程始于理解需求，然后才是选择架构。',
    writing: '技术文章',
    writingDescription: '来自 NoKV 实践的思考，直接链接项目官网原文。',
    readArticle: '阅读 NoKV 原文（英文）',
    contact: '联系',
    contactTitle: '一起做些真正有用的东西。',
    contactBody: '如果你在做 Agent 基础设施、解决实际问题的 AI 应用，或有意思的开源项目，欢迎交流。',
    footer: '为阅读而设计 · 托管于 GitHub Pages',
    source: '网站源码',
    notFound: '这里还没有这个页面。',
    notFoundBody: '你可以在首页找到我的项目、文章和联系方式。',
    backHome: '返回首页',
  },
} satisfies Localized<Record<string, string | string[]>>;

export const facts = {
  neuonoShowcase: 'New York Fashion Week 25SS',
  picseo: { dailyActiveUsers: '100+', payingUsers: '30+' },
  loopx: { stars: 5816, displayStars: '5.8K', checkedOn: '2026-09-13' },
  echoJournalCohort: 36,
} as const;

type ProjectCopy = {
  role: string;
  focus: string;
  description: string;
  outcome: string;
  note?: string;
};

type Project = {
  id: string;
  name: string;
  url: string;
  copy: Localized<ProjectCopy>;
  recognitionLinks?: { name: string; url: string }[];
};

// Shared ordering, URLs and facts keep both language versions aligned.
export const projects: Project[] = [
  {
    id: 'nokv',
    name: 'NoKV',
    url: 'https://nokv.io',
    recognitionLinks: [
      { name: 'LF AI & Data Landscape', url: 'https://landscape.lfai.foundation/?group=projects-and-products&item=data--store-format--nokv' },
      { name: 'CNCF Landscape', url: 'https://landscape.cncf.io/?group=projects-and-products&item=runtime--cloud-native-storage--nokv' },
    ],
    copy: {
      en: {
        role: 'Co-founder',
        focus: 'A durable workspace for agents.',
        description: 'Co-built an agent-native filesystem and versioned state layer so workspaces can outlive their sandboxes. My work spans durable checkpoints, ownership fencing and safe recovery, alongside finding downstream use cases and building open-source collaborations.',
        outcome: 'Listed in',
        note: 'Landscape entries are directory listings, not foundation endorsements.',
      },
      zh: {
        role: '联合创始人',
        focus: '让 Agent 的工作区独立于沙箱，持久保留。',
        description: '共同构建面向 Agent 的文件系统形态工作区与版本化状态层。我负责的工作涵盖持久化检查点、执行权隔离与故障恢复，也包括寻找真实的下游需求、推进开源合作与集成验证。',
        outcome: '已收录于',
        note: 'Landscape 为项目目录，收录不代表基金会官方背书。',
      },
    },
  },
  {
    id: 'neuono',
    name: 'Neuono',
    url: 'https://neuono.com/',
    copy: {
      en: {
        role: 'Founding Engineer · Contract',
        focus: 'A fashion agent harness, from design to order.',
        description: 'Built the data and retrieval architecture, including the production-database-to-Graph-RAG ETL pipeline and graph design. Used authoritative garment metadata and images to constrain personalised product previews and connect design to ordering.',
        outcome: `Showcased at ${facts.neuonoShowcase}.`,
      },
      zh: {
        role: '创始工程师 · 合同制',
        focus: '连接服装设计与下单的 Agent 应用。',
        description: '负责数据与检索架构，将生产数据库中的服装元数据和图像接入 Graph RAG，完成 ETL 管道与图谱设计。依据业务数据库中的权威数据约束个性化生成的产品预渲染图，打通设计到下单的流程。',
        outcome: `亮相纽约时装周（${facts.neuonoShowcase}）。`,
      },
    },
  },
  {
    id: 'picseo',
    name: 'PicSEO AI',
    url: 'https://picseo.ai/',
    copy: {
      en: {
        role: 'Full-stack Engineer · Contract',
        focus: 'Image management and sharing for photographers.',
        description: 'Independently shipped v1.0 of a photographer-focused image management and sharing product. Owned the application flow from uploads and storage through shareable galleries and billing.',
        outcome: `${facts.picseo.dailyActiveUsers} daily active users and ${facts.picseo.payingUsers} paying users in the first month.`,
      },
      zh: {
        role: '全栈工程师 · 合同制',
        focus: '面向摄影师的图片管理与分享系统。',
        description: '独立交付 v1.0，负责从图片上传、存储到图库分享和计费的完整应用流程，让摄影师更方便地管理作品并交付给客户。',
        outcome: `首月获得 ${facts.picseo.dailyActiveUsers} 日活跃用户、${facts.picseo.payingUsers} 付费用户。`,
      },
    },
  },
  {
    id: 'loopx',
    name: 'LoopX',
    url: 'https://github.com/huangruiteng/loopx',
    copy: {
      en: {
        role: 'Collaborator',
        focus: 'A harness for long-running agent tasks.',
        description: 'Contributed shared-goal state and execution-ownership semantics to a long-task agent harness. The work makes authority explicit: who may act and publish results, and how state stays consistent across retries, reassignment and recovery.',
        outcome: `${facts.loopx.displayStars} GitHub stars`,
        note: `Checked ${facts.loopx.checkedOn}; a dated snapshot, not a live counter.`,
      },
      zh: {
        role: '协作者',
        focus: '面向长任务的 Agent 执行框架。',
        description: '参与共享目标状态与执行权机制的设计和实现，明确谁可以执行任务、谁有权提交结果，以及重试、任务转交和故障恢复时如何保持状态一致。',
        outcome: `${facts.loopx.displayStars} GitHub stars`,
        note: `核对日期：${facts.loopx.checkedOn}，非实时计数。`,
      },
    },
  },
  {
    id: 'echojournal',
    name: 'EchoJournal',
    url: 'https://github.com/NoKV-Lab/EchoJournal',
    copy: {
      en: {
        role: 'Personal project',
        focus: 'Personal memory, built around voice.',
        description: 'Built a voice-native system that turns spoken entries into a searchable journal and structured reflections. Added real-time voice conversations grounded in the user’s own history, with explicit time-range retrieval.',
        outcome: `University of Sydney Genesis Accelerator, cohort ${facts.echoJournalCohort}.`,
      },
      zh: {
        role: '个人项目',
        focus: '以语音为入口的个人记忆系统。',
        description: '将语音记录整理为可检索的日记和结构化回顾，并支持基于个人历史数据的实时语音交流。通过明确的时间范围检索，让对话回到用户真正经历过的事情。',
        outcome: `入选悉尼大学 Genesis Accelerator 第 ${facts.echoJournalCohort} 期。`,
      },
    },
  },
];

export const articles = [
  {
    url: 'https://nokv.io/blog/workspace-outlives-the-sandbox',
    published: '2026-08-31',
    copy: {
      en: {
        title: 'The Sandbox Can Disappear. The Workspace Can Stay.',
        description: 'Why agent compute and durable workspace state need different lifecycles.',
        date: '31 Aug 2026',
      },
      zh: {
        title: '沙箱可以消失，工作区应当保留',
        description: '为什么 Agent 的计算环境和持久化工作区，需要各自独立的生命周期。',
        date: '2026 年 8 月 31 日',
      },
    },
  },
  {
    url: 'https://nokv.io/blog/agents-want-filesystems',
    published: '2026-06-13',
    copy: {
      en: {
        title: 'Agents Want Filesystems',
        description: 'An early interface study on filesystem-shaped tools and token efficiency. An archived experiment, not a current-release benchmark.',
        date: '13 Jun 2026',
      },
      zh: {
        title: 'Agent 为什么偏爱文件系统接口',
        description: '一次关于文件系统形态工具与 token 效率的早期研究。文章记录历史实验，不代表当前版本的性能基准。',
        date: '2026 年 6 月 13 日',
      },
    },
  },
] as const;
