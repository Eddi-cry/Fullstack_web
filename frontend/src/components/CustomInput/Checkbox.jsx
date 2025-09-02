import './CustomInput.scss';

function Checkbox({checked, onChange, content}) {

  return(
    <>
      <label className="label-checkbox">
        <input 
          type="checkbox"
          className="input-checkbox" 
          checked={checked}
          onChange={onChange}
          />
        {content}
      </label>
    </>
  );
}

export default Checkbox;