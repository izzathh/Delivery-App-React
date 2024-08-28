import { IoCloseCircleOutline } from "react-icons/io5";
import { ImageValidation } from "../schema";
import { useDeliveryApp } from "../hooks";

const ImageUploader = ({
    imagePreview,
    setImagePreview,
    setOpenImageUploader,
    onClickCallBack,
    setNewImage,
    buttonTxt
}) => {
    const { toastIt } = useDeliveryApp()

    const handleDrop = async (e) => {
        try {
            e.preventDefault();
            const imageFile = e.dataTransfer.files[0];
            await ImageValidation.validate({ image: imageFile });
            setNewImage(imageFile)
            setImagePreview(URL.createObjectURL(imageFile))
        } catch (error) {
            toastIt('error', error.message)
            console.error(error);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleImageChange = async (e) => {
        try {
            const { files } = e.target
            await ImageValidation.validate({ image: files[0] });
            setNewImage(files[0])
            setImagePreview(URL.createObjectURL(files[0]))
        } catch (error) {
            toastIt('error', error.message)
            console.error(error);
        }
    }

    return (
        <div className="image-upload-container">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`store-image-uploader ${imagePreview ? 'preview' : ''}`}
            >
                {imagePreview ? (
                    <>
                        <button
                            onClick={() => {
                                setImagePreview(null)
                                setNewImage(null)
                            }}
                        >
                            <IoCloseCircleOutline />
                        </button>
                        <img src={imagePreview} className="store-image" alt="image" />
                    </>
                ) : (
                    <>
                        <p>Drag and drop a image or</p>
                        <label className="img-upload-btn">
                            <input
                                className="image-upload"
                                type="file"
                                name="image"
                                accept=".jpg, .jpeg, .png"
                                onChange={handleImageChange}
                            />
                            Browse Files
                        </label>
                    </>
                )}
            </div>
            <div className="image-uploader-btn">
                <button onClick={onClickCallBack}>{buttonTxt}</button>
                <button onClick={() => {
                    setOpenImageUploader(false)
                    setImagePreview(null)
                    setNewImage(null)
                }}
                >
                    Cancel
                </button>
            </div>
        </div >
    )
}

export default ImageUploader