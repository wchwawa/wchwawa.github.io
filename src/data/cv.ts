import { facts, projects, type Locale } from './profile.ts';

type Localized<T> = Record<Locale, T>;
type ExperienceCopy = { name: string; role: string; summary?: string; outcome?: string };
type Experience = {
  id: string;
  start: string;
  end: string | null;
  incoming?: boolean;
  kind: 'open-source' | 'work' | 'personal';
  url: string;
  projectId?: string;
  copy: Localized<ExperienceCopy>;
};

const project = (id: string) => {
  const value = projects.find(item => item.id === id);
  if (!value) throw new Error(`Unknown project: ${id}`);
  return value;
};

// Dates and roles maintained from owner-provided records, reviewed 2026-09-30.
// Null end dates mean ongoing unless explicitly marked incoming.
// Identical start/end months mean single-month work.
// Equal start dates retain CV order. Do not infer dates from repository activity.
export const experience: Experience[] = ([
  {
    id: 'lingopal', start: '2026-10', end: null, incoming: true, kind: 'work',
    url: 'https://lingopal.ai/',
    copy: {
      en: { name: 'Lingopal', role: 'Member of Technical Staff' },
      zh: { name: 'Lingopal', role: 'Member of Technical Staff' },
    },
  },
  {
    id: 'loopx', start: '2026-08', end: null, kind: 'open-source',
    projectId: 'loopx', url: project('loopx').url,
    copy: {
      en: { name: 'LoopX', role: project('loopx').copy.en.role, summary: 'Designed shared-goal state and execution ownership for long-running agents. Fenced claims, idempotent writeback and restart-safe recovery give agents and hosts one durable authority while keeping runtimes and storage replaceable.', outcome: project('loopx').copy.en.outcome },
      zh: { name: 'LoopX', role: project('loopx').copy.zh.role, summary: '围绕长任务 Agent 对跨进程、跨主机共享状态的需求，设计共享目标状态与执行权机制。通过隔离过期执行者、幂等写回和可恢复执行，避免多个 Agent 同时持有权威状态，同时保持运行时和存储可替换。', outcome: project('loopx').copy.zh.outcome },
    },
  },
  {
    id: 'nokv', start: '2026-03', end: null, kind: 'open-source',
    projectId: 'nokv', url: project('nokv').url,
    copy: {
      en: { name: 'NoKV', role: 'Co-founder & Distributed Systems Engineer', summary: 'Lead engineering, downstream use-case discovery and open-source collaboration alongside my day job. Evolved a Go distributed filesystem into a Rust workspace and persistent state layer for agents, and opened AI-for-science pilots alongside atomate2/jobflow.', outcome: 'Listed in the CNCF and LF AI & Data Landscapes. The early Go version is catalogued by CMU DBDB.io.' },
      zh: { name: 'NoKV', role: '联合创始人、分布式系统工程师', summary: '在主业之外独立推进工程实现、下游需求探索与开源合作，将 Go 分布式文件系统发展为面向 Agent 的 Rust 工作区与持久化状态层，并探索作为 atomate2/jobflow 增量的 AI-for-science 试点。', outcome: '获 CNCF 与 LF AI & Data Landscape 收录；早期 Go 版本收录于 CMU DBDB.io。' },
    },
  },
  {
    id: 'echojournal', start: '2025-08', end: '2025-09', kind: 'personal',
    projectId: 'echojournal', url: project('echojournal').url,
    copy: {
      en: { name: 'Genesis Accelerator', role: `Cohort ${facts.echoJournalCohort}`, summary: 'Built EchoJournal, a voice-native personal memory system with searchable transcripts, daily-to-monthly reflections and a WebRTC voice agent. Conversations retrieve personal history through explicit user- and date-scoped queries.', outcome: project('echojournal').copy.en.outcome },
      zh: { name: 'Genesis 创业孵化器', role: `第 ${facts.echoJournalCohort} 期`, summary: '构建 EchoJournal 语音原生个人记忆系统，将语音整理为可检索文本及日、周、月回顾；通过 WebRTC 实时语音 Agent，按用户与时间范围检索个人历史，让对话基于真实记录。', outcome: project('echojournal').copy.zh.outcome },
    },
  },
  {
    id: 'usyd', start: '2025-06', end: null, kind: 'work',
    url: 'https://www.sydney.edu.au/',
    copy: {
      en: { name: 'The University of Sydney', role: 'Tutor & Teaching Assistant', summary: 'Teach object-oriented programming, software construction and design, testing, and databases across five undergraduate units. Deliver 14 teaching hours each week, helping students reason about debugging and architectural trade-offs.' },
      zh: { name: '悉尼大学', role: '课程导师、助教', summary: '承担五门本科课程的教学，涵盖面向对象编程、软件构造与设计、软件测试和数据库。每周授课 14 小时，指导学生调试程序、理解工程架构与设计取舍。' },
    },
  },
  {
    id: 'picseo', start: '2025-03', end: '2025-06', kind: 'work',
    projectId: 'picseo', url: project('picseo').url,
    copy: {
      en: { name: 'PicSEO AI', role: 'Full-stack Engineer (Contract)', summary: 'Independently built and shipped v1.0 of an image management and sharing system for photographers. Owned chunked uploads, isolated storage, encrypted sharing, metadata, real-time rendering and billing.', outcome: project('picseo').copy.en.outcome },
      zh: { name: 'PicSEO AI', role: '全栈工程师（合同制）', summary: '独立开发并交付面向摄影师的图片管理与分享系统 v1.0，负责分块上传、隔离存储、加密分享、图片元数据、实时渲染和计费的完整流程。', outcome: project('picseo').copy.zh.outcome },
    },
  },
  {
    id: 'neuono', start: '2025-01', end: '2025-03', kind: 'work',
    projectId: 'neuono', url: project('neuono').url,
    copy: {
      en: { name: 'Neuono', role: 'AI Software Development Engineer (Contract)', summary: 'Built the data and retrieval architecture and core fashion design-to-order agent workflow from scratch. Designed the production-database-to-Graph-RAG ETL and graph model, grounding personalised product previews in authoritative garment metadata and images before translating approved designs into order-ready specifications.', outcome: project('neuono').copy.en.outcome },
      zh: { name: 'Neuono', role: 'AI 软件开发工程师（合同制）', summary: '从零构建服装设计到下单的核心 Agent 流程、数据与检索架构，负责生产数据库到 Graph RAG 的 ETL 和图谱设计。依据业务数据库中的权威服装元数据与图像，约束个性化生成的产品预渲染图，并将确认后的设计转为可下单的规格。', outcome: project('neuono').copy.zh.outcome },
    },
  },
] satisfies Experience[]).sort((a, b) => b.start.localeCompare(a.start));

