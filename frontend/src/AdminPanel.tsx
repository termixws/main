import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Master, Service } from './types';

// Порт 8001 из docker-compose, плюс префикс /api из server.py
const API_URL = 'http://localhost:8001/api';

const AdminPanel = () => {
    // --- Состояние для списков ---
    const [masters, setMasters] = useState<Master[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    // --- Состояние для формы Мастера ---
    const [masterForm, setMasterForm] = useState({
        name: '',
        sex: 'female', // Значение по умолчанию
        phone: '',
        experience: 0,
        specialty: ''
    });

    // --- Состояние для формы Услуги ---
    const [serviceForm, setServiceForm] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 60 // Значение по умолчанию (минуты)
    });

    // Загрузка данных
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const resMasters = await axios.get(`${API_URL}/masters/`);
            setMasters(resMasters.data);
            
            const resServices = await axios.get(`${API_URL}/services/`);
            setServices(resServices.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    };

    // --- Обработчик создания Мастера ---
    const handleAddMaster = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/masters/`, masterForm);
            alert('Мастер добавлен!');
            // Сброс формы
            setMasterForm({ name: '', sex: 'female', phone: '', experience: 0, specialty: '' });
            fetchData();
        } catch (error: any) {
            alert('Ошибка добавления мастера. Проверьте консоль (возможно дубликат телефона).');
            console.error(error.response?.data || error);
        }
    };

    // --- Обработчик создания Услуги ---
    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/services/`, serviceForm);
            alert('Услуга добавлена!');
            // Сброс формы
            setServiceForm({ name: '', description: '', price: 0, duration: 60 });
            fetchData();
        } catch (error: any) {
            alert('Ошибка добавления услуги. Проверьте консоль.');
            console.error(error.response?.data || error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Панель администратора (Salon Natasha)</h1>

            {/* --- БЛОК МАСТЕРОВ --- */}
            <div style={styles.card}>
                <h2>Добавить Мастера</h2>
                <form onSubmit={handleAddMaster} style={styles.form}>
                    <input 
                        placeholder="Имя" 
                        value={masterForm.name}
                        onChange={e => setMasterForm({...masterForm, name: e.target.value})}
                        required 
                    />
                    <select 
                        value={masterForm.sex}
                        onChange={e => setMasterForm({...masterForm, sex: e.target.value})}
                    >
                        <option value="female">Женский</option>
                        <option value="male">Мужской</option>
                    </select>
                    <input 
                        placeholder="Телефон" 
                        value={masterForm.phone}
                        onChange={e => setMasterForm({...masterForm, phone: e.target.value})}
                        required 
                    />
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <label>Опыт (лет):</label>
                        <input 
                            type="number"
                            value={masterForm.experience}
                            onChange={e => setMasterForm({...masterForm, experience: Number(e.target.value)})}
                            required 
                        />
                    </div>
                    <input 
                        placeholder="Специальность" 
                        value={masterForm.specialty}
                        onChange={e => setMasterForm({...masterForm, specialty: e.target.value})}
                        required 
                    />
                    <button type="submit" style={styles.button}>Сохранить Мастера</button>
                </form>

                <h3>Список мастеров:</h3>
                <ul>
                    {masters.map((m) => (
                        <li key={m.id}>
                            <b>{m.name}</b> ({m.sex}) — {m.specialty}. Тел: {m.phone}. Опыт: {m.experience} лет.
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- БЛОК УСЛУГ --- */}
            <div style={styles.card}>
                <h2>Добавить Услугу</h2>
                <form onSubmit={handleAddService} style={styles.form}>
                    <input 
                        placeholder="Название услуги" 
                        value={serviceForm.name}
                        onChange={e => setServiceForm({...serviceForm, name: e.target.value})}
                        required 
                    />
                    <input 
                        placeholder="Описание" 
                        value={serviceForm.description}
                        onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                        required 
                    />
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <label>Цена (₽):</label>
                        <input 
                            type="number"
                            value={serviceForm.price}
                            onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})}
                            required 
                        />
                    </div>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <label>Длительность (мин):</label>
                        <input 
                            type="number"
                            value={serviceForm.duration}
                            onChange={e => setServiceForm({...serviceForm, duration: Number(e.target.value)})}
                            required 
                        />
                    </div>
                    <button type="submit" style={styles.button}>Сохранить Услугу</button>
                </form>

                <h3>Список услуг:</h3>
                <ul>
                    {services.map((s) => (
                        <li key={s.id}>
                            <b>{s.name}</b> — {s.price} ₽ ({s.duration} мин). <br/>
                            <small>{s.description}</small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Простые стили
const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '10px',
        maxWidth: '400px'
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default AdminPanel;