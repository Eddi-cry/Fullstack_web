import { useState } from 'react';
import './StationCard.scss';
import TabAntenna from './StationCardTabs/TabAntenna';
import TabOverview from'./StationCardTabs/TabOverview';
import TabPhoto from'./StationCardTabs/TabPhoto';
import TabReceiver from './StationCardTabs/TabReceiver';


function StationCard({ station }) {
  const [tab, setTab] = useState('overview');
  
  let content;
  if (tab === 'overview') content = <TabOverview station={station} />;
  else if (tab === 'antenna') content = <TabAntenna station={station} />;
  else if (tab === 'receiver') content = <TabReceiver station={station} />;
  else if (tab === 'photo') content = <TabPhoto station={station} />;
  
  return (
    <>
      <div className="cards__station">
        <div className="cards__station-container">
          <div className="cards__station-links">
            <button onClick={() => setTab('overview')} className="button cards__station-link">Информация</button>
            <button onClick={() => setTab('antenna')} className="button cards__station-link">Антенна</button>
            <button onClick={() => setTab('receiver')} className="button cards__station-link">Приемник</button>
            <button onClick={() => setTab('photo')} className="button cards__station-link">Фото</button>
          </div>
          <h3 className="cards__station__title"><strong>{station.Name.toUpperCase()}</strong></h3>
          {content}
        </div>
      </div>
    </>
  );
}

export default StationCard;