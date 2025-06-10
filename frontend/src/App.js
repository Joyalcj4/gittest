import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, { text: newTodo });
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        text: editText
      });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={!newTodo.trim()}
        >
          <FiPlus size={20} />
        </button>
      </form>

      <div className="todo-list">
        {todos.map((todo) => (
          <div 
            key={todo._id} 
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            {editingId === todo._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                  autoFocus
                />
                <div className="edit-buttons">
                  <button 
                    className="save-button"
                    onClick={() => saveEdit(todo._id)}
                  >
                    <FiCheck size={18} />
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={cancelEditing}
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span 
                  className="todo-text"
                  onClick={() => toggleTodo(todo._id)}
                >
                  {todo.text}
                </span>
                <div className="todo-buttons">
                  <button 
                    className="edit-button"
                    onClick={() => startEditing(todo)}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 