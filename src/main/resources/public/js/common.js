window.common = window.common || {};

(function (ns) {
	ns.api = "/api/";
	ns.taskListParamName = "taskList";
	ns.doPost = function (url, data) {
		return jQuery.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			contentType: 'application/json'
		});
	};
	ns.getURLParameter = function(name) {
	  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	};
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
