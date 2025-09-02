import './Footer.scss'

function Footer() {
  return(
    <>
      <footer className='footer'>
        <div className="footer__container">
          <div className="footer__address">
            <h3 className="footer__title">Адрес</h3>
            <p className="footer__description">49035, обл. Калужская, г. Обнинск, пр. Ленина, 189</p>
          </div>
          <div className="footer__contacts">
            <h3 className='footer__title'>Контакты</h3>
            <p className='footer__description'>Электронная почта: 
              <a className='footer__email' href="mailto:frc@gsras.ru">frc@gsras.ru</a>
            </p>
            <p className='footer__description'>Дирекция: 
              <a href="tel:+74959126872" className='footer__tel'>+7(495)912-68-72</a>,
              <a href="tel:+74843931405" className='footer__tel'>+7(484)393-14-05</a>
            </p>
            <p className='footer__description'>Факс: 
              <a href="tel:+74843930234" className='footer__tel'>+7(484)393-02-34</a>
            </p>
            <p className='footer__description'>Служба срочных донесений (ССД):
              <a href="tel:+74959126397" className='footer__tel'>+7(495)912-63-97</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;