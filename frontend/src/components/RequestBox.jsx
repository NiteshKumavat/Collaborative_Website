import React from 'react'

export default function RequestBox({ name, desc, img, project,  onApprove, onReject }) {
  return (
    
    <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center justify-between shadow-lg mt-5">

      <div className="flex items-center gap-4">
        {
          img ? (
            <img
              src={img}
              alt="user"
              className="w-14 h-14 rounded-full object-cover border border-white/30"
            />
          ) : (
            <img 
              src="/defaultUser.png"
              alt="user"
              className="w-14 h-14 rounded-full object-cover border border-white/30"
            />
          )
        }
        

        <div>
          <p className='text-black-200 fonst-extrabold text-base'>{project}</p>
          <p className="text-white font-semibold text-base">{name}</p>
          <p className="text-gray-300 text-sm">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={onApprove}
          className="w-10 h-10 bg-green-500/80 hover:bg-green-600 transition text-white rounded-lg flex items-center justify-center"
        >
          ✔️
        </button>

        <button
          onClick={onReject}
          className="w-10 h-10 bg-red-500/80 hover:bg-red-600 transition text-white rounded-lg flex items-center justify-center"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
