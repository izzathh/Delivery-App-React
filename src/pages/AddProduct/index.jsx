import { useState, lazy, Suspense } from "react";
import { useDeliveryApp } from "../../hooks";
import { ImageValidation, ProductFormValidation, StoreFormValidation } from "../../schema";
import { ValidationError } from "yup";
import * as Yup from "yup"

const ImageUploader = lazy(() => import('../../components/ImageUploader'))

const AddNewProduct = () => {
    const [productValues, setProductValues] = useState({
        name: "",
        description: "",
        price: 0,
        image: null
    });

    const { toastIt, addNewProduct, navigate } = useDeliveryApp()
    const [openImageUploader, setOpenImageUploader] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [errors, setErrors] = useState({})
    const [newImage, setNewImage] = useState(null)

    const handleProductInputChange = async (e) => {
        const { name, value } = e.target
        try {
            setProductValues(prev => ({ ...prev, [name]: value }))
            const validator = Yup.object().shape({
                [name]: ProductFormValidation.fields[name]
            })
            await validator.validate({ [name]: value })
            setErrors((pre) => ({ ...pre, [name]: '' }));
        } catch (error) {
            console.error(error);
            setErrors((pre) => ({ ...pre, [name]: error.message }));
        }
    }

    const handleImgSelection = async () => {
        try {
            if (newImage) {
                setProductValues((prev) => ({ ...prev, image: newImage }))
                setOpenImageUploader(false)
                setErrors((pre) => ({ ...pre, image: '' }));
                return
            }
            toastIt('error', 'Please select an image or choose a different one.')
        } catch (error) {
            console.error(error);
            setErrors((pre) => ({ ...pre, image: error.message }));
        }
    }

    const handleFormSubmit = async () => {
        try {
            await ProductFormValidation.validate(productValues, { abortEarly: false })
            await addNewProduct(productValues)
        } catch (error) {
            if (error instanceof ValidationError) {
                const fotmattedErrors = error.inner.reduce((acc, err) => {
                    return { ...acc, [err.path]: err.message }
                }, {})
                setErrors(fotmattedErrors)
            } else {
                console.error(error);
            }
        }
    }

    const handleStoreImageOpen = () => {
        setOpenImageUploader(true)
        const imgUrl = typeof productValues.image === 'object'
            ? URL.createObjectURL(productValues.image)
            : productValues.image
        setImagePreview(imgUrl)
    }

    return (
        <div className="add-store-container">
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
                        <h2>Add New Product</h2>
                    </div>
                    <div className="add-store-forms products">
                        <div className="add-store">
                            <div>
                                <input
                                    onChange={handleProductInputChange}
                                    value={productValues.name}
                                    id="name"
                                    name="name"
                                    placeholder="enter name"
                                    type="text"
                                />
                                {
                                    errors && errors.name && (
                                        <label htmlFor="name">
                                            {errors.name}
                                        </label>)
                                }
                                <input
                                    onChange={handleProductInputChange}
                                    value={productValues.price}
                                    id="price"
                                    name="price"
                                    placeholder="enter price"
                                    type="number"
                                />
                                {
                                    errors && errors.price && (
                                        <label htmlFor="price">
                                            {errors.price}
                                        </label>)
                                }
                                <input
                                    onChange={handleProductInputChange}
                                    value={productValues.description}
                                    id="description"
                                    name="description"
                                    placeholder="enter description"
                                    type="text"
                                />
                                {
                                    errors && errors.description && (
                                        <label htmlFor="description">
                                            {errors.description}
                                        </label>)
                                }
                                <input
                                    id="image"
                                    name="image"
                                    type="submit"
                                    value={productValues.image
                                        ? productValues.image.name
                                        : 'Click to add product image'}
                                    onClick={handleStoreImageOpen}
                                />
                                {
                                    errors && errors.image && (
                                        <label htmlFor="image">
                                            {errors.image}
                                        </label>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className="add-store-submit">
                        <button onClick={handleFormSubmit}>Add</button>
                        <button onClick={() => navigate('/products')}>Cancel</button>
                    </div>
                </>
            }
        </div>
    )
}

export default AddNewProduct