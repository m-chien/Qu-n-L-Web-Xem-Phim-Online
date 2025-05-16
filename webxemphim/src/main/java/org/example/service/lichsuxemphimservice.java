package org.example.service;

import org.example.model.lichsuxemphim;
import org.example.model.lichsuxemphimId;
import org.example.model.phim;
import org.example.repository.lichsuxemphimrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class lichsuxemphimservice {
    @Autowired
    private lichsuxemphimrepository lichsuxemphimrepository;

    //lất tất cả lịch sử xem phim theo idUser
    public List<lichsuxemphim> getlichsuxemphimcuaUser(String idUser)
    {
        return lichsuxemphimrepository.findByIdUser(idUser);
    }
    public lichsuxemphim themlichsu(String idphim, String iduser)
    {
        lichsuxemphimId id = new lichsuxemphimId(iduser, idphim);
        if (lichsuxemphimrepository.existsById(id)) {
            throw new IllegalArgumentException("Lịch sử đã tồn tại");
        }
        lichsuxemphim lichsuxemphim1 = new lichsuxemphim(iduser, idphim, LocalDate.now());
        return lichsuxemphimrepository.save(lichsuxemphim1);
    }
    public lichsuxemphim getOnelichsu(String idUser, String idPhim)
    {
        lichsuxemphimId id = new lichsuxemphimId(idUser, idPhim);
         return  lichsuxemphimrepository.findById(id)
                 .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi"));
    }
    public lichsuxemphim update(String idUser, String idPhim, lichsuxemphim updatedLichSuxemPhim) {
        lichsuxemphim lichsuxemphim = getOnelichsu(idUser,idPhim);

        lichsuxemphim.setNgayxem(updatedLichSuxemPhim.getNgayxem());
        return lichsuxemphimrepository.save(lichsuxemphim);
    }
    //lấy tất cả lịch sử xem phim
    public List<lichsuxemphim> getalllichsu()
    {
        return lichsuxemphimrepository.findAll();
    }

}
