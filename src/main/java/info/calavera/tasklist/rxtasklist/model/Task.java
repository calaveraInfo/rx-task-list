package info.calavera.tasklist.rxtasklist.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Task {
    private @GeneratedValue @Id Long id;
    private @Column String description;
    private @Column boolean completed;
    private @Column Priority priority = Priority.MEDIUM;
    private @ManyToOne TaskList taskList;

    public Task() {
    }

    public Task(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

		public TaskList getTaskList() {
			return taskList;
		}

		public void setTaskList(TaskList taskList) {
			this.taskList = taskList;
		}

		public boolean getCompleted() {
			return completed;
		}

		public void setCompleted(boolean completed) {
			this.completed = completed;
		}

		public Priority getPriority() {
			return priority;
		}

		public void setPriority(Priority priority) {
			this.priority = priority;
		}

}
