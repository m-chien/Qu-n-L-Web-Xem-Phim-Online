package org.example.service;

import org.example.dto.request.khachhangCreationRequest;
import org.example.dto.request.khachhangUpdateRequest;
import org.example.exception.AppException;
import org.example.exception.DuplicateFieldException;
import org.example.exception.ErrorCode;
import org.example.model.khachhang;
import org.example.repository.khachhangrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class khachhangservice {
    @Autowired
    private khachhangrepository khachhangrepository;

    public List<khachhang> getallkhachang()
    {
        return khachhangrepository.findAll();
    }
    public khachhang getonekhachhang(String id)
    {
        return khachhangrepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Id_Not_Found));
    }
    public khachhang adduser(khachhangCreationRequest khach) {
        if (khachhangrepository.existsByemail(khach.getEmail()))
            throw new AppException(ErrorCode.Email_Duplicate);
        if (khachhangrepository.existsBysdt(khach.getSdt()))
            throw new AppException(ErrorCode.Sdt_Duplicate);
        khachhang khachhang1 = khachhang.builder()
                .tenUser(khach.getTenUser())
                .diachiKh(khach.getDiachiKh())
                .sdt(khach.getSdt())
                .email(khach.getEmail())
                .matkhau(khach.getMatkhau())
                .build();
        return khachhangrepository.save(makeIDUSer(khachhang1));
    }
    public void delete(String id)
    {
        khachhangrepository.deleteById(id);
    }
    public khachhang update(String id, khachhangUpdateRequest khachhangUpdateRequest)
    {
        khachhang khachhang1 = getonekhachhang(id);
        khachhang1.setDiachiKh(khachhangUpdateRequest.getDiachiKh());
        khachhang1.setSdt(khachhangUpdateRequest.getSdt());
        khachhang1.setEmail(khachhangUpdateRequest.getEmail());
        khachhang1.setMatkhau(khachhangUpdateRequest.getMatkhau());
        return khachhangrepository.save(khachhang1);
    }
    public khachhang makeIDUSer(khachhang khachhang)
    {
        String lastMa = khachhangrepository.findLastMaDatVe(); // ví dụ: VT010

        int newNumber = 1; // mặc định nếu chưa có vé nào
        if (lastMa != null && lastMa.startsWith("KH")) {
            newNumber = Integer.parseInt(lastMa.substring(2)) + 1;
        }
        String newMa = String.format("KH%03d", newNumber);
        khachhang.setIdUser(newMa);

        return khachhang;
    }
}
