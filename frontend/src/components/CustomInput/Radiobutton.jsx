import './CustomInput.scss';

function RadioButton({ name, value, checked, onChange, content}) {

  return(
    <>
      <label className="label-radiobutton">
        <input 
          type="radio"
          className="input-radiobutton" 
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        {content}
      </label>
    </>
  );
}

export default RadioButton;