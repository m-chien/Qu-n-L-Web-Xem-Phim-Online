package org.example.exception;

import jakarta.persistence.Entity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<String> handlingRuntiemException(RuntimeException exception)
    {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
    //tại sao lớp duplicatefieldException không gán @ControllerAdvice mà vẫn bắt được ngoại lệ?
    // là do ExceptionHandler đã bắt RuntimeException mà duplicatefieldException kế thừa RuntimeException nên khi bắt nó sẽ bắt RuntimeException
    // và bắt tất cả các class con kế thừa từ RuntimeException đấy
}
