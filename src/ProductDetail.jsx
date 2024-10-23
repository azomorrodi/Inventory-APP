import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductDetail = ({ products, onEdit, isDarkMode }) => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState(''); // New state for description

    useEffect(() => {
        const productId = parseInt(id); 

        if (!isNaN(productId)) { 
            const productToEdit = products.find(product => product.id === productId);
            if (productToEdit) {
                setProduct(productToEdit);
                setTitle(productToEdit.title);
                setQuantity(productToEdit.quantity);
                setCategory(productToEdit.category);
                setDescription(productToEdit.description); // Initialize description
            }
        }
        setLoading(false);
    }, [id, products]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found!</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = { 
            ...product, 
            title, 
            quantity, 
            category,
            description // Include description in the updated product
        };
        onEdit(product.id, updatedProduct);
        navigate('/');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-300 text-black'}`}>
            <div className={`rounded-xl p-6 w-full max-w-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="flex items-center justify-center">
                    <img src="/file-edit.svg" alt="" className='w-10 h-10 mr-2 slate-500' />
                    <h1 className="text-2xl font-bold text-slate-500">Product & Category Editing Section</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
                    <div>
                        <label htmlFor="product-title" className="block mb-1 text-slate-400">Title</label>
                        <input 
                            type="text" 
                            id="product-title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-full"/>
                    </div>
                    <div>
                        <label htmlFor="product-quantity" className="block mb-1 text-slate-400">Quantity</label>
                        <input 
                            type="number" 
                            id="product-quantity" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-full"/>
                    </div>
                    <div>
                        <label htmlFor="product-category" className="block mb-1 text-slate-400">Category</label>
                        <input 
                            type="text" 
                            id="product-category" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-full"/>
                    </div>
                    <div>
                        <label htmlFor="product-description" className="block mb-1 text-slate-400">Description</label>
                        <textarea 
                            id="product-description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-full" 
                            rows="4" />
                    </div>
                    <button type="submit" className="rounded-xl py-2 bg-slate-500 text-slate-200 ">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

ProductDetail.propTypes = {
    products: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    isDarkMode: PropTypes.bool.isRequired,
};

export default ProductDetail;
