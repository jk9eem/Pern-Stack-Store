import { EditIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore'

function ProductCard({product}) {
    const {deleteProduct} = useProductStore()

    const handleDelete = async () => {
    if(window.confirm("Are you sure?")){
      await deleteProduct(product.id)
    }
  }
  
    return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300'>
        {/* Product Image */}
        <figure className='relative pt-[56.25%]'>
            {/* image source as a field */}
            <img
                src={product.image}
                alt={product.name}
                className='absolute top-0 left-0 w-full h-full object-cover'
            />
        </figure>
        
        <div className='card-body'>
            {/* Put Product Info inside of the Card-Body */}
            <h2 className='card-title text-lg font-semibold'>{product.name}</h2>
            <p className='text-2xl font-bold text-primary'>${Number(product.price).toFixed(2)}</p>

            {/* Card Actions - Edit/Delete */}
            <div className='card-actions justify-end mt-4'>
                {/* Edit */}
                <Link to={`/product/${product.id}`} className='btn btn-sm btn-info btn-outline'>
                    <EditIcon className='size-4' />
                </Link>

                {/* Delete */}
                <button className='btn btn-sm btn-error btn-outline' onClick={handleDelete}>
                    <Trash2Icon className='size-4'/>
                </button>
            </div>
        </div>

    </div>
  )
}

export default ProductCard