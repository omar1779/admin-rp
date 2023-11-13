import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Teachers({swal}) {
  const [editedTeacher, setEditedTeacher] = useState(null);
  const [name,setName] = useState('');
  const [descriptionTeacher,setDescriptionTeacher] = useState('');
  const [teachers,setTeachers] = useState([]);
  useEffect(() => {
    fetchTeachers();
  }, [])
  function fetchTeachers() {
    axios.get('/api/teachers').then(result => {
      setTeachers(result.data);
      console.log(result.data)
    });
  }
  async function saveTeacher(ev){
    ev.preventDefault();
    const data = {
      name,
      descriptionTeacher,
    };
    console.log(data)
    if (editedTeacher) {
      data._id = editedTeacher._id;
      await axios.put('/api/teachers', data);
      setEditedTeacher(null);
    } else {
      await axios.post('/api/teachers', data);
    }
    setName('');
    setDescriptionTeacher('');
    setProperties([]);
    fetchTeachers();
  }
  function editTeacher(teacher){
    setEditedTeacher(teacher);
    setName(teacher.name);
    setDescriptionTeacher(teacher.description);
  }
  function deleteTeacher(teacher){
    swal.fire({
      title: 'Estas seguro de seguir?',
      text: `Tu borras al siguiente Maestro : ${teacher.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Borrar!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = teacher;
        await axios.delete('/api/teachers?_id='+_id);
        fetchTeachers();
      }
    });
  }
  return (
    <Layout>
      <h1>Maestros</h1>
      <label>
        {editedTeacher
          ? `Editar maestro ${editedTeacher.name}`
          : 'Crea un nuevo maestro'}
      </label>
      <form onSubmit={saveTeacher}>
        <div className="flex gap-1">
          <input
            type="text"
            className="border-slate-400 outline-none"
            placeholder={'Nombre de Maestro'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            className="border-slate-400 outline-none"
            placeholder={'Añade una Descripcion'}
            onChange={ev => setDescriptionTeacher(ev.target.value)}
            value={descriptionTeacher}/>
        </div>
        <div className="flex gap-1">
          {editedTeacher && (
            <button
              type="button"
              onClick={() => {
                setEditedTeacher(null);
                setName('');
                setDescriptionTeacher('');
              }}
              className="btn-default">Cancel</button>
          )}
          <button type="submit"
                  className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedTeacher && (
        <table className="basic mt-4 hover:border-collapse">
          <thead>
          <tr>
            <td>Maestro</td>
            <td>Descripcion</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          {teachers.length > 0 && teachers.map(teacher => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>{teacher?.description}</td>
              <td>
                <button
                  onClick={() => editTeacher(teacher)}
                  className="btn-primary mr-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteTeacher(teacher)}
                  className="btn-red">Borrar</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Teachers swal={swal} />
));
