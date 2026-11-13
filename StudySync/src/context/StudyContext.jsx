import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { loadData, saveData, uid } from '../utils/storage';
import { apiFetch } from '../utils/api';
import {
  defaultSubjects,
  defaultTasks,
  defaultSchedule,
  defaultGoals,
  defaultNotes,
  defaultExams,
  defaultAssignments,
  defaultPomodoroStats,
  defaultStreak,
} from '../utils/seedData';

const StudyContext = createContext();

const normalizeDoc = (doc) => {
  if (!doc || typeof doc !== 'object') return doc;
  return { ...doc, id: doc.id || doc._id };
};

const isDemoToken = (tok) => !tok || tok.startsWith('demo_') || tok.startsWith('mock_');

function getInitialLocalEntities() {
  const subs = loadData('subjects', null) || defaultSubjects();
  const tsks = loadData('tasks', null) || defaultTasks(subs);
  const sch = loadData('schedule', null) || defaultSchedule();
  const gls = loadData('goals', null) || defaultGoals(subs);
  const nts = loadData('notes', null) || defaultNotes();
  const exm = loadData('exams', null) || defaultExams(subs);
  const asg = loadData('assignments', null) || defaultAssignments(subs);
  const pom = loadData('pomodoroStats', null) || defaultPomodoroStats();
  const str = loadData('streak', null) || defaultStreak();
  return { subs, tsks, sch, gls, nts, exm, asg, pom, str };
}

function saveLocalEntities({ subs, tsks, sch, gls, nts, exm, asg, pom, str }) {
  if (subs) saveData('subjects', subs);
  if (tsks) saveData('tasks', tsks);
  if (sch) saveData('schedule', sch);
  if (gls) saveData('goals', gls);
  if (nts) saveData('notes', nts);
  if (exm) saveData('exams', exm);
  if (asg) saveData('assignments', asg);
  if (pom) saveData('pomodoroStats', pom);
  if (str) saveData('streak', str);
}

