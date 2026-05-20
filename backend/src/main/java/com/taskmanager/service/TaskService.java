package com.taskmanager.service;

import com.taskmanager.dto.DashboardStats;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponse createTask(TaskRequest request, String userId) {
        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : "TODO");
        task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        task.setDueDate(request.getDueDate());
        task.setAssigneeId(request.getAssigneeId() != null ? request.getAssigneeId() : userId);
        task.setCreatorId(userId);
        task.setCreatedAt(Instant.now().toString());
        task.setUpdatedAt(Instant.now().toString());

        taskRepository.save(task);

        return toResponse(task);
    }

    public TaskResponse getTask(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));
        return toResponse(task);
    }

    public List<TaskResponse> getTasksForUser(String userId) {
        List<Task> tasks = taskRepository.findAllByUserId(userId);

        return tasks.stream()
                .sorted(Comparator
                        .comparing((Task t) -> t.getDueDate() != null ? t.getDueDate() : "9999-12-31")
                        .thenComparing(t -> priorityOrder(t.getPriority())))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse updateTask(String taskId, TaskRequest request, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssigneeId() != null) {
            task.setAssigneeId(request.getAssigneeId());
        }
        task.setUpdatedAt(Instant.now().toString());

        taskRepository.save(task);

        return toResponse(task);
    }

    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        if (!task.getCreatorId().equals(userId) && !task.getAssigneeId().equals(userId)) {
            throw new SecurityException("Not authorized to delete this task");
        }

        taskRepository.deleteById(taskId);
    }

    public DashboardStats getDashboardStats(String userId) {
        List<Task> tasks = taskRepository.findAllByUserId(userId);

        DashboardStats stats = new DashboardStats();
        stats.setTotalTasks(tasks.size());
        stats.setCompletedTasks(tasks.stream().filter(t -> "DONE".equals(t.getStatus())).count());
        stats.setPendingTasks(tasks.stream().filter(t -> !"DONE".equals(t.getStatus()) && !"CANCELLED".equals(t.getStatus())).count());

        String today = LocalDate.now().toString();
        stats.setOverdueTasks(tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().compareTo(today) < 0
                        && !"DONE".equals(t.getStatus()) && !"CANCELLED".equals(t.getStatus()))
                .count());

        stats.setTasksByStatus(tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getStatus() != null ? t.getStatus() : "UNKNOWN",
                        Collectors.counting())));

        stats.setTasksByPriority(tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getPriority() != null ? t.getPriority() : "UNKNOWN",
                        Collectors.counting())));

        return stats;
    }

    private int priorityOrder(String priority) {
        if (priority == null) return 99;
        return switch (priority) {
            case "CRITICAL" -> 0;
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            default -> 99;
        };
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setAssigneeId(task.getAssigneeId());
        response.setCreatorId(task.getCreatorId());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        return response;
    }
}
