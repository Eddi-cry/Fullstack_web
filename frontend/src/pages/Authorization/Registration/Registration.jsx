// Registration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@services/api'; // твой axios-инстанс
import Button from '@components/Button/Button';
import './Registration.scss';

export default function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    user_name: '',
    organization: '',
    password: '',
    password2: '',
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

    // Валидация паролей
    if (formData.password !== formData.password2) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users/register/', {
        email: formData.email,
        user_name: formData.user_name,
        organization: formData.organization,
        password: formData.password,
        password2: formData.password2,
      });
      alert('Регистрация успешна! Войдите в систему.');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.email?.[0] || 
                       err.response?.data?.user_name?.[0] || 
                       'Ошибка регистрации';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reg">
      <div className="reg__container">
        <h2 className="reg__title">Регистрация</h2>

        <form onSubmit={handleSubmit} className="reg__form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="user_name"
            placeholder="Имя пользователя"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="organization"
            placeholder="Организация"
            value={formData.organization}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password2"
            placeholder="Подтверждение пароля"
            value={formData.password2}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <Button
            type="submit"
            aim="reg"
            content={loading ? 'Регистрация...' : 'Зарегистрироваться'}
            disabled={loading}
          />
        </form>
      </div>
    </section>
  );
}
