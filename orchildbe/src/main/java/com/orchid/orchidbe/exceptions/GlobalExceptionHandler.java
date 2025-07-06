package com.orchid.orchidbe.exceptions;

import com.orchid.orchidbe.apis.ApiResponse;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ApiResponse<Object>> handleNullPointerException
        (
        NullPointerException e) {
        log.error("NullPointerException: ", e);
        return ApiResponse.error(
            HttpStatus.BAD_REQUEST,
            "Null pointer exception occurred",
            e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(
        IllegalArgumentException e) {
        log.error("IllegalArgumentException: ", e);
        return ApiResponse.error(
            HttpStatus.BAD_REQUEST,
            "Invalid argument provided",
            e.getMessage());
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<Object>> handleJwtException(
            JwtException e) {
        log.error("JwtException: ", e);
        return ApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Invalid jwt token",
                e.getMessage());
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {
        log.error("AccessDeniedException: ", ex);
        return ApiResponse.error(
                HttpStatus.FORBIDDEN,
                "Access denied",
                ex.getMessage());
    }
}
