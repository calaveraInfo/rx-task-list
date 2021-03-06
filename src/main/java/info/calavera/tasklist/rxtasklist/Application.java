package info.calavera.tasklist.rxtasklist;

import info.calavera.tasklist.rxtasklist.model.Task;
import info.calavera.tasklist.rxtasklist.model.TaskList;
import info.calavera.tasklist.rxtasklist.repository.TaskListRepository;
import info.calavera.tasklist.rxtasklist.repository.TaskRepository;

import java.util.ArrayList;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    private static final Logger LOG = LoggerFactory.getLogger(Application.class);

    @Autowired
    TaskRepository tasks;
    
    @Autowired
    TaskListRepository taskLists;

    public static void main(String... args) {
        SpringApplication.run(Application.class, args);
    }

    @PostConstruct
    public void init() {
        LOG.info("Initializing database with random testing data.");
        TaskList taskList = new TaskList("Some tasklist");
        taskLists.save(taskList);
        taskList.setTasks(new ArrayList<Task>());
        for (int i = 0; i < 10; i++) {
        	Task task = new Task("Some task " + i);
        	task.setTaskList(taskList);
        	tasks.save(task);
        	taskList.getTasks().add(task);
        }
        taskLists.save(taskList);
    }
}