export const education = [
  { start: '2024-02', end: '2026-02', copy: {
    en: { institution: 'The University of Sydney', degree: 'Master of Computer Science' },
    zh: { institution: '悉尼大学', degree: '计算机科学硕士' },
  } },
  { start: '2019-07', end: '2020-11', copy: {
    en: { institution: 'Newcastle University, UK', degree: 'MA, International Multimedia Journalism' },
    zh: { institution: '英国纽卡斯尔大学', degree: '国际多媒体新闻学硕士' },
  } },
] satisfies { start: string; end: string; copy: Localized<{ institution: string; degree: string }> }[];

export const skills: Localized<{ label: string; text: string }[]> = {
  en: [
    { label: 'Languages', text: 'Rust, Go, Python, TypeScript / JavaScript, SQL' },
    { label: 'Systems', text: 'Distributed storage, Raft, MVCC, WAL / checkpoints, persistent ART, S3, Linux I/O, Docker, Kubernetes' },
    { label: 'Applied AI', text: 'Agent orchestration, Graph RAG, provenance, real-time voice / WebRTC, vLLM / SGLang, inference scheduling and KV-cache lifecycles' },
  ],
  zh: [
    { label: '编程语言', text: 'Rust、Go、Python、TypeScript / JavaScript、SQL' },
    { label: '系统工程', text: '分布式存储、Raft、MVCC、WAL 与检查点、持久化 ART、S3、Linux I/O、Docker、Kubernetes' },
    { label: 'AI 应用', text: 'Agent 编排、Graph RAG、数据溯源、实时语音与 WebRTC、vLLM / SGLang、推理调度与 KV 缓存生命周期' },
  ],
};

export const recognition = {
  date: '2026-08',
  copy: {
    en: { title: 'Linux Foundation ONE Summit Tokyo 2026', role: 'Invited speaker', text: 'Invited to speak on why agent systems need a persistent state layer outside their sandboxes.' },
    zh: { title: 'Linux Foundation ONE Summit Tokyo 2026', role: '受邀演讲嘉宾', text: '受邀分享 Agent 系统为什么需要沙箱之外的持久化状态层。' },
  },
};

export const cvCopy = {
  en: { experience: 'Experience', education: 'Education', skills: 'Skills', recognition: 'Speaking', present: 'Present', incoming: 'Incoming', to: 'to', details: 'Experience details', role: 'Applied AI Engineer', specialisms: 'Agent Systems & DBMS', teaching: 'Tutor, University of Sydney', timelineLabel: 'Work, open-source contributions and personal projects, newest first' },
  zh: { experience: '工作与开源经历', education: '教育背景', skills: '技术能力', recognition: '演讲', present: '至今', incoming: '即将入职', to: '至', details: '经历详情', role: '应用 AI 工程师', specialisms: 'Agent 系统与 DBMS', teaching: '悉尼大学课程导师', timelineLabel: '按开始时间倒序排列的工作、开源与个人项目经历' },
};

export const monthLabel = (month: string) => month.replace('-', '.');
