var taskListModel = {};
taskListModel.newTask = {};
taskListModel.newTask.formSubmissions = new Rx.Subject();
taskListModel.task = {};
taskListModel.task.updates = new Rx.Subject();
taskListModel.task.deletes = new Rx.Subject();

taskListModel.task.updateConfirmations = Rx.Observable.merge(
	taskListModel.task.updates
		.flatMap(taskUpdate => Rx.Observable.fromPromise(common.doPut(taskUpdate.url, taskUpdate.entity))),
	taskListModel.task.deletes
		.flatMap(deleteUrl => Rx.Observable.fromPromise(common.doDelete(deleteUrl))));

taskListModel.newTask.confirmations = taskListModel.newTask.formSubmissions
	.withLatestFrom(
		Rx.Observable.just(common.api)
			.flatMap(apiUrl => Rx.Observable.fromPromise(jQuery.get(apiUrl)))
			.map(apiHal => apiHal._links.tasks.href),
		(entity, url) => ({entity: entity, url: url}))
	.flatMap(submission => Rx.Observable.fromPromise(common.doPost(submission.url, submission.entity)));

taskListModel.taskList = Rx.Observable.just(common.getURLParameter(common.taskListParamName))
	.combineLatest(
		taskListModel.newTask.confirmations.startWith("whatever"),
		taskListModel.task.updateConfirmations.startWith("whatever"),
		url => url)
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
			description: this.props.data.description,
			completed: this.props.data.completed,
			priority: this.props.data.priority
		};
	},
	onToggleCompleted: function (e) {
		this.setState({completed: e.target.checked});
		this.update(e.target.checked, this.state.priority);
	},
	onPriorityChange: function (e) {
		this.setState({priority: e.target.value});
		this.update(this.state.completed, e.target.value);
	},
	update: function (completed, priority) {
		this.props.onSubmit({
			description: this.state.description,
			completed: completed,
			priority: priority
		}, this.props.data._links.self.href);
	},
	onSave: function(e) {
		e.preventDefault();
		this.setState({editable: false});
		this.update(this.state.completed, this.state.priority);
	},
	onDelete: function(e) {
		this.props.onDelete(this.props.data._links.self.href);
	},
	enableEdit: function() {this.setState({editable: true});},
	disableEdit: function() {
		this.setState(this.getInitialState());
	},
	renderReadOnly: function() {
		return (
			<form>
				<input checked={this.state.completed} onChange={this.onToggleCompleted} type="checkbox" />
				<select value={this.state.priority} onChange={this.onPriorityChange}>
					<option value="HIGH">High</option>
					<option value="MEDIUM">Medium</option>
					<option value="LOW">Low</option>
				</select>
				<span onClick={this.enableEdit}>{this.props.data.description}</span>
			</form>
		);
	},
	renderEditable: function() {
		return (
			<form onSubmit={this.onSave}>
				<input value={this.state.description} onChange={e => {this.setState({description: e.target.value});}} type="text" />
				<input value="Save" type="submit" />
				<input value="Delete" onClick={this.onDelete} type="button" />
				<input value="Cancel" onClick={this.disableEdit} type="button" />
			</form>
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
					<li key={task._links.self.href}>
						<Task data={task} onSubmit={this.props.onSubmit} onDelete={this.props.onDelete} />
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
	updateTask: function(task, id) {
		this.props.model.task.updates.onNext({entity: task, url: id});
	},
	deleteTask: function(id) {
		this.props.model.task.deletes.onNext(id)
	},
	render: function() {
		return (
			<div>
				<common.Menu />
				<NewTask onSubmit={this.newTask} ref={newTask => {this.newTaskComponent = newTask}}/>
				<TaskList onSubmit={this.updateTask} onDelete={this.deleteTask} ref={taskList => {this.taskListComponent = taskList;}}/>
			</div>
		);
	}
});

React.render(
	<TaskListController model={taskListModel} />,
	document.body
);