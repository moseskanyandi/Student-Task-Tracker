import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const SAMPLE_TASKS = [
  { id: 1, title: "History Essay - Industrial Revolution", description: "Write a 2000-word essay on the socio-economic impacts of the Industrial Revolution in 19th-century Britain.", dueDate: "2026-06-10", priority: "High", status: "In Progress", category: "History" },
  { id: 2, title: "Multivariable Calculus - Set 4", description: "Complete the problem set on triple integrals and Stokes' theorem. Show all derivation steps for full credit.", dueDate: "2026-06-12", priority: "High", status: "Pending", category: "Math" },
  { id: 3, title: "Buy Lab Notebook", description: "Purchase a spiral-bound carbon copy lab notebook for Chemistry 201 before the first lab session.", dueDate: "2026-06-08", priority: "Low", status: "Completed", category: "Personal" },
  { id: 4, title: "CS Senior Project - Alpha Milestone", description: "The alpha milestone requires the core database schema and the authentication layer to be fully functional.", dueDate: "2026-06-15", priority: "High", status: "In Progress", category: "Computer Science" },
  { id: 5, title: "Physics Lab Report", description: "Draft the results and discussion section for the projectile motion experiment conducted on Monday.", dueDate: "2026-06-09", priority: "Medium", status: "Pending", category: "Physics" },
  { id: 6, title: "Advanced Macroeconomics Research Paper", description: "Research paper on monetary policy effects.", dueDate: "2026-06-14", priority: "High", status: "Pending", category: "Academic" },
];

const STUDY_TIPS = [
  "Active recall is 3x more effective than passive reading. Try quizzing yourself.",
  "Spaced repetition helps long-term retention. Review notes after 1 day, 1 week, 1 month.",
  "The Pomodoro technique: 25 minutes focus, 5 minute break. Repeat 4 times.",
  "Teaching concepts to others is one of the best ways to solidify your understanding.",
];

const STATUS_META = {
  "Pending":     { color: "#6366f1", bg: "#eef2ff" },
  "In Progress": { color: "#f59e0b", bg: "#fffbeb" },
  "Completed":   { color: "#10b981", bg: "#ecfdf5" },
};

const CATEGORY_COLORS = {
  "History": "#dbeafe", "Academic": "#dbeafe", "Math": "#d1fae5",
  "Computer Science": "#ede9fe", "Physics": "#fce7f3", "Personal": "#f3f4f6", "Project": "#fef9c3",
};

