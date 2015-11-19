package info.calavera.tasklist.rxtasklist;

import static org.junit.Assert.assertThat;
import info.calavera.tasklist.rxtasklist.model.Task;
import info.calavera.tasklist.rxtasklist.model.TaskList;
import info.calavera.tasklist.rxtasklist.repository.TaskListRepository;
import info.calavera.tasklist.rxtasklist.repository.TaskRepository;

import org.hamcrest.collection.IsIterableWithSize;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class ApplicationIntegrationTests {
    @Autowired
    TaskRepository taskRepository;
    @Autowired
    TaskListRepository taskListRepository;

    @Test
    public void taskRepositoryTest() {
        Iterable<Task> result = taskRepository.findAll();
        assertThat(result, IsIterableWithSize.<Task> iterableWithSize(10));
    }
    
    @Test
    public void taskListRepositoryTest() {
        Iterable<TaskList> result = taskListRepository.findAll();
        assertThat(result, IsIterableWithSize.<TaskList> iterableWithSize(1));
        //assertThat(result.iterator().next().getTasks(), IsIterableWithSize.<Task> iterableWithSize(10));
        
    }
}
