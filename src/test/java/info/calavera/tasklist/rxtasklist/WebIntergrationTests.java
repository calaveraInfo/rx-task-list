package info.calavera.tasklist.rxtasklist;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import info.calavera.tasklist.rxtasklist.model.Task;
import info.calavera.tasklist.rxtasklist.repository.TaskRepository;

import java.net.URI;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.util.UriTemplate;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@SpringApplicationConfiguration(classes = Application.class)
public class WebIntergrationTests {
    @Autowired
    WebApplicationContext context;
    @Autowired
    TaskRepository tasks;

    MockMvc mvc;

    @Before
    public void setUp() {
        this.mvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void testApi() throws Exception {
        Task task = tasks.findAll().iterator().next();
        URI uri = new UriTemplate("/api/tasks/{id}").expand(task.getId());
        MockHttpServletResponse response = mvc.perform(get(uri)).andExpect(status().isOk()).andReturn().getResponse();
    }
}
