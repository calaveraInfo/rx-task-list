var taskListsModel = {};
taskListsModel.lists = Rx.Observable.just(common.api)
	.flatMap(apiUrl => Rx.Observable.fromPromise(jQuery.get(apiUrl)))
	.map(apiHal => apiHal._links.taskLists.href)
	.flatMap(url => Rx.Observable.fromPromise(jQuery.get(url)))
	.map(apiTaskList => apiTaskList._embedded.taskLists);
	//.subscribe(value => {console.log(value)});

var TaskLists = React.createClass({
	getInitialState: function() {
		return {
			taskLists: []
		};
	},
	render: function() {
		return (
			<ul>
				{this.state.taskLists.map(taskList => 
					<li key={taskList._links.taskList.href}>
						<a href={"task-list.html?"+common.taskListParamName+"="+taskList._links.taskList.href}>{taskList.title}</a>
					</li>
				)}
			</ul>
		);
	}
});

var TaskListsPage = React.createClass({
	componentWillMount: function() {
		this.props.model.lists.subscribeOnNext(taskLists => {this.taskListsComponent.setState({taskLists: taskLists})});
	},
	render: function() {
		return (
			<div>
				<common.Menu />
				<TaskLists ref={taskLists => this.taskListsComponent = taskLists}/>
			</div>
		);
	}
});
 
React.render(
	<TaskListsPage model={taskListsModel} />,
	document.body
);