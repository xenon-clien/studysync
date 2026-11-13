import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { loadData, saveData, uid } from '../utils/storage';
import { apiFetch } from '../utils/api';

const StudyContext = createContext();

const normalizeDoc = (doc) => {
  if (!doc || typeof doc !== 'object') return doc;
  return { ...doc, id: doc.id || doc._id };
};

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

  useEffect(() => {
    saveData('readNotifs', readNotifIds);
  }, [readNotifIds]);

  const refreshAllData = useCallback(async () => {
    if (!token) return;
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
      } else {
        console.error('Error fetching data', e);
      }
    }
  }, [token]);

  // Load data on user login / mount
  useEffect(() => {
    if (user && token) {
      refreshAllData();
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
  }, [user?.id, token, refreshAllData]);

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
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    });
    return applyAuthSession(res);
  };

  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    return applyAuthSession(res);
  };

  const logout = async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    saveData('user', null);
    saveData('token', null);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  const updateProfile = async (profileData) => {
    const res = await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    const normalized = normalizeDoc(res.data);
    setUser(normalized);
    return normalized;
  };

  const forgotPassword = async (email) => {
    return apiFetch('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  const resetPassword = async (resetToken, password) => {
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

  const optimisticAdd = (endpoint, setState, transformList) => async (data) => {
    const tempId = uid('temp');
    setState(prev => {
      const next = [...prev, { _id: tempId, id: tempId, ...data }];
      return transformList ? transformList(next) : next;
    });
    try {
      const res = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) });
      const created = normalizeDoc(res.data);
      setState(prev => {
        const next = prev.map(item => (item._id === tempId || item.id === tempId) ? created : item);
        return transformList ? transformList(next) : next;
      });
      showToast('Saved to MongoDB');
      return created;
    } catch (e) {
      setState(prev => prev.filter(item => item._id !== tempId && item.id !== tempId));
      console.error(e);
    }
  };

  const optimisticUpdate = (endpoint, setState, { debounceMs = 0 } = {}) => async (id, data) => {
    if (!id) return;
    const realId = id.toString();
    setState(prev => prev.map(item => (item._id === realId || item.id === realId) ? { ...item, ...data } : item));

    if (realId.startsWith('temp_')) return;

    const sendUpdate = async (payload) => {
      try {
        const res = await apiFetch(`${endpoint}/${realId}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res.data) {
          const updated = normalizeDoc(res.data);
          setState(prev => prev.map(item => (item._id === realId || item.id === realId) ? updated : item));
          showToast('Updated in MongoDB');
        }
      } catch (e) {
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

  const optimisticDelete = (endpoint, setState) => async (id) => {
    if (!id) return;
    const realId = id.toString();
    setState(prev => prev.filter(item => item._id !== realId && item.id !== realId));
    if (realId.startsWith('temp_')) return;
    try {
      await apiFetch(`${endpoint}/${realId}`, { method: 'DELETE' });
      showToast('Deleted from MongoDB');
    } catch (e) {
      console.error(e);
    }
  };

  // ===== Subjects CRUD =====
  const addSubject = optimisticAdd('/subjects', setSubjects);
  const updateSubject = optimisticUpdate('/subjects', setSubjects);
  const deleteSubject = (id) => {
    optimisticDelete('/subjects', setSubjects)(id);
    const realId = id?.toString();
    setTasks(prev => prev.filter(t => t.subjectId !== realId));
  };

  // ===== Tasks CRUD =====
  const addTask = optimisticAdd('/tasks', setTasks);
  const updateTask = optimisticUpdate('/tasks', setTasks);
  const deleteTask = optimisticDelete('/tasks', setTasks);
  const toggleTaskComplete = async (id) => {
    const realId = id?.toString();
    const task = tasks.find(t => t._id === realId || t.id === realId);
    if (task) updateTask(realId, { status: task.status === 'Completed' ? 'Pending' : 'Completed' });
  };

  // ===== Schedule CRUD =====
  const sortSchedule = (list) => [...list].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const addScheduleItem = optimisticAdd('/schedules', setSchedule, sortSchedule);
  const updateScheduleItem = optimisticUpdate('/schedules', setSchedule);
  const deleteScheduleItem = optimisticDelete('/schedules', setSchedule);

  // ===== Goals CRUD =====
  const addGoal = optimisticAdd('/goals', setGoals);
  const updateGoal = optimisticUpdate('/goals', setGoals, { debounceMs: 150 });
  const deleteGoal = optimisticDelete('/goals', setGoals);

  // ===== Notes CRUD =====
  const addNote = async (data) => {
    const tempId = uid('temp');
    const localDate = new Date().toISOString().slice(0, 10);
    setNotes(prev => [{ _id: tempId, id: tempId, updatedAt: localDate, ...data }, ...prev]);
    try {
      const res = await apiFetch('/notes', { method: 'POST', body: JSON.stringify(data) });
      const created = normalizeDoc(res.data);
      setNotes(prev => prev.map(item => (item._id === tempId || item.id === tempId) ? created : item));
      showToast('Saved to MongoDB');
      return created;
    } catch (e) {
      setNotes(prev => prev.filter(item => item._id !== tempId && item.id !== tempId));
      console.error(e);
    }
  };
  const updateNote = optimisticUpdate('/notes', setNotes);
  const deleteNote = optimisticDelete('/notes', setNotes);

  // ===== Exams CRUD =====
  const addExam = optimisticAdd('/exams', setExams);
  const updateExam = optimisticUpdate('/exams', setExams);
  const deleteExam = optimisticDelete('/exams', setExams);

  // ===== Assignments CRUD =====
  const addAssignment = optimisticAdd('/assignments', setAssignments);
  const updateAssignment = optimisticUpdate('/assignments', setAssignments);
  const deleteAssignment = optimisticDelete('/assignments', setAssignments);

  // ===== Pomodoro =====
  const logPomodoroSession = useCallback(async (minutes, subjectId) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nextStatsPayload = {
      todaySessions: (pomodoroStats.todaySessions || 0) + 1,
      totalFocusMinutes: (pomodoroStats.totalFocusMinutes || 0) + minutes,
      sessionLog: [...(pomodoroStats.sessionLog || []), { date: todayStr, minutes }].slice(-200),
      ...(subjectId ? { subjectId, sessionMinutes: minutes } : {}),
    };
    setPomodoroStats(prev => ({ ...prev, ...nextStatsPayload }));

    if (subjectId) {
      const addHours = Number((minutes / 60).toFixed(2));
      setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, loggedHours: Number(((s.loggedHours || 0) + addHours).toFixed(2)) } : s));
    }

    try {
      const res = await apiFetch('/pomodorostats', {
        method: 'POST',
        body: JSON.stringify(nextStatsPayload),
      });
      if (res.data) setPomodoroStats(normalizeDoc(res.data));
    } catch (e) {
      console.error(e);
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
    setStreak(prev => ({ ...prev, ...nextStreakPayload }));

    try {
      const res = await apiFetch('/streaks', {
        method: 'POST',
        body: JSON.stringify(nextStreakPayload),
      });
      if (res.data) setStreak(normalizeDoc(res.data));
    } catch (e) {
      console.error(e);
    }
  }, [pomodoroStats, streak]);

  const seedSampleData = async () => {
    try {
      const res = await apiFetch('/auth/seed-sample-data', { method: 'POST' });
      await refreshAllData();
      showToast('Populated full B.Tech CSE study database in MongoDB');
      return res;
    } catch (e) {
      console.error('Failed to seed sample data', e);
      throw e;
    }
  };

  const value = {
    user, register, login, logout, updateProfile, forgotPassword, resetPassword,
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
