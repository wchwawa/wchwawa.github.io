export type Locale = 'en' | 'zh';
type Localized<T> = Record<Locale, T>;

export const profile = {
  name: 'Jason Wang',
  fullName: 'Changhao Wang',
  site: 'https://wchwawa.github.io',
  email: 'wch19961116@gmail.com',
  github: 'https://github.com/wchwawa',
  linkedin: 'https://www.linkedin.com/in/changhaow/',
  x: 'https://x.com/jasonwch96',
  cv: '/cv/Jason_Wang_CV.pdf',
  portrait: '/images/jason-wang.jpg',
  repository: 'https://github.com/wchwawa/wchwawa.github.io',
} as const;

export const routes: Record<Locale, string> = { en: '/', zh: '/zh/' };

export const copy = {
  en: {
    title: 'Jason Wang | Applied AI engineer',
    description: 'Jason (Changhao) Wang is a Sydney-based applied AI engineer, NoKV lead maintainer and tutor at the University of Sydney’s School of Computer Science.',
    skip: 'Skip to content',
    navigation: 'Main navigation',
    home: 'Jason Wang, home',
    language: '中文版',
    languageCode: 'zh',
    theme: 'Dark theme',
    role: 'Applied AI Engineer · Agent Systems, AI Infrastructure & DBMS',
    contactAction: 'Get in touch',
    cvAction: 'Download CV',
    portraitAlt: 'Jason Wang smiling and giving a thumbs-up',
    projects: 'Selected work',
    about: 'About me',
    writing: 'Writing',
    contact: 'Contact',
    emailContact: 'Email Jason',
    githubContact: 'Jason on GitHub',
    linkedinContact: 'Jason on LinkedIn',
    xContact: 'Jason on X',
    source: 'Site source',
    notFound: 'This page isn’t here.',
    notFoundBody: 'You can find my projects, writing and contact details on the homepage.',
    backHome: 'Back to the homepage',
  },
  zh: {
    title: 'Jason Wang | 应用 AI 工程师',
    description: 'Jason（Changhao）Wang，常驻悉尼的应用 AI 工程师、NoKV 主要维护者，同时在悉尼大学计算机科学学院担任课程导师。',
    skip: '跳转到正文',
    navigation: '主导航',
    home: 'Jason Wang，首页',
    language: 'English',
    languageCode: 'en',
    theme: '深色主题',
    role: '应用 AI 工程师 · Agent 系统、AI 基础设施与 DBMS',
    contactAction: '联系我',
    cvAction: '下载英文 CV',
    portraitAlt: 'Jason Wang 微笑着竖起拇指',
    projects: '精选项目',
    about: '关于我',
    writing: '技术文章',
    contact: '联系',
    emailContact: '给 Jason 发邮件',
    githubContact: 'Jason 的 GitHub',
    linkedinContact: 'Jason 的 LinkedIn',
    xContact: 'Jason 的 X',
    source: '网站源码',
    notFound: '这里还没有这个页面。',
    notFoundBody: '你可以在首页找到我的项目、文章和联系方式。',
    backHome: '返回首页',
  },
} satisfies Localized<Record<string, string | string[]>>;

const biographyLinks = {
  lfai: 'https://landscape.lfai.foundation/?group=projects-and-products&item=data--store-format--nokv',
  cncf: 'https://landscape.cncf.io/?group=projects-and-products&item=runtime--cloud-native-storage--nokv',
  dbdb: 'https://dbdb.io/db/nokv',
  loopx: 'https://github.com/huangruiteng/loopx',
  openViking: 'https://github.com/volcengine/OpenViking',
  hermes: 'https://github.com/NousResearch/hermes-agent',
  neuono: 'https://neuono.com/',
  forbes: 'https://www.forbes.com.au/covers/entrepreneurs/from-aussie-suits-to-ai-couture-the-startup-trying-to-reinvent-fashion-in-five-days/',
  nyfw: 'https://designobserver.com/your-tailormade-revenge-dress-theres-an-app-for-that/',
} as const;

type BiographySegment = { text: string; href?: string };

