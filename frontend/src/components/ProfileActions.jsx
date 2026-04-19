export default function ProfileActions({ 
    isOwner, 
    profileId, 
    isBlocked, 
    block, 
    unBlock ,
    deleteProfile
}) {

    return (
        <div className="flex justify-center mt-6">

            {isOwner ? (
                <button 
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={async function() {
                        await deleteProfile();
                        window.location.reload();
                        
                    }}
                >
                    Delete Profile
                </button>
            ) : (
                <button
                    onClick={() =>
                        isBlocked
                            ? unBlock(profileId)
                            : block(profileId)
                    }
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    {isBlocked ? "Unblock User" : "Block User"}
                </button>
            )}

        </div>
    );
}
