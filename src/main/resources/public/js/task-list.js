var taskListModel = {};
taskListModel.newTask = {};
taskListModel.newTask.formSubmissions = new Rx.Subject();
taskListModel.task = new Rx.Subject();

taskListModel.newTask.confirmations = taskListModel.newTask.formSubmissions
	.withLatestFrom(
		Rx.Observable.just(common.api)
			.flatMap(apiUrl => Rx.Observable.fromPromise(jQuery.get(apiUrl)))
			.map(apiHal => apiHal._links.tasks.href),
		(entity, url) => ({entity: entity, url: url}))
	.flatMap(submission => Rx.Observable.fromPromise(common.doPost(submission.url, submission.entity)));

taskListModel.taskList = Rx.Observable.just(common.getURLParameter(common.taskListParamName))
	.combineLatest(taskListModel.newTask.confirmations.startWith("whatever"), url => url)
	.flatMap(taskListUri => Rx.Observable.fromPromise(jQuery.get(taskListUri)))
	.flatMap(taskList => Rx.Observable.fromPromise(jQuery.get(taskList._links.tasks.href)),
		(taskList, tasks) => ({taskList: taskList, tasks: tasks._embedded.tasks}))

var NewTask = React.createClass({
	render: function() {
		return (
			<form onSubmit={e => {e.preventDefault(); this.props.onSubmit({description: this.description});}}>
				<input type="text" onChange={e => {this.description = e.target.value}} />
				<input type="submit" value="Create new task"/>
			</form>
		);
	}
});

var Task = React.createClass({
	getInitialState: function() {
		return {
			editable: false,
			description: this.props.data.description
		};
	},
	onSave: function() {
		this.props.onSubmit({description: this.state.description});
	},
	renderReadOnly: function() {
		return (
			<span onClick={() => {this.setState({editable: true});}}>{this.props.data.description}</span>
		);
	},
	renderEditable: function() {
		return (
			<span>
				<input value={this.state.description} onChange={e => this.setState({description: e.target.value})} type="text" />
				<input value="Save" onClick={this.onSave} type="button" />
				<input value="Cancel" onClick={() => {this.setState(this.getInitialState());}} type="button" />
			</span>
		);
	},
	render: function() {
		return this.state.editable ? this.renderEditable() : this.renderReadOnly();
	}
});

var TaskList = React.createClass({
	getInitialState: function() {
		return {
			taskList: {title: ""},
			tasks: []
		};
	},
	render: function() {
		return (
			<div>
				<h1>{this.state.taskList.title}</h1>
				<ul>{this.state.tasks.map(task =>
					<li>
						<Task data={task} onSubmit={this.props.onSubmit} />
					</li>
				)}</ul>
			</div>
		);
	}
});

var TaskListController = React.createClass({
	componentWillMount: function() {
		this.props.model.taskList.subscribeOnNext(data => {this.taskListComponent.setState(data);});
	},
	newTask: function(task) {
		task.taskList = this.taskListComponent.state.taskList._links.self.href;
		this.props.model.newTask.formSubmissions.onNext(task);
	},
	updateTask: function(task) {
		console.log(task);
	},
	render: function() {
		return (
			<div>
				<common.Menu />
				<NewTask onSubmit={this.newTask} ref={newTask => {this.newTaskComponent = newTask}}/>
				<TaskList onSubmit={this.updateTask} ref={taskList => {this.taskListComponent = taskList;}}/>
			</div>
		);
	}
});

React.render(
	<TaskListController model={taskListModel} />,
	document.body
);