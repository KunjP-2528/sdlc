package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbIndex;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Expression;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class TaskRepository {

    private final DynamoDbTable<Task> taskTable;

    public TaskRepository(DynamoDbTable<Task> taskTable) {
        this.taskTable = taskTable;
    }

    public void save(Task task) {
        taskTable.putItem(task);
    }

    public Optional<Task> findById(String id) {
        Task task = taskTable.getItem(r -> r.key(k -> k.partitionValue(id)));
        return Optional.ofNullable(task);
    }

    public List<Task> findByAssigneeId(String assigneeId) {
        DynamoDbIndex<Task> index = taskTable.index("assignee-index");

        QueryConditional queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(assigneeId).build()
        );

        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(queryConditional)
                .build();

        return index.query(request)
                .stream()
                .flatMap(page -> page.items().stream())
                .collect(Collectors.toList());
    }

    public List<Task> findByCreatorId(String creatorId) {
        Expression filterExpression = Expression.builder()
                .expression("creatorId = :creatorId")
                .expressionValues(Map.of(":creatorId", AttributeValue.builder().s(creatorId).build()))
                .build();

        ScanEnhancedRequest scanRequest = ScanEnhancedRequest.builder()
                .filterExpression(filterExpression)
                .build();

        return taskTable.scan(scanRequest)
                .items()
                .stream()
                .collect(Collectors.toList());
    }

    public List<Task> findAllByUserId(String userId) {
        Expression filterExpression = Expression.builder()
                .expression("assigneeId = :userId OR creatorId = :userId")
                .expressionValues(Map.of(":userId", AttributeValue.builder().s(userId).build()))
                .build();

        ScanEnhancedRequest scanRequest = ScanEnhancedRequest.builder()
                .filterExpression(filterExpression)
                .build();

        return taskTable.scan(scanRequest)
                .items()
                .stream()
                .collect(Collectors.toList());
    }

    public void deleteById(String id) {
        taskTable.deleteItem(r -> r.key(k -> k.partitionValue(id)));
    }
}
