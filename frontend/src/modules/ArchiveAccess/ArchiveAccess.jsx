// ArchiveAccess.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArchiveAccess.scss';
import { allStationNames } from '@constants/constants';
import Checkbox from '@components/CustomInput/Checkbox';
import Button from '@components/Button/Button';

function Stations() {
  const navigate = useNavigate();

  // Состояния формы
  const [selectedStations, setSelectedStations] = useState([]);
  const allSelected = selectedStations.length === allStationNames.length;
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-02');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Данные и ошибки
  const [results, setResults] = useState(null);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [error, setError] = useState(null);

  // Состояние пользователя
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Проверка: можно ли скачивать?
  const canDownload = () => {
    return user && user.is_active;
  };

  // Получение профиля пользователя
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        const response = await fetch('api/users/me/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          setUser(null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Обработчики формы
  const handleStationChange = (station) => {
    setSelectedStations((prev) =>
      prev.includes(station)
        ? prev.filter((s) => s !== station)
        : [...prev, station]
    );
  };

  const handleSelectAll = () => {
    setSelectedStations(allSelected ? [] : allStationNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStations.length === 0) {
      setError('Выберите хотя бы одну станцию');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const token = localStorage.getItem('access');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('api/stations/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          stations: selectedStations,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      console.log('Данные получены:', data);
    } catch (err) {
      console.error('Ошибка при запросе данных:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Для скачивания данных необходимо зарегистрироваться и войти в аккаунт');
      return;
    }

    if (!user.is_active) {
      setError('Для скачивания данных необходимо активировать учётную запись. Проверьте почту.');
      return;
    }

    if (selectedStations.length === 0) {
      setError('Выберите хотя бы одну станцию');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch('api/download/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({
          stations: selectedStations,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }

      const data = await response.json();
      console.log('Архив создан:', data);

      // 🔽 Скачиваем архив напрямую по URL
      const fileResponse = await fetch(data.download_url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      if (!fileResponse.ok) {
        throw new Error(`Ошибка скачивания: ${fileResponse.status}`);
      }

      const blob = await fileResponse.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = data.archive_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setDownloadInfo(data);
    } catch (err) {
      console.error('Ошибка при скачивании:', err);
      setError(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setSelectedStations([]);
    setStartDate('2024-01-01');
    setEndDate('2024-01-02');
    setResults(null);
    setDownloadInfo(null);
    setError(null);
  };

  if (loadingUser) {
    return <div className="stations">Загрузка профиля...</div>;
  }

  return (
    <section className="stations">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="stations__container">
          <h2 className="stations__title">Доступ к архиву данных ГНСС-наблюдений</h2>

          <div className="stations__list">
            <h3 className="stations__list-title">Список станций</h3>
            <div className="stations__list-radio">
              {allStationNames.map((station) => (
                <Checkbox
                  key={station}
                  checked={selectedStations.includes(station)}
                  onChange={() => handleStationChange(station)}
                  content={station.toUpperCase()}
                />
              ))}
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
                content="Выбрать все"
              />
            </div>
          </div>

          <div className="stations__criteria-time">
            <h3 className="stations__criteria-title">Временной запрос</h3>
            <div className="stations__criteria-inputs">
              <label className="stations__criteria-label">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="stations__criteria-input"
                  required
                />
              </label>
              <label className="stations__criteria-label">
                –
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="stations__criteria-input"
                  required
                />
              </label>
            </div>
          </div>

          <div className="stations__buttons">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || !canDownload()}
              className={`stations__download-btn ${!canDownload() ? 'stations__download-btn--disabled' : ''}`}
              title={
                !user
                  ? 'Войдите, чтобы скачать'
                  : !user.is_active
                  ? 'Подтвердите email для доступа к скачиванию'
                  : ''
              }
            >
              {isDownloading ? 'Создание архива...' : 'Скачать'}
            </button>

            <Button
              type="submit"
              aim="stations"
              disabled={isLoading}
              content={isLoading ? 'Загрузка...' : 'Посмотреть данные'}
            />
            <Button type="reset" content="Очистить" />
          </div>
        </div>
      </form>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="stations__error">
          <p>{error}</p>
        </div>
      )}

      {/* Информация о скачивании */}
      {downloadInfo && (
        <div className="stations__download-info">
          <h3>Архив успешно создан</h3>
          <p>Имя файла: {downloadInfo.archive_name}</p>
          <p>Количество файлов: {downloadInfo.file_count}</p>
          <p>Структура архива: {downloadInfo.structure}</p>
          {downloadInfo.download_url && (
            <a
              href={downloadInfo.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              Скачать архив
            </a>
          )}
        </div>
      )}

      {/* Результаты поиска */}
      {results && (
        <div className="stations__results">
          <h3>Результаты запроса:</h3>
          <div className="results-container">
            {Object.entries(results).map(([station, data]) => (
              <div key={station} className="station-results">
                <h4>Станция: {station.toUpperCase()}</h4>
                {Array.isArray(data) ? (
                  data.length > 0 ? (
                    <ul>
                      {data.map((file, index) => (
                        <li key={index}>
                          <p>Файл: {file.filename}</p>
                          <p>Дата: {file.date}</p>
                          <p>Путь: {file.path}</p>
                          <p>Полнота: {file.fullness}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Нет данных за выбранный период</p>
                  )
                ) : (
                  <p className="error-message">{data.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Stations;
