package com.taskmanager;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "aws.region=us-east-1",
        "aws.dynamodb.endpoint=http://localhost:8000",
        "aws.dynamodb.table-prefix=test",
        "jwt.secret=dGVzdC1zZWNyZXQta2V5LWZvci10ZXN0aW5nLXB1cnBvc2VzLW9ubHktMjU2LWJpdHMtbG9uZw==",
        "jwt.expiration-ms=86400000"
})
class TaskManagerApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the application context loads
    }
}
