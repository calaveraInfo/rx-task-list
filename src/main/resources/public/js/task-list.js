var taskListModel = {};
taskListModel.taskList = Rx.Observable.just(common.getURLParameter(common.taskListParamName))
	.flatMap(taskListUri => Rx.Observable.fromPromise(jQuery.get(taskListUri)))
	.flatMap(taskList => Rx.Observable.fromPromise(jQuery.get(taskList._links.tasks.href)),
		(taskList, tasks) => ({taskList: taskList, tasks: tasks._embedded.tasks}))
	//.subscribe(value => {console.log(value)});

var TaskList = React.createClass({
	getInitialState: function() {
		return {data: {
			taskList: {title: ""},
			tasks: []
		}};
	},
	render: function() {
		return (
			<div>
				<h1>{this.state.data.taskList.title}</h1>
				<ul>{this.state.data.tasks.map(task => 
					<li>
						{task.description}
					</li>
				)}</ul>
			</div>
		);
	}
});

var TaskListPage = React.createClass({
	componentWillMount: function() {
		this.props.model.taskList.subscribeOnNext(data => {this.taskListComponent.setState({data: data})});
	},
	render: function() {
		return (
			<div>
				<common.Menu />
				<TaskList ref={taskList => this.taskListComponent = taskList} />
			</div>
		);
	}
});
 
React.render(
	<TaskListPage model={taskListModel} />,
	document.body
);