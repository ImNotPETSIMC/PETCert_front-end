const Radio = (props) => {
    const aux = String(props.name).replace(" ", "_");
    const id = String(aux).toLowerCase();
  
    return (
      <div className="radio-container" key={id}>
        <input type="radio" name="nav-bar" id={id} value={id}/>
        <label htmlFor={id} name={props.name} onClick={props.fn}>{props.name}</label>
      </div>
    )
};

export default Radio;