import { useState, lazy, Suspense } from "react";
import { useDeliveryApp } from "../../hooks";
import { ImageValidation, StoreFormValidation } from "../../schema";
import { ValidationError } from "yup";
import * as Yup from "yup"

const ImageUploader = lazy(() => import('../../components/ImageUploader'))

const AddNewStore = () => {
    const [profileValues, setProfileValues] = useState({
        username: "",
        email: "",
        password: "",
        profileAddress: "",
        adminType: "",
    });

    const [storeValues, setStoreValues] = useState({
        name: "",
        storeAddress: "",
        contact: "",
        description: "",
        image: null
    });

    const { toastIt, addNewStore, navigate } = useDeliveryApp()
    const [openImageUploader, setOpenImageUploader] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [errors, setErrors] = useState({})
    const [newImage, setNewImage] = useState(null)

    const handleProfileInputChange = async (e) => {
        const { name, value } = e.target
        try {
            setProfileValues(prev => ({ ...prev, [name]: value }))
            const validator = Yup.object().shape({
                [name]: StoreFormValidation.fields[name]
            })
            await validator.validate({ [name]: value })
            setErrors((pre) => ({ ...pre, [name]: '' }));
        } catch (error) {
            console.error(error);
            setErrors((pre) => ({ ...pre, [name]: error.message }));
        }
    }

    const handleStoreInputChange = async (e) => {
        const { name, value } = e.target
        try {
            setStoreValues(prev => ({ ...prev, [name]: value }))
            const validator = Yup.object().shape({
                [name]: StoreFormValidation.fields[name]
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
                await ImageValidation.validate({ image: newImage });
                setStoreValues((prev) => ({ ...prev, image: newImage }))
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
            const data = {
                ...profileValues,
                ...storeValues
            }
            await StoreFormValidation.validate(data, { abortEarly: false })
            await addNewStore(data)
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
        const imgUrl = typeof storeValues.image === 'object'
            ? URL.createObjectURL(storeValues.image)
            : storeValues.image
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
                        <h2>Add New Store</h2>
                    </div>
                    <div className="add-store-forms">
                        <div className="add-profile">
                            <div>
                                <h3>Profile</h3>
                            </div>
                            <br />
                            <div>
                                <input
                                    id="username"
                                    name="username"
                                    placeholder="enter username"
                                    type="text"
                                    value={profileValues.username}
                                    onChange={handleProfileInputChange}
                                />
                                {
                                    errors && errors.username && (
                                        <label htmlFor="username">
                                            {errors.username}
                                        </label>)
                                }
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="enter email"
                                    type="text"
                                    value={profileValues.email}
                                    onChange={handleProfileInputChange}
                                />
                                {
                                    errors && errors.email && (
                                        <label htmlFor="email">
                                            {errors.email}
                                        </label>)
                                }
                                <input
                                    id="password"
                                    name="password"
                                    placeholder="enter password"
                                    type="password"
                                    value={profileValues.password}
                                    onChange={handleProfileInputChange}
                                />
                                {
                                    errors && errors.password && (
                                        <label htmlFor="password">
                                            {errors.password}
                                        </label>)
                                }
                                <input
                                    id="profileAddress"
                                    name="profileAddress"
                                    placeholder="enter address"
                                    type="text"
                                    value={profileValues.profileAddress}
                                    onChange={handleProfileInputChange}
                                />
                                {
                                    errors && errors.profileAddress && (
                                        <label htmlFor="profileAddress">
                                            {errors.profileAddress}
                                        </label>)
                                }
                                <select
                                    name="adminType"
                                    id="adminType"
                                    onChange={handleProfileInputChange}
                                    value={profileValues.adminType}
                                >
                                    <option value="">Select admin type</option>
                                    <option value="sales">Sales</option>
                                    <option value="finance">Finance</option>
                                </select>
                                {
                                    errors && errors.adminType && (
                                        <label htmlFor="adminType">
                                            {errors.adminType}
                                        </label>)
                                }
                            </div>
                        </div>
                        <div className="add-store">
                            <div>
                                <h3>Store</h3>
                            </div>
                            <br />
                            <div>
                                <input
                                    onChange={handleStoreInputChange}
                                    value={storeValues.name}
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
                                    onChange={handleStoreInputChange}
                                    value={storeValues.storeAddress}
                                    id="storeAddress"
                                    name="storeAddress"
                                    placeholder="enter address"
                                    type="text"
                                />
                                {
                                    errors && errors.storeAddress && (
                                        <label htmlFor="storeAddress">
                                            {errors.storeAddress}
                                        </label>)
                                }
                                <input
                                    onChange={handleStoreInputChange}
                                    value={storeValues.contact}
                                    id="contact"
                                    name="contact"
                                    placeholder="enter contact"
                                    type="number"
                                />
                                {
                                    errors && errors.contact && (
                                        <label htmlFor="contact">
                                            {errors.contact}
                                        </label>)
                                }
                                <input
                                    onChange={handleStoreInputChange}
                                    value={storeValues.description}
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
                                    value={storeValues.image
                                        ? storeValues.image.name
                                        : 'Click to add or edit store image'}
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
                        <button onClick={() => navigate('/')}>Cancel</button>
                    </div>
                </>
            }
        </div>
    )
}

export default AddNewStore