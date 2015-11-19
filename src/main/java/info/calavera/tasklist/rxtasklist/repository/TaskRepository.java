package info.calavera.tasklist.rxtasklist.repository;

import info.calavera.tasklist.rxtasklist.model.Task;

import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<Task, Long> {

}
