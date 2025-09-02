// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@services/api'; // твой axios-инстанс
import Button from '@components/Button/Button';
import './Login.scss';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/token/', {
        email: formData.email,
        password: formData.password,
      });

      // Сохраняем токены
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      // Перенаправляем
      navigate('/profile');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Неверный email или пароль';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login__container">
        <h2 className="login__title">Вход</h2>

        <form onSubmit={handleSubmit} className="login__form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <Button
            type="submit"
            aim="login"
            content={loading ? 'Вход...' : 'Войти'}
            disabled={loading}
          />
        </form>

        <div className="login__links">
          <a href="/forgot-password">Забыли пароль?</a>
          <a href="/register">Нет аккаунта? Зарегистрироваться</a>
        </div>
      </div>
    </section>
  );
}
