import { Link } from 'react-router-dom';

export default function BlockBtn ({BtnLink, Name}) {
	return (
		<Link
			className="flex items-center px-4 py-2 h-64 rounded-lg shadow-md hover:bg-pistachio-light hover:text-white hover:scale-[1.015]"
			to={BtnLink}
		>
			{Name}
		</Link>
	);
}