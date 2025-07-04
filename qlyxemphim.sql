IF EXISTS (SELECT * FROM sys.databases WHERE name = 'Qlxemphim')
BEGIN
    USE master; -- Chuyển sang cơ sở dữ liệu master để có thể xóa được cơ sở dữ liệu khác
    ALTER DATABASE Qlxemphim SET SINGLE_USER WITH ROLLBACK IMMEDIATE; -- Ngắt mọi kết nối
    DROP DATABASE Qlxemphim; -- Xóa cơ sở dữ liệu
END
go
create database Qlxemphim
go
use Qlxemphim

create table nguoidung
(
	idUser char(5) primary key,
	email varchar(50) unique check(email like '[A-Za-z]%@gmail.com') not  null,
	matkhau varchar(255) not null,
	ngaytao Date default getdate(),
	loaitaikhoan nvarchar(20) default N'Khách hàng',
	trangthai nvarchar(20) default N'active',
	avatar_url VARCHAR(255)
)
create table nhanvien
(
	idNhanvien char(5) primary key,
	idUser char(5) unique,
	hoten nvarchar(50),
	sdt varchar(10),
	emaillienhe varchar(50) unique not  null,
	gioitinh nvarchar(20),
	chucVu nvarchar(30),
	Luong money,
	trangthai nvarchar(30) default N'đang làm'
	foreign key (idUser) references nguoidung(idUser)
			on update
				cascade
			on delete
				cascade
)
create table khachhang
(
	idKhachhang char(5) primary key,
	idUser char(5) unique,
	hoten nvarchar(50),
	sdt varchar(10),
	ngaysinh date,
	gioitinh nvarchar(20),
	foreign key (idUser) references nguoidung(idUser)
			on update
				cascade
			on delete
				cascade
)
create table phim
(
	idPhim char(5) PRIMARY KEY,
    tenphim NVARCHAR(100) NOT NULL,
    DaoDien NVARCHAR(50),
    thoiluong INT NOT NULL,
    ngayphathanh DATE NOT NULL,
    gioihandotuoi NVARCHAR(10),
    quocgia NVARCHAR(50),
    luotxem BIGINT DEFAULT 0,
    trangthai NVARCHAR(20) DEFAULT N'Sắp chiếu',
    url_poster VARCHAR(255),
    mo_ta NVARCHAR(MAX)
)
create table danhgia
(
	idDanhGia char(5) primary key,
	idUser char(5),
	idPhim char(5),
	diemdanhgia int,
	ngaydanhgia date default getdate(),
	binhluan nvarchar(255),
	foreign key (idUser) references nguoidung(idUser)
			on update
				cascade
			on delete
				cascade,
	foreign key (idPhim) references phim(idPhim)
			on update
				cascade
			on delete
				cascade
)
create table dienvien
(
	idDienVien char(5) primary key,
	tendienvien nvarchar(50),
	ngaysinh date,
	quoctich nvarchar(30),
	mota nvarchar(100),
)
create table dienvien_phim
(
	idDienVien char(5),
	idPhim char(5),
	primary key (idDienVien, idPhim),
	foreign key (idDienVien) references dienvien(idDienVien)
			on update
				cascade
			on delete
				cascade,
	foreign key (idPhim) references phim(idPhim)
			on update
				cascade
			on delete
				cascade
)
create table theloai
(
	idTheLoai char(5) primary key,
	tentheloai nvarchar(30),
)
create table theloai_phim
(
	idTheLoai char(5),
	idPhim char(5),
	primary key (idTheLoai, idPhim),
	foreign key (idTheLoai) references theloai(idTheLoai)
			on update
				cascade
			on delete
				cascade,
	foreign key (idPhim) references phim(idPhim)
			on update
				cascade
			on delete
				cascade
)
create table ve
(
	idVe char(5) PRIMARY KEY,
    idUser char(5) NOT NULL,
    NgayDat DATETIME DEFAULT GETDATE(),
    TongGiaTriDonHang MONEY NOT NULL,
    trangthai NVARCHAR(30) DEFAULT N'Đang chờ thanh toán',
	ngayhethan Datetime
)
CREATE TABLE Food
(
    idFood char(5) PRIMARY KEY,
    TenDoAn NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(MAX),
    GiaBan MONEY NOT NULL,
    TrangThai NVARCHAR(20) DEFAULT N'Còn hàng',
	soluongtonkho int default 0,
    url_anh VARCHAR(255)
)
create table ve_food
(
	idvefood char(5) primary key,
	idVe char(5),
	idFood char(5),
	soluong int,
	foreign key (idVe) references ve(idVe)
			on update
				cascade
			on delete
				cascade,
	foreign key (idFood) references Food(idFood)
			on update
				cascade
			on delete
				cascade
)
create table thanhtoan
(
	idThanhToan char(5) primary key,
	idVe char(5),
	phuongthucthanhtoan nvarchar(30) default N'online',
	trangthai nvarchar(40) default N'Đang chờ',
	soTienThanhToan money not null,
	ngayThanhToan DATETIME DEFAULT GETDATE(),
	foreign key (idVe) references ve(idVe)
			on update
				cascade
			on delete
				cascade
)
create table phong
(
	idPhong char(5) primary key,
	tenphong nvarchar(50),
	tongSoLuongChoNgoi int,
)
create table loaighe
(
	idLoaiGhe char(5) primary key,
	tenloaighe nvarchar(50),
	gia money,
)
create table chongoi
(
	idChoNgoi char(6) primary key,
	idPhong char(5),
	idLoaiGhe char(5),
	hang nvarchar(1) not null,
	[cot] int not null,
	foreign key (idPhong) references phong(idPhong)
			on update
				cascade
			on delete
				cascade,
	foreign key (idLoaiGhe) references loaighe(idLoaiGhe)
			on update
				cascade
			on delete
				cascade
)
create table suatchieu
(
	idSuatChieu char(5) primary key,
	tenSuatChieu nvarchar(30),
	tgianchieu time not null unique,
)
create table lichchieu
(
	idLichChieu char(5) primary key,
	idPhim char(5),
	idSuatChieu char(5),
	idPhong char(5),
	ngaychieu date,
	foreign key (idPhong) references phong(idPhong)
			on update
				cascade
			on delete
				cascade,
	foreign key (idPhim) references phim(idPhim)
			on update
				cascade
			on delete
				cascade,
	foreign key (idSuatChieu) references suatchieu(idSuatChieu)
			on update
				cascade
			on delete
				cascade
)
create table chitietdatve
(
	idChiTietVe char(5) PRIMARY key,
    idVe char(5) NOT NULL,
    idLichChieu char(5) NOT NULL,
    idChoNgoi char(6) NOT NULL,
    GiaVeDonLe MONEY NOT NULL,
    TrangThaiVe NVARCHAR(30) DEFAULT N'Đã đặt',
	foreign key (idVe) references ve(idVe)
			on update
				cascade
			on delete
				cascade,
	foreign key (idLichChieu) references lichchieu(idLichChieu)
			on update
				cascade
			on delete
				cascade,
	foreign key (idChoNgoi) references chongoi(idChoNgoi)
			on update
				no action
			on delete
				no action,
)
alter table nguoidung
	add constraint CK_trangthai_user
		check ( trangthai = N'active' or (trangthai = N'offline'))
