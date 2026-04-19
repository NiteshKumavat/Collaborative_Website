import React, { useEffect, useState } from 'react';
import UserInfo from '../components/UserInfo.jsx';
import { useProfileStore } from '../store/useProfileStore.js';
import { useNavigate } from 'react-router-dom';

function Developers() {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const { allusers, getUsers } = useProfileStore();

    const texthandler = (event) => {
        setText(event.target.value);
    };

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = allusers?.filter((user) =>
        user.fullName?.toLowerCase().includes(text.toLowerCase()) ||
        user.userName?.toLowerCase().includes(text.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full pb-20"> {/* Added pb-20 for footer space */}
            
            {/* Added pt-10 to push content down from the Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                
                {/* Search Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Find Developers</h2>
                    <p className="text-gray-400 mb-6">Connect with skilled students and professionals.</p>
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {/* Search Icon */}
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or username..."
                            className="input-field pl-12" // Using our global 'input-field' class from index.css
                            value={text}
                            onChange={texthandler}
                        />
                    </div>
                </div>

                {/* Grid Layout for Cards (Instead of vertical stack) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers?.length > 0 ? (
                        filteredUsers.map((user) => (
                            <UserInfo key={user._id} user={user} click={() => navigate(`/profile/${user.user}`)}/>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 text-lg">No developers found matching "{text}".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Developers;