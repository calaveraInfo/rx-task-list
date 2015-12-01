var React = require('react');
var common = require('./common.js');
var ReactDOM = require('react-dom');
var Rx = require('rx');
var jQuery = require('jquery');

var taskListModel = {};
taskListModel.newTask = {};
taskListModel.newTask.formSubmissions = new Rx.Subject();
taskListModel.task = {};
taskListModel.task.updates = new Rx.Subject();
taskListModel.task.deletes = new Rx.Subject();

taskListModel.taskList = Rx.Observable.just(common.getURLParameter(common.taskListParamName))
	.flatMap(taskListUri => Rx.Observable.fromPromise(jQuery.get(taskListUri)))
	.flatMap(taskList => Rx.Observable.fromPromise(jQuery.get(taskList._links.tasks.href))
		.map(tasks => tasks._embedded.tasks)
		.merge(taskListModel.newTask.formSubmissions
			.withLatestFrom(
				Rx.Observable.just(common.api)
					.flatMap(apiUrl => Rx.Observable.fromPromise(jQuery.get(apiUrl)))
					.map(apiHal => apiHal._links.tasks.href),
				(entity, url) => ({entity: entity, url: url}))
			.flatMap(submission => Rx.Observable.fromPromise(common.doPost(submission.url, submission.entity)))
			.map(newTask => ({task: newTask, isNew: true})))
		.merge(taskListModel.task.updates
			.flatMap(taskUpdate => Rx.Observable.fromPromise(common.doPut(taskUpdate.url, taskUpdate.entity)))
			.map(updatedTask => ({task: updatedTask, isUpdated: true})))
		.merge(taskListModel.task.deletes
			.flatMap(deleteUrl => Rx.Observable.fromPromise(common.doDelete(deleteUrl)), deleteUrl => deleteUrl)
			.map(deleteUrl => ({task: deleteUrl, isDeleted: true})))
		.scan((previous, current) => jQuery.isArray(current) ? current :
			current.isNew ? previous.concat(current.task) :
			current.isUpdated ? previous.map(oldTask => oldTask._links.self.href == current.task._links.self.href ? current.task : oldTask) :
			current.isDeleted ? previous.filter(task => task._links.self.href != current.task) : []),
		(taskList, tasks) => ({taskList: taskList, tasks: tasks
			.sort((t1, t2) => t1.description.localeCompare(t2.description))}));

var NewTask = React.createClass({
	render: function() {
		return (
			<form onSubmit={e => {e.preventDefault(); this.props.onSubmit({description: this.description});}}>
				<div className="form-group">
					<label htmlFor="newTaskDescription">New task description</label>
					<input id="newTaskDescription" type="text" onChange={e => {this.description = e.target.value}} className="form-control" />
				</div>
				<input type="submit" value="Create new task" className="btn btn-primary"/>
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
			<tr>
				<td></td>
				<td>
					<input checked={this.state.completed} onChange={this.onToggleCompleted} type="checkbox" />
				</td>
				<td>
					<select value={this.state.priority} onChange={this.onPriorityChange}>
						<option value="HIGH">High</option>
						<option value="MEDIUM">Medium</option>
						<option value="LOW">Low</option>
					</select>
				</td>
				<td onClick={this.enableEdit}>
					{this.props.data.description}
				</td>
			</tr>
		);
	},
	renderEditable: function() {
		return (
			<tr>
				<td>
					<input value="Delete" onClick={this.onDelete} type="button" className="btn btn-danger"/>
				</td>
				<td>
					<input checked={this.state.completed} onChange={this.onToggleCompleted} type="checkbox" />
				</td>
				<td>
					<select value={this.state.priority} onChange={this.onPriorityChange}>
						<option value="HIGH">High</option>
						<option value="MEDIUM">Medium</option>
						<option value="LOW">Low</option>
					</select>
				</td>
				<td>
					<form onSubmit={this.onSave}>
						<div className="form-group">
							<input value={this.state.description} onChange={e => {this.setState({description: e.target.value});}} type="text" className="form-control"/>
						</div>
						<input value="Save" type="submit" className="btn btn-primary"/>
						<input value="Cancel" onClick={this.disableEdit} type="button" className="btn btn-default"/>
					</form>
				</td>
			</tr>
			
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
				<h1>Task List: {this.state.taskList.title}</h1>
				<table className="table table-hover">
					<thead>
						<tr>
							<th className="actionColumn">
								
							</th>
							<th className="checkboxColumn">
								Finished
							</th>
							<th className="priorityColumn">
								Priority
							</th>
							<th className="descriptionColumn">
								Description
							</th>
						</tr>
					</thead>
					<tbody>{this.state.tasks.map(task =>
						<Task data={task} onSubmit={this.props.onSubmit} onDelete={this.props.onDelete} key={task._links.self.href} />
					)}</tbody>
				</table>
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
			<div className="container">
				<common.Menu />
				<TaskList onSubmit={this.updateTask} onDelete={this.deleteTask} ref={taskList => {this.taskListComponent = taskList;}}/>
				<NewTask onSubmit={this.newTask} ref={newTask => {this.newTaskComponent = newTask}}/>
			</div>
		);
	}
});

React.render(
	<TaskListController model={taskListModel} />,
	document.getElementById("app")
);