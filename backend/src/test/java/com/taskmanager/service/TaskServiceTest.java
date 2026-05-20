package com.taskmanager.service;

import com.taskmanager.dto.DashboardStats;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskService(taskRepository);
    }

    @Test
    void createTask_shouldCreateAndReturnTask() {
        TaskRequest request = new TaskRequest("Test Task", "Description", "TODO", "HIGH", "2025-12-31", null);

        TaskResponse response = taskService.createTask(request, "user-123");

        assertNotNull(response.getId());
        assertEquals("Test Task", response.getTitle());
        assertEquals("Description", response.getDescription());
        assertEquals("TODO", response.getStatus());
        assertEquals("HIGH", response.getPriority());
        assertEquals("2025-12-31", response.getDueDate());
        assertEquals("user-123", response.getAssigneeId());
        assertEquals("user-123", response.getCreatorId());

        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(taskCaptor.capture());
        assertEquals("Test Task", taskCaptor.getValue().getTitle());
    }

    @Test
    void createTask_shouldDefaultStatusAndPriority() {
        TaskRequest request = new TaskRequest("Task", null, null, null, null, null);

        TaskResponse response = taskService.createTask(request, "user-123");

        assertEquals("TODO", response.getStatus());
        assertEquals("MEDIUM", response.getPriority());
    }

    @Test
    void getTask_shouldReturnTask() {
        Task task = createTestTask("task-1", "Test", "TODO", "HIGH", "user-123");
        when(taskRepository.findById("task-1")).thenReturn(Optional.of(task));

        TaskResponse response = taskService.getTask("task-1");

        assertEquals("task-1", response.getId());
        assertEquals("Test", response.getTitle());
    }

    @Test
    void getTask_shouldThrowWhenNotFound() {
        when(taskRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> taskService.getTask("nonexistent"));
    }

    @Test
    void getTasksForUser_shouldReturnSortedTasks() {
        Task task1 = createTestTask("t1", "Task1", "TODO", "LOW", "user-1");
        task1.setDueDate("2025-12-31");
        Task task2 = createTestTask("t2", "Task2", "TODO", "HIGH", "user-1");
        task2.setDueDate("2025-06-15");
        Task task3 = createTestTask("t3", "Task3", "TODO", "CRITICAL", "user-1");
        task3.setDueDate("2025-06-15");

        when(taskRepository.findAllByUserId("user-1")).thenReturn(Arrays.asList(task1, task2, task3));

        List<TaskResponse> tasks = taskService.getTasksForUser("user-1");

        assertEquals(3, tasks.size());
        assertEquals("t3", tasks.get(0).getId());
        assertEquals("t2", tasks.get(1).getId());
        assertEquals("t1", tasks.get(2).getId());
    }

    @Test
    void updateTask_shouldUpdateFields() {
        Task existing = createTestTask("task-1", "Old Title", "TODO", "LOW", "user-1");
        when(taskRepository.findById("task-1")).thenReturn(Optional.of(existing));

        TaskRequest request = new TaskRequest("New Title", null, "IN_PROGRESS", "HIGH", null, null);

        TaskResponse response = taskService.updateTask("task-1", request, "user-1");

        assertEquals("New Title", response.getTitle());
        assertEquals("IN_PROGRESS", response.getStatus());
        assertEquals("HIGH", response.getPriority());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void deleteTask_shouldDeleteWhenAuthorized() {
        Task task = createTestTask("task-1", "Test", "TODO", "LOW", "user-1");
        when(taskRepository.findById("task-1")).thenReturn(Optional.of(task));

        taskService.deleteTask("task-1", "user-1");

        verify(taskRepository).deleteById("task-1");
    }

    @Test
    void deleteTask_shouldThrowWhenNotAuthorized() {
        Task task = createTestTask("task-1", "Test", "TODO", "LOW", "user-1");
        task.setAssigneeId("user-1");
        when(taskRepository.findById("task-1")).thenReturn(Optional.of(task));

        assertThrows(SecurityException.class, () -> taskService.deleteTask("task-1", "user-other"));
    }

    @Test
    void getDashboardStats_shouldCalculateStats() {
        Task t1 = createTestTask("t1", "Done task", "DONE", "LOW", "user-1");
        Task t2 = createTestTask("t2", "Todo task", "TODO", "HIGH", "user-1");
        Task t3 = createTestTask("t3", "Overdue task", "TODO", "CRITICAL", "user-1");
        t3.setDueDate(LocalDate.now().minusDays(1).toString());
        Task t4 = createTestTask("t4", "Cancelled task", "CANCELLED", "MEDIUM", "user-1");

        when(taskRepository.findAllByUserId("user-1")).thenReturn(Arrays.asList(t1, t2, t3, t4));

        DashboardStats stats = taskService.getDashboardStats("user-1");

        assertEquals(4, stats.getTotalTasks());
        assertEquals(1, stats.getCompletedTasks());
        assertEquals(2, stats.getPendingTasks());
        assertEquals(1, stats.getOverdueTasks());
        assertEquals(3, stats.getTasksByStatus().size());
        assertEquals(4, stats.getTasksByPriority().size());
    }

    private Task createTestTask(String id, String title, String status, String priority, String creatorId) {
        Task task = new Task();
        task.setId(id);
        task.setTitle(title);
        task.setStatus(status);
        task.setPriority(priority);
        task.setCreatorId(creatorId);
        task.setAssigneeId(creatorId);
        task.setCreatedAt("2025-01-01T00:00:00Z");
        task.setUpdatedAt("2025-01-01T00:00:00Z");
        return task;
    }
}
