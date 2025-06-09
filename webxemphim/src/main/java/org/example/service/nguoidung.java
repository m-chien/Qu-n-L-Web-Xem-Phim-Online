package org.example.service;

import org.example.repository.nguoidungRepository;
import org.springframework.stereotype.Service;

@Service
public class nguoidung {
    public final nguoidungRepository nguoidungrepository;

    public nguoidung(nguoidungRepository nguoidungrepository) {
        this.nguoidungrepository = nguoidungrepository;
    }

}
