import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfileHeader({ info, setInfo, isOwner, editMode, setEditMode, saveChanges }) {
    // eslint-disable-next-line no-unused-vars
    const [previewImage, setPreviewImage] = useState(info?.profilePicture || "/default.jpg");

    const {logout} = useAuthStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setPreviewImage(localPreview);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setInfo(prev => ({ ...prev, profilePicture: reader.result }));
        };
    };

    return (
        <div className="flex flex-col items-center relative">

            {isOwner && (
                <button
                    className="absolute left-0 top-0 px-5 py-2 
                    bg-gradient-to-r from-blue-500 to-purple-500 
                    hover:from-blue-400 hover:to-purple-400 
                    active:from-blue-300 active:to-purple-300 
                    text-white rounded-xl transition-all duration-200"
                    onClick={logout}
                >
                    logout
                </button>
            )}

            {isOwner && (
                <button
                    className="absolute right-0 top-0 px-5 py-2 
                    bg-gradient-to-r from-blue-500 to-purple-500 
                    hover:from-blue-400 hover:to-purple-400 
                    active:from-blue-300 active:to-purple-300 
                    text-white rounded-xl transition-all duration-200"
                    onClick={() => (editMode ? saveChanges() : setEditMode(true))}
                >
                    {editMode ? "Save" : "Edit"}
                </button>
            )}

            <div className="relative">
                <img
                    src={info.profilePicture}
                    alt="profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />

                {editMode && (
                    <>
                        <label
                            htmlFor="imageUpload"
                            className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-black/80"
                        >
                            Change
                        </label>

                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </>
                )}
            </div>

            <h1 className="text-2xl font-semibold mt-3">{info?.userName}</h1>
            <p className="text-gray-300 text-sm">{info?.fullName}</p>
        </div>
    );
}



