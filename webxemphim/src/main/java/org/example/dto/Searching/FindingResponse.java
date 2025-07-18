package org.example.dto.Searching;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FindingResponse {
    int currentPage;
    int limit;
    int totalItems;
    int totalPages;
    List<FindingMoviesResponse> DataList;
}
