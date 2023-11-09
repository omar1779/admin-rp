import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Teachers({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name,setName] = useState('');
  const [parentCategory,setParentCategory] = useState('');
  const [teachers,setTeachers] = useState([]);
  const [properties,setProperties] = useState([]);
  useEffect(() => {
    fetchTeachers();
  }, [])
  function fetchTeachers() {
    axios.get('/api/teachers').then(result => {
      setTeachers(result.data);
    });
  }
  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/teachers', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/teachers', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchTeachers();
  }
  function editCategory(teacher){
    setEditedCategory(teacher);
    setName(teacher.name);
    setParentCategory(teacher.parent?._id);
    setProperties(
      teacher.properties.map(({name,values}) => ({
      name,
      values:values.join(',')
    }))
    );
  }
  function deleteCategory(teacher){
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${teacher.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
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
  function addProperty() {
    setProperties(prev => {
      return [...prev, {name:'',values:''}];
    });
  }
  function handlePropertyNameChange(index,property,newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index,property,newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Teachers</h1>
      <label>
        {editedCategory
          ? `Edit teacher ${editedCategory.name}`
          : 'Create new teacher'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Category name'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
          <select
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
            <option value="">No parent teacher</option>
            {teachers.length > 0 && teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2">
            Add new property
          </button>
          {properties.length > 0 && properties.map((property,index) => (
            <div key={property.name} className="flex gap-1 mb-2">
              <input type="text"
                     value={property.name}
                     className="mb-0"
                     onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                     placeholder="property name (example: color)"/>
              <input type="text"
                     className="mb-0"
                     onChange={ev =>
                       handlePropertyValuesChange(
                         index,
                         property,ev.target.value
                       )}
                     value={property.values}
                     placeholder="values, comma separated"/>
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default">Cancel</button>
          )}
          <button type="submit"
                  className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
          <tr>
            <td>Category name</td>
            <td>Parent teacher</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          {teachers.length > 0 && teachers.map(teacher => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>{teacher?.parent?.name}</td>
              <td>
                <button
                  onClick={() => editCategory(teacher)}
                  className="btn-default mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(teacher)}
                  className="btn-red">Delete</button>
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
