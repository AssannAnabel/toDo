import React, { useState, useEffect } from "react";
import "../styles/Task.css";

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pendiente");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:3000/task");
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const handleAddTask = async () => {
        const newTask = { title, description, status };
        try {
            await fetch('http://localhost:3000/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            setTitle('');
            setDescription('');
            setStatus('Pendiente');
            setShowModal(false);
            fetchTasks();
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await fetch(`http://localhost:3000/task/${id}`, {
                method: 'DELETE',
            });
            fetchTasks();
        } catch (error) {
            console.error('Error', error);
        }
    };

   
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    return (
        <div className="task">
            <h1>ToDo List</h1>
            <button className="add-task-btn" onClick={() => setShowModal(true)}>
                Agregar Tarea
            </button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Crear Tarea</h2>
                        <input
                            type="text"
                            placeholder="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                        <button onClick={handleAddTask}>Agregar</button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            <div className="task-list">
                {tasks.map(task => (
                    <div className="task-card" key={task.id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p><strong>Estado:</strong> {task.status}</p>
                        <p><strong>Fecha: </strong>{formatDate(task.createdAt)}</p>
                        <button className="btn-eliminar" onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Task;
