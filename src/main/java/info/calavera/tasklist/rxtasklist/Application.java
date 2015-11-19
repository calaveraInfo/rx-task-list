package info.calavera.tasklist.rxtasklist;

import info.calavera.tasklist.rxtasklist.model.Task;
import info.calavera.tasklist.rxtasklist.repository.TaskRepository;

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

    public static void main(String... args) {
        SpringApplication.run(Application.class, args);
    }

    @PostConstruct
    public void init() {
        LOG.info("Initializing database with random testing data.");
        tasks.save(new Task("Some task"));
    }
}