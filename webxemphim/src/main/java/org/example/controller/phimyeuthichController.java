package org.example.controller;

import org.example.model.phimyeuthich;
import org.example.service.phimyeuthichService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/phimyeuthich")
public class phimyeuthichController {
    @Autowired
    private phimyeuthichService phimyeuthichService;

//    @GetMapping("/{iduser}")
//    public List<phimyeuthich> getphimyeuthiochbyuser(@PathVariable String iduser)
//    {
//        return phimyeuthichService.getallPhimyeuthichtheouser(iduser);
//    }
//
//    @DeleteMapping("/xoaphim/{iduser}/{idphimyeuthich}")
//    public String xoaphimyeuthich(@PathVariable String iduser, @PathVariable String idphimyeuthich)
//    {
//        phimyeuthichService.xoaPhimYeuThich(iduser, idphimyeuthich);
//        return "xóa thành công!";
//    }
    @PostMapping("/addphimyeuthich")
    public ResponseEntity<phimyeuthich> themphim(@RequestBody phimyeuthich phimyeuthich)
    {
         phimyeuthich phimyeuthich1 =  phimyeuthichService.addphim(phimyeuthich);
         return ResponseEntity.status(HttpStatus.CREATED).body(phimyeuthich1);
    }
}
