package org.example.exception;

public class DuplicateFieldException extends RuntimeException{
    private String fieldName;

    public DuplicateFieldException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
