package org.example.controller;

import org.example.model.khachhang;
import org.example.model.lichsuxemphim;
import org.example.model.phim;
import org.example.service.lichsuxemphimservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/lichsuphim")
public class lichsuxemphimcontroller {
    @Autowired
    private lichsuxemphimservice lichsuxemphimservice;
    //lấy tất cả lịch sử xem
    @GetMapping("/getalllichsu")
    public List<lichsuxemphim> getalllichsuxem()
    {
        return lichsuxemphimservice.getalllichsu();
    }
    //lấy 1 lịch sử xem
    @GetMapping("/getonelichsu/{iduser}/{idphim}")
    public lichsuxemphim getOneLichsu(@PathVariable String iduser, @PathVariable String idphim)
    {
        return lichsuxemphimservice.getOnelichsu(iduser,idphim);
    }
    //lấy tất cả phim đã coi của user
    @GetMapping("getlichsu/{iduser}")
    public List<lichsuxemphim> getlichsu(@PathVariable String iduser)
    {
        return lichsuxemphimservice.getlichsuxemphimcuaUser(iduser);
    }

    @PutMapping("updatelichsu/{iduser}/{idphim}")
    public lichsuxemphim updatelichsu(@PathVariable String iduser, @PathVariable String idphim, @RequestBody lichsuxemphim lichsuxemphim)
    {
        return lichsuxemphimservice.update(iduser,idphim,lichsuxemphim);
    }
    @PostMapping("/addlichsu/{iduser}/{idphim}")
    public lichsuxemphim themlichsu(@PathVariable String iduser, @PathVariable String idphim)
    {
        return lichsuxemphimservice.themlichsu(idphim,iduser);
    }
}
