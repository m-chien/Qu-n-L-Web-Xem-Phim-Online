package org.example.exception;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
//      1000            Success	                    Thao tác thành công.
//      1001	        Not Found	                Không tìm thấy dữ liệu.
//      1002	        Unauthorized	            Người dùng chưa xác thực hoặc không có quyền.
//      1003	        Server Error	            Lỗi từ phía server.
//      1004	        Bad Request	                Dữ liệu gửi lên không hợp lệ.
//      1005	        Duplicate	                Dữ liệu bị trùng lặp.
//      1006	        Validation Error	        Dữ liệu không đúng định dạng.
public enum ErrorCode {
    User_Exitsted(1005,"User existed"),
    Email_Duplicate(1005,"Email cannot be Duplicate!!!!"),
    Sdt_Duplicate(1005,"SDT cannot be Duplicate!!!!"),
    Id_Not_Found(1001," Id not found ")
    ;
    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
