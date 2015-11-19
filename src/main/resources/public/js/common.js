window.common = window.common || {};

(function (ns) {
	ns.Menu = React.createClass({
		render: function() {
			return (
				<nav className="navbar navbar-inverse navbar-fixed-top">
					<div className="container">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
								data-target="#navbar" aria-expanded="false" aria-controls="navbar">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<span className="navbar-brand">Rx Task List</span>
						</div>
						<div id="navbar" className="collapse navbar-collapse">
							<ul className="nav navbar-nav">
								<li className="active">
									<a href="#" key="home">
										Home
									</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			);
		}
	});
})(window.common); 
