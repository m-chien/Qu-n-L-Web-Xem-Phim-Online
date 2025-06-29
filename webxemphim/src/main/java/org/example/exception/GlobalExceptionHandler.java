package org.example.exception;

import jakarta.persistence.Entity;
import org.example.dto.request.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<String> handlingRuntiemException(RuntimeException exception)
    {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppexception(AppException exception)
    {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse api = new ApiResponse<>();
        api.setCode(errorCode.getCode());
        api.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(api);
    }
    @ExceptionHandler(value = NoSuchElementException.class)
    ResponseEntity<ApiResponse> handleNotfound(NoSuchElementException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.builder()
                        .code(ErrorCode.Not_Found.getCode())
                        .message(ErrorCode.Not_Found.getMessage())
                        .result(ex.getMessage())
                        .build());
    }
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.builder()
                        .code(ErrorCode.Unauthorized.getCode())
                        .message(ErrorCode.Unauthorized.getMessage())
                        .result(ex.getMessage())
                        .build()
        );
    }
    //tại sao lớp duplicatefieldException không gán @ControllerAdvice mà vẫn bắt được ngoại lệ?
    // là do ExceptionHandler đã bắt RuntimeException mà duplicatefieldException kế thừa RuntimeException nên khi bắt nó sẽ bắt RuntimeException
    // và bắt tất cả các class con kế thừa từ RuntimeException đấy
}