alter table NhanVien
	add constraint CK_trangthai_nhanvien
		check ( trangthai = N'Đang làm' or (trangthai = N'Nghỉ Việc'))
alter table phim
	add constraint Check_trangthai_Phim
		check ( trangthai = N'Đang chiếu' or (trangthai = N'Đã chiếu') or (trangthai = N'Sắp chiếu'))
alter table ve
	add constraint CK_trangthai_ve
		check ( trangthai = N'Đang chờ thanh toán' or (trangthai = N'Đã thanh toán') or (trangthai = N'Đã hủy'))
alter table Food
	add constraint CK_trangthai_phim
		check ( trangthai = N'Còn hàng' or (trangthai = N'Hết Hàng'))
alter table thanhtoan
	add constraint CK_trangthai_thanhtoan
			check ( trangthai = N'Đang chờ' or (trangthai = N'Thành công') or (trangthai = N'Thất bại')),
		constraint CK_phuongthuc_thanhtoan
			check ( phuongthucthanhtoan = N'online' or (phuongthucthanhtoan = N'tiền Mặt'))
alter table ChiTietDatVe
	add constraint CK_trangthai_ChiTietDatVe
		check ( TrangThaiVe = N'Đã đặt' 
		or (TrangThaiVe = N'Đã thanh toán') 
		or (TrangThaiVe = N'Đã sử dụng') 
		or (TrangThaiVe = N'Đã hủy') 
		or (TrangThaiVe = N'Đã hoàn tiền'))
-- 1. Bảng nguoidung
INSERT INTO nguoidung (idUser, email, matkhau, ngaytao, loaitaikhoan, trangthai,avatar_url) VALUES
('U0001', 'anh.nguyen@gmail.com', 'hashedpass123abc', '2023-01-05', N'Khách hàng', N'active','/images/user-circle (1).png'),
('U0002', 'binh.le@gmail.com', 'hashedpass456def', '2023-02-10', N'Khách hàng', N'active','/images/user-circle (1).png'),
('U0003', 'cuong.tran@gmail.com', 'hashedpass789ghi', '2023-03-15', N'Khách hàng', N'active','/images/user-circle (1).png'),
('U0004', 'duyen.pham@gmail.com', 'hashedpassabcjkl', '2023-04-20', N'Khách hàng', N'active','/images/user-circle (1).png'),
('U0005', 'em.hoang@gmail.com', 'hashedpassdefmno', '2023-05-25', N'Khách hàng', N'active','/images/user-circle (1).png'),
('U0006', 'thao.nguyen@gmail.com', 'hashedpassghipqr', '2023-06-01', N'Nhân viên', N'active','/images/user-circle (1).png'),
('U0007', 'long.tran@gmail.com', 'hashedpassjklstu', '2023-07-07', N'Nhân viên', N'active','/images/user-circle (1).png'),
('U0008', 'minh.vo@gmail.com', 'hashedpassvwyxyz', '2023-08-12', N'Admin', N'active','/images/user-circle (1).png'),
('U0009', 'ngoc.phan@gmail.com', 'hashedpass1a2b3c', '2023-09-18', N'Khách hàng', N'active','/images/user-circle (1).png'),
('U0010', 'huy.do@gmail.com', 'hashedpass4d5e6f', '2023-10-23', N'Khách hàng', N'active','/images/user-circle (1).png');

-- 9. Bảng NhanVien
INSERT INTO NhanVien (idNhanVien, idUser, hoten, sdt, emaillienhe, gioitinh, chucVu, Luong, trangthai) VALUES
('NV001', 'U0006', N'Nguyễn Thị Thảo', '0912345678', 'thao.nguyen.nv@gmail.com', N'Nữ', N'Nhân viên bán vé', 7000000, N'Đang làm'),
('NV002', 'U0007', N'Trần Văn Long', '0987654321', 'long.tran.ql@gmail.com', N'Nam', N'Quản lý lịch chiếu', 12000000, N'Đang làm'),
('NV003', 'U0008', N'Võ Minh', '0901122334', 'minh.vo.admin@gmail.com', N'Nam', N'Admin hệ thống', 15000000, N'Đang làm'),
('NV004', 'U0001', N'Phạm Anh Đào', '0902233445', 'anh.dao.nv@gmail.com', N'Nữ', N'Nhân viên soát vé', 6500000, N'Đang làm'),
('NV005', 'U0002', N'Lê Bình An', '0903344556', 'binh.an.nv@gmail.com', N'Nam', N'Nhân viên quầy Food', 6800000, N'Đang làm'),
('NV006', 'U0003', N'Trần Cường Phát', '0904455667', 'cuong.phat.kythuat@gmail.com', N'Nam', N'Kỹ thuật viên', 9000000, N'Đang làm'),
('NV007', 'U0004', N'Phạm Thị Duyên', '0905566778', 'duyen.phu.trach@gmail.com', N'Nữ', N'Phụ trách phòng chiếu', 8500000, N'Đang làm'),
('NV008', 'U0005', N'Hoàng Em', '0906677889', 'em.hoang.tapvu@gmail.com', N'Nam', N'Tạp vụ', 5500000, N'Đang làm'),
('NV009', 'U0009', N'Phan Thị Ngọc', '0907788990', 'ngoc.phan.ke.toan@gmail.com', N'Nữ', N'Kế toán', 10000000, N'Đang làm'),
('NV010', 'U0010', N'Đỗ Xuân Huy', '0908899001', 'huy.do.nvbh@gmail.com', N'Nam', N'Nhân viên bán hàng', 7200000, N'Đang làm');

