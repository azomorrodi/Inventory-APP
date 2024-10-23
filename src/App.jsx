import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ProductProvider } from "./ProductContext";
import ProductDetail from "./ProductDetail";
import "./App.css";


function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productCategory, setProductCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const editProduct = (id, updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === parseInt(id) ? updatedProduct : product
    );
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
  };

  const addCategory = () => {
    if (categoryTitle) {
      const newCategory = {
        title: categoryTitle,
        description: categoryDescription,
      };

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      saveCategoriesToLocalStorage(updatedCategories); // Save categories to local storage
      setCategoryTitle("");
      setCategoryDescription("");
    }
  };

  const saveCategoriesToLocalStorage = (categories) => {
    localStorage.setItem("categories", JSON.stringify(categories));
  };

  const loadCategoriesFromLocalStorage = () => {
    const storedCategories = localStorage.getItem("categories");
    return storedCategories ? JSON.parse(storedCategories) : [];
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const loadProductsFromLocalStorage = () => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  };

  const saveProductsToLocalStorage = (products) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  useEffect(() => {
    const initialProducts = loadProductsFromLocalStorage();
    setProducts(initialProducts);

    const initialCategories = loadCategoriesFromLocalStorage(); // Load categories
    setCategories(initialCategories);
  }, []);

  const addProduct = () => {
    if (productTitle && productQuantity > 0 && productCategory) {
      const newProduct = {
        id: Date.now(),
        title: productTitle,
        quantity: productQuantity,
        category: productCategory,
        createdAt: new Date().toISOString(), // Save as ISO string
      };
      setProducts([...products, newProduct]);
      setProductTitle("");
      setProductQuantity(0);
      setProductCategory("");
      saveProductsToLocalStorage([...products, newProduct]);
    }
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product && // Check if product is not null
        product.title.toLowerCase().includes(searchInput.toLowerCase()) &&
        (selectedCategory === "" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by full date
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt); // Sort by full date
      }
    });

  return (
    <ProductProvider>
      <Routes>
        <Route
          path="/"
          element={
            <div
              className={`min-h-screen ${
                isDarkMode
                  ? "bg-slate-800 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              <div
                className={`h-12 flex items-center justify-between gap-x-4 mb-6 sticky top-0 ${
                  isDarkMode
                    ? "bg-slate-700 text-slate-300"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                <button
                  onClick={toggleDarkMode}
                  className="text-3xl bg-transparent border-none p-0 focus:outline-none"
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
                <div className="flex items-center flex-grow justify-center">
                  <h1 className="md:text-xl text-sm font-bold">
                    Inventory App using Tailwind & React.js
                  </h1>
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full border-2 font-bold ml-2 ${
                      isDarkMode
                        ? "text-slate-300 border-slate-300 bg-slate-500"
                        : "text-slate-600 border-slate-600 bg-slate-400"
                    }`}
                  >
                    {products.length}
                  </span>
                </div>
              </div>
              <div className="container mx-auto p-4 md:flex-row flex-col flex md:justify-between lg:max-w-screen-xl md:gap-x-12">
                <section className="w-full">
                  <section>
                    {showCategoryForm && (
                      <div className="mb-8">
                        <h2
                          className={`text-xl font-bold mb-2 ${
                            isDarkMode
                              ? "bg-slate-800 text-slate-300"
                              : "bg-gray-300 text-slate-500"
                          }`}
                        >
                          Add New Category
                        </h2>
                        <form
                          className={`p-4 rounded-xl flex flex-col gap-y-4 ${
                            isDarkMode
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-200 text-slate-700"
                          }`}
                          onSubmit={(e) => {
                            e.preventDefault();
                            addCategory();
                          }}
                        >
                          <div>
                            <label
                              htmlFor="category-title"
                              className="block mb-1 text-slate-400"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              id="category-title"
                              className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-2/8"
                              value={categoryTitle}
                              onChange={(e) => setCategoryTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="category-description"
                              className="block mb-1 text-slate-400"
                            >
                              Description
                            </label>
                            <textarea
                              className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-full"
                              name="description"
                              id="category-description"
                              value={categoryDescription}
                              onChange={(e) =>
                                setCategoryDescription(e.target.value)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between gap-x-4">
                            <button
                              type="button"
                              className="flex-1 border border-slate-400 text-slate-400 rounded-xl py-2"
                              onClick={() => setShowCategoryForm(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 bg-slate-500 text-slate-200 rounded-xl py-2"
                            >
                              Add Category
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    {!showCategoryForm && (
                      <button
                        onClick={() => setShowCategoryForm(true)}
                        className={`text-lg mb-4 font-medium ${
                          isDarkMode
                            ? "bg-slate-800 text-slate-500"
                            : "bg-gray-300 text-slate-200"
                        }`}
                      >
                        Add new Category?
                      </button>
                    )}
                  </section>

                  <div className="mb-10">
                    <h2
                      className={`text-xl font-bold mb-2 ${
                        isDarkMode
                          ? "bg-slate-800 text-slate-300"
                          : "bg-gray-300 text-slate-500"
                      }`}
                    >
                      Add New Product
                    </h2>
                    <div
                      className={`p-4 rounded-xl flex flex-col gap-y-4 ${
                        isDarkMode
                          ? "bg-slate-700 text-slate-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      <div>
                        <label
                          htmlFor="product-title"
                          className="block mb-1 text-slate-400"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="product-title"
                          className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-2/8"
                          value={productTitle}
                          onChange={(e) => setProductTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-quantity"
                          className="block mb-1 text-slate-400"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="bg-transparent rounded-xl border border-slate-500 text-slate-400 w-2/8"
                          name="quantity"
                          id="product-quantity"
                          value={productQuantity}
                          onChange={(e) => setProductQuantity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-category"
                          className="block mb-1 text-slate-400"
                        >
                          Category
                        </label>
                        <select
                          name="categoryId"
                          id="product-category"
                          className="bg-transparent text-slate-400 w-full p-2 border rounded-xl"
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                        >
                          <option
                            className="bg-slate-500 text-slate-300"
                            value=""
                          >
                            Select a category
                          </option>
                          {categories.map((category, index) => (
                            <option
                              key={index}
                              className="bg-slate-500 text-slate-300"
                              value={category.title}
                            >
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center justify-between gap-x-4">
                        <button
                          onClick={addProduct}
                          className="flex-1 bg-slate-500 text-slate-200 rounded-xl py-2"
                        >
                          Add new Product
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="w-full">
                  <div className="mb-6">
                    <h2 className="text-slate-500 font-bold mb-5 border-b-slate-500 border-b text-xl">
                      Filters
                    </h2>
                    <div className="flex items-center justify-between mb-6">
                      <label
                        htmlFor="search-input"
                        className="text-slate-500 text-lg"
                      >
                        Search
                      </label>
                      <input
                        type="text"
                        name="search-input"
                        id="search-input"
                        className="bg-transparent border-slate-500 text-slate-400 w-2/5 p-2 border-2 rounded-xl ml-auto"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <label
                        htmlFor="sort-products"
                        className="text-slate-500 text-lg"
                      >
                        Sort
                      </label>
                      <select
                        name="sort-products"
                        id="sort-products"
                        className="bg-transparent text-slate-400 w-1/3 p-2 border-2 rounded-xl ml-auto"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option
                          className={` ${
                            isDarkMode
                              ? "bg-slate-500 text-slate-300"
                              : "bg-slate-200 text-slate-500"
                          }`}
                          value="latest"
                        >
                          Latest
                        </option>
                        <option
                          className={` ${
                            isDarkMode
                              ? "bg-slate-500 text-slate-300"
                              : "bg-slate-200 text-slate-500"
                          }`}
                          value="earliest"
                        >
                          Earliest
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <label
                        htmlFor="category-filter"
                        className="text-slate-500 text-lg"
                      >
                        Category
                      </label>
                      <select
                        name="category-filter"
                        id="category-filter"
                        className="bg-transparent text-slate-400 w-1/6 p-2 border-2 rounded-xl ml-auto"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option
                          className="bg-slate-500 text-slate-300"
                          style={{ width: "200px" }}
                          value=""
                        >
                          All
                        </option>
                        {categories.map((category, index) => (
                          <option
                            key={index}
                            className="bg-slate-500 text-slate-300"
                            value={category.title}
                          >
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl text-slate-500 font-bold mb-4 border-b-slate-500 border-b">
                      Product List
                    </h2>
                    <div className="overflow-x-auto">
                      {filteredProducts.length === 0 ? (
                        <div className="text-center text-slate-500 font-bold font-sans px-6 py-4 text-xl">
                          There are no products to display
                        </div>
                      ) : (
                        <table className="min-w-full divide-y divide-slate-500">
                          <thead
                            className={`${
                              isDarkMode
                                ? "bg-slate-800 text-white"
                                : "bg-gray-300 text-gray-900"
                            }`}
                          >
                            <tr>
                              <th className="px-6 py-3 text-center text-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                              </th>
                              <th className="px-6 py-3 text-center text-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                              </th>
                              <th className="px-6 py-3 text-center text-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-center text-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-center text-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            className={`${
                              isDarkMode
                                ? "bg-slate-800 text-white"
                                : "bg-gray-300 text-gray-900"
                            }`}
                          >
                            {filteredProducts.map((product) => (
                              <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                                  {product.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                  {new Date(product.createdAt).toLocaleDateString("fa-IR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                  {product.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                  {product.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                  <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="text-red-500"
                                  >
                                    Delete
                                  </button>
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="text-blue-500 ml-2"
                                  >
                                    Edit
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          }
        />
        <Route path="/product/:id" element={<ProductDetail products={products} onEdit={editProduct} isDarkMode={isDarkMode} />} />
      </Routes>
    </ProductProvider>
  );
}

export default App;
