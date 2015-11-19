var App = React.createClass({
	render: function() {
		return (
			<div>
				<common.Menu />
			</div>
		);
	}
});
 
React.render(
	<App />,
	document.body
);