import { Link } from 'react-router-dom';

export default function AsideBtn({ BtnLink, Name, isActive }) {
    return (
        <Link 
            className={`px-4 py-2 rounded-lg shadow-md transition-all hover:scale-[1.015] ${
                isActive 
                ? "bg-pistachio-light text-white" 
                : "bg-white hover:bg-pistachio-light hover:text-white"
            }`} 
            to={BtnLink}
        >
            {Name}
        </Link>
    );
};
