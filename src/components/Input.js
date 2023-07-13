export const Input = (props) => {

  return (
    <div className="input-container">
      <input type="text" name={props.value} id={props.value} placeholder={props.name} onChange={props.fn} />
      <label htmlFor={props.value}>{props.name.toUpperCase()}<div className="info-container"><p>{props.info}</p></div></label>
    </div>
  );
};

export default Input;