import axios from 'axios';

export const getCategorias = async () => {
    const { data } = await axios.get('/categorias');
    return data;
};

export const createCategoria = async (categoria: any) => {
    const { data } = await axios.post('/categorias', categoria);
    return data;
};

export const updateCategoria = async (categoria: any) => {
    const { data } = await axios.put(`/categorias/${categoria.id}`, categoria);
    return data;
};

export const deleteCategoria = async (id: number) => {
    await axios.delete(`/categorias/${id}`);
};