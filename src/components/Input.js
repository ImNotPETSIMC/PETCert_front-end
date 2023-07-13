export const Input = (props) => {

  return (
    <div className="input-container">
      <input type="text" name={props.value} id={props.value} placeholder={props.name} onChange={props.fn} />
      <label htmlFor={props.value}>{props.name.toUpperCase()}</label>
    </div>
  );
};

export default Input;