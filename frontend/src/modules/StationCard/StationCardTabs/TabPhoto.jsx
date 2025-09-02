import './TabPhoto.scss'
import { useEffect, useState } from 'react';

const mobj = import.meta.glob('../../../assets/receivers/mobj/*.{jpg,JPG,png,svg}', { eager: true });
const mobk = import.meta.glob('../../../assets/receivers/mobk/*.{jpg,JPG,png,svg}', { eager: true });
const yssk = import.meta.glob('../../../assets/receivers/yssk/*.{jpg,JPG,png,svg}', { eager: true });

const stationPhotos = {
  mobj: Object.values(mobj).map((mod) => mod.default),
  mobk: Object.values(mobk).map((mod) => mod.default),
  yssk: Object.values(yssk).map((mod) => mod.default),
};

function TabPhoto({ station }) {
  const photos = stationPhotos[station.Name.toLowerCase()] || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [station]);

  if (photos.length === 0) return <div className='cards__station--warning'>Пока нет фото для этой станции</div>;

  const prev = () => setCurrent((current - 1 + photos.length) % photos.length);
  const next = () => setCurrent((current + 1) % photos.length);

  return (
    <>
      <div className="cards__station__slider">
        {photos.length !== 1 && <img src="src/assets/icon-slide-left.png" className="cards__station__button" onClick={prev} alt="" width="40" height="40" />}
        <img className="cards__station__photo" src={photos[current]} alt={`Фото ${current + 1}`} style={{ maxWidth: '75%'}}/>
        {photos.length !== 1 && <img src="src/assets/icon-slide-right.png" className="cards__station__button" onClick={next} alt="" width="40" height="40"/>}
      </div>
      {photos.length !== 1 && <div className="cards__station__counter" >{current + 1} / {photos.length}</div>}
    </>
  );
}

export default TabPhoto;