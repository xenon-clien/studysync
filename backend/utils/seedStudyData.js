const Subject = require('../models/Subject');
const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const Goal = require('../models/Goal');
const Note = require('../models/Note');
const Exam = require('../models/Exam');
const Assignment = require('../models/Assignment');
const PomodoroStats = require('../models/PomodoroStats');
const Streak = require('../models/Streak');

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

/**
 * Seeds a comprehensive, fully realistic academic B.Tech CSE study dataset
 * for a specific user. Dynamic dates ensure Daily Planner and Dashboard are ALWAYS
 * populated with today's and upcoming blocks.
 */
async function seedFullStudyDataForUser(userId, { overwrite = true } = {}) {
  if (overwrite) {
    await Promise.all([
      Subject.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      Schedule.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      Note.deleteMany({ userId }),
      Exam.deleteMany({ userId }),
      Assignment.deleteMany({ userId }),
      PomodoroStats.deleteMany({ userId }),
      Streak.deleteMany({ userId }),
    ]);
  }

  // 1. Subjects
  const [ml, discrete, dbms, os, cn, cd, daa] = await Subject.create([
    { userId, name: 'Machine Learning', color: '#7A9B76', goalHours: 45, loggedHours: 28 },
    { userId, name: 'Discrete Mathematical Structures', color: '#5B7B9A', goalHours: 40, loggedHours: 30 },
    { userId, name: 'Database Management Systems', color: '#E8A33D', goalHours: 35, loggedHours: 24 },
    { userId, name: 'Operating Systems', color: '#D97757', goalHours: 35, loggedHours: 20 },
    { userId, name: 'Computer Networks', color: '#8B5CF6', goalHours: 30, loggedHours: 16 },
    { userId, name: 'Compiler Design', color: '#0EA5E9', goalHours: 30, loggedHours: 14 },
    { userId, name: 'Design & Analysis of Algorithms', color: '#10B981', goalHours: 40, loggedHours: 32 },
  ]);

  // 2. Tasks
  await Task.create([
    { userId, name: 'Supervised Learning: Gradient Descent & Loss Optimization', subjectId: ml._id, priority: 'High', deadline: addDays(0), estHours: 2.5, status: 'Pending' },
    { userId, name: 'Solve 10 Graph Theory & Handshaking Lemma PYQs', subjectId: discrete._id, priority: 'High', deadline: addDays(1), estHours: 2, status: 'Pending' },
    { userId, name: 'Simulate Round Robin & Shortest Job First CPU Scheduling in C', subjectId: os._id, priority: 'High', deadline: addDays(2), estHours: 3, status: 'Pending' },
    { userId, name: 'Construct LR(1) and LALR Parsing Tables & First/Follow sets', subjectId: cd._id, priority: 'Medium', deadline: addDays(3), estHours: 2, status: 'Pending' },
    { userId, name: 'Solve SQL Joins, Nested Subqueries & BCNF Decomposition questions', subjectId: dbms._id, priority: 'Medium', deadline: addDays(2), estHours: 2.5, status: 'Pending' },
    { userId, name: 'Calculate Subnet Masks & CIDR IP Addressing Numerical Problems', subjectId: cn._id, priority: 'Medium', deadline: addDays(4), estHours: 1.5, status: 'Pending' },
    { userId, name: 'Implement Dynamic Programming: 0/1 Knapsack & LCS Algorithm', subjectId: daa._id, priority: 'High', deadline: addDays(1), estHours: 2.5, status: 'Pending' },
    { userId, name: 'Revise K-Means Clustering & PCA Dimensionality Reduction', subjectId: ml._id, priority: 'Medium', deadline: addDays(5), estHours: 2, status: 'Pending' },
    { userId, name: 'Solved B-Tree and B+ Tree Indexing Numerical Problems', subjectId: dbms._id, priority: 'Medium', deadline: addDays(-1), estHours: 2, status: 'Completed' },
    { userId, name: 'Implemented Binary Search Tree & AVL Tree Rotations', subjectId: daa._id, priority: 'Medium', deadline: addDays(-2), estHours: 3, status: 'Completed' },
    { userId, name: 'Virtual Memory & FIFO vs LRU Page Replacement Simulations', subjectId: os._id, priority: 'Low', deadline: addDays(-1), estHours: 1.5, status: 'Completed' },
    { userId, name: 'Verified Chomsky Hierarchy & Regular Expressions in Lex', subjectId: cd._id, priority: 'Low', deadline: addDays(-3), estHours: 1, status: 'Completed' },
  ]);

  // 3. Daily Planner (Schedule) - Today, Tomorrow, Day After Tomorrow
  const todayStr = addDays(0);
  const tomorrowStr = addDays(1);
  const dayAfterStr = addDays(2);

  await Schedule.create([
    { userId, date: todayStr, time: '09:00', title: 'Machine Learning - Cost Functions & Gradient Descent', subject: 'Machine Learning', duration: 90 },
    { userId, date: todayStr, time: '11:00', title: 'Discrete Structures - Graph Theory & Euler Paths', subject: 'Discrete Mathematical Structures', duration: 90 },
    { userId, date: todayStr, time: '14:00', title: 'Operating Systems - Virtual Memory & Page Faults', subject: 'Operating Systems', duration: 90 },
    { userId, date: todayStr, time: '16:30', title: 'Compiler Design - Predictive LL(1) Parser Implementation', subject: 'Compiler Design', duration: 60 },
    { userId, date: todayStr, time: '19:00', title: 'DBMS - Normalization & BCNF Decomposition Practice', subject: 'Database Management Systems', duration: 90 },
    { userId, date: tomorrowStr, time: '09:30', title: 'Computer Networks - TCP 3-Way Handshake & Flow Control', subject: 'Computer Networks', duration: 90 },
    { userId, date: tomorrowStr, time: '14:00', title: 'DAA - Dijkstra Shortest Path & Prim MST Algorithm', subject: 'Design & Analysis of Algorithms', duration: 90 },
    { userId, date: dayAfterStr, time: '10:00', title: 'Machine Learning - Support Vector Machines & Kernels', subject: 'Machine Learning', duration: 90 },
  ]);

  // 4. Goals
  await Goal.create([
    { userId, name: 'Score 90%+ in Sem 5 ETT Theory Examination', targetDate: addDays(30), progress: 75, subjectId: ml._id },
    { userId, name: 'Master Core DAA & Dynamic Programming Patterns', targetDate: addDays(45), progress: 80, subjectId: daa._id },
    { userId, name: 'Complete All 5 Units of Discrete Mathematics PYQs', targetDate: addDays(20), progress: 65, subjectId: discrete._id },
    { userId, name: 'Build End-to-End Deep Learning Classification API', targetDate: addDays(40), progress: 45, subjectId: ml._id },
    { userId, name: 'Master SQL Complex Queries, Indexing & ACID Transactions', targetDate: addDays(15), progress: 85, subjectId: dbms._id },
    { userId, name: 'Simulate OS Deadlock Detection & Banker Algorithm in C', targetDate: addDays(25), progress: 60, subjectId: os._id },
  ]);

  // 5. Assignments
  await Assignment.create([
    { userId, title: 'ML Lab 3: Implement Logistic Regression from scratch with NumPy', subjectId: ml._id, dueDate: addDays(3), priority: 'High', status: 'Pending' },
    { userId, title: 'Discrete Maths: Propositional Logic & Mathematical Induction Problem Set', subjectId: discrete._id, dueDate: addDays(2), priority: 'High', status: 'Pending' },
    { userId, title: 'OS Assignment 2: Multi-threading & Semaphore Synchronization in C', subjectId: os._id, dueDate: addDays(5), priority: 'Medium', status: 'Pending' },
    { userId, title: 'DBMS Project: Hospital Management System ER Model & Normalized Schema', subjectId: dbms._id, dueDate: addDays(7), priority: 'High', status: 'Pending' },
    { userId, title: 'Compiler Design Lab: Write Lex/Flex scanner for C language tokens', subjectId: cd._id, dueDate: addDays(4), priority: 'Medium', status: 'Pending' },
    { userId, title: 'CN Numerical Assignment: Go-Back-N & Selective Repeat ARQ window size', subjectId: cn._id, dueDate: addDays(-1), priority: 'Low', status: 'Completed' },
    { userId, title: 'DAA Lab: Quicksort vs Mergesort empirical benchmark comparison report', subjectId: daa._id, dueDate: addDays(-2), priority: 'Medium', status: 'Completed' },
  ]);

  // 6. Exams
  await Exam.create([
    { userId, name: 'Machine Learning End Term Test (ETT - 60 Marks)', subjectId: ml._id, date: addDays(15), prep: 'In Progress' },
    { userId, name: 'Discrete Structures Mid Term Test', subjectId: discrete._id, date: addDays(6), prep: 'In Progress' },
    { userId, name: 'Operating Systems Theory External Exam', subjectId: os._id, date: addDays(22), prep: 'Not Started' },
    { userId, name: 'DBMS Lab Practical & Viva Voce', subjectId: dbms._id, date: addDays(12), prep: 'In Progress' },
    { userId, name: 'Computer Networks Theory Examination', subjectId: cn._id, date: addDays(28), prep: 'Not Started' },
    { userId, name: 'Compiler Design Internal Assessment', subjectId: cd._id, date: addDays(-3), prep: 'Completed' },
  ]);

  // 7. Notes
  await Note.create([
    {
      userId,
      title: 'Machine Learning Units 1–5 Comprehensive Formula & Concept Sheet',
      subject: 'Machine Learning',
      content: `1. Supervised Learning:
   - Linear Regression Hypothesis: h_theta(x) = theta^T * x
   - Mean Squared Error (MSE) Cost Function: J(theta) = (1/2m) * sum((h_theta(x_i) - y_i)^2)
   - Gradient Descent Update: theta_j := theta_j - alpha * (1/m) * sum((h_theta(x) - y) * x_j)
   - Logistic Regression: g(z) = 1 / (1 + e^-z) (Sigmoid activation)
   - Cross-Entropy Loss: -[y*log(h) + (1-y)*log(1-h)]

2. Model Evaluation Metrics:
   - Accuracy = (TP + TN) / (TP + TN + FP + FN)
   - Precision = TP / (TP + FP) (Focus on false positives)
   - Recall = TP / (TP + FN) (Focus on false negatives / sensitivity)
   - F1-Score = 2 * (Precision * Recall) / (Precision + Recall)

3. Overfitting vs Underfitting:
   - High Bias = Underfitting (Model too simple) -> Add polynomial features, decrease regularization
   - High Variance = Overfitting (Model memorizes noise) -> More training data, L1/L2 Regularization, Dropout`,
    },
    {
      userId,
      title: 'Discrete Structures Graph Theory & Tree Traversals Cheat Sheet',
      subject: 'Discrete Mathematical Structures',
      content: `1. Graph Fundamentals:
   - Handshaking Theorem: Sum of degrees of all vertices = 2 * |E|.
   - An undirected graph has an even number of vertices of odd degree.
   - Euler Circuit: Exists iff every vertex has even degree.
   - Euler Path: Exists iff exactly 0 or 2 vertices have odd degree.
   - Hamiltonian Path/Circuit: Visits every vertex exactly once (NP-Complete).

2. Trees & Planar Graphs:
   - A tree with n vertices always has exactly (n - 1) edges.
   - Euler's Planar Formula: V - E + F = 2 (where F is number of regions/faces).
   - Kuratowski's Theorem: A graph is planar iff it contains no subgraph homeomorphic to K5 or K3,3.

3. Recurrence Relations:
   - Master Theorem: T(n) = a*T(n/b) + O(n^d)
     * If d < log_b(a) -> O(n^(log_b(a)))
     * If d = log_b(a) -> O(n^d * log n)
     * If d > log_b(a) -> O(n^d)`,
    },
    {
      userId,
      title: 'Operating Systems Virtual Memory & CPU Scheduling Summary',
      subject: 'Operating Systems',
      content: `1. CPU Scheduling Algorithms:
   - FCFS (First Come First Served): Non-preemptive, suffers from Convoy Effect.
   - SJF (Shortest Job First): Optimal average waiting time; requires burst time estimation.
   - Round Robin (RR): Time quantum q. If q is too small, high context-switch overhead; if too large, behaves like FCFS.

2. Process Synchronization:
   - Critical Section Problem conditions: Mutual Exclusion, Progress, Bounded Waiting.
   - Counting Semaphore vs Binary Semaphore (Mutex).
   - wait(S) / P(S): while (S <= 0); S--;
   - signal(S) / V(S): S++;

3. Virtual Memory & Paging:
   - Page Fault occurs when referenced page is not in physical RAM (valid-invalid bit is 0).
   - Belady's Anomaly: FIFO page replacement can cause MORE page faults with MORE page frames.
   - LRU (Least Recently Used) and Optimal (OPT) do NOT suffer from Belady's anomaly (Stack algorithms).`,
    },
    {
      userId,
      title: 'DBMS 1NF to BCNF Normalization Rules & Decomposition Guide',
      subject: 'Database Management Systems',
      content: `1. Normal Forms Hierarchy:
   - 1NF: Every attribute must contain only atomic (indivisible) values. No repeating groups.
   - 2NF: Must be in 1NF AND no Partial Functional Dependency (no non-prime attribute depends on a proper subset of candidate key).
   - 3NF: Must be in 2NF AND no Transitive Dependency. For every non-trivial X -> Y, either X is a Superkey OR Y is a Prime attribute.
   - BCNF (Boyce-Codd NF): Strictly for every non-trivial X -> Y, X MUST be a Superkey.

2. ACID Properties:
   - Atomicity (All or nothing) -> Handled by Transaction / Undo Log
   - Consistency (DB invariants preserved)
   - Isolation (Concurrent transactions do not interfere) -> Handled by Concurrency Control (2PL, Timestamping)
   - Durability (Committed changes survive system crash) -> Handled by Write-Ahead Logging (WAL / Redo Log)`,
    },
  ]);

  // 8. Pomodoro Stats & Streak
  await PomodoroStats.create({
    userId,
    todaySessions: 5,
    totalFocusMinutes: 2750,
    sessionLog: [
      { date: addDays(-4), minutes: 90 },
      { date: addDays(-3), minutes: 120 },
      { date: addDays(-2), minutes: 150 },
      { date: addDays(-1), minutes: 180 },
      { date: todayStr, minutes: 210 },
    ],
  });

  await Streak.create({
    userId,
    current: 15,
    longest: 32,
    lastStudyDate: todayStr,
  });

  return {
    subjects: 7,
    tasks: 12,
    schedules: 8,
    goals: 6,
    assignments: 7,
    exams: 6,
    notes: 4,
  };
}

module.exports = {
  seedFullStudyDataForUser,
  addDays,
  iso,
};
