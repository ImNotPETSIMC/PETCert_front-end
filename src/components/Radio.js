const Radio = (props) => {
    const aux = String(props.name).replace(" ", "_");
    const id = String(aux).toLowerCase();
  
    return (
      <div className="radio-container">
        <input type="radio" name="nav-bar" id={id + "-input"} value={id}/>
        <label htmlFor={id + "-input"} name={props.name} onClick={props.fn}>{props.name}</label>
      </div>
    )
};

export default Radio;