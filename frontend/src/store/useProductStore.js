import { create } from "zustand";
import axios from "axios"
import toast from "react-hot-toast";

// Dynamic base url depends on development mode or production mode
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : ""

// setter and getter
export const useProductStore = create((set,get) => ({
    // Products state
    products: [],
    loading: false,
    error: null,
    currentProduct: null,

    // Form state. formData is an object. All the fields are string
    formData: {
        name:"",
        price:"",
        image:"",
    },

    // Helper functions to update the form state
    // Setter function
    // Set the form data with what the user inputs
    setFormData: (formData) => set({ formData }),
    // Reset the form data 
    resetForm: () => set({ formData: {name:"", price:"", image:""} }),

    // This function takes an event (e)
    addProduct: async(e) => {
        // Prevent the default first
        e.preventDefault()
        set({ loading: true })

        try {
            // Get the form data inside of the function --> use 'get' parameter
            const {formData} = get()
            // Send a request --> Send a formData as the body
            await axios.post(`${BASE_URL}/api/products`, formData)
            // Once it is posted, refetch the data
            await get().fetchProducts() // This will update the UI immediately
            get().resetForm() // After updating the product, it needs to clear that form
            toast.success("Product added successfully")

            // todo: Close the popup after adding the product
            document.getElementById("add_product_modal").close()

        } catch (error) {
            console.log("Error in addProduct function", error)
            toast.error("Something went wrong while adding the product")
        } finally {
            set({ loading: false })
        }
    },

    // This eventually update products states above(products: [])
    fetchProducts: async() => {
        // Set the base loading state as true --> basically we're trying to fetch some data
        set({loading: true})
        // try: send a get request w/axios
        try {
            // Send a get request
            const response = await axios.get(`${BASE_URL}/api/products`)
            // then we can update our state --> array
            set({ products: response.data.data, error: null })
            // Why data.data? in productController.js, in 'getProducts' func,
            // it returns under 'data' field --> data(axios).data(our API)
            // error is null. If the error occurs, handle it in the catch block
        } catch (error) {
            if(error.status == 429) set({error:"Rate Limit Exceeded", products:[]})
            else set({error:"Something Went Wrong while fetching the product", products:[]})
        } finally{
            set({loading: false})
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`)
            set((prev) => ({products: prev.products.filter((product) => product.id !== id)}))
            toast.success("Product deleted successfully")
        } catch (error) {
            console.log("Error in deleteProduct function", error)
            toast.error("Something went wrong while deleting the product")
        } finally {
            set({ loading: false })
        }
    },

    // For the Product Page 1.fetch the data first -> 2.update the data then
    fetchProduct: async(id) => {
        set({ loading:true })
        try {
            // Get response by sending a request w/ axios.get() to the endpoint
            const response = await axios.get(`${BASE_URL}/api/products/${id}`)
            // Update the state --> current product is the data field 
            // from the data which response from the database(response.data.data)
            set({ 
                currentProduct: response.data.data,
                formData: response.data.data, // Prefill form with current product data
                error: null, // It's in the 'try' block -> should be no error
             })
        } catch (error) {
            console.log("Error in fetchProduct function", error)
            // If it's an error, current product is null -> it couldn't fetch it
            set({ error: "Something went wrong", currentProduct: null})
        } finally{
            set({ loading: false})
        }
    },
    updateProduct: async(id) => {
        set({ loading: true })
        try {
            // Get the form data --> That's what we're going to change
            // Change something in the form, then send the data to API
            const {formData} = get()
            // Get response by sending a request(data=formData) w/ axios.put()
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData)
            // Set the currentProduct with the incoming data which is the new data
            set({ currentProduct: response.data.data})
            toast.success("Product updated successfully!")
        } catch (error) {
            toast.error("Something went wrong")
            console.log("Error in updateProduct function", error)
        } finally{
            set({ loading: false })
        }
    },
}))