package org.example.config; // Đảm bảo đúng package của bạn

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Lớp cấu hình để bật tính năng lập lịch (scheduling) trong Spring Boot.
 */
@Configuration // Đánh dấu đây là một lớp cấu hình Spring
@EnableScheduling // Bật tính năng lập lịch
public class SchedulingConfig {
    // Không cần thêm code nào khác trong lớp này
}
