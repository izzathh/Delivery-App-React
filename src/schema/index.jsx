import { object, string } from "yup";
import * as Yup from "yup"

export const LoginFormValidation = object().shape({
    userName: Yup.string().trim().required('username is required'),
    password: Yup.string().required('password is required')
})

export const ImageValidation = object().shape({
    image: Yup.mixed()
        .required('Image is required')
        .test(
            'isNotString',
            'Invalid input type. Expected a file.',
            (value) => {
                if (typeof value === 'string') return true;
                return value !== undefined;
            }
        )
        .test(
            'fileFormat',
            'Invalid file format. Only JPG, JPEG, and PNG are allowed.',
            (value) => {
                if (typeof value === 'string') return true;
                if (!value) return true;
                const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
                return allowedFormats.includes(value.type);
            }
        )
        .test(
            'fileSize',
            'File size exceeds the limit of 5MB.',
            (value) => {
                if (typeof value === 'string') return true;
                if (!value) return true;
                return value.size <= 5 * 1024 * 1024;
            }
        )
});

export const StoreFormValidation = object().shape({
    name: string()
        .max(30, 'Store name must be 30 chars at minimum')
        .required('Store name is required'),
    storeAddress: string()
        .max(80, 'Store address must be 80 chars at maximum')
        .required('Store address is required'),
    description: string()
        .max(70, 'Description must be 70 chars at maximum')
        .min(6, 'Description must be 6 chars at minimum')
        .required('Description is required'),
    contact: string().required('Contact is required'),
    username: string().required('Username is required'),
    profileAddress: string()
        .max(80, 'Profile address must be 80 chars at maximum')
        .required('Profile address is required'),
    email: string()
        .email('Enter a valid email')
        .test(
            'emailDomain',
            'Enter a valid email',
            (value) => value.includes('.')
        )
        .required('Email is required'),
    password: string().required('Password is required'),
    adminType: string().required('Admin type is required'),
    image: ImageValidation.fields.image
})

export const ProductFormValidation = object().shape({
    name: string().required('Product name is required'),
    price: string()
        .required('Price is required')
        .test('negativePrice',
            'Price must be positive',
            (value) => {
                return value > 0
            }
        ),
    description: string()
        .max(90, 'Description must be 90 chars at maximum')
        .min(6, 'Description must be 6 chars at minimum')
        .required('Description is required'),
    image: ImageValidation.fields.image,
})