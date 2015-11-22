var taskListModel = {};
taskListModel.newTask = {};
taskListModel.newTask.formSubmissions = new Rx.Subject();
taskListModel.task = new Rx.Subject();

taskListModel.newTask.confirmations = taskListModel.newTask.formSubmissions
	.doOnNext(value => {console.log(value)})
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
	getInitialState: function() {
		return {taskListId: ""};
	},
	onSubmit: function(event) {
		event.preventDefault();
		this.props.model.formSubmissions.onNext({description: this.description, taskList: this.state.taskListId});
	},
	render: function() {
		return (
			<form onSubmit={this.onSubmit}>
				<input type="text" onChange={event => this.description = event.target.value} />
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
		//this.setState({editable: true});
	},
	onEdit: function() {
		this.setState({editable: true});
	},
	onCancel: function() {
		this.setState(this.getInitialState());
	},
	renderReadOnly: function() {
		return (
			<li>
				{this.props.data.description}
				<input type="button" onClick={this.onEdit} value="Edit"/>
			</li>
		);
	},
	renderEditable: function() {
		return (
			<li>
				<input type="text" value={this.state.description} onChange={event => this.setState({description: event.target.value})}/>
				<input type="button" onClick={this.onSave} value="Save"/>
				<input type="button" onClick={this.onCancel} value="Cancel"/>
			</li>
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
					<Task data={task} model={this.props.taskModel}/>
				)}</ul>
			</div>
		);
	}
});

var TaskListPage = React.createClass({
	componentWillMount: function() {
		this.props.model.taskList.subscribeOnNext(data => {
			this.taskListComponent.setState(data);
			this.newTaskComponent.setState({taskListId: data.taskList._links.self.href});
		});
	},
	render: function() {
		return (
			<div>
				<common.Menu />
				<NewTask ref={newTask => this.newTaskComponent = newTask} model={this.props.model.newTask} />
				<TaskList ref={taskList => this.taskListComponent = taskList} taskModel={this.props.model.task}/>
			</div>
		);
	}
});
 
React.render(
	<TaskListPage model={taskListModel} />,
	document.body
);