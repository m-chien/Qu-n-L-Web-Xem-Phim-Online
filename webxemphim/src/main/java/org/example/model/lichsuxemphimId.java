package org.example.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Objects;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class lichsuxemphimId implements Serializable {
    String idUser;
    String idPhim;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        lichsuxemphimId that = (lichsuxemphimId) o;
        return Objects.equals(idUser, that.idUser) && Objects.equals(idPhim, that.idPhim);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUser, idPhim);
    }

}
