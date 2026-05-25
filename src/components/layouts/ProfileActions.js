import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const btnStyle = "bg-white rounded-lg shadow-lg p-2 hover:bg-pistachio-light hover:text-white";

export default function ProfileActions () {
	const { logout, currentRole } = useAuth();

	const base = currentRole === 'doctor' ? '/doctor' : '';

	return (
		<div className="flex flex-col rounded-lg shadow-xl gap-2 absolute right-0 top-[80%] pt-6 z-110 min-w-[180px]">
    	<div className="bg-white rounded-lg shadow-xl flex flex-col gap-2 p-1 border border-gray-100">
        	<Link className={btnStyle} to={`${base}/settings`}>Настройки</Link>
        	<Link className={btnStyle} to={`${base}/changeProfile`}>Сменить аккаунт</Link>
        	<button className={btnStyle} onClick={logout}>Выход</button>
    	</div>
	</div>
	);
}