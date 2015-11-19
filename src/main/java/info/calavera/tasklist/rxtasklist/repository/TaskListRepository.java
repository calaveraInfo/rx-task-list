package info.calavera.tasklist.rxtasklist.repository;

import org.springframework.data.repository.CrudRepository;

import info.calavera.tasklist.rxtasklist.model.TaskList;

public interface TaskListRepository extends CrudRepository<TaskList, Long>  {

}
