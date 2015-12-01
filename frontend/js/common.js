var React = require('react');
var jQuery = require('jquery');

module.exports.api = "/api/";
module.exports.taskListParamName = "taskList";
module.exports.doPost = function (url, data) {
	return jQuery.ajax({
		type: "POST",
		url: url,
		data: JSON.stringify(data),
		contentType: 'application/json'
	});
};
module.exports.doPut = function (url, data) {
	return jQuery.ajax({
		type: "PUT",
		url: url,
		data: JSON.stringify(data),
		contentType: 'application/json'
	});
};
module.exports.doDelete = function (url) {
	return jQuery.ajax({
		type: "DELETE",
		url: url
	});
};
module.exports.getURLParameter = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
};
module.exports.Menu = React.createClass({
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
									<a href="http://localhost:8080/">
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