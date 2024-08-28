import { useEffect } from "react"
import { ProductFormValidation } from "../schema"
import * as Yup from "yup"

export const ProductContents = ({ name, description, price }) => {
    return (
        <>
            <span>{name}</span>
            <span>{description}</span>
            <span>{price}/-</span>
        </>
    )
}

export const EditProductContents = ({
    newDetails,
    setNewDetails,
    setErrors,
    errors
}) => {

    const handleDetailsChange = async (e) => {
        const { name, value } = e.target
        try {
            setNewDetails((prev) => ({ ...prev, [name]: value }))
            const validator = Yup.object().shape({
                [name]: ProductFormValidation.fields[name]
            })
            await validator.validate({ [name]: value })
            setErrors((pre) => ({ ...pre, [name]: '' }));
        } catch (error) {
            setErrors((pre) => ({ ...pre, [name]: error.message }));
        }
    }

    return (
        <>
            <input
                type="text"
                placeholder='name'
                name="name"
                id="name"
                value={newDetails.name}
                onChange={handleDetailsChange}
            />
            {
                errors && errors.name && (
                    <label htmlFor="name">
                        {errors.name}
                    </label>)
            }
            <input
                type="text"
                placeholder='description'
                name="description"
                id="description"
                value={newDetails.description}
                onChange={handleDetailsChange}
            />
            {
                errors && errors.description && (
                    <label htmlFor="description">
                        {errors.description}
                    </label>)
            }
            <input
                type="number"
                placeholder='price'
                name="price"
                id="price"
                value={newDetails.price}
                onChange={handleDetailsChange}
            />
            {
                errors && errors.price && (
                    <label htmlFor="price">
                        {errors.price}
                    </label>)
            }
        </>
    )
}