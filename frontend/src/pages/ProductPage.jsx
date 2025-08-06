import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";

function ProductPage() {
  { /* Destructure the values from the store -> then, build the UI */ }
  { /* Get the values here */ }
  const {
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
    currentProduct,
  } = useProductStore();
  const navigate = useNavigate();
  { /* Handful hook to fetch the id that in the URL id field */ }
  { /* Variable name should be matched which is used in the app.jsx -> "/product/:id" */ }
  const { id } = useParams();

  { /* To fetch the product w/ useEffect() by id coming from the URL that we're going to pass */ }
  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  { /* Handle deleting process */}
  { /* After confirmation, run deleteProduct w/ id and move the page to the Homepage */}
  const handleDelete = async () => {
    if(window.confirm("Are you sure?")){
      await deleteProduct(id)
      navigate("/")
    }
  }


  { /* Loading State */ }
  { /* If the loading state is true, display loading spinner */ }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  { /* If it's an error, display the error message */ }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  { /* Neither having loading state nor error, return the UI */ }
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Button to take to the homepage */}
      {/* When it's clicked, navigate the user back to the homepage */}
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      {/* Divide by column to set the area for display product contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image -> on the left */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className="size-full object-cover"
          />
        </div>

        {/* Product Form -> on the right */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Edit Product</h2>
            {/* Take the event w/e.preventDefault and pass the product ID coming from the URL */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct(id);
              }}
              className="space-y-6"
            >
              {/* Product Name - Exactly the same code in the AddProductModal.jsx but no code for icon */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Product Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary
                            transition-colors duration-200"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Product Price - same as well as the code in AddProductModal.jsx ex.icon part */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Price
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary
                transition-colors duration-200"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              {/* Product Image URL - same as well as the code in AddProductModal.jsx ex code for icon*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Image URL
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="https://examples.com/image.jpg"
                  className="input input-bordered w-full pl-10 py-3 
                  focus:input-primary transition-colors duration-200"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              {/* Form Actions - Delete Product and Save Changes */}
              <div className="flex justify-between mt-8">
                {/* Delete Product - Same code in ProductCard.jsx */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Product
                </button>

                {/* Submit Button - Same code in AddProductModal.jsx */}
                {/* This button will be disable if the conditions are not satisfied */}
                <button
                  type="submit"
                  className="btn btn-primary min-w-[120px]"
                  disabled={
                    !formData.name ||
                    !formData.price ||
                    !formData.image ||
                    loading
                  }
                >
                  {/* Conditional statement by loading state */}
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