function generateId() { return Math.random().toString(36).slice(2, 9); }
function isOverdue(task) {
  if (!task.dueDate || task.status === "Completed") return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

const emptyForm = { title: "", description: "", dueDate: "", priority: "Medium", status: "Pending", category: "Academic" };

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue:      #2563eb;
    --blue-dark: #1d4ed8;
    --blue-light:#eff6ff;
    --blue-mid:  #dbeafe;
    --navy:      #1e3a5f;
    --text:      #111827;
    --muted:     #6b7280;
    --light:     #9ca3af;
    --bg:        #f3f4f6;
    --white:     #ffffff;
    --border:    #e5e7eb;
    --success:   #10b981;
    --warning:   #f59e0b;
    --purple:    #6366f1;
    --radius:    12px;
    --shadow:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
  }

  body { font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  * { font-family: 'Sora', sans-serif; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }

  /* ── LANDING ── */
  .landing { min-height: 100vh; background: var(--white); }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 64px; border-bottom: 1px solid var(--border);
    background: var(--white); position: sticky; top: 0; z-index: 50;
  }
  .nav-logo { font-size: 1rem; font-weight: 700; color: var(--blue); }
  .nav-links { display: flex; gap: 32px; }
  .nav-link { font-size: 0.875rem; color: var(--muted); cursor: pointer; text-decoration: none; transition: color 0.15s; border-bottom: 2px solid transparent; padding-bottom: 2px; }
  .nav-link:hover, .nav-link.active { color: var(--text); border-bottom-color: var(--blue); }
  .nav-actions { display: flex; gap: 12px; align-items: center; }
  .btn-ghost { padding: 8px 20px; border: none; background: transparent; color: var(--text); font-size: 0.875rem; cursor: pointer; font-weight: 500; border-radius: 8px; transition: background 0.15s; }
  .btn-ghost:hover { background: var(--bg); }
  .btn-blue { padding: 9px 22px; background: var(--blue); color: white; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-blue:hover { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }

  .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; padding: 80px 64px; max-width: 1200px; margin: 0 auto; animation: fadeUp 0.6s ease; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--blue-light); color: var(--blue); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 14px; border-radius: 99px; margin-bottom: 24px; }
  .hero-title { font-family: 'Lora', serif; font-size: clamp(2.2rem, 4vw, 3.2rem); line-height: 1.12; font-weight: 700; color: var(--text); margin-bottom: 20px; }
  .hero-sub { font-size: 1rem; color: var(--muted); line-height: 1.7; margin-bottom: 36px; max-width: 420px; }
  .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn-outline { padding: 12px 28px; border: 1.5px solid var(--border); background: white; color: var(--text); border-radius: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .btn-outline:hover { border-color: var(--blue); color: var(--blue); }
  .btn-blue-lg { padding: 12px 28px; background: var(--blue); color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-blue-lg:hover { background: var(--blue-dark); box-shadow: 0 4px 16px rgba(37,99,235,0.3); }
  .hero-img { border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-lg); background: var(--bg); aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; }
  .hero-img-inner { width: 100%; height: 100%; background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; }

  .features-section { background: var(--bg); padding: 80px 64px; text-align: center; }
  .section-title { font-family: 'Lora', serif; font-size: 1.9rem; font-weight: 700; margin-bottom: 12px; }
  .section-sub { color: var(--muted); font-size: 0.95rem; max-width: 500px; margin: 0 auto 48px; line-height: 1.65; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto; }
  .feature-card { background: var(--white); border-radius: var(--radius); padding: 32px 28px; text-align: left; border: 1px solid var(--border); transition: transform 0.18s, box-shadow 0.18s; }
  .feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 18px; }
  .feature-title { font-weight: 600; font-size: 1rem; margin-bottom: 10px; }
  .feature-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.65; }

  .cta-section { background: var(--navy); padding: 80px 64px; text-align: center; border-radius: 24px; margin: 0 64px 80px; }
  .cta-title { font-family: 'Lora', serif; font-size: 2rem; color: white; margin-bottom: 16px; }
  .cta-sub { color: rgba(255,255,255,0.65); font-size: 0.95rem; max-width: 480px; margin: 0 auto 36px; line-height: 1.65; }
  .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .btn-white { padding: 12px 28px; background: white; color: var(--navy); border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-white:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  .btn-ghost-white { padding: 12px 28px; background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 8px; }
  .btn-ghost-white:hover { border-color: white; }

  .footer { padding: 32px 64px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: white; }
  .footer-logo { font-weight: 700; color: var(--blue); font-size: 0.9rem; }
  .footer-copy { font-size: 0.8rem; color: var(--light); }
  .footer-links { display: flex; gap: 20px; }
  .footer-link { font-size: 0.78rem; color: var(--muted); cursor: pointer; border: 1px solid var(--border); border-radius: 6px; padding: 4px 12px; transition: all 0.15s; }
  .footer-link:hover { border-color: var(--blue); color: var(--blue); }

  /* ── LOGIN ── */
  .login-page { min-height: 100vh; background: #f3f4f6; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.4s ease; }
  .login-title { font-size: 1.5rem; font-weight: 700; color: var(--blue); margin-bottom: 6px; }
  .login-tagline { color: var(--muted); font-size: 0.9rem; margin-bottom: 32px; }
  .login-card { background: white; border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
  .login-heading { font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; }
  .login-sub { color: var(--muted); font-size: 0.875rem; margin-bottom: 28px; }
  .input-label { display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .input-wrap { position: relative; margin-bottom: 20px; }
  .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--light); font-size: 0.9rem; }
  .form-input { width: 100%; padding: 12px 14px 12px 40px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.9rem; color: var(--text); outline: none; transition: border-color 0.15s; font-family: 'Sora', sans-serif; }
  .form-input:focus { border-color: var(--blue); }
  .forgot-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .forgot-link { font-size: 0.8rem; color: var(--blue); cursor: pointer; }
  .btn-signin { width: 100%; padding: 13px; background: var(--blue); color: white; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; margin-top: 8px; transition: all 0.18s; font-family: 'Sora', sans-serif; }
  .btn-signin:hover { background: var(--blue-dark); box-shadow: 0 4px 16px rgba(37,99,235,0.3); }
  .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; color: var(--light); font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .divider::before, .divider::after { content:''; flex:1; height:1px; background: var(--border); }
  .social-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .btn-social { padding: 11px; border: 1.5px solid var(--border); border-radius: 10px; background: white; font-size: 0.85rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s; font-family: 'Sora', sans-serif; }
  .btn-social:hover { border-color: var(--blue); color: var(--blue); }

  /* ── APP SHELL ── */
  .app-shell { display: flex; min-height: 100vh; background: var(--bg); }

  /* ── SIDEBAR ── */
  .sidebar { width: 230px; min-height: 100vh; position: fixed; top: 0; left: 0; background: var(--white); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 0; z-index: 100; animation: slideIn 0.3s ease; }
  .sidebar-logo { padding: 0 20px 24px; border-bottom: 1px solid var(--border); }
  .sidebar-logo-text { font-size: 1rem; font-weight: 700; color: var(--blue); line-height: 1.2; }
  .sidebar-logo-sub { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .sidebar-nav { flex: 1; padding-top: 16px; }
  .sidebar-item { display: flex; align-items: center; gap: 12px; padding: 10px 20px; font-size: 0.875rem; color: var(--muted); cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; user-select: none; }
  .sidebar-item:hover { color: var(--text); background: var(--bg); }
  .sidebar-item.active { color: var(--blue); border-left-color: var(--blue); background: var(--blue-light); font-weight: 600; }
  .sidebar-icon { font-size: 1rem; }
  .sidebar-bottom { padding: 16px 20px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; }
  .sidebar-bottom-item { display: flex; align-items: center; gap: 10px; padding: 9px 0; font-size: 0.85rem; color: var(--muted); cursor: pointer; transition: color 0.15s; }
  .sidebar-bottom-item:hover { color: var(--text); }
  .sidebar-add-btn { margin: 12px 16px; padding: 11px; background: var(--blue); color: white; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s; font-family: 'Sora', sans-serif; }
  .sidebar-add-btn:hover { background: var(--blue-dark); }

  /* ── MAIN ── */
  .main-content { margin-left: 230px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── TOPBAR ── */
  .topbar { background: white; border-bottom: 1px solid var(--border); padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; gap: 16px; position: sticky; top: 0; z-index: 40; }
  .search-wrap { position: relative; flex: 1; max-width: 480px; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--light); font-size: 0.9rem; }
  .search-input { width: 100%; padding: 10px 14px 10px 40px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.875rem; color: var(--text); outline: none; transition: border-color 0.15s; background: var(--bg); font-family: 'Sora', sans-serif; }
  .search-input:focus { border-color: var(--blue); background: white; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-icon { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--border); background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); font-size: 1rem; transition: all 0.15s; }
  .topbar-icon:hover { border-color: var(--blue); color: var(--blue); }
  .user-info { text-align: right; }
  .user-name { font-size: 0.875rem; font-weight: 600; }
  .user-role { font-size: 0.72rem; color: var(--muted); }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--blue); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }

  /* ── PAGE CONTENT ── */
  .page { padding: 32px; animation: fadeUp 0.35s ease; }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
  .page-title { font-size: 1.7rem; font-weight: 700; }
  .page-sub { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }

  /* ── DASHBOARD CARDS ── */
  .dash-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .dash-card { background: white; border-radius: var(--radius); padding: 22px; border: 1px solid var(--border); box-shadow: var(--shadow); transition: transform 0.18s, box-shadow 0.18s; }
  .dash-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .dash-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .dash-card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .dash-card-badge { font-size: 0.7rem; font-weight: 600; color: var(--success); background: #ecfdf5; padding: 3px 8px; border-radius: 99px; }
  .dash-card-label { font-size: 0.8rem; color: var(--muted); margin-bottom: 4px; }
  .dash-card-num { font-size: 2rem; font-weight: 700; }

  /* ── RECENT TASKS ── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-heading { font-size: 1.1rem; font-weight: 700; }
  .recent-task { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 10px; transition: all 0.15s; box-shadow: var(--shadow); }
  .recent-task:hover { box-shadow: var(--shadow-md); border-color: #d1d5db; }
  .task-type-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .recent-task-body { flex: 1; min-width: 0; }
  .recent-task-title { font-size: 0.9rem; font-weight: 500; }
  .recent-task-title.done { text-decoration: line-through; color: var(--muted); }
  .recent-task-meta { font-size: 0.75rem; color: var(--muted); margin-top: 3px; display: flex; gap: 12px; }
  .status-badge { padding: 4px 12px; border-radius: 99px; font-size: 0.72rem; font-weight: 600; flex-shrink: 0; }
  .three-dot { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.15s; }
  .three-dot:hover { background: var(--bg); color: var(--text); }

  /* ── BOTTOM WIDGETS ── */
  .bottom-widgets { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px; }
  .focus-card { background: var(--navy); border-radius: var(--radius); padding: 28px; color: white; }
  .focus-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; }
  .focus-desc { font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.65; margin-bottom: 24px; }
  .btn-session { padding: 10px 24px; background: transparent; color: var(--blue); border: 2px solid white; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; background: white; transition: all 0.15s; font-family: 'Sora', sans-serif; }
  .btn-session:hover { background: var(--blue-light); }
  .tip-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }
  .tip-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--warning); margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
  .tip-text { font-size: 0.9rem; color: var(--text); line-height: 1.65; font-style: italic; margin-bottom: 16px; }
  .tip-link { font-size: 0.8rem; color: var(--blue); cursor: pointer; font-weight: 500; }
  .tip-link:hover { text-decoration: underline; }

  /* ── TASKS PAGE ── */
  .filter-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .filter-tabs { display: flex; gap: 4px; }
  .filter-tab { padding: 8px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; cursor: pointer; border: none; background: transparent; color: var(--muted); transition: all 0.15s; font-family: 'Sora', sans-serif; }
  .filter-tab.active { background: var(--blue); color: white; }
  .filter-tab:not(.active):hover { background: var(--bg); color: var(--text); }
  .sort-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1.5px solid var(--border); border-radius: 8px; background: white; font-size: 0.82rem; color: var(--muted); cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.15s; }
  .sort-btn:hover { border-color: var(--blue); color: var(--blue); }

  /* Task cards grid */
  .task-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .task-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); transition: all 0.18s; animation: fadeUp 0.3s ease both; }
  .task-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: #d1d5db; }
  .task-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .task-card-actions { display: flex; gap: 6px; }
  .icon-btn { width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; transition: all 0.15s; }
  .icon-btn:hover { background: var(--bg); color: var(--text); }
  .icon-btn.danger:hover { color: #ef4444; border-color: #fecaca; background: #fef2f2; }
  .task-card-title { font-size: 1rem; font-weight: 600; line-height: 1.35; margin-bottom: 8px; }
  .task-card-title.done { text-decoration: line-through; color: var(--muted); }
  .task-card-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .task-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 8px; }
  .task-card-date { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 5px; }
  .task-card-date.overdue { color: #ef4444; }
  .category-tag { font-size: 0.72rem; font-weight: 500; padding: 3px 10px; border-radius: 99px; }
  .task-check-btn { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
  .task-check-btn:hover { border-color: var(--success); }
  .task-check-btn.checked { background: var(--success); border-color: var(--success); color: white; font-size: 0.7rem; font-weight: 700; }

  /* ── MODAL ── */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); animation: fadeIn 0.2s ease; padding: 20px; }
  .modal { background: white; border-radius: 18px; width: 100%; max-width: 480px; padding: 32px; box-shadow: var(--shadow-lg); animation: fadeUp 0.25s ease; max-height: 90vh; overflow-y: auto; border: 1px solid var(--border); }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .modal-title { font-size: 1.25rem; font-weight: 700; }
  .close-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .close-btn:hover { background: var(--bg); color: var(--text); }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 7px; }
  .form-field { width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 9px; font-size: 0.875rem; color: var(--text); outline: none; transition: border-color 0.15s; font-family: 'Sora', sans-serif; background: white; }
  .form-field:focus { border-color: var(--blue); }
  .form-textarea { resize: vertical; min-height: 80px; line-height: 1.55; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .btn-save { width: 100%; padding: 13px; background: var(--blue); color: white; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; margin-top: 8px; transition: all 0.18s; font-family: 'Sora', sans-serif; }
  .btn-save:hover { background: var(--blue-dark); box-shadow: 0 4px 16px rgba(37,99,235,0.3); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .task-cards-grid { grid-template-columns: repeat(2, 1fr); }
    .dash-cards { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .main-content { margin-left: 0; }
    .page { padding: 20px 16px; }
    .task-cards-grid { grid-template-columns: 1fr; }
    .bottom-widgets { grid-template-columns: 1fr; }
    .hero { grid-template-columns: 1fr; padding: 48px 24px; }
    .hero-img { display: none; }
    .nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .features-section, .footer { padding: 48px 24px; }
    .features-grid { grid-template-columns: 1fr; }
    .cta-section { margin: 0 24px 48px; padding: 48px 24px; }
    .form-row { grid-template-columns: 1fr; }
    .topbar { padding: 12px 16px; }
  }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing"); // landing | login | dashboard | tasks
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [tipIndex, setTipIndex] = useState(0);

  // Inject styles
  if (!document.getElementById("stt-styles")) {
    const tag = document.createElement("style");
    tag.id = "stt-styles";
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  const total     = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending   = tasks.filter(t => t.status === "Pending").length;
  const inProgress= tasks.filter(t => t.status === "In Progress").length;

  const TASK_FILTERS = ["All", "Pending", "In Progress", "Completed"];
  const filteredTasks = tasks.filter(t => filter === "All" ? true : t.status === filter);

  function openAdd() { setForm(emptyForm); setModal({ mode: "add" }); }
  function openEdit(task) {
    setForm({ title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority, status: task.status, category: task.category || "Academic" });
    setModal({ mode: "edit", task });
  }
  function saveTask() {
    if (!form.title.trim()) return;
    if (modal.mode === "add") {
      setTasks(prev => [{ id: generateId(), ...form }, ...prev]);
    } else {
      setTasks(prev => prev.map(t => t.id === modal.task.id ? { ...t, ...form } : t));
    }
    setModal(null);
  }
  function deleteTask(id) { setTasks(prev => prev.filter(t => t.id !== id)); }
  function toggleComplete(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" } : t));
  }

  // ── LANDING ──────────────────────────────────────────────────────────────
  if (page === "landing") return (
    <div className="landing">
      <nav className="nav">
        <div className="nav-logo">Student Task Tracker</div>
        <div className="nav-links">
          {["Features", "Methodology", "Pricing", "Resources"].map(l => (
            <span key={l} className={`nav-link ${l === "Features" ? "active" : ""}`}>{l}</span>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => setPage("login")}>Log In</button>
          <button className="btn-blue" onClick={() => setPage("login")}>Get Started</button>
        </div>
      </nav>

      <div className="hero">
        <div>
          <div className="hero-badge">⚙ Built for Deep Work</div>
          <h1 className="hero-title">Master Your Study Stream</h1>
          <p className="hero-sub">Reclaim your focus and conquer deadlines with the only intelligent task tracker designed specifically for the modern academic workflow.</p>
          <div className="hero-btns">
            <button className="btn-blue-lg" onClick={() => setPage("login")}>Get Started for Free</button>
            <button className="btn-outline">View Methodology</button>
          </div>
        </div>
        <div className="hero-img">
          <div className="hero-img-inner">📚</div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Optimized for Academic Excellence</h2>
        <p className="section-sub">Focus on what matters most. Our toolset is built to remove administrative friction from your study sessions.</p>
        <div className="features-grid">
          {[
            { icon: "📋", color: "#dbeafe", title: "Task Tracking", desc: "A smart queue system that prioritizes assignments based on deadline proximity and complexity metrics." },
            { icon: "⏱", color: "#d1fae5", title: "Focus Timer", desc: "Built-in Pomodoro techniques designed to help you maintain flow states during long research and writing sessions." },
            { icon: "📈", color: "#ede9fe", title: "Progress Analytics", desc: "Visualize your academic growth with data-driven insights into your study habits and completion rates." },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">Ready to streamline your studies?</h2>
        <p className="cta-sub">Join over 15,000 students who have reclaimed 20+ hours of study time per month using StudyFlow.</p>
        <div className="cta-btns">
          <button className="btn-white" onClick={() => setPage("login")}>Create Free Account</button>
          <button className="btn-ghost-white">▶ Watch Demo</button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">Student Task Tracker</div>
        <div className="footer-copy">© 2024 Student Task Tracker. Built for the deep work generation.</div>
        <div className="footer-links">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Support"].map(l => (
            <span key={l} className="footer-link">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (page === "login") return (
    <div className="login-page">
      <div className="login-title">Student Task Tracker</div>
      <div className="login-tagline">Simplify your study stream.</div>
      <div className="login-card">
        <div className="login-heading">Welcome back</div>
        <div className="login-sub">Access your workspace and tasks.</div>
        <label className="input-label">Email Address</label>
        <div className="input-wrap">
          <span className="input-icon">✉</span>
          <input className="form-input" defaultValue="student@university.edu" placeholder="student@university.edu" />
        </div>
        <div className="forgot-row">
          <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
          <span className="forgot-link">Forgot password?</span>
        </div>
        <div className="input-wrap" style={{ marginTop: 8 }}>
          <span className="input-icon">🔒</span>
          <input className="form-input" type="password" defaultValue="password" />
        </div>
        <button className="btn-signin" onClick={() => setPage("dashboard")}>Sign In</button>
        <div className="divider">Or continue with</div>
        <div className="social-btns">
          <button className="btn-social" onClick={() => setPage("dashboard")}>🌐 Google</button>
          <button className="btn-social" onClick={() => setPage("dashboard")}>🎓 EduID</button>
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD / TASKS ─────────────────────────────────────────────────────
  const isDashboard = page === "dashboard";

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">Student Task<br/>Tracker</div>
          <div className="sidebar-logo-sub">Deep Work Session</div>
        </div>
        <nav className="sidebar-nav">
          {[["🏠", "Dashboard", "dashboard"], ["✅", "Tasks", "tasks"], ["⚙️", "Settings", "settings"]].map(([icon, label, key]) => (
            <div key={key} className={`sidebar-item ${page === key ? "active" : ""}`} onClick={() => { if (key !== "settings") setPage(key); }}>
              <span className="sidebar-icon">{icon}</span>{label}
            </div>
          ))}
        </nav>
        <button className="sidebar-add-btn" onClick={() => { setPage("tasks"); openAdd(); }}>＋ ADD NEW TASK</button>
        <div className="sidebar-bottom">
          <div className="sidebar-bottom-item">❓ Help Center</div>
          <div className="sidebar-bottom-item" onClick={() => setPage("landing")}>↪ Logout</div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search tasks, courses, or notes..." />
          </div>
          <div className="topbar-right">
            <div className="topbar-icon">🔔</div>
            <div className="topbar-icon">❓</div>
            <div className="user-info">
              <div className="user-name">Moses Kanyandi</div>
              <div className="user-role">Computer Science</div>
            </div>
            <div className="avatar">MK</div>
          </div>
        </div>

        {/* DASHBOARD PAGE */}
        {isDashboard && (
          <div className="page">
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 24 }}>
              Good morning, Moses! 👋
            </div>

            {/* Summary cards */}
            <div className="dash-cards">
              {[
                { label: "Total Tasks", num: total, icon: "📊", iconBg: "#dbeafe", badge: null },
                { label: "Completed",   num: completed, icon: "✅", iconBg: "#dcfce7", badge: "+12%" },
                { label: "Pending",     num: pending,   icon: "🕐", iconBg: "#fef9c3", badge: null },
                { label: "In Progress", num: inProgress,icon: "⏳", iconBg: "#fef3c7", badge: null },
              ].map(c => (
                <div className="dash-card" key={c.label}>
                  <div className="dash-card-top">
                    <div className="dash-card-icon" style={{ background: c.iconBg }}>{c.icon}</div>
                    {c.badge && <span className="dash-card-badge">{c.badge}</span>}
                  </div>
                  <div className="dash-card-label">{c.label}</div>
                  <div className="dash-card-num">{c.num}</div>
                </div>
              ))}
            </div>

            {/* Recent Tasks */}
            <div className="section-header">
              <div className="section-heading">Recent Tasks</div>
              <button className="btn-blue" onClick={() => setPage("tasks")} style={{ padding: "9px 20px", fontSize: "0.82rem" }}>＋ Add Task</button>
            </div>
            {tasks.slice(0, 3).map(task => {
              const sm = STATUS_META[task.status] || STATUS_META["Pending"];
              const done = task.status === "Completed";
              return (
                <div className="recent-task" key={task.id}>
                  <div className="task-type-icon" style={{ background: CATEGORY_COLORS[task.category] || "#f3f4f6" }}>📄</div>
                  <div className="recent-task-body">
                    <div className={`recent-task-title ${done ? "done" : ""}`}>{task.title}</div>
                    <div className="recent-task-meta">
                      {task.dueDate && <span>📅 Due: {new Date(task.dueDate + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                      {task.category && <span>🗂 {task.category}</span>}
                      {done && task.dueDate && <span>✅ Completed</span>}
                    </div>
                  </div>
                  <span className="status-badge" style={{ color: sm.color, background: sm.bg }}>{task.status}</span>
                  <button className="three-dot" onClick={() => { setPage("tasks"); openEdit(task); }}>⋯</button>
                </div>
              );
            })}

            {/* Bottom widgets */}
            <div className="bottom-widgets">
              <div className="focus-card">
                <div className="focus-title">Focus Mode: StudyTimer</div>
                <div className="focus-desc">Your most productive hours are usually between 9 AM and 11 AM. Start a focus session now to boost your paper completion rate by 25%.</div>
                <button className="btn-session">Start Session</button>
              </div>
              <div className="tip-card">
                <div className="tip-label">💡 Study Tip</div>
                <div className="tip-text">"{STUDY_TIPS[tipIndex]}"</div>
                <span className="tip-link" onClick={() => setTipIndex(i => (i + 1) % STUDY_TIPS.length)}>View all tips →</span>
              </div>
            </div>
          </div>
        )}

        {/* TASKS PAGE */}
        {!isDashboard && (
          <div className="page">
            <div className="page-header">
              <div>
                <h1 className="page-title">Tasks</h1>
                <div className="page-sub">Manage your academic workload and track your progress.</div>
              </div>
              <button className="btn-blue" onClick={openAdd} style={{ padding: "12px 24px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>＋ ADD TASK</button>
            </div>

            <div className="filter-bar">
              <div className="filter-tabs">
                {TASK_FILTERS.map(f => (
                  <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              <button className="sort-btn">≡ Sort by: Due Date</button>
            </div>

            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0", color: "var(--muted)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎉</div>
                <div>No tasks here — you're all caught up!</div>
              </div>
            ) : (
              <div className="task-cards-grid">
                {filteredTasks.map((task, i) => {
                  const sm = STATUS_META[task.status] || STATUS_META["Pending"];
                  const over = isOverdue(task);
                  const done = task.status === "Completed";
                  return (
                    <div className="task-card" key={task.id} style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="task-card-header">
                        <span className="status-badge" style={{ color: sm.color, background: sm.bg }}>{task.status}</span>
                        <div className="task-card-actions">
                          <button className="icon-btn" onClick={() => openEdit(task)}>✏️</button>
                          <button className="icon-btn danger" onClick={() => deleteTask(task.id)}>🗑️</button>
                        </div>
                      </div>
                      <div className={`task-card-title ${done ? "done" : ""}`}>{task.title}</div>
                      {task.description && <div className="task-card-desc">{task.description}</div>}
                      <div className="task-card-footer">
                        <div className={`task-card-date ${over ? "overdue" : ""}`}>
                          📅 Due: {task.dueDate ? new Date(task.dueDate + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date"}
                          {over && <span style={{ marginLeft: 6, color: "#ef4444", fontWeight: 600, fontSize: "0.68rem" }}>OVERDUE</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {task.category && (
                            <span className="category-tag" style={{ background: CATEGORY_COLORS[task.category] || "#f3f4f6", color: "#374151" }}>{task.category}</span>
                          )}
                          <button className={`task-check-btn ${done ? "checked" : ""}`} onClick={() => toggleComplete(task.id)}>
                            {done ? "✓" : ""}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{modal.mode === "add" ? "Add New Task" : "Edit Task"}</div>
              <button className="close-btn" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input className="form-field" placeholder="e.g. Complete React project…" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-field form-textarea" placeholder="Add more details…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-field" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-field" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                  {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-field" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {["Pending", "In Progress", "Completed"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {["Academic", "Math", "History", "Physics", "Computer Science", "Personal", "Project"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button className="btn-save" onClick={saveTask}>{modal.mode === "add" ? "Add Task" : "Save Changes"}</button>
          </div>
        </div>
      )}
    </div>
  );
}