set dateformat ymd
-- 10. Bảng KhachHang
INSERT INTO KhachHang (idKhachhang, idUser, hoten, sdt, ngaysinh, gioitinh) VALUES
('KH001', 'U0001', N'Nguyễn Văn Anh', '0912345678', '1990-01-01', N'Nam'),
('KH002', 'U0002', N'Lê Thị Bình', '0987654321', '1995-02-02', N'Nữ'),
('KH003', 'U0003', N'Trần Đình Cường', '0901234567', '1988-03-03', N'Nam'),
('KH004', 'U0004', N'Phạm Thu Duyên', '0902345678', '1992-04-04', N'Nữ'),
('KH005', 'U0005', N'Hoàng Thanh Em', '0903456789', '1998-05-05', N'Nam'),
('KH006', 'U0009', N'Phan Ngọc Mai', '0909876543', '1993-09-09', N'Nữ'),
('KH007', 'U0010', N'Đỗ Văn Huy', '0908765432', '1991-10-10', N'Nam'),
('KH008', 'U0006', N'Đinh Thanh Thảo', '0911223344', '1987-06-15', N'Nữ'), -- Khách hàng dùng chung ID User với NV
('KH009', 'U0007', N'Lê Long An', '0922334455', '1989-07-20', N'Nam'), -- Khách hàng dùng chung ID User với NV
('KH010', 'U0008', N'Võ Minh Quân', '0933445566', '1985-08-25', N'Nam'); -- Khách hàng dùng chung ID User với NV
set dateformat ymd
-- 2. Bảng phim
INSERT INTO Phim (idPhim, tenphim, DaoDien, thoiluong, ngayphathanh, gioihandotuoi, quocgia, luotxem, trangthai, url_poster, mo_ta) VALUES
('P0001', N'Lật Mặt 7: Một Chuyến Phiêu Lưu', N'Lý Hải', 135, '2024-04-26', N'K', N'Việt Nam', 1500000, N'Đang chiếu', '/images/latmat.jpg', N'Hành trình cảm xúc và sự đoàn tụ gia đình.'),
('P0002', N'Cái Giá Của Hạnh Phúc', N'Nguyễn Ngọc Lâm', 105, '2024-03-08', N'T16', N'Việt Nam', 800000, N'Đã chiếu', '/images/caigiacuamothanhphuc.jpg', N'Câu chuyện về những lựa chọn và hậu quả.'),
('P0003', N'Dune: Part Two', N'Denis Villeneuve', 166, '2024-03-01', N'T13', N'Mỹ', 2500000, N'Đã chiếu', '/images/Dune.jpg', N'Chuyến đi sử thi tiếp theo trên hành tinh Arrakis.'),
('P0004', N'Godzilla x Kong: The New Empire', N'Adam Wingard', 115, '2024-03-29', N'T13', N'Mỹ', 1800000, N'Đã chiếu', '/images/Kong.jpg', N'Hai titan huyền thoại đối đầu với một mối đe dọa mới.'),
('P0005', N'Kung Fu Panda 4', N'Mike Mitchell', 94, '2024-03-08', N'P', N'Mỹ', 1200000, N'Đang chiếu', '/images/panda.jpg', N'Po trở lại với cuộc phiêu lưu mới đầy hài hước.'),
('P0006', N'Inside Out 2', N'Kelsey Mann', 96, '2024-06-14', N'P', N'Mỹ', 0, N'Sắp chiếu', '/images/insideout.jpg', N'Riley đối mặt với những cảm xúc mới khi trưởng thành.'),
('P0007', N'A Quiet Place: Day One', N'Michael Sarnoski', 100, '2024-06-28', N'T16', N'Mỹ', 0, N'Sắp chiếu', '/images/quietplace.jpg', N'Ngày đầu tiên khi sự im lặng trở thành sinh tồn.'),
('P0008', N'Deadpool & Wolverine', N'Shawn Levy', 127, '2024-07-26', N'T18', N'Mỹ', 0, N'Sắp chiếu', '/images/deadpool.jpg', N'Hai siêu anh hùng bất đắc dĩ hợp tác.'),
('P0009', N'Mắt Biếc', N'Victor Vũ', 117, '2019-12-20', N'T13', N'Việt Nam', 3000000, N'Đã chiếu', '/images/matbiec.jpg', N'Tình yêu tuổi học trò trong bối cảnh làng Đo Đo.'),
('P0010', N'Bố Già', N'Trấn Thành', 128, '2021-03-12', N'T13', N'Việt Nam', 4200000, N'Đang chiếu', '/images/bogia.jpg', N'Câu chuyện cảm động về tình cha con.'),
('P0011', N'Dưới Đáy Hồ', N'Trần Hữu Tấn', 98, '2025-06-06', N'T18', N'Việt Nam', 2340000, N'Đang chiếu', '/images/duoidayho.jpg', N'Phim kinh dị về truyền thuyết bí ẩn vùng hồ.'),
('P0012', N'Điệp Quỷ Tân Nương', N'Paul Agusta', 101, '2025-06-06', N'T16', N'Indonesia', 237890, N'Đang chiếu', '/images/diephuytannuong.jpg', N'Phim kinh dị Indonesia xoay quanh hôn lễ ám ảnh.'),
('P0013', N'Từ Vũ Trụ John Wick: Ballerina', N'Len Wiseman', 125, '2025-06-06', N'T18', N'Mỹ', 1234440, N'Đang chiếu', '/images/johnwick_ballerina.jpg', N'Phim hành động bom tấn về assassin trong thế giới John Wick.'),
('P0014', N'Buôn Thần Bán Thánh', N'Pae Arak Amornsupasiri', 125, '2025-06-06', N'T16', N'Thái Lan', 567550, N'Đang chiếu', '/images/buonthan_banthan.jpg', N'Hài Thái nói về những buôn bán tâm linh với góc nhìn hài hước.'),
('P0015', N'Dính "Thính" Là Yêu', N'Kang Yi Kwan', 92, '2025-06-06', N'T13', N'Hàn Quốc', 123440, N'Đang chiếu', '/images/dinhthingialove.jpg', N'Hài tâm lý lãng mạn Hàn Quốc về tình yêu và “thính”.'),
('P0016', N'Doraemon: Nobita''s Art World Tales', N'Yukiyo Teramoto', 100, '2025-05-23', N'P', N'Nhật Bản', 5000000, N'Đang chiếu', '/images/doraemon_artworld.jpg', N'Chuyến phiêu lưu vào thế giới hội họa của Nobita và Doraemon.'),
('P0017', N'Mission: Impossible – The Final Reckoning', N'Christopher McQuarrie', 169, '2025-05-23', N'T16', N'Mỹ', 2607023, N'Đang chiếu', '/images/mi_final_reckoning.jpg', N'Thám hiểm những pha hành động nghẹt thở trong phần cuối cùng của chuỗi Mission Impossible.'),
('P0018', N'Lilo & Stitch (Live‑Action)', N'Dean Fleischer Camp', 108, '2025-05-23', N'P', N'Mỹ', 1200324, N'Đang chiếu', '/images/lilo_stitch_live.jpg', N'Phiên bản chân thực đầy cảm xúc của tác phẩm gốc, đề cao ý nghĩa gia đình và “ohana”.');
set dateformat ymd
-- 11. Bảng danhgia
INSERT INTO danhgia (idDanhGia, idUser, idPhim, diemdanhgia, ngaydanhgia, binhluan) VALUES
('DG001', 'U0001', 'P0001', 9, '2024-05-01', N'Phim rất hay, ý nghĩa.'),
('DG002', 'U0002', 'P0003', 8, '2024-03-05', N'Kỹ xảo đỉnh cao, nội dung sâu sắc.'),
('DG003', 'U0003', 'P0002', 7, '2024-03-10', N'Cốt truyện hấp dẫn.'),
('DG004', 'U0004', 'P0004', 8, '2024-04-01', N'Hành động mãn nhãn.'),
('DG005', 'U0005', 'P0005', 9, '2024-03-12', N'Hoạt hình vui nhộn, ý nghĩa.'),
('DG006', 'U0009', 'P0001', 7, '2024-05-05', N'Phim ổn, nhưng hơi dài.'),
('DG007', 'U0010', 'P0009', 10, '2024-01-01', N'Bộ phim yêu thích của tôi.'),
('DG008', 'U0001', 'P0009', 9, '2024-01-10', N'Xem đi xem lại vẫn hay.'),
('DG009', 'U0002', 'P0004', 7, '2024-04-05', N'Godzilla và Kong vẫn là số 1.'),
('DG010', 'U0003', 'P0001', 8, '2024-05-03', N'Cốt truyện nhân văn.');
set dateformat ymd
-- 3. Bảng dienvien
INSERT INTO dienvien  VALUES
('DV001', N'Ryan Reynolds', '1976-10-23', N'Canada', N'Diễn viên hài hành động.'),
('DV002', N'Hugh Jackman', '1968-10-12', N'Australia', N'Nổi tiếng với vai Wolverine.'),
('DV003', N'Zendaya', '1996-09-01', N'Mỹ', N'Ngôi sao trẻ đa tài.'),
('DV004', N'Timothée Chalamet', '1995-12-27', N'Mỹ', N'Diễn viên trẻ triển vọng.'),
('DV005', N'Võ Thanh Hiền', '1985-05-15', N'Việt Nam', N'Diễn viên thực lực.'),
('DV006', N'Trần Thành', '1987-07-05', N'Việt Nam', N'Đạo diễn, diễn viên, MC.'),
('DV007', N'Issa Rae', '1985-01-13', N'Mỹ', N'Biên kịch, diễn viên, nhà sản xuất.'),
('DV008', N'Lương Định Thanh', '1990-09-20', N'Việt Nam', N'Diễn viên truyền hình và điện ảnh.'),
('DV009', N'Kelly Marie Tran', '1989-01-17', N'Mỹ', N'Diễn viên lồng tiếng.'),
('DV010', N'Quốc Anh', '1996-08-08', N'Việt Nam', N'Diễn viên trẻ.'),
('DV011', N'Bae Doona', '1979-10-11', N'Hàn Quốc', N'Diễn viên nổi tiếng quốc tế.'),
('DV012', N'Son Seok Koo', '1983-02-07', N'Hàn Quốc', N'Diễn viên đang lên với nhiều vai diễn ấn tượng.'),
('DV013', N'Chang Ki Ha', '1982-02-20', N'Hàn Quốc', N'Ca sĩ, diễn viên, và MC truyền hình.');
-- 4. Bảng theloai
INSERT INTO TheLoai VALUES
('TL001', N'Hành động'),
('TL002', N'Khoa học viễn tưởng'),
('TL003', N'Hài hước'),
('TL004', N'Hoạt hình'),
('TL005', N'Tâm lý'),
('TL006', N'Kinh dị'),
('TL007', N'Phiêu lưu'),
('TL008', N'Tình cảm'),
('TL009', N'Gia đình'),
('TL010', N'Chính kịch'),
('TL011', N'Giật gân');

