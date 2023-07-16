import React, { useState} from "react";
import {Plus, PlusCircle} from "react-bootstrap-icons";

const ShowImage = ({
                       formik = null,
                       width60 = false,
                       width40 = false,
                        width30 = false,
                   }) => {
    const [isHover, setIsHover] = useState(false);


    return (
        <label className="block rounded-full">
            <div
                className={` bg-gray-200 ${width60 && "w-60 h-60 sm:w-40 sm:h-40"} ${
                    width40 && "w-40 h-40"
                } rounded-full transition-all relative !bottom-0 hover:!bottom-2 hover:shadow-2xl hover:shadow-black/60 cursor-pointer flex justify-center`}
            >
                {formik?.values?.image ? (
                    <>
                        <img
                            className={`rounded-full ${width60 && "w-60 h-60 sm:w-40 sm:h-40"} ${
                                width40 && "w-40 h-40"
                            }`}
                            src={URL?.createObjectURL(formik?.values?.image)}
                            alt="image"
                            onMouseEnter={() => setIsHover(true)}
                            onMouseLeave={() => setIsHover(false)}
                        />
                        <div
                            className={`absolute bottom-0 right-0 ${width60 && "w-12 h-12"} ${
                                width40 && "w-10 h-10"
                            } rounded-full bg-emerald-500 flex justify-center items-center ${
                                isHover ? "animated fadeIn" : "animated fadeOut"
                            }`}
                        >
                            <PlusCircle className={`w-8 h-8 text-white`}/>
                        </div>
                    </>
                ) : (
                    <div
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        className={`${width60 && "w-60 h-60 sm:w-40 sm:h-40"} ${
                            width40 && "w-40 h-40"
                        } rounded-full  flex justify-center items-center`}
                    >
                        <p
                            className={`${width60 && "text-2xl"} ${width40 && "text-base"} ${
                                isHover ? "animated fadeIn" : "animated fadeOut"
                            }`}
                        >
                            Upload Image
                        </p>

                        <Plus
                            className={`${width60 && "w-20 h-20"} ${
                                width40 && "w-16 h-16"
                            } mx-auto my-auto ${
                                !isHover ? "animated fadeIn" : "animated fadeOut"
                            }`}
                        />
                    </div>
                )}
            </div>
            <input
                type="file"
                className="hidden"
                name="image"
                id="image"
                accept="image/*"
                onChange={(e) =>
                    formik ? formik.setFieldValue("image", e.target.files[0]) : null
                }
            />
        </label>
    );
};

export default ShowImage;
