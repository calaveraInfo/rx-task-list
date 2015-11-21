package info.calavera.tasklist.rxtasklist.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class TaskList {
	private @GeneratedValue @Id Long id;
	private @Column String title;
	private @OneToMany List<Task> tasks;
	
	public TaskList() {
		// noop
	}
	
	public TaskList(String title) {
		this.title = title;
	}

	public Long getId() {
		return id;
	}
	
	public List<Task> getTasks() {
		return tasks;
	}
	
	public void setTasks(List<Task> tasks) {
		this.tasks = tasks;
	}
	
	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
}
