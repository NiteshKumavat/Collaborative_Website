import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // THIS PART IS CRITICAL
      colors: {
        collab: {
          bg: "#0B0C15",       
          card: "#151725",     
          primary: "#6366F1",  
          accent: "#8B5CF6",   
          text: "#E2E8F0",     
          muted: "#94A3B8",    
        }
      },
      // ... rest of the config
    },
  },
  plugins: [daisyui],
};