package com.orchid.orchidbe.apis;

import com.orchid.orchidbe.apis.ApiResponse.Error;
import com.orchid.orchidbe.apis.ApiResponse.Success;
import com.orchid.orchidbe.apis.ApiResponse.ValidationError;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public sealed interface ApiResponse<T>
        permits Error, Success, ValidationError {

    int getStatusCode();

    String getMessage();

    Instant getTimestamp();

    record Success<T>(
            int statusCode,
            String message,
            T data,
            Instant timestamp) implements ApiResponse<T> {
        @Override
        public int getStatusCode() {
            return statusCode;
        }

        @Override
        public String getMessage() {
            return message;
        }

        @Override
        public Instant getTimestamp() {
            return timestamp;
        }
    }

    record Error<T>(
            int statusCode,
            String message,
            String reason,
            Instant timestamp) implements ApiResponse<T> {
        @Override
        public int getStatusCode() {
            return statusCode;
        }

        @Override
        public String getMessage() {
            return message;
        }

        @Override
        public Instant getTimestamp() {
            return timestamp;
        }
    }

    record ValidationError<T>(
            int statusCode,
            String message,
            Map<String, String> fieldErrors,
            Instant timestamp) implements ApiResponse<T> {
        @Override
        public int getStatusCode() {
            return statusCode;
        }

        @Override
        public String getMessage() {
            return message;
        }

        @Override
        public Instant getTimestamp() {
            return timestamp;
        }
    }

    static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(new Success<>(
                200, "Success", data, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new Success<>(
                201, "Created successfully", data, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> created() {
        return ResponseEntity.status(HttpStatus.CREATED).body(new Success<>(
                201, "Created successfully", null, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> updated(T data) {
        return ResponseEntity.ok(new Success<>(
                200, "Updated successfully", data, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> updated() {
        return ResponseEntity.ok(new Success<>(
                200, "Updated successfully", null, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> badRequest(String reason) {
        return ResponseEntity.badRequest().body(new Error<>(
                400, "Bad Request", reason, Instant.now()));
    }

    static ResponseEntity<ApiResponse<Object>> validationError(Map<String, String> errors) {
        return ResponseEntity
                .badRequest()
                .body(new ValidationError<>(
                        400,
                        "Validation failed",
                        errors,
                        Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> notFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Error<>(
                404, "Not Found", null, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> noContent() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new Success<>(
                204, "No Content", null, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> delete() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Success<>(
                204, "Delete successfully", null, Instant.now()));
    }

    static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message, String reason) {
        return ResponseEntity.status(status)
                .body(new Error<>(
                        status.value(), message, reason, Instant.now()));
    }
}

