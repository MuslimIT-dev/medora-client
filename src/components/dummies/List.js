const List = ({ list }) => {
	return(
		<div>
			<ol>
				{list.map((text, i) => 
					<li key={i}>{text}</li>
				)}
			</ol>
		</div>
	);
};

export default List;