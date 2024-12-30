import { baseUrl } from '../../constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decryptFile, downloadFile, formatDate } from './utils';
import ShareModal from './Share';
import { Button } from '../../components/ui/button';
import { Share2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../store/auth/action';
import { getFileAccessList } from '../../store/file/action';

const FileDetails = () => {
   const { fileId } = useParams();
   const [file, setFile] = useState();
   const [youAreOwner, setOwnership] = useState(false);
   const [fileUploadDate, setUploadFileDate] = useState();
   const dispatch = useDispatch();
   const users = useSelector((state) => state.auth.users);
   const navigate = useNavigate();
  const renderPreview = () => {
    const { type, previewUrl = URL.createObjectURL(file) } = file;
    if (type.startsWith('image/')) {
      return <img src={previewUrl} alt={file.name} className="w-full h-auto rounded-md" />;
    }

    if (type.startsWith('video/')) {
      return (
        <video controls className="w-full rounded-md">
          <source src={previewUrl} type={type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (type === 'application/pdf') {
      return (
        <iframe
          src={previewUrl}
          title={file.name}
          className="w-full h-96 border rounded-md"
        >
          PDF preview not supported.
        </iframe>
      );
    }

    if (type.startsWith('text/')) {
      return (
        <iframe
          src={previewUrl}
          title={file.name}
          className="w-full h-48 border rounded-md"
        >
          Text preview not supported.
        </iframe>
      );
    }

    return <p className="text-gray-500">Preview not available for this file type.</p>;
  };

  const getFile = async () => {
    try {
        const {data} = await axios.get(`${baseUrl}/file?file_id=${fileId}`, {
            withCredentials: true
        });
        const blob = atob(data?.files?.encrypted_content)
        const decodedArray = Uint8Array.from(blob, c => c.charCodeAt(0));

        // Now `decodedArray` is your original encrypted data as a binary array (Uint8Array)
        const decrypted = await decryptFile(decodedArray, localStorage.getItem("password"))
        const decryptedBlob = new Blob([decrypted.data], { type: data?.files?.fileType ?? "" });
        const decryptedFile = new File([decryptedBlob], data?.files?.filename, { type: data?.files?.fileType ?? "" });
        setFile(decryptedFile)
        setUploadFileDate(data?.files?.upload_date)
        setOwnership(data?.files?.youAreOwner ?? false)
    } catch(error) {
        if (error.status === 401) {
            toast.error("You don't have access to the file")
            navigate("/")
        } else {
            toast.error("Something Went Wrong!")
        }
    }
    // downloadFile(decrypted.data, data?.files?.filename);
    // setFiles(response?.data?.files)
  }
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getFile();
    dispatch(getFileAccessList(fileId, navigate))
    if (!users || !users?.length)
        dispatch(getUsers())
  }, [])

  return (
    <div className="p-6 mt-6 mx-auto">
        <div className="flex mb-6 justify-between items-center mb-[30px]">
            <h1 className="text-4xl font-bold text-black-800">File Details</h1>
            <Button disabled={!youAreOwner} onClick={() => setModalOpen(true)} className="bg-sky-500 text-white hover:bg-sky-600"> Share <Share2Icon /> </Button>
        </div>
      <div className="mb-2 text-left">
        <strong className="text-black-700">File Name:</strong> {file?.name ?? ""}
      </div>
      <div className="mb-2 text-left">
        <strong className="text-black-700">Upload Date:</strong> {fileUploadDate ? formatDate(fileUploadDate): ""}
      </div>
      <div>
        <ShareModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            fileName="ExampleFile.txt"
            copyLink={() => {}}
            users={users}
            fileId={fileId}
        />

      </div>
      <div className="mt-4">
        <strong className="text-black-500">File Preview:</strong>
        <div>
            {file && renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
