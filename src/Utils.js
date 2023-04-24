export const generateInput = (name, label) => {
    const aux = String(name).replace(' ', '-');
    const id = String(aux).toLowerCase();
    
    if(!label){
        return (
            <div className={id +"-container"}>
                <input type="text" name="" id={id} placeholder={name}/>
                <label htmlFor={id}>{name.toUpperCase()}</label>
            </div>
        )
    };
    
    return (
        <div className={id +"-container"}>
            <input type="text" name="" id={id} placeholder={name}/>
            <label htmlFor={id}>{label.toUpperCase()}</label>
        </div>
    )
}