package com.taskmanager.repository;

import com.taskmanager.model.User;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Expression;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.Map;
import java.util.Optional;

@Repository
public class UserRepository {

    private final DynamoDbTable<User> userTable;

    public UserRepository(DynamoDbTable<User> userTable) {
        this.userTable = userTable;
    }

    public void save(User user) {
        userTable.putItem(user);
    }

    public Optional<User> findById(String id) {
        User user = userTable.getItem(r -> r.key(k -> k.partitionValue(id)));
        return Optional.ofNullable(user);
    }

    public Optional<User> findByUsername(String username) {
        Expression filterExpression = Expression.builder()
                .expression("username = :username")
                .expressionValues(Map.of(":username", AttributeValue.builder().s(username).build()))
                .build();

        ScanEnhancedRequest scanRequest = ScanEnhancedRequest.builder()
                .filterExpression(filterExpression)
                .build();

        return userTable.scan(scanRequest)
                .items()
                .stream()
                .findFirst();
    }

    public Optional<User> findByEmail(String email) {
        Expression filterExpression = Expression.builder()
                .expression("email = :email")
                .expressionValues(Map.of(":email", AttributeValue.builder().s(email).build()))
                .build();

        ScanEnhancedRequest scanRequest = ScanEnhancedRequest.builder()
                .filterExpression(filterExpression)
                .build();

        return userTable.scan(scanRequest)
                .items()
                .stream()
                .findFirst();
    }

    public boolean existsByUsername(String username) {
        return findByUsername(username).isPresent();
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }
}
