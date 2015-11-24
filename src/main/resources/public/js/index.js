var taskListsModel = {};
taskListsModel.newTaskList = {};
taskListsModel.newTaskList.formSubmissions = new Rx.Subject();
taskListsModel.api = Rx.Observable.just(common.api)
	.flatMap(apiUrl => Rx.Observable.fromPromise(jQuery.get(apiUrl)))
	.map(apiHal => apiHal._links.taskLists.href)
	.shareReplay(1);

taskListsModel.newTaskList.confirmations = taskListsModel.newTaskList.formSubmissions
	.withLatestFrom(taskListsModel.api, (entity, url) => ({entity: entity, url: url}))
	.flatMap(submission => Rx.Observable.fromPromise(common.doPost(submission.url, submission.entity)));

taskListsModel.lists = taskListsModel.api
	.combineLatest(taskListsModel.newTaskList.confirmations.startWith("whatever"), url => url)
	.flatMap(url => Rx.Observable.fromPromise(jQuery.get(url)))
	.map(apiTaskList => apiTaskList._embedded.taskLists);

var NewTaskList = React.createClass({
	render: function() {
		return (
			<form onSubmit={e => {e.preventDefault(); this.props.onSubmit({title: this.title});}}>
				<input type="text" onChange={e => {this.title = e.target.value}} />
				<input type="submit" value="Create new task list"/>
			</form>
		);
	}
});

var TaskLists = React.createClass({
	getInitialState: function() {
		return {taskLists: []};
	},
	render: function() {
		return (
			<ul>{this.state.taskLists.map(taskList => 
				<li key={taskList._links.taskList.href}>
					<a href={"task-list.html?"+common.taskListParamName+"="+taskList._links.taskList.href}>{taskList.title}</a>
				</li>
			)}</ul>
		);
	}
});

var TaskListsController = React.createClass({
	componentWillMount: function() {
		this.props.model.lists.subscribeOnNext(taskLists => {this.taskListsComponent.setState({taskLists: taskLists})});
	},
	render: function() {
		return (
			<div>
				<common.Menu />
				<NewTaskList onSubmit={taskList => {this.props.model.newTaskList.formSubmissions.onNext(taskList);}} />
				<TaskLists ref={taskLists => {this.taskListsComponent = taskLists;}} />
			</div>
		);
	}
});
 
React.render(
	<TaskListsController model={taskListsModel} />,
	document.body
);