// Keep the full biography as structured text so links are explicit, not raw HTML.
export const biography: Localized<BiographySegment[][]> = {
  en: [
    [
      { text: 'Hi, I’m Jason Wang, a Sydney-based applied AI engineer focused on agent systems and infrastructure. I also tutor at the University of Sydney’s School of Computer Science.' },
    ],
    [
      { text: 'I’m the lead maintainer of NoKV, an open-source infrastructure project providing persistent workspaces and state management for AI agents. NoKV is part of the Linux Foundation ecosystem, listed in both the ' },
      { text: 'LF AI & Data', href: biographyLinks.lfai },
      { text: ' and ' },
      { text: 'CNCF', href: biographyLinks.cncf },
      { text: ' landscapes, and is also catalogued in ' },
      { text: 'CMU’s Database of Databases (DBDB.io)', href: biographyLinks.dbdb },
      { text: ' by Prof. Andy Pavlo. NoKV is actively collaborating with ' },
      { text: 'LoopX', href: biographyLinks.loopx },
      { text: ' (5.8K+ GitHub stars), ' },
      { text: 'OpenViking', href: biographyLinks.openViking },
      { text: ' (37K+ stars), and ' },
      { text: 'Hermes Agent', href: biographyLinks.hermes },
      { text: ' (245K+ stars).' },
    ],
    [
      { text: 'I’ve been building with generative AI since late 2023 and have helped two local startups develop customer-facing AI agent systems from scratch. At THDR Group, I implemented the core agent workflow for ' },
      { text: 'Neuono', href: biographyLinks.neuono },
      { text: ', an AI fashion platform later featured in ' },
      { text: 'Forbes Australia', href: biographyLinks.forbes },
      { text: ' and showcased at ' },
      { text: 'New York Fashion Week in September 2025', href: biographyLinks.nyfw },
      { text: '.' },
    ],
    [
      { text: 'My capstone project, EchoJournal, is a voice-native personal memory system powered by a real-time voice model. It was selected for the University of Sydney’s Genesis Accelerator, Cohort 36, in late 2025.' },
    ],
    [
      { text: 'I value the combination of product development and infrastructure engineering in practical AI applications, particularly in industries beyond tech. I’m especially interested in working closely with domain experts to understand their workflows and turn their needs into useful, reliable agent systems.' },
    ],
    [
      { text: 'Fun fact: I was a journalist back in 2019.' },
    ],
  ],
  zh: [
    [
      { text: '你好，我是 Jason Wang，一名常驻悉尼的应用 AI 工程师，专注于 Agent 系统与基础设施。我也在悉尼大学计算机科学学院担任课程导师（Tutor）。' },
    ],
    [
      { text: '我是 NoKV 的主要维护者。NoKV 是一个开源基础设施项目，为 AI Agent 提供持久化工作区与状态管理。NoKV 属于 Linux 基金会生态，已被 ' },
      { text: 'LF AI & Data', href: biographyLinks.lfai },
      { text: ' 和 ' },
      { text: 'CNCF', href: biographyLinks.cncf },
      { text: ' 的 Landscape 项目目录收录，也由 Andy Pavlo 教授收录于 ' },
      { text: 'CMU 的 Database of Databases（DBDB.io）', href: biographyLinks.dbdb },
      { text: '。目前，NoKV 正与 ' },
      { text: 'LoopX', href: biographyLinks.loopx },
      { text: '（5.8K+ GitHub stars）、' },
      { text: 'OpenViking', href: biographyLinks.openViking },
      { text: '（37K+ stars）和 ' },
      { text: 'Hermes Agent', href: biographyLinks.hermes },
      { text: '（245K+ stars）积极开展合作。' },
    ],
    [
      { text: '我从 2023 年末开始开发生成式 AI 应用，曾帮助两家本地初创公司从零构建面向用户的 AI Agent 系统。在 THDR Group，我实现了 AI 时尚平台 ' },
      { text: 'Neuono', href: biographyLinks.neuono },
      { text: ' 的核心 Agent 工作流。该平台后来获得 ' },
      { text: 'Forbes Australia', href: biographyLinks.forbes },
      { text: ' 报道，并亮相 ' },
      { text: '2025 年 9 月的纽约时装周', href: biographyLinks.nyfw },
      { text: '。' },
    ],
    [
      { text: '我的毕业项目 EchoJournal 是一个以实时语音模型驱动的语音原生个人记忆系统，于 2025 年末入选悉尼大学 Genesis Accelerator 第 36 期。' },
    ],
    [
      { text: '我看重产品开发与基础设施工程在实际 AI 应用中的结合，尤其关注科技行业之外的应用场景。我特别希望与领域专家密切合作，理解他们的工作流程，将真实需求转化为有用、可靠的 Agent 系统。' },
    ],
    [
      { text: '一个小趣事：我在 2019 年曾是一名记者。' },
    ],
  ],
};

