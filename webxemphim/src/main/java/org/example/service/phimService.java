package org.example.service;

import org.example.model.phim;
import org.example.repository.phimrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class phimService {
    @Autowired
    private phimrepository phimrepository;

    //thêm phim
    public phim themPhim(phim phim) {
        Optional<phim> existingPhim = phimrepository.findByTenphim(phim.getTenphim());
        if (existingPhim.isPresent()) {
            throw new IllegalArgumentException("Phim đã tồn tại!");
        }
        return phimrepository.save(phim);
    }

    //xóa phim
    public void xoaphim(String idphim)
    {
         phimrepository.deleteById(idphim);
    }

    //lấy tất cả phim
    public List<phim> getallphim()
    {
        return phimrepository.findAll();
    }

    //lấy 1 phim
    public phim get1phim(String idphim) {
        return phimrepository.findById(idphim)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + idphim));
    }

    //update phim
    public phim updatephim(String id, phim phim) {
        phim existing = get1phim(id);
        phim updated = existing.toBuilder()
                .tenphim(phim.getTenphim())
                .daodien(phim.getDaodien())
                .MoTaPhim(phim.getMoTaPhim())
                .ThoiLuong(phim.getThoiLuong())
                .NgaySanXuat(phim.getNgaySanXuat())
                .LuotXem(phim.getLuotXem())
                .quocgia(phim.getQuocgia())
                .gioihandotuoi(phim.getGioihandotuoi())
                .build();
        return phimrepository.save(updated);
    }

}