-- 12. Bảng dienvien_phim
INSERT INTO DienVien_Phim (idDienVien, idPhim) VALUES
('DV001', 'P0008'), ('DV002', 'P0008'), ('DV003', 'P0003'), ('DV004', 'P0003'),
('DV005', 'P0001'), ('DV006', 'P0010'), ('DV007', 'P0006'), ('DV008', 'P0009'),
('DV009', 'P0005'), ('DV010', 'P0002'), ('DV011', 'P0015'), ('DV012', 'P0015'),
('DV013', 'P0015');

-- 13. Bảng theloai_phim
INSERT INTO TheLoai_Phim (idTheLoai, idPhim) VALUES
('TL001', 'P0001'), ('TL009', 'P0001'), ('TL005', 'P0002'), ('TL010', 'P0002'),
('TL002', 'P0003'), ('TL007', 'P0003'), ('TL001', 'P0004'), ('TL002', 'P0004'),
('TL004', 'P0005'), ('TL003', 'P0005'), ('TL004', 'P0006'), ('TL005', 'P0006'),
('TL006', 'P0007'), ('TL001', 'P0008'), ('TL003', 'P0008'), ('TL005', 'P0009'),
('TL008', 'P0009'), ('TL003', 'P0010'), ('TL009', 'P0010'), ('TL010', 'P0010'),
('TL003', 'P0015'), ('TL008', 'P0015'), ('TL006', 'P0011'), ('TL006', 'P0012'),
('TL001', 'P0013'), ('TL005', 'P0014'), ('TL011', 'P0014'), ('TL004', 'P0016'),
('TL001', 'P0017'), ('TL001', 'P0018'), ('TL003', 'P0018');
set dateformat ymd
-- 16. Bảng ve (DonHangVe)
INSERT INTO Ve (idVe, idUser, NgayDat, TongGiaTriDonHang, trangthai,ngayhethan) VALUES
('V0001', 'U0001', GETDATE(), 270000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0002', 'U0002', GETDATE(), 100000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0003', 'U0003', GETDATE(), 85000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0004', 'U0004', GETDATE(), 120000, N'Đang chờ thanh toán',DATEADD(minute, 15, GETDATE())),
('V0005', 'U0005', GETDATE(), 180000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0006', 'U0009', GETDATE(), 90000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0007', 'U0010', GETDATE(), 95000, N'Đang chờ thanh toán',DATEADD(minute, 15, GETDATE())),
('V0008', 'U0001', GETDATE(), 360000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0009', 'U0002', GETDATE(), 200000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE())),
('V0010', 'U0003', GETDATE(), 170000, N'Đã thanh toán',DATEADD(minute, 15, GETDATE()));

-- 8. Bảng Food
INSERT INTO Food (idFood, TenDoAn, MoTa, GiaBan, TrangThai, soluongtonkho, url_anh) VALUES
('F0001', N'Bắp rang bơ caramel', N'Bắp rang bơ vị caramel thơm ngon.', 60000, N'Còn hàng', 500, '/images/popcorn.jpg'),
('F0002', N'Coca-Cola (lon)', N'Nước ngọt có ga giải khát.', 30000, N'Còn hàng', 800, '/images/coca.jpg'),
('F0003', N'Snack khoai tây', N'Snack khoai tây giòn rụm.', 45000, N'Còn hàng', 300, '/images/snack.jpg'),
('F0004', N'Combo bắp nước nhỏ', N'1 bắp nhỏ + 1 nước nhỏ.', 85000, N'Còn hàng', 200, '/images/combobapnuoc.jpg'),
('F0005', N'Combo bắp nước lớn', N'1 bắp lớn + 2 nước lớn.', 130000, N'Còn hàng', 150, '/images/bapnuoclon.jpg'),
('F0006', N'Hot dog', N'Bánh mì kẹp xúc xích nóng.', 70000, N'Còn hàng', 100, '/images/hotdog.jpg'),
('F0007', N'Nước lọc đóng chai', N'Nước uống tinh khiết.', 20000, N'Còn hàng', 1000, '/images/nuocloc.jpg'),
('F0008', N'Kẹo dẻo', N'Kẹo dẻo nhiều màu sắc.', 35000, N'Còn hàng', 400, '/images/haribo.jpg'),
('F0009', N'Pizza mini', N'Pizza cỡ nhỏ với nhiều vị.', 90000, N'Còn hàng', 80, '/images/pizza.jpg'),
('F0100', N'Kem ly', N'Kem mát lạnh nhiều hương vị.', 55000, N'Còn hàng', 120, '/images/kem.jpg');

-- 18. Bảng ve_food (ChiTietDoAn)
INSERT INTO Ve_Food (idvefood,idVe, idFood,soluong) VALUES
('VF001','V0001', 'F0004',1), ('VF002','V0001', 'F0002',1),
('VF003','V0002', 'F0001',1),
('VF004','V0003', 'F0002',2), ('VF010','V0003', 'F0003',2),
('VF005','V0005', 'F0005',2), ('VF011','V0005', 'F0007',6),
('VF006','V0006', 'F0001',3), ('VF012','V0006', 'F0002',4),
('VF007','V0008', 'F0004',2), ('VF013','V0008', 'F0002',3), ('VF016','V0008', 'F0003',5),
('VF008','V0009', 'F0001',6), ('VF014','V0009', 'F0002',1), ('VF017','V0009', 'F0007',2),
('VF009','V0010', 'F0001',2), ('VF015','V0010', 'F0002',2);
set dateformat ymd
INSERT INTO ThanhToan (idThanhToan, idVe, phuongthucthanhtoan, trangthai, soTienThanhToan, ngayThanhToan) VALUES
('TT001', 'V0001', N'online', N'Thành công', 270000, GETDATE()),
('TT002', 'V0002', N'online', N'Thành công', 100000, GETDATE()),
('TT003', 'V0003', N'online', N'Thành công', 85000, GETDATE()),
('TT004', 'V0004', N'online', N'Thất bại', 120000, GETDATE()),
('TT005', 'V0005', N'online', N'Thành công', 180000, GETDATE()),
('TT006', 'V0006', N'tiền mặt', N'Thành công', 90000, GETDATE()),
('TT007', 'V0007', N'online', N'Đang chờ', 95000, GETDATE()),
('TT008', 'V0008', N'online', N'Thành công', 360000, GETDATE()),
('TT009', 'V0009', N'online', N'Thành công', 200000, GETDATE()),
('TT010', 'V0010', N'tiền mặt', N'Thành công', 170000, GETDATE());

-- 5. Bảng Phong
INSERT INTO Phong (idPhong, tenphong, tongSoLuongChoNgoi) VALUES
('R0001', N'Phòng Cinema 1', 150),
('R0002', N'Phòng Cinema 2', 120),
('R0003', N'Phòng Cinema 3', 100),
('R0004', N'Phòng Cinema 4', 80),
('R0005', N'Phòng Cinema 5', 180),
('R0006', N'Phòng Cinema 6', 90),
('R0007', N'Phòng Cinema 7', 70),
('R0008', N'Phòng Cinema 8', 110),
('R0009', N'Phòng Cinema 9', 130),
('R0010', N'Phòng Cinema 10', 60);

-- 6. Bảng LoaiGhe
INSERT INTO LoaiGhe (idLoaiGhe, tenloaighe, gia) VALUES
('LG001', N'Ghế thường', 100000),
('LG002', N'Ghế VIP', 150000),
('LG003', N'Ghế đôi', 200000);
-- 14. Bảng chongoi
DECLARE @MaPhong INT = 1
DECLARE @STT INT = 1  -- Dùng để tạo ID chỗ ngồi

WHILE @MaPhong <= 10
BEGIN
    DECLARE @Hang INT = 1

    WHILE @Hang <= 10
    BEGIN
        DECLARE @Cot INT = 1

        WHILE @Cot <= 14
        BEGIN
            DECLARE @IDChoNgoi NVARCHAR(10)
            DECLARE @IDPhong NVARCHAR(10)
            DECLARE @HangGhe CHAR(1)
            DECLARE @IDLoaiGhe NVARCHAR(10)

            SET @IDChoNgoi = 'CG' + RIGHT('000' + CAST(@STT AS VARCHAR), 4)
            SET @IDPhong = 'R' + RIGHT('000' + CAST(@MaPhong AS VARCHAR), 4)
            SET @HangGhe = CHAR(64 + @Hang)  -- Hàng A–J

            -- Xác định loại ghế theo hàng
            IF @HangGhe IN ('H', 'I', 'J')
                SET @IDLoaiGhe = 'LG002'  -- Ghế VIP
            ELSE
                SET @IDLoaiGhe = 'LG001'  -- Ghế thường

            INSERT INTO ChoNgoi (idChoNgoi, idPhong, idLoaiGhe, Hang, [cot])
            VALUES (@IDChoNgoi, @IDPhong, @IDLoaiGhe, @HangGhe, @Cot)

            SET @STT += 1
            SET @Cot += 1
        END

        SET @Hang += 1
    END

    SET @MaPhong += 1
END
-- 7. Bảng SuatChieu
INSERT INTO SuatChieu (idSuatChieu, tenSuatChieu, tgianchieu) VALUES
('SC001', N'Suất sáng 10:00', '10:00:00'),
('SC002', N'Suất trưa 13:00', '13:00:00'),
('SC003', N'Suất chiều 16:00', '16:00:00'),
('SC004', N'Suất tối 19:00', '19:00:00'),
('SC005', N'Suất khuya 22:00', '22:00:00'),
('SC006', N'Suất đặc biệt 09:30', '09:30:00'),
('SC007', N'Suất muộn 23:30', '23:30:00'),
('SC008', N'Suất sớm 08:30', '08:30:00'),
('SC009', N'Suất 14:30', '14:30:00'),
('SC010', N'Suất 20:30', '20:30:00');
set dateformat ymd
-- 15. Bảng lichchieu
INSERT INTO LichChieu (idLichChieu, idPhim, idSuatChieu, idPhong, ngaychieu) VALUES
('LC001', 'P0001', 'SC003', 'R0001', '2024-06-07' ),
('LC002', 'P0001', 'SC004', 'R0001', '2024-06-07' ),
('LC003', 'P0003', 'SC004', 'R0002', '2024-06-07' ),
('LC004', 'P0005', 'SC002', 'R0003', '2024-06-07' ),
('LC005', 'P0006', 'SC001', 'R0004', '2024-06-15' ),
('LC006', 'P0007', 'SC005', 'R0001', '2024-06-28' ),
('LC007', 'P0008', 'SC004', 'R0005', '2024-07-26'),
('LC008', 'P0001', 'SC003', 'R0001', '2024-06-08' ),
('LC009', 'P0003', 'SC004', 'R0002', '2024-06-08' ),
('LC010', 'P0005', 'SC002', 'R0003', '2024-06-08' ),
('LC011', 'P0001', 'SC006', 'R0002' ,'2024-06-08'),
('LC012', 'P0002', 'SC001', 'R0003', '2024-06-07'),
('LC013', 'P0004', 'SC005', 'R0004', '2024-06-07'),
('LC014', 'P0009', 'SC006', 'R0005', '2024-06-07'),
('LC015', 'P0002', 'SC002', 'R0006', '2024-06-08'), -- Sử dụng phòng mới R0006
('LC016', 'P0004', 'SC007', 'R0007', '2024-06-08'), -- Sử dụng suất chiếu SC007 và phòng R0007
('LC017', 'P0010', 'SC008', 'R0008', '2024-06-08'), -- Sử dụng suất chiếu SC008 và phòng R0008
('LC018', 'P0001', 'SC009', 'R0009', '2024-06-09'), -- Sử dụng suất chiếu SC009 và phòng R0009
('LC019', 'P0003', 'SC010', 'R0010', '2024-06-09'), -- Sử dụng suất chiếu SC010 và phòng R0010
('LC020', 'P0005', 'SC001', 'R0001', '2024-06-10'), -- Quay lại phòng R0001
('LC021', 'P0006', 'SC002', 'R0002', '2024-06-10'),
('LC022', 'P0007', 'SC003', 'R0003', '2024-06-15'),
('LC023', 'P0008', 'SC004', 'R0004', '2024-06-15'),
('LC024', 'P0009', 'SC005', 'R0005', '2024-06-20'),
('LC025', 'P0010', 'SC006', 'R0006', '2024-06-20'),
('LC026', 'P0001', 'SC007', 'R0007', '2024-07-01'), -- Suất chiếu mới, phòng mới, tháng mới
('LC027', 'P0002', 'SC008', 'R0008', '2024-07-01'),
('LC028', 'P0003', 'SC009', 'R0009', '2024-07-05'),
('LC029', 'P0004', 'SC010', 'R0010', '2024-07-05'),
('LC030', 'P0005', 'SC001', 'R0001', '2024-07-10'),
('LC031', 'P0001', 'SC003', 'R0002', '2024-06-07');
-- 19. Bảng chitietdatve
INSERT INTO ChiTietDatVe (idChiTietVe, idVe, idLichChieu, idChoNgoi, GiaVeDonLe, TrangThaiVe) VALUES
('CTV01', 'V0001', 'LC001', 'CG0001', 90000, N'Đã đặt'),
('CTV02', 'V0001', 'LC001', 'CG0002', 90000, N'Đã đặt'),
('CTV03', 'V0001', 'LC001', 'CG0003', 90000, N'Đã đặt'),
('CTV04', 'V0002', 'LC003', 'CG0007', 100000, N'Đã đặt'),
('CTV05', 'V0003', 'LC004', 'CG0005', 85000, N'Đã đặt'),
('CTV06', 'V0004', 'LC005', 'CG0008', 120000, N'Đã đặt'),
('CTV07', 'V0005', 'LC002', 'CG0004', 95000, N'Đã đặt'),
('CTV08', 'V0005', 'LC002', 'CG0009', 95000, N'Đã đặt'),
('CTV09', 'V0009', 'LC009', 'CG0006', 100000, N'Đã đặt'),
('CTV10', 'V0010', 'LC031', 'CG0012', 100000, N'Đã đặt'),
('CTV11', 'V0010', 'LC031', 'CG0011', 100000, N'Đã đặt'),
('CTV12', 'V0010', 'LC031', 'CG0013', 100000, N'Đã đặt'),
('CTV13', 'V0010', 'LC031', 'CG0014', 100000, N'Đã đặt'),
('CTV14', 'V0010', 'LC031', 'CG0010', 100000, N'Đã đặt'),
('CTV15', 'V0010', 'LC031', 'CG0015', 100000, N'Đã đặt');
--chọn phim
select * from phim where phim.ngayphathanh <= getdate()+30
--chọn chọn ngày đi sau khi chọn phim
select distinct l.ngaychieu from lichchieu l, phim p
where l.idPhim = p.idPhim  and p.tenphim =N'Lật Mặt 7: Một Chuyến Phiêu Lưu'
--chọn suất chiếu và phòng tương ứng sau khi đã chọn phim và ngày đi
select s.tgianchieu from lichchieu l, phim p, suatchieu s
where l.idPhim = p.idPhim  
	and l.idSuatChieu = s.idSuatChieu
	and p.tenphim =N'Lật Mặt 7: Một Chuyến Phiêu Lưu' 
	and l.ngaychieu = '2024-06-07'
--lấy ra phòng sau khi đã chọn phim, ngày đi và thời gian chiếu (chỉ áp dụng cho trường hợp chỉ có 1 phòng chiếu)
select ph.* from lichchieu l, phim p, suatchieu s, phong ph
where l.idPhim = p.idPhim  
	and l.idSuatChieu = s.idSuatChieu 
	and l.idPhong = ph.idPhong
	and p.tenphim =N'Lật Mặt 7: Một Chuyến Phiêu Lưu' 
	and l.ngaychieu = '2024-06-07'
	and s.tgianchieu = '16:00:00'
--nếu như có nhiều hơn 2 phòng có cùng các thuộc tính như vậy thì phải lọc ra phòng có số lượng đặt chỗ ít nhất
SELECT TOP 1 
    l.idPhong
FROM lichchieu l
JOIN phong p ON p.idPhong = l.idPhong
JOIN suatchieu s ON s.idSuatChieu = l.idSuatChieu
JOIN phim ph ON ph.idPhim = l.idPhim
LEFT JOIN chitietdatve ct 
    ON ct.idLichChieu = l.idLichChieu 
   AND ct.TrangThaiVe = N'Đã đặt'
WHERE 
    ph.tenphim = N'Lật Mặt 7: Một Chuyến Phiêu Lưu' 
    AND l.ngaychieu = '2024-06-07'
    AND s.tgianchieu = '16:00:00'
GROUP BY 
    l.idLichChieu, l.idPhong
ORDER BY COUNT(ct.idChoNgoi) ASC
--lấy ra lịch chiếu từ các thuộc tính đã chọn (chỉ áp dụng cho trường hợp chỉ có 1 phòng chiếu)
select l.* from lichchieu l, phim p, suatchieu s, phong ph
where l.idPhim = p.idPhim  
	and l.idSuatChieu = s.idSuatChieu 
	and l.idPhong = ph.idPhong
	and p.tenphim =N'Lật Mặt 7: Một Chuyến Phiêu Lưu' 
	and l.ngaychieu = '2024-06-07'
	and s.tgianchieu = '16:00:00'
--lấy tất cả các ghế ngồi đã được đặt từ các thuộc tính đã chọn
SELECT ch.*
FROM chitietdatve c
JOIN chongoi ch ON c.idChoNgoi = ch.idChoNgoi
WHERE c.idLichChieu = (
    SELECT TOP 1 l.idLichChieu
    FROM lichchieu l
    JOIN phim p ON l.idPhim = p.idPhim
    JOIN suatchieu s ON l.idSuatChieu = s.idSuatChieu
    LEFT JOIN chitietdatve ct ON ct.idLichChieu = l.idLichChieu AND ct.TrangThaiVe = N'Đã đặt'
    WHERE 
        p.tenphim = N'Bố Già'
        AND l.ngaychieu = '2024-06-08'
        AND s.tgianchieu = '08:30:00'
    GROUP BY l.idLichChieu
    ORDER BY COUNT(ct.idChoNgoi) asc
) and (c.TrangThaiVe = N'Đã đặt' or c.TrangThaiVe = N'Đã thanh toán')
--thêm bản ghi cho vé vừa mới đặt
insert into ve values
('V0011','U0001',getdate(),0,N'Đang chờ thanh toán',DATEADD(minute, 15, GETDATE()));
--trước khi insert chitietdatve người dùng sẽ lấy danh sách ghế đã chọn từ trên giao diện sau đó với mỗi ghế sẽ select ra 1 giá rồi sau đó
--mới insert vào bảng chitietdatve
insert into chitietdatve values
('CTV16', 'V0011', 'LC001', 'CG0006', 100000, N'Đã đặt'),
('CTV17', 'V0011', 'LC001', 'CG0005', 100000, N'Đã đặt');
--chọn mua thêm đồ ăn đồ uống nếu muốn
--insert into ve_food values
--('V0011', 'F0001',2),
--('V0011', 'F0003',2);
--tính tổng só tiền phải trả sau khi đặt chỗ và mua đồ ăn
update ve
set TongGiaTriDonHang = ISNULL((SELECT SUM(c.GiaVeDonLe)
                                FROM chitietdatve c
                                WHERE c.idVe = 'V0011'), 0) 
						+ ISNULL((SELECT SUM(vf.SoLuong * f.giaban) -- Tổng tiền đồ ăn (sử dụng DonGiaBan từ Ve_Food)
                                from ve_food vf join Food f on vf.idFood = f.idFood
                               WHERE vf.idVe = 'V0011'), 0)
where idVe = 'V0011'
--kiểm tra xem giá đã cập nhật chưa
select * from ve where idVe = 'V0011'
-- thêm bản ghi thanh toán cho vé vừa mới đặt
insert into thanhtoan values
('TT011', 'V0011', N'online', N'Thành công', 410000, GETDATE());
select * from thanhtoan where idVe = 'V0011'
-- nếu thanh toán thành công thì sẽ chuyển trạng thái của vé thành đã thanh toán
update ve
set trangthai = N'Đã thanh toán'
where idVe = 'V0011'
--khi thêm lịch trình nhân viên sẽ xem gọi hàm này để kiểm tra có trùng lịch hay không, nếu trả ra 1 bản ghi hoặc nhiều hơn thì sẽ là lịch  này bị trùng
--SELECT * FROM LichChieu lc
--         JOIN SuatChieu sc ON lc.idSuatChieu = sc.idSuatChieu
--         JOIN Phim p ON lc.idPhim = p.idPhim
--         WHERE lc.idPhong = :phongId
--          AND lc.ngaychieu = :ngayChieu
--          AND (
--               (sc.tgianchieu < :thoiGianKetThuc AND :tgianChieu < DATEADD(minute, p.thoiluong, sc.tgianchieu))
--           );
select * from chongoi where idPhong = 'R0001'
select * from nguoidung
select * from khachhang where idUser = 'U0011'
select n.*,k.idKhachhang,k.hoten,k.sdt,k.ngaysinh,k.gioitinh
from nguoidung n join khachhang k on n.idUser =k.idUser
select * from thanhtoan

--lịch sử đặt vé
SELECT v.idVe,
	   p.url_poster,
	   p.tenphim,
       v.NgayDat,
       STRING_AGG(ch.hang + CAST(ch.cot AS NVARCHAR(10)), ', ') AS DanhSachGhe,
	   v.TongGiaTriDonHang,
	   v.trangthai
FROM chitietdatve c
JOIN ve v ON c.idVe = v.idVe
JOIN lichchieu l ON c.idLichChieu = l.idLichChieu
JOIN phim p ON l.idPhim = p.idPhim
JOIN chongoi ch ON ch.idChoNgoi = c.idChoNgoi
where v.idUser = 'U0001'
GROUP BY p.tenphim, v.NgayDat, v.TongGiaTriDonHang,v.idUser,v.trangthai,p.url_poster,v.idVe;

--xem chi tiết phim
--lấy ra phim từ vé đã đặt
select distinct p.url_poster,p.tenphim,p.mo_ta,p.thoiluong
from chitietdatve ct
	join lichchieu l on l.idLichChieu = ct.idLichChieu
	join phim p on p.idPhim = l.idPhim
where ct.idVe = 'V0001'
--lấy ra thể loại
select distinct t.tentheloai
from chitietdatve ct
	join lichchieu l on l.idLichChieu = ct.idLichChieu
	join phim p on p.idPhim = l.idPhim
	join theloai_phim tl on tl.idPhim = p.idPhim
	join theloai t on t.idTheLoai = tl.idTheLoai
where ct.idVe = 'V0001'
--tính điểm đánh giá cũng như số lần đánh giá của 1 bộ phim 
select COUNT(diemdanhgia) as N'Số lượt đánh gía',AVG(diemdanhgia)/2 as N'Điểm đánh giá trung bình'
from danhgia d join phim p on p.idPhim = d.idPhim
where p.idPhim = 'P0001'
--lấy các thông tin về lịch chiếu
select distinct l.ngaychieu, s.tgianchieu
from chitietdatve ct
	join lichchieu l on l.idLichChieu = ct.idLichChieu
	join suatchieu s on s.idSuatChieu = l.idSuatChieu
where ct.idVe = 'V0001' 
--lấy thông tin về chỗ ngồi
select ch.hang + CAST(ch.cot AS NVARCHAR(10)) AS TenGhe
from chitietdatve ct
	join chongoi ch on ch.idChoNgoi = ct.idChoNgoi
where ct.idVe = 'V0001' 
--lấy thông tin về vé đã đặt
SELECT DISTINCT 
    v.idVe,
    v.trangthai,
    v.TongGiaTriDonHang AS N'Tổng tiền',
    ct.GiaVeDonLe AS N'Tiền vé',
    (
        SELECT SUM(vf.SoLuong * f.giaban)
        FROM ve_food vf
        JOIN Food f ON vf.idFood = f.idFood
        WHERE vf.idVe = v.idVe
    ) AS N'Tiền đồ ăn'

FROM chitietdatve ct
JOIN ve v ON v.idVe = ct.idVe
WHERE ct.idVe = 'V0001';
--lấy thông tin thanh toán
select t.phuongthucthanhtoan,t.ngayThanhToan	
from ve v join thanhtoan t on v.idVe = t.idVe
where v.idVe = 'V0001'
--lấy thông tin của phòng chiếu
select distinct p.tenphong
from chitietdatve ct
	join lichchieu l on l.idLichChieu = ct.idLichChieu
	join phong p on p.idPhong = l.idPhong
where ct.idVe = 'V0001'
go
--drop PROCEDURE sp_ChiTietDatVe
CREATE PROCEDURE sp_ChiTietDatVe
    @idVe NVARCHAR(20)
AS
BEGIN
    -- 1. Lấy thông tin phim từ vé đã đặt
    SELECT DISTINCT 
        p.url_poster,
        p.tenphim,
        p.mo_ta,
        p.thoiluong
    FROM chitietdatve ct
    JOIN lichchieu l ON l.idLichChieu = ct.idLichChieu
    JOIN phim p ON p.idPhim = l.idPhim
    WHERE ct.idVe = @idVe;

    -- 2. Lấy thể loại
    SELECT DISTINCT t.tentheloai
    FROM chitietdatve ct
    JOIN lichchieu l ON l.idLichChieu = ct.idLichChieu
    JOIN phim p ON p.idPhim = l.idPhim
    JOIN theloai_phim tl ON tl.idPhim = p.idPhim
    JOIN theloai t ON t.idTheLoai = tl.idTheLoai
    WHERE ct.idVe = @idVe;

    -- 3. Tính điểm đánh giá
    SELECT 
        COUNT(d.diemdanhgia) AS [Số lượt đánh giá],
        AVG(CAST(d.diemdanhgia AS FLOAT)) / 2 AS [Điểm đánh giá trung bình]
    FROM danhgia d
    JOIN phim p ON p.idPhim = d.idPhim
    WHERE p.idPhim = (
        SELECT TOP 1 p.idPhim
        FROM chitietdatve ct
        JOIN lichchieu l ON l.idLichChieu = ct.idLichChieu
        JOIN phim p ON p.idPhim = l.idPhim
        WHERE ct.idVe = @idVe
    );

    -- 4. Lịch chiếu
    SELECT DISTINCT 
        l.ngaychieu, 
        s.tgianchieu
    FROM chitietdatve ct
    JOIN lichchieu l ON l.idLichChieu = ct.idLichChieu
    JOIN suatchieu s ON s.idSuatChieu = l.idSuatChieu
    WHERE ct.idVe = @idVe;

    -- 5. Ghế
    SELECT 
        ch.hang + CAST(ch.cot AS NVARCHAR(10)) AS TenGhe
    FROM chitietdatve ct
    JOIN chongoi ch ON ch.idChoNgoi = ct.idChoNgoi
    WHERE ct.idVe = @idVe;

   -- 6. Gộp: Thông tin vé + tiền vé + tiền đồ ăn
	SELECT DISTINCT 
		v.idVe,
		v.trangthai,
		v.TongGiaTriDonHang AS [Tổng tiền],
		(SELECT SUM(GiaVeDonLe)
		 FROM chitietdatve
		 WHERE idVe = v.idVe) AS [Tiền vé],
		DoAn.TienDoAn AS [Tiền đồ ăn]
	FROM chitietdatve ct
	JOIN ve v ON v.idVe = ct.idVe
	OUTER APPLY (
		SELECT SUM(vf.SoLuong * f.giaban) AS TienDoAn
		FROM ve_food vf
		JOIN Food f ON vf.idFood = f.idFood
		WHERE vf.idVe = v.idVe
	) AS DoAn
	WHERE ct.idVe = @idVe;


    -- 7. Thanh toán
    SELECT 
        t.phuongthucthanhtoan,
        t.ngayThanhToan
    FROM ve v 
    JOIN thanhtoan t ON v.idVe = t.idVe
    WHERE v.idVe = @idVe;

    -- 8. Thông tin phòng
    SELECT DISTINCT p.tenphong
    FROM chitietdatve ct
    JOIN lichchieu l ON l.idLichChieu = ct.idLichChieu
    JOIN phong p ON p.idPhong = l.idPhong
    WHERE ct.idVe = @idVe;
END;

EXEC sp_ChiTietDatVe 'V0013';
select * from chongoi where idphong = 'R0008'
select idLichChieu from lichchieu where idPhong = 'R0008' and idSuatChieu ='SC008' and ngaychieu ='2024-06-08'
delete from ve where idVe = 'V0013'
select * from chitietdatve
select * from ve
select * from thanhtoan
select * from ve_food vf
select * from Food
/*update chitietdatve
set trangthaive = N'Đã hủy'
where idchitietve = 'CTV20'*/