import './Button.scss'

function Button({ type = "button", aim, content}) {
  return (
    <>
      <button type={type} className={`button ${aim}__button`}>
        {content}
      </button>
    </>
  );
}

export default Button;