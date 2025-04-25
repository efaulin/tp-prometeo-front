import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Category } from '../entities/categoryEntity';
import toast from 'react-hot-toast';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { CategoryDataModal } from '../components/modals/categoryModal';
import { ConfirmationModal } from '../components/confirmationModal';

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>(new Category());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
      if (!doubleToastControl) fetchCategories();
    }, []);
  
    const fetchCategories = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        CategoryRepository.GetAll().then((categories) => {setCategories(categories); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setCategories([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo categorias...',
          success: undefined,
          error: (error) => (<span><b>Hubo un error:</b><br/>{(error.response.data.message ? error.response.data.message : error.toString())}</span>),
        },
        {
          error: {
            duration: 5000,
          }
        }
      );
    };

    const handleAddCategory= () => {
      setSelectedCategory(new Category()); // Limpiar selección para añadir
      setShowCategoryModal(true);
    };
  
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category); // Seleccionar usuario para editar
        setShowCategoryModal(true);
    };

    const handleDeleteModal = (category: Category)=>{
      setSelectedCategory(category);
      setShowDeleteModal(true);
    }

    const handleDeleteCategory = async (categoryId: string) => {
      toast.promise(
        CategoryRepository.Delete(categoryId).then(fetchCategories, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>¡Categoria borrada!</b>,
          error: (err) => (<span><b>Hubo un error:</b><br/>{err.toString()}</span>),
        },
        {
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          }
        }
      );
    };
  
    const handleSave = async (category: Category) => {
      if (category.id) {
        toast.promise(
          CategoryRepository.Update(category).then(fetchCategories, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Categoria modificada!</b>,
            error: (err) => (<span><b>Hubo un error:</b><br/>{err.toString()}</span>),
          },
          {
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            }
          }
        );
      } else {
        toast.promise(
          CategoryRepository.Create(category as Category).then(fetchCategories, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Categoria creada!</b>,
            error: (err) => (<span><b>Hubo un error:</b><br/>{err.toString()}</span>),
          },
          {
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            }
          }
        );
      }
    }
  
    return (
      <div>
        <h2>Categorias</h2>
        <Button onClick={handleAddCategory}>Agregar categoria</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
            <thead>
              <tr>
                <th>Categorias</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditCategory(category)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(category)}><i className="bi bi-trash-fill"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <CategoryDataModal
          show={showCategoryModal}
          handleClose={() => setShowCategoryModal(false)}
          handleSave={(category) => {handleSave(category);}}
          initialData={selectedCategory}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteCategory(selectedCategory.id ? selectedCategory!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar esta categoria?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedCategory.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default CategoriesPage;