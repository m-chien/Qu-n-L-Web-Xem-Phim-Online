package org.example.controller;

import org.example.model.phim;
import org.example.service.phimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/film")
public class phimController {
    @Autowired
    private phimService phimService;

    @GetMapping("/getall")
    public List<phim> getAllPhim()
    {
        return phimService.getallphim();
    }

    @GetMapping("/getone/{idphim}")
    public phim getOnePhim(@PathVariable String idphim)
    {
        return phimService.get1phim(idphim);
    }

    @PostMapping("/addphim")
    public ResponseEntity<phim> themphim(@RequestBody phim phim)
    {
        phim phim1 = phimService.themPhim(phim);
        return ResponseEntity.status(HttpStatus.CREATED).body(phim1);
    }

    @DeleteMapping("/delete/{idphim}")
    public String deletephim(@PathVariable String idphim)
    {
        phimService.xoaphim(idphim);
        return "đã xóa phim thành công!!";
    }

    @PutMapping("/update/{idphim}")
    public phim updatephim(@PathVariable String idphim,@RequestBody phim phim1)
    {
        return phimService.updatephim(idphim,phim1);
    }
}