export const facts = {
  neuonoShowcase: 'New York Fashion Week 25SS',
  picseo: { dailyActiveUsers: '100+', payingUsers: '30+' },
  loopx: { stars: 5816, displayStars: '5.8K', checkedOn: '2026-09-13' },
  echoJournalCohort: 36,
} as const;

type ProjectCopy = {
  role: string;
  description: string;
  outcome: string;
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
        description: 'Co-built an agent-native filesystem and versioned state layer so workspaces can outlive their sandboxes. My work spans engineering, downstream use-case discovery and open-source collaboration.',
        outcome: 'Listed in',
      },
      zh: {
        role: '联合创始人',
        description: '共同构建面向 Agent 的文件系统形态工作区与版本化状态层，让工作区独立于沙箱持久保留。我负责工程实现、下游需求探索与开源合作。',
        outcome: '已收录于',
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
        description: 'Built the data and retrieval architecture for a fashion agent harness, including the production-database-to-Graph-RAG ETL pipeline and graph design. Used authoritative garment metadata and images to constrain personalised product previews and connect design to ordering.',
        outcome: `Showcased at ${facts.neuonoShowcase}.`,
      },
      zh: {
        role: '创始工程师 · 合同制',
        description: '为服装设计 Agent 应用构建数据与检索架构，将生产数据库中的服装元数据和图像接入 Graph RAG，完成 ETL 管道与图谱设计。依据业务数据库中的权威数据约束个性化生成的产品预渲染图，打通设计到下单的流程。',
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
        description: 'Independently shipped v1.0 of a photographer-focused image management and sharing product. Owned the application flow from uploads and storage through shareable galleries and billing.',
        outcome: `${facts.picseo.dailyActiveUsers} daily active users and ${facts.picseo.payingUsers} paying users in the first month.`,
      },
      zh: {
        role: '全栈工程师 · 合同制',
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
        description: 'Contributed shared-goal state and execution-ownership semantics to a long-task agent harness. The work makes authority explicit: who may act and publish results, and how state stays consistent across retries, reassignment and recovery.',
        outcome: `${facts.loopx.displayStars} GitHub stars (as of ${facts.loopx.checkedOn}).`,
      },
      zh: {
        role: '协作者',
        description: '为面向长任务的 Agent 执行框架设计和实现共享目标状态与执行权机制，明确谁可以执行任务、谁有权提交结果，以及重试、任务转交和故障恢复时如何保持状态一致。',
        outcome: `${facts.loopx.displayStars} GitHub stars（截至 ${facts.loopx.checkedOn}）。`,
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
        description: 'Built a voice-native personal memory system that turns spoken entries into a searchable journal and structured reflections. Added real-time voice conversations grounded in the user’s own history, with explicit time-range retrieval.',
        outcome: `University of Sydney Genesis Accelerator, cohort ${facts.echoJournalCohort}.`,
      },
      zh: {
        role: '个人项目',
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
        date: '31 Aug 2026',
      },
      zh: {
        title: '沙箱可以消失，工作区应当保留',
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
        date: '13 Jun 2026',
      },
      zh: {
        title: 'Agent 为什么偏爱文件系统接口',
        date: '2026 年 6 月 13 日',
      },
    },
  },
] as const;
