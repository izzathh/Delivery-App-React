import { RiDeleteBinLine, RiSaveLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useDeliveryApp } from "../../hooks";
import { useEffect, useState, lazy, Suspense } from "react";
import { IoMdClose } from "react-icons/io";
import { ProductContents, EditProductContents } from "../../components/products"
import { Link } from "react-router-dom";
const ImageUploader = lazy(() => import('../../components/ImageUploader'))

const Product = () => {
    const [editProductDetails, setEditProductDetails] = useState(null)
    const [newDetails, setNewDetails] = useState({ name: '', description: '', price: '', image: null })
    const [openImageUploader, setOpenImageUploader] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [newImage, setNewImage] = useState(null)
    const [errors, setErrors] = useState({})

    const {
        products,
        getAllProducts,
        updateProductDetails,
        deleteProduct,
        setConfirmCallBack,
        setTitle,
        setMessage,
        setOpenConfirmationDialog,
        setBlurred
    } = useDeliveryApp();

    useEffect(() => {
        getAllProducts()
    }, [])

    const handleCloseEdit = () => {
        setEditProductDetails(null)
        setNewDetails({ name: '', description: '', price: '', image: null })
    }

    const handleOpenEdit = (i, product) => {
        if (i !== null) {
            setNewDetails({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image
            })
        }
        setEditProductDetails(i)
    }

    const handleSaveNewDetails = async (id) => {
        await updateProductDetails(id, newDetails)
        setErrors((pre) => ({ ...pre, image: '' }));
        setEditProductDetails(null)
        setNewDetails({ name: '', description: '', price: '', image: null })
    }

    const handleImgSelection = () => {
        if (newImage) {
            setNewDetails((prev) => ({ ...prev, image: newImage }))
            setOpenImageUploader(false)
            setErrors((pre) => ({ ...pre, image: '' }));
            return
        }
        toastIt('error', 'Please select an image or choose a different one.')
    }

    const handleProductDelete = (id) => {
        setTitle('Confirm to delete !')
        setMessage('Do you want to delete this product ?')
        setBlurred(true)
        setOpenConfirmationDialog(true)
        setConfirmCallBack(() => async () => {
            await deleteProduct(id)
            setOpenConfirmationDialog(false)
            setBlurred(false)
        });
    };

    const handleStoreImageOpen = (img) => {
        setOpenImageUploader(true)
        const imgUrl = typeof img === 'object'
            ? URL.createObjectURL(img)
            : img
        setImagePreview(imgUrl)
    }

    return (
        <div className="product-container">
            {openImageUploader &&
                <Suspense>
                    <ImageUploader
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                        setOpenImageUploader={setOpenImageUploader}
                        onClickCallBack={handleImgSelection}
                        setNewImage={setNewImage}
                        buttonTxt={'Continue with the image'}
                    />
                </Suspense>
            }
            {!openImageUploader &&
                <>
                    <div className="header">
                        <h2>Products</h2>
                        <Link to="/add-product">Add Product</Link>
                    </div>
                    <div className="product-cards">
                        {products.map((product, index) => (
                            <div key={index} className="card">
                                <div className={`${editProductDetails !== index ? 'card-img' : ''}`}>
                                    {editProductDetails !== index &&
                                        <img src={product.image} alt="product image" />
                                    }
                                </div>
                                <div className={`${editProductDetails === index ? 'btn' : ''} product-btns`}>
                                    <div>
                                        {editProductDetails !== index &&
                                            <ProductContents
                                                name={product.name}
                                                description={product.description}
                                                price={product.price}
                                            />
                                        }
                                        {editProductDetails === index &&
                                            <EditProductContents
                                                newDetails={newDetails}
                                                setNewDetails={setNewDetails}
                                                setErrors={setErrors}
                                                errors={errors}
                                            />
                                        }
                                        {editProductDetails === index &&
                                            <input
                                                id="image"
                                                name="image"
                                                type="submit"
                                                value={product.image && product.image.name
                                                    ? product.image.name
                                                    : 'Click to edit product image'}
                                                onClick={() => handleStoreImageOpen(product.image)}
                                            />
                                        }
                                    </div>
                                    <div>
                                        {editProductDetails !== index &&
                                            <button onClick={() => handleOpenEdit(index, product)}>
                                                <CiEdit />
                                            </button>
                                        }
                                        {editProductDetails === index &&
                                            <button onClick={handleCloseEdit}>
                                                <IoMdClose />
                                            </button>
                                        }
                                        {editProductDetails === index &&
                                            <button
                                                className="save"
                                                onClick={() => handleSaveNewDetails(product._id)}
                                            >
                                                <RiSaveLine />
                                            </button>
                                        }
                                        {editProductDetails !== index &&
                                            <>
                                                <button
                                                    onClick={(e) => handleProductDelete(product._id)}
                                                >
                                                    <RiDeleteBinLine />
                                                </button>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default Product