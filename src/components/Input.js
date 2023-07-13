export const Input = (props) => {
  const aux = String(props.name).replace(" ", "_");
  const id = String(aux).toLowerCase();

  return (
    <div className="input-container" key={id}>
      <input type="text" name={id} id={id} placeholder={props.name} onChange={props.fn} />
      <label htmlFor={id}>{props.name.toUpperCase()}</label>
    </div>
  );
};

export default Input;