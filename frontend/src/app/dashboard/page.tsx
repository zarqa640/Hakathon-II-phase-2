'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

// Task interface
interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Initial sample tasks
const initialTasks: Task[] = [
  { id: 1, title: 'Check emails', completed: false, createdAt: new Date() },
  { id: 2, title: 'Meeting with client', completed: false, createdAt: new Date() },
  { id: 3, title: 'Buy groceries', completed: true, createdAt: new Date() },
];

export default function DashboardPage() {
  // State
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = 0; // Placeholder for now
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get upcoming tasks (not completed)
  const upcomingTasks = tasks.filter(task => !task.completed);

  // Add new task
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Toggle task completion
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Delete task
  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#1E1B4B] to-[#312E81] text-white flex flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-xl">Todo App</div>
          <nav className="space-y-2 px-4">
            {[
              "Dashboard",
              "Analytics",
              "AI Tasks",
              "Add Task",
              "Completed",
              "Pending",
              "Archived",
              "Calendar",
              "Profile",
              "Settings",
            ].map((item) => (
              <div
                key={item}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  item === "Dashboard" ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Good afternoon! 👋
            </h1>
            <p className="text-gray-500">
              Ready to conquer your day? Let&apos;s make it productive!
            </p>
          </div>

          <div className="flex gap-6 bg-white px-6 py-3 rounded-xl shadow">
            <Stat label="Complete" value={`${completionPercent}%`} />
            <Stat label="Active" value={inProgressTasks.toString()} />
            <Stat label="Tasks" value={totalTasks.toString()} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card color="from-blue-500 to-indigo-500" title="Total Tasks" value={totalTasks.toString()} />
          <Card color="from-green-500 to-emerald-500" title="Completed" value={completedTasks.toString()} />
          <Card color="from-orange-400 to-orange-600" title="In Progress" value={inProgressTasks.toString()} />
          <Card color="from-pink-500 to-fuchsia-500" title="Overdue" value={overdueTasks.toString()} />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Quick Add Task */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow">
            <h2 className="font-semibold mb-4">Quick Add Task</h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter task title..."
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleAddTask}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              + Add Task
            </button>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-indigo-600">{completionPercent}%</div>
            <p className="text-gray-500 mt-2">Progress Today</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Overdue Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold mb-4 text-red-600">Overdue Tasks</h3>
            {overdueTasks === 0 ? (
              <p className="text-sm text-gray-400">No overdue tasks 🎉</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-600">
                {/* Overdue tasks will appear here later */}
              </ul>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold mb-4 text-blue-600">Upcoming Tasks</h3>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-400">All tasks completed! 🎉</p>
            ) : (
              <ul className="space-y-2">
                {upcomingTasks.map((task) => (
                  <li
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* All Tasks Section */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4">All Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks yet. Add your first task above!</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {task.completed ? 'Completed' : 'In Progress'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

/* Helper Components */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 text-white shadow bg-gradient-to-r ${color}`}
    >
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
