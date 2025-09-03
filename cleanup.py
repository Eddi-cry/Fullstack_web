import os
import logging
from datetime import datetime

# Настройки
folder_path = "/home/gpsaweb/sampleproject/fullstak_django/media"
max_size_mb = 100
log_file = "/home/gpsaweb/sampleproject/cleanup.log"

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

def cleanup_folder():
    try:
        # Проверяем существование папки
        if not os.path.exists(folder_path):
            logging.error(f"Папка {folder_path} не существует")
            return
        
        if not os.path.isdir(folder_path):
            logging.error(f"{folder_path} не является папкой")
            return

        # Получаем список файлов
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        
        # Считаем общий размер
        total_size = 0
        for file in files:
            file_path = os.path.join(folder_path, file)
            total_size += os.path.getsize(file_path)

        # Проверяем размер
        total_size_mb = total_size / (1024 * 1024)
        
        if total_size_mb > max_size_mb:
            # Удаляем все файлы
            for file in files:
                file_path = os.path.join(folder_path, file)
                os.remove(file_path)
            
            logging.info(f"Удалено {len(files)} файлов. Размер был: {total_size_mb:.1f} МБ")
        else:
            logging.info(f"Размер в норме: {total_size_mb:.1f} МБ из {max_size_mb} МБ")

    except Exception as e:
        logging.error(f"Ошибка при очистке папки: {e}")

if __name__ == "__main__":
    cleanup_folder()