export function StudyProvider({ children }) {
  // ---- Auth ----
  const [token, setToken] = useState(() => localStorage.getItem('token') || loadData('token', null));
  const [user, setUser] = useState(() => ((localStorage.getItem('token') || loadData('token', null)) ? loadData('user', null) : null));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || null);

  useEffect(() => {
    saveData('user', user);
    saveData('token', token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [user, token, refreshToken]);

  // ---- Theme ----
  const [darkMode, setDarkMode] = useState(() => loadData('theme', false));
  useEffect(() => {
    saveData('theme', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ---- Sidebar (mobile) ----
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ---- Core entities ----
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [pomodoroStats, setPomodoroStats] = useState({ todaySessions: 0, totalFocusMinutes: 0, sessionLog: [] });
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastStudyDate: null });
  const [readNotifIds, setReadNotifIds] = useState(() => loadData('readNotifs', []));
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const populateFromLocalStorage = useCallback(() => {
    const local = getInitialLocalEntities();
    setSubjects(local.subs);
    setTasks(local.tsks);
    setSchedule(local.sch);
    setGoals(local.gls);
    setNotes(local.nts);
    setExams(local.exm);
    setAssignments(local.asg);
    setPomodoroStats(local.pom);
    setStreak(local.str);
    saveLocalEntities(local);
  }, []);

  useEffect(() => {
    saveData('readNotifs', readNotifIds);
  }, [readNotifIds]);

  const refreshAllData = useCallback(async () => {
    if (!token) return;

    if (isDemoToken(token)) {
      populateFromLocalStorage();
      return;
    }

    try {
      const [meRes, subRes, taskRes, schRes, goalRes, noteRes, examRes, asgRes, pomRes, strRes] = await Promise.all([
        apiFetch('/auth/me'),
        apiFetch('/subjects'),
        apiFetch('/tasks'),
        apiFetch('/schedules'),
        apiFetch('/goals'),
        apiFetch('/notes'),
        apiFetch('/exams'),
        apiFetch('/assignments'),
        apiFetch('/pomodorostats'),
        apiFetch('/streaks'),
      ]);
      if (meRes?.data) setUser(normalizeDoc(meRes.data));
      setSubjects((subRes.data || []).map(normalizeDoc));
      setTasks((taskRes.data || []).map(normalizeDoc));
      setSchedule((schRes.data || []).map(normalizeDoc).sort((a, b) => (a.time || '').localeCompare(b.time || '')));
      setGoals((goalRes.data || []).map(normalizeDoc));
      setNotes((noteRes.data || []).map(normalizeDoc));
      setExams((examRes.data || []).map(normalizeDoc));
      setAssignments((asgRes.data || []).map(normalizeDoc));
      if (pomRes.data?.length > 0) setPomodoroStats(normalizeDoc(pomRes.data[0]));
      if (strRes.data?.length > 0) setStreak(normalizeDoc(strRes.data[0]));
    } catch (e) {
      if (e.status === 401) {
        setUser(null);
        setToken(null);
        setRefreshToken(null);
      } else if (e.status === 405 || e.status === 503 || (e.message && e.message.includes('Backend'))) {
        console.warn('Backend unavailable, falling back to local demo state.');
        populateFromLocalStorage();
      } else {
        console.error('Error fetching data', e);
      }
    }
  }, [token, populateFromLocalStorage]);

  // Load data on user login / mount
  useEffect(() => {
    if (user && token) {
      if (isDemoToken(token)) {
        populateFromLocalStorage();
      } else {
        refreshAllData();
      }
    } else {
      setSubjects([]);
      setTasks([]);
      setSchedule([]);
      setGoals([]);
      setNotes([]);
      setExams([]);
      setAssignments([]);
      setPomodoroStats({ todaySessions: 0, totalFocusMinutes: 0, sessionLog: [] });
      setStreak({ current: 0, longest: 0, lastStudyDate: null });
    }
  }, [user?.id, token, refreshAllData, populateFromLocalStorage]);

  // Build real notifications from user's live DB records
  const notifications = (() => {
    const list = [];
    const todayStr = new Date().toISOString().slice(0, 10);
    tasks
      .filter(t => t.status !== 'Completed' && t.deadline && t.deadline <= todayStr)
      .slice(0, 3)
      .forEach(t => {
        const id = `task_${t.id}`;
        list.push({ id, message: `${t.name} is due ${t.deadline === todayStr ? 'today' : `(${t.deadline})`}`, time: 'Task reminder', read: readNotifIds.includes(id), type: 'task' });
      });
    exams
      .filter(e => e.date >= todayStr && e.prep !== 'Completed')
      .slice(0, 2)
      .forEach(e => {
        const id = `exam_${e.id}`;
        list.push({ id, message: `Upcoming exam: ${e.name} on ${e.date}`, time: e.prep, read: readNotifIds.includes(id), type: 'exam' });
      });
    if (streak.current > 0) {
      const id = `streak_${streak.current}`;
      list.push({ id, message: `You're on a ${streak.current}-day study streak!`, time: 'Active streak', read: readNotifIds.includes(id), type: 'streak' });
    }
    if (list.length === 0) {
      list.push({ id: 'welcome', message: 'Welcome to StudySync! Add subjects and tasks to get started.', time: 'Just now', read: readNotifIds.includes('welcome'), type: 'task' });
    }
    return list;
  })();

  const markNotifRead = (id) => {
    setReadNotifIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  // ===== Auth actions =====
  const applyAuthSession = (res) => {
    const normalized = normalizeDoc(res.data);
    if (res.token) localStorage.setItem('token', res.token);
    if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
    saveData('user', normalized);
    saveData('token', res.token);
    setToken(res.token);
    if (res.refreshToken) setRefreshToken(res.refreshToken);
    setUser(normalized);
    return normalized;
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      return applyAuthSession(res);
    } catch (err) {
      const isCloudOrMissingBackend =
        err.status === 405 ||
        err.status === 503 ||
        err.status === 404 ||
        (err.message && (err.message.includes('Backend') || err.message.includes('405') || err.message.includes('Method Not Allowed')));

      if (isCloudOrMissingBackend) {
        const localUser = {
          id: uid('usr'),
          name: name.trim() || 'Student',
          email: email.trim(),
          role: 'student',
        };
        const demoToken = `demo_token_${Date.now()}`;
        setToken(demoToken);
        setUser(localUser);
        saveData('token', demoToken);
        saveData('user', localUser);
        localStorage.setItem('token', demoToken);

        populateFromLocalStorage();
        showToast('Account created in Demo Mode');
        return localUser;
      }
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      return applyAuthSession(res);
    } catch (err) {
      const isCloudOrMissingBackend =
        err.status === 405 ||
        err.status === 503 ||
        err.status === 404 ||
        (err.message && (err.message.includes('Backend') || err.message.includes('405') || err.message.includes('Method Not Allowed')));

      if (isCloudOrMissingBackend || email.trim().toLowerCase() === 'demo@studysync.app') {
        const demoUser = {
          id: 'demo_user_1',
          name: email.trim().toLowerCase() === 'demo@studysync.app' ? 'Demo Student' : (email.split('@')[0] || 'Student'),
          email: email.trim(),
          role: 'student',
        };
        const demoToken = `demo_token_${Date.now()}`;
        setToken(demoToken);
        setUser(demoUser);
        saveData('token', demoToken);
        saveData('user', demoUser);
        localStorage.setItem('token', demoToken);

        populateFromLocalStorage();
        showToast('Signed in to Demo Mode (Local Storage)');
        return demoUser;
      }
      throw err;
    }
  };

  const logout = async () => {
    if (!isDemoToken(token)) {
      try { await apiFetch('/auth/logout', { method: 'POST' }); } catch {}
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    saveData('user', null);
    saveData('token', null);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  const updateProfile = async (profileData) => {
    if (isDemoToken(token)) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      saveData('user', updated);
      showToast('Profile updated locally');
      return updated;
    }
    const res = await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    const normalized = normalizeDoc(res.data);
    setUser(normalized);
    return normalized;
  };

  const forgotPassword = async (email) => {
    if (isDemoToken(token)) {
      return { success: true, message: 'Password reset instructions sent (Demo mode).' };
    }
    return apiFetch('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  const resetPassword = async (resetToken, password) => {
    if (isDemoToken(token)) {
      return { success: true, message: 'Password updated (Demo mode).' };
    }
    const res = await apiFetch(`/auth/resetpassword/${resetToken}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
    if (res.token && res.data) {
      applyAuthSession(res);
    }
    return res;
  };

  // ===== Generic CRUD factory =====
  const updateTimersRef = useRef({});
  const pendingUpdatesRef = useRef({});

  const optimisticAdd = (endpoint, setState, transformList, storageKey) => async (data) => {
    const tempId = uid('item');
    const newItem = { _id: tempId, id: tempId, ...data };
    setState(prev => {
      const next = [...prev, newItem];
      if (storageKey) saveData(storageKey, next);
      return transformList ? transformList(next) : next;
    });

    if (isDemoToken(token)) {
      showToast('Saved locally');
      return newItem;
    }

    try {
      const res = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) });
      const created = normalizeDoc(res.data);
      setState(prev => {
        const next = prev.map(item => (item._id === tempId || item.id === tempId) ? created : item);
        if (storageKey) saveData(storageKey, next);
        return transformList ? transformList(next) : next;
      });
      showToast('Saved to MongoDB');
      return created;
    } catch (e) {
      if (e.status === 405 || e.status === 503 || e.status === 404) {
        showToast('Saved locally (Offline)');
        return newItem;
      }
      setState(prev => prev.filter(item => item._id !== tempId && item.id !== tempId));
      console.error(e);
    }
  };

  const optimisticUpdate = (endpoint, setState, { debounceMs = 0, storageKey } = {}) => async (id, data) => {
    if (!id) return;
    const realId = id.toString();
    setState(prev => {
      const next = prev.map(item => (item._id === realId || item.id === realId) ? { ...item, ...data } : item);
      if (storageKey) saveData(storageKey, next);
      return next;
    });

    if (isDemoToken(token) || realId.startsWith('temp_') || realId.startsWith('item_')) {
      return;
    }

    const sendUpdate = async (payload) => {
      try {
        const res = await apiFetch(`${endpoint}/${realId}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res.data) {
          const updated = normalizeDoc(res.data);
          setState(prev => {
            const next = prev.map(item => (item._id === realId || item.id === realId) ? updated : item);
            if (storageKey) saveData(storageKey, next);
            return next;
          });
          showToast('Updated in MongoDB');
        }
      } catch (e) {
        if (e.status === 405 || e.status === 503) return;
        console.error(e);
      }
    };

    if (debounceMs > 0) {
      const key = `${endpoint}:${realId}`;
      pendingUpdatesRef.current[key] = { ...(pendingUpdatesRef.current[key] || {}), ...data };
      clearTimeout(updateTimersRef.current[key]);
      updateTimersRef.current[key] = setTimeout(() => {
        const merged = pendingUpdatesRef.current[key];
        delete pendingUpdatesRef.current[key];
        sendUpdate(merged);
      }, debounceMs);
    } else {
      await sendUpdate(data);
    }
  };

  const optimisticDelete = (endpoint, setState, storageKey) => async (id) => {
    if (!id) return;
    const realId = id.toString();
    setState(prev => {
      const next = prev.filter(item => item._id !== realId && item.id !== realId);
      if (storageKey) saveData(storageKey, next);
      return next;
    });

    if (isDemoToken(token) || realId.startsWith('temp_') || realId.startsWith('item_')) {
      showToast('Deleted locally');
      return;
    }

    try {
      await apiFetch(`${endpoint}/${realId}`, { method: 'DELETE' });
      showToast('Deleted from MongoDB');
    } catch (e) {
      if (e.status === 405 || e.status === 503) {
        showToast('Deleted locally');
        return;
      }
      console.error(e);
    }
  };

  // ===== Subjects CRUD =====
  const addSubject = optimisticAdd('/subjects', setSubjects, null, 'subjects');
  const updateSubject = optimisticUpdate('/subjects', setSubjects, { storageKey: 'subjects' });
  const deleteSubject = (id) => {
    optimisticDelete('/subjects', setSubjects, 'subjects')(id);
    const realId = id?.toString();
    setTasks(prev => {
      const next = prev.filter(t => t.subjectId !== realId);
      saveData('tasks', next);
      return next;
    });
  };

  // ===== Tasks CRUD =====
  const addTask = optimisticAdd('/tasks', setTasks, null, 'tasks');
  const updateTask = optimisticUpdate('/tasks', setTasks, { storageKey: 'tasks' });
  const deleteTask = optimisticDelete('/tasks', setTasks, 'tasks');
  const toggleTaskComplete = async (id) => {
    const realId = id?.toString();
    const task = tasks.find(t => t._id === realId || t.id === realId);
    if (task) updateTask(realId, { status: task.status === 'Completed' ? 'Pending' : 'Completed' });
  };

  // ===== Schedule CRUD =====
  const sortSchedule = (list) => [...list].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const addScheduleItem = optimisticAdd('/schedules', setSchedule, sortSchedule, 'schedule');
  const updateScheduleItem = optimisticUpdate('/schedules', setSchedule, { storageKey: 'schedule' });
  const deleteScheduleItem = optimisticDelete('/schedules', setSchedule, 'schedule');

  // ===== Goals CRUD =====
  const addGoal = optimisticAdd('/goals', setGoals, null, 'goals');
  const updateGoal = optimisticUpdate('/goals', setGoals, { debounceMs: 150, storageKey: 'goals' });
  const deleteGoal = optimisticDelete('/goals', setGoals, 'goals');

  // ===== Notes CRUD =====
  const addNote = async (data) => {
    const tempId = uid('note');
    const localDate = new Date().toISOString().slice(0, 10);
    const newNote = { _id: tempId, id: tempId, updatedAt: localDate, ...data };
    setNotes(prev => {
      const next = [newNote, ...prev];
      saveData('notes', next);
      return next;
    });

    if (isDemoToken(token)) {
      showToast('Saved note locally');
      return newNote;
    }

    try {
      const res = await apiFetch('/notes', { method: 'POST', body: JSON.stringify(data) });
      const created = normalizeDoc(res.data);
      setNotes(prev => {
        const next = prev.map(item => (item._id === tempId || item.id === tempId) ? created : item);
        saveData('notes', next);
        return next;
      });
      showToast('Saved to MongoDB');
      return created;
    } catch (e) {
      if (e.status === 405 || e.status === 503) {
        showToast('Saved note locally (Offline)');
        return newNote;
      }
      setNotes(prev => prev.filter(item => item._id !== tempId && item.id !== tempId));
      console.error(e);
    }
  };
  const updateNote = optimisticUpdate('/notes', setNotes, { storageKey: 'notes' });
  const deleteNote = optimisticDelete('/notes', setNotes, 'notes');

  // ===== Exams CRUD =====
  const addExam = optimisticAdd('/exams', setExams, null, 'exams');
  const updateExam = optimisticUpdate('/exams', setExams, { storageKey: 'exams' });
  const deleteExam = optimisticDelete('/exams', setExams, 'exams');

  // ===== Assignments CRUD =====
  const addAssignment = optimisticAdd('/assignments', setAssignments, null, 'assignments');
  const updateAssignment = optimisticUpdate('/assignments', setAssignments, { storageKey: 'assignments' });
  const deleteAssignment = optimisticDelete('/assignments', setAssignments, 'assignments');

  // ===== Pomodoro =====
  const logPomodoroSession = useCallback(async (minutes, subjectId) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nextStatsPayload = {
      todaySessions: (pomodoroStats.todaySessions || 0) + 1,
      totalFocusMinutes: (pomodoroStats.totalFocusMinutes || 0) + minutes,
      sessionLog: [...(pomodoroStats.sessionLog || []), { date: todayStr, minutes }].slice(-200),
      ...(subjectId ? { subjectId, sessionMinutes: minutes } : {}),
    };
    setPomodoroStats(prev => {
      const next = { ...prev, ...nextStatsPayload };
      saveData('pomodoroStats', next);
      return next;
    });

    if (subjectId) {
      const addHours = Number((minutes / 60).toFixed(2));
      setSubjects(prev => {
        const next = prev.map(s => s.id === subjectId ? { ...s, loggedHours: Number(((s.loggedHours || 0) + addHours).toFixed(2)) } : s);
        saveData('subjects', next);
        return next;
      });
    }

    let newCurrent = streak.current || 0;
    if (streak.lastStudyDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = streak.lastStudyDate === yesterday.toISOString().slice(0, 10);
      newCurrent = wasYesterday ? newCurrent + 1 : 1;
    } else if (newCurrent === 0) {
      newCurrent = 1;
    }

    const nextStreakPayload = {
      current: newCurrent,
      longest: Math.max(streak.longest || 0, newCurrent),
      lastStudyDate: todayStr,
    };
    setStreak(prev => {
      const next = { ...prev, ...nextStreakPayload };
      saveData('streak', next);
      return next;
    });

    if (isDemoToken(token)) return;

    try {
      const res = await apiFetch('/pomodorostats', {
        method: 'POST',
        body: JSON.stringify(nextStatsPayload),
      });
      if (res.data) setPomodoroStats(normalizeDoc(res.data));
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await apiFetch('/streaks', {
        method: 'POST',
        body: JSON.stringify(nextStreakPayload),
      });
      if (res.data) setStreak(normalizeDoc(res.data));
    } catch (e) {
      console.error(e);
    }
  }, [pomodoroStats, streak, token]);

  const seedSampleData = async () => {
    if (isDemoToken(token)) {
      populateFromLocalStorage();
      showToast('Populated study data in Local Storage');
      return;
    }
    try {
      const res = await apiFetch('/auth/seed-sample-data', { method: 'POST' });
      await refreshAllData();
      showToast('Populated full B.Tech CSE study database in MongoDB');
      return res;
    } catch (e) {
      if (e.status === 405 || e.status === 503) {
        populateFromLocalStorage();
        showToast('Populated study data in Local Storage');
        return;
      }
      console.error('Failed to seed sample data', e);
      throw e;
    }
  };

  const value = {
    user, register, login, logout, updateProfile, forgotPassword, resetPassword,
    token, isDemoMode: isDemoToken(token),
    darkMode, setDarkMode,
    sidebarOpen, setSidebarOpen,
    notifications, markNotifRead,
    subjects, addSubject, updateSubject, deleteSubject,
    tasks, addTask, updateTask, deleteTask, toggleTaskComplete,
    schedule, addScheduleItem, updateScheduleItem, deleteScheduleItem,
    goals, addGoal, updateGoal, deleteGoal,
    notes, addNote, updateNote, deleteNote,
    exams, addExam, updateExam, deleteExam,
    assignments, addAssignment, updateAssignment, deleteAssignment,
    pomodoroStats, logPomodoroSession,
    streak,
    refreshAllData,
    seedSampleData,
    showToast,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: 'var(--ink)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: '#10B981', fontSize: 16 }}>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </StudyContext.Provider>
  );
}

export const useStudy = () => useContext(StudyContext);
