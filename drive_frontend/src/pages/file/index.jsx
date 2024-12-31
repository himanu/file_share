import axios from "axios";
import { baseUrl } from "../../constant";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOADER_ON, LOADER_OFF } from "../../store/loader/actionTypes";
import { toast } from "react-toastify";
import { allowedFileTypes, encryptFile, formatDate } from "./utils";
import { fileTypeFromBlob } from 'file-type';

const FileShareComponent = () => {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const password = localStorage.getItem("password")
    const loading = useSelector(store => store.loader.loading)
    const user = useSelector(store => store.auth.user)

    // Handle file upload
    const handleFileUpload = async (event) => {
        dispatch({
            type: LOADER_ON
        })
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const type = await fileTypeFromBlob(uploadedFile);
            console.log("file type ", type)
            if (!allowedFileTypes.includes(type?.mime)) {
                toast.dismiss()
                toast.error("Only PDF, PNG, JPEG and Videos can be uploaded")
                dispatch({
                    type: LOADER_OFF
                })
                return;
            }
            const { data, filename } = await encryptFile(uploadedFile, password);
            uploadEncryptedFile(data, filename, type.mime);
            // setFiles((prevFiles) => [...prevFiles, newFile]);
        }
    };
    async function uploadEncryptedFile(encryptedArray, filename, fileType = "") {
        try {
            // Convert Uint8Array to a Blob
            const fileBlob = new Blob([encryptedArray], { type: "application/octet-stream" });
            // Create a FormData object
            const formData = new FormData();
            formData.append("filename", filename);
            formData.append("encrypted_data", fileBlob);
            formData.append("file_type", fileType);

            // Send POST request to the backend
            const { data: { id, filename: file_name, upload_date } } = await axios.post(`${baseUrl}/file`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });
            toast.dismiss()
            toast.success("Successfully uploaded file");
            setFiles((prev) => [...prev, {
                id,
                filename: file_name,
                upload_date
            }])
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            // setFiles()
            dispatch({
                type: LOADER_OFF
            })
        }
    }

    // Handle file click (navigate to URL)
    const handleFileClick = (fileId) => {
        navigate(`/file/${fileId}`);
    };
    const getFiles = async () => {
        try {
            dispatch({
                type: LOADER_ON
            })
            const response = await axios.get(`${baseUrl}/file`, {
                withCredentials: true
            });
            setFiles(response?.data?.files)
            console.log("response ", response);
        } catch (err) {
            if (err.status == 401) {
                navigate("/auth/signin")
            }
        } finally {
            dispatch({
                type: LOADER_OFF
            })
        }
    }
    useEffect(() => {
        getFiles();
    }, [])
    if (loading)
        return null;
    console.log("user ", user);
    return (
        <div className="p-6 mt-6 mx-auto">
            {/* Header with Heading and Upload Button */}
            <div className="flex mb-6 justify-between items-center mb-[30px]">
                {user?.role === "guest" ? <h1 className="text-4xl font-bold text-black-800">Welcome</h1> : <>
                    <h1 className="text-4xl font-bold text-black-800">Your Files</h1>
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Upload File
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                    /></>}
            </div>

            {/* File List or Placeholder Image */}
            {files.length > 0 ? (
                <ul className="space-y-3">
                    {files.map((file) => (
                        <li
                            key={file.id}
                            className="flex justify-between items-center bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-gray-700"
                            onClick={() => handleFileClick(file.id)}
                        >
                            <span className="text-gray-300">{file.filename}</span>
                            <span className="text-gray-400 text-sm">{formatDate(file.upload_date)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        width="160"
                        height="160"
                        fill="none"
                    >
                        <rect width="64" height="64" rx="8" fill="#F3F4F6" />
                        <path
                            d="M12 20H28L30 24H52C53.1046 24 54 24.8954 54 26V46C54 47.1046 53.1046 48 52 48H12C10.8954 48 10 47.1046 10 46V22C10 20.8954 10.8954 20 12 20Z"
                            fill="#D1D5DB"
                        />
                        <path
                            d="M12 20C10.8954 20 10 20.8954 10 22V46C10 47.1046 10.8954 48 12 48H52C53.1046 48 54 47.1046 54 46V26C54 24.8954 53.1046 24 52 24H30L28 20H12Z"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M20 34H44"
                            stroke="#6B7280"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M20 38H44"
                            stroke="#6B7280"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                     */}
                     {user?.role === 'guest' ? <>Copy and paste url shared to you in browser</> : <>
                        <h1 className="text-[80px]"> 😕 </h1>
                        <p className="text-black-800 mt-4">You haven't uploaded any files yet.</p>
                     </>}
                </div>
            )}
        </div>
    );
};

export default FileShareComponent;
