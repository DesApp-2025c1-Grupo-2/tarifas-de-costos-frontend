type Text = {
    nombre: string;
    tipo: string;
  };
  
export const TextInput = ({ nombre, tipo }: { nombre: string; tipo: string }) => {
  return (
    <div className="form-group">
      <label htmlFor={nombre.replace(/\s+/g, '-').toLowerCase()}>
        {nombre}:
      </label>
      <input
        type={tipo}
        id={nombre.replace(/\s+/g, '-').toLowerCase()}
        name={nombre}
        className="form-control"
        required
      />
    </div>
  );
};
  
type Select = {
    nombre: string;
    opciones: Array<string>;
};
  
export const SelectField: React.FC<Select> = ({ nombre, opciones }) => {
    const name = nombre;
  
    return (
      <div className='text-field'>
        <label htmlFor={nombre} className="label-espaciada">{nombre}</label>
        <select id={name} className='select-field'>
            <option value='default' selected>-</option>
            {opciones.map((e) => 
                <option value={e}>{e}</option>
            )}
        </select>
      </div>
    );
};

type Options = {
    opciones: Array<string>;
};

export const ChipBlock: React.FC<Options> = ({ opciones }) => {
    const op = opciones;

    return (
        <div>
            <label>Requisitos especiales</label>
            {opciones.map((e, index) => 
                <Chip id={e} nombre={e} key={index}/>
            )}
        </div>
    )
};

type ChipOp = {
    id: string;
    nombre: string;
};

const Chip: React.FC<ChipOp> = ({ id, nombre }) => {

    return (
        <div className="div-margin-top">
            <input type='checkbox' id={String(id)} name={nombre} value={nombre}/>
            <label htmlFor={nombre}>{nombre}</label>
        </div>
    )
}

type Res = {
    nombre: string;
};

export const Resultado: React.FC<Res> = ({ nombre }) => {
    return (
        <div className='result'>
            <p>{nombre}</p>
            <p>$$$</p>
        </div>
    )
}