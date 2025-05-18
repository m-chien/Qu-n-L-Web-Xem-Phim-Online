package org.example.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    int code = 1000;
    String message = "create succese";
    T result;

}
//      1000            Success	                    Thao tác thành công.
//      1001	        Not Found	                Không tìm thấy dữ liệu.
//      1002	        Unauthorized	            Người dùng chưa xác thực hoặc không có quyền.
//      1003	        Server Error	            Lỗi từ phía server.
//      1004	        Bad Request	                Dữ liệu gửi lên không hợp lệ.
//      1005	        Duplicate	                Dữ liệu bị trùng lặp.
//      1006	        Validation Error	        Dữ liệu không đúng định dạng.