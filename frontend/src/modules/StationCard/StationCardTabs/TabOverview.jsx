function TabOverview({ station }) {
    return (
      <>
        <p className="cards__station__description"><strong>Местоположение</strong>: {station.Region}</p>
        {station.Latitude && <p className="cards__station__description"><strong>Широта:</strong> {station.Latitude}</p>}
        {station.Longitude && <p className="cards__station__description"><strong>Долгота:</strong> {station.Longitude}</p>}
        {station.Height && <p className="cards__station__description"><strong>Высота:</strong> {station.Height}</p>}
        {station.Clock && <h4 className="cards__station__subtitle">Часы</h4>}
        {station.Clock.Type && <p className="cards__station__description"><strong>Тип:</strong> {station.Clock.Type}</p>}
        {station.Clock.InputFrequency && <p className="cards__station__description"><strong>Входная частота:</strong> {station.Clock.InputFrequency}</p>}
        {station.Clock.EffectiveDates && <p className="cards__station__description"><strong>Дата эффективной работы (Effective dates):</strong> {station.Clock.EffectiveDates}</p>}
      </>
    );
  }
  
export default TabOverview;