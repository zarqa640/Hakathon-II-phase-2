/**
 * Task Context for the Todo Application
 *
 * This module provides task state management for the frontend.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types
interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentTask: Task | null;
}

interface TaskAction {
  type: string;
  payload?: any;
}

interface TaskContextType {
  state: TaskState;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  setCurrentTask: (task: Task | null) => void;
  fetchTasks: () => void;
  toggleTaskCompletion: (id: number) => void;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  currentTask: null,
};

// Task reducer
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'TASKS_FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'TASKS_FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        error: null,
      };
    case 'TASKS_FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_TASK_COMPLETION':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, is_completed: action.payload.is_completed }
            : task
        ),
      };
    case 'SET_CURRENT_TASK':
      return {
        ...state,
        currentTask: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks from API
  const fetchTasks = async () => {
    dispatch({ type: 'TASKS_FETCH_START' });

    try {
      // In a real app, you would fetch from your API
      // const response = await fetch('/api/tasks');
      // const tasks = await response.json();

      // For now, we'll just dispatch success with empty array
      dispatch({ type: 'TASKS_FETCH_SUCCESS', payload: [] });
    } catch (error: any) {
      dispatch({
        type: 'TASKS_FETCH_ERROR',
        payload: error.message || 'Failed to fetch tasks',
      });
    }
  };

  // Add a new task
  const addTask = (task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  // Update an existing task
  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  // Delete a task
  const deleteTask = (id: number) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: number) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, is_completed: !task.is_completed };
      dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: { id, is_completed: !task.is_completed } });
    }
  };

  // Set current task
  const setCurrentTask = (task: Task | null) => {
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  };

  // Load tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, []);

  const value = {
    state,
    addTask,
    updateTask,
    deleteTask,
    setCurrentTask,
    fetchTasks,
    toggleTaskCompletion,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};