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

create table khachhang
(	
	idUser Char(5) primary key,
	tenUser nvarchar(30),
	diachiKh nvarchar(50),
	SDT varchar(11),
	email varchar(50),
	matkhau varchar(10)
	unique(SDT,email,matkhau)
)
create table phim
(
	idPhim Char(5) primary key,
	tenphim nvarchar(50),
	daodien nvarchar(30),
	MoTaPhim nvarchar(100),
    ThoiLuong INT,
    NgaySanXuat DATE,
    LuotXem INT DEFAULT 0,
	quocgia nvarchar(30),
	gioihandotuoi int,
)
create table dienvien
(
	idDienVien Char(5) primary key,
	tenDienVien nvarchar(30),
	ngaysinh date,
	quoctich nvarchar(30),
	mota nvarchar(100)
)
create table theloai 
(
	idtheloai Char(5) primary key,
	tentheloai nvarchar(30),
)
create table theloai_phim
(
	idtheloai Char(5),
	idPhim Char(5)
	primary key (idtheloai,idPhim)
	foreign key (idtheloai) references theloai(idtheloai)
			on update
				cascade
			on delete
				cascade,
	foreign key (idPhim) references phim(idPhim)
			on update
				cascade
			on delete
				cascade,
)
create table dienvien_phim
(
	idDienVien Char(5),
	idPhim Char(5)
	primary key (idDienVien,idPhim)
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
create table lichsuxemphim
(
	idUser Char(5),
	idPhim Char(5),
	ngayxem date,
	primary key (idUser,idPhim),
	foreign key (idUser) references khachhang(idUser)
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
create table phimyeuthich
(
	idphimyeuthich Char(5) primary key,
	idUser Char(5),
	idPhim Char(5),
	ngayluu date,
	foreign key (idUser) references khachhang(idUser)
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
create table binhluan
(
	idbinhluan Char(5) primary key,
	idUser Char(5),
	idPhim Char(5),
	noidung nvarchar(200),
	ngaydang date,
	foreign key (idUser) references khachhang(idUser)
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
create table danhgia
(
	iddanhgia Char(5) primary key,
	idUser Char(5),
	idPhim Char(5),
	diemdanhgia int,
	ngaydanhgia date,
	foreign key (idUser) references khachhang(idUser)
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

ALTER TABLE KhachHang
    ADD CONSTRAINT CK_KhachHang_SDT 
    CHECK (LEN(SDT) = 10 AND PATINDEX('%[^0-9]%', SDT) = 0);
alter table KhachHang
	add constraint CK_KhachHang_Email
			check(email like '[A-Za-z]%@gmail.com')
alter table danhgia
	add CONSTRAINT ck_diemdanhgia CHECK (diemdanhgia BETWEEN 1 AND 10)

-- Insert KhachHang
INSERT INTO khachhang (idUser, tenUser, diachiKh, SDT, email, matkhau) VALUES
    ('KH001', 'Nguyen Thi A', '123 Mai Xuân Thưởng, TP.HCM', '0123456781', 'nguyen.a@gmail.com', 'password1'),
    ('KH002', 'Tran Thi B', '456 Le Lai, TP.HCM', '0123456789', 'tran.b@gmail.com', 'password2'),
    ('KH003', 'Le Thi C', '789 Hoa Mai, TP.HCM', '0123456783', 'le.c@gmail.com', 'password3'),
    ('KH004', 'Nguyen Thi D', '321 Nguyen Trai, TP.HCM', '0124567894', 'nguyen.d@gmail.com', 'password4'),
    ('KH005', 'Pham Thi E', '654 Quang Trung, TP.HCM', '0123457895', 'pham.e@gmail.com', 'password5'),
    ('KH006', 'Bui Thi F', '987 Tran Phu, TP.HCM', '0123467896', 'bui.f@gmail.com', 'password6'),
    ('KH007', 'Hoang Thi G', '123 Vo Thi Sau, TP.HCM', '0123467897', 'hoang.g@gmail.com', 'password7'),
    ('KH008', 'Phan Thi H', '456 An Duong Vuong, TP.HCM', '0124567898', 'phan.h@gmail.com', 'password8'),
    ('KH009', 'Nguyen Thi I', '789 Le Quang Dieu, TP.HCM', '0123567899', 'nguyen.i@gmail.com', 'password9'),
    ('KH010', 'Trinh Thi J', '321 Ho Chi Minh, TP.HCM', '0124567900', 'trinh.j@gmail.com', 'password10');

-- Insert Phim
INSERT INTO phim (idPhim, tenphim, daodien, MoTaPhim, ThoiLuong, NgaySanXuat, LuotXem, quocgia, gioihandotuoi) VALUES
    ('PH001', N'Hai Phượng', N'Lê Văn Kiệt', N'Phim hành động Việt Nam về hành trình cứu con của một bà mẹ đơn thân.', 120, '2023-01-01', 1000, N'Việt Nam', 18),
    ('PH002', N'Avengers: Endgame', N'Anthony Russo & Joe Russo', N'Tập phim đỉnh cao trong loạt phim Marvel, kết thúc cuộc chiến với Thanos.', 181, '2023-02-01', 1500, N'Mỹ', 13),
    ('PH003', N'Train to Busan', N'Yeon Sang-ho', N'Phim kinh dị Hàn Quốc về đại dịch zombie trên chuyến tàu.', 118, '2023-03-01', 1200, N'Hàn Quốc', 16),
    ('PH004', N'Rurouni Kenshin', N'Keishi Ōtomo', N'Phim kiếm hiệp Nhật Bản chuyển thể từ manga nổi tiếng.', 134, '2023-04-01', 1100, N'Nhật Bản', 15),
    ('PH005', N'Mắt Biếc', N'Victor Vũ', N'Tác phẩm tình cảm lãng mạn chuyển thể từ truyện của Nguyễn Nhật Ánh.', 100, '2023-05-01', 1400, N'Việt Nam', 13),
    ('PH006', N'Inception', N'Christopher Nolan', N'Trận chiến giữa mộng và thực, lối kể chuyện đầy chiều sâu và phức tạp.', 148, '2023-06-01', 1600, N'Mỹ', 12),
    ('PH007', N'Parasite', N'Bong Joon-ho', N'Bộ phim giành giải Oscar với câu chuyện phân hóa giàu nghèo tại Hàn Quốc.', 132, '2023-07-01', 1700, N'Hàn Quốc', 16),
    ('PH008', N'Your Name', N'Makoto Shinkai', N'Anime nổi tiếng kể về hai người hoán đổi thân xác kỳ lạ và tình cảm vượt không gian.', 115, '2023-08-01', 1300, N'Nhật Bản', 14),
    ('PH009', N'Tiệc Trăng Máu', N'Nguyễn Quang Dũng', N'Hài kịch đen hé lộ những bí mật của bạn bè trong một bữa tiệc.', 125, '2023-09-01', 1500, N'Việt Nam', 18),
    ('PH010', N'Iron Man', N'Jon Favreau', N'Phim mở màn vũ trụ điện ảnh Marvel với nhân vật Tony Stark.', 140, '2023-10-01', 2000, N'Mỹ', 20);

set dateformat ymd
-- Insert DienVien
INSERT INTO dienvien (idDienVien, tenDienVien, ngaysinh, quoctich, mota) VALUES
    ('DV001', N'Ngô Thanh Vân', '1979-02-26', N'Việt Nam', N'Nữ diễn viên, nhà sản xuất nổi tiếng với các phim hành động như Hai Phượng.'),
    ('DV002', N'Johnny Depp', '1963-06-09', N'Mỹ', N'Tài tử Hollywood, nổi tiếng qua loạt phim Cướp biển vùng Caribbean.'),
    ('DV003', N'Song Hye Kyo', '1981-11-22', N'Hàn Quốc', N'Mỹ nhân phim truyền hình, nổi bật với Hậu duệ mặt trời.'),
    ('DV004', N'Ken Watanabe', '1959-10-21', N'Nhật Bản', N'Nam diễn viên kỳ cựu từng tham gia Inception, The Last Samurai.'),
    ('DV005', N'Ninh Dương Lan Ngọc', '1990-04-04', N'Việt Nam', N'Nữ diễn viên nổi bật với nhiều phim điện ảnh và truyền hình Việt.'),
    ('DV006', N'Chris Evans', '1981-06-13', N'Mỹ', N'Nổi tiếng với vai Captain America trong vũ trụ Marvel.'),
    ('DV007', N'Lee Min Ho', '1987-06-22', N'Hàn Quốc', N'Tài tử đình đám với phim Vườn sao băng, Huyền thoại biển xanh.'),
    ('DV008', N'Takeshi Kaneshiro', '1973-10-11', N'Nhật Bản', N'Diễn viên gạo cội, từng xuất hiện trong nhiều phim hành động châu Á.'),
    ('DV009', N'Huỳnh Đông', '1984-03-13', N'Việt Nam', N'Gương mặt quen thuộc trên sóng truyền hình Việt Nam.'),
    ('DV010', N'Robert Downey Jr.', '1965-04-04', N'Mỹ', N'Iron Man – biểu tượng của Marvel với lối diễn xuất cá tính.');

-- Insert TheLoai
INSERT INTO theloai (idtheloai, tentheloai) VALUES
    ('TL001', N'Hành động'),
    ('TL002', N'Kinh dị'),
    ('TL003', N'Lãng mạn'),
    ('TL004', N'Phiêu lưu'),
    ('TL005', N'Hài hước'),
    ('TL006', N'Khoa học viễn tưởng'),
    ('TL007', N'Tâm lý'),
    ('TL008', N'Hoạt hình'),
    ('TL009', N'Tình cảm'),
    ('TL010', N'Thể thao');


-- Insert TheLoai_Phim
INSERT INTO theloai_phim (idtheloai, idPhim) VALUES
    ('TL001', 'PH001'), ('TL002', 'PH002'), ('TL003', 'PH003'), ('TL004', 'PH004'), ('TL005', 'PH005'),
    ('TL006', 'PH006'), ('TL007', 'PH007'), ('TL008', 'PH008'), ('TL009', 'PH009'), ('TL010', 'PH010');

-- Insert DienVien_Phim
INSERT INTO dienvien_phim (idDienVien, idPhim) VALUES
    ('DV001', 'PH001'), ('DV002', 'PH002'), ('DV003', 'PH003'), ('DV004', 'PH004'), ('DV005', 'PH005'),
    ('DV006', 'PH006'), ('DV007', 'PH007'), ('DV008', 'PH008'), ('DV009', 'PH009'), ('DV010', 'PH010');
set dateformat ymd
-- Insert into lichsuxemphim
INSERT INTO lichsuxemphim (idUser, idPhim, ngayxem) VALUES
	('KH001', 'PH001', '2023-01-01'),
	('KH002', 'PH002', '2023-02-01'),
	('KH003', 'PH003', '2023-03-01'),
	('KH004', 'PH004', '2023-04-01'),
	('KH005', 'PH005', '2023-05-01'),
	('KH006', 'PH006', '2023-06-01'),
	('KH007', 'PH007', '2023-07-01'),
	('KH008', 'PH008', '2023-08-01'),
	('KH009', 'PH009', '2023-09-01'),
	('KH010', 'PH010', '2023-10-01');
set dateformat ymd
-- Insert into phimyeuthich
INSERT INTO phimyeuthich (idphimyeuthich, idUser, idPhim, ngayluu) VALUES
	('PY001', 'KH001', 'PH001', '2023-01-01'),
	('PY002', 'KH002', 'PH002', '2023-02-01'),
	('PY003', 'KH003', 'PH003', '2023-03-01'),
	('PY004', 'KH004', 'PH004', '2023-04-01'),
	('PY005', 'KH005', 'PH005', '2023-05-01'),
	('PY006', 'KH006', 'PH006', '2023-06-01'),
	('PY007', 'KH007', 'PH007', '2023-07-01'),
	('PY008', 'KH008', 'PH008', '2023-08-01'),
	('PY009', 'KH009', 'PH009', '2023-09-01'),
	('PY010', 'KH010', 'PH010', '2023-10-01');

-- Insert into binhluan
set dateformat ymd
INSERT INTO binhluan (idbinhluan,idUser, idPhim, noidung, ngaydang) VALUES
	('BL001','KH001', 'PH001', N'Phim rất hay, diễn xuất tuyệt vời!', '2023-04-01'),
	('BL002','KH002', 'PH002', N'Không thích cốt truyện, nhưng hình ảnh đẹp.', '2023-04-02'),
	('BL003','KH003', 'PH003', N'Phim này thú vị, thích cách diễn viên thể hiện cảm xúc.', '2023-04-03'),
	('BL004','KH004', 'PH004', N'Chắc chắn sẽ xem lại, phim này rất hấp dẫn!', '2023-04-04'),
	('BL005','KH005', 'PH005', N'Không hợp gu của mình lắm, nhưng vẫn ok.', '2023-04-05'),
	('BL006','KH006', 'PH006', N'Phim hay quá, mời bạn bè cùng xem!', '2023-04-06'),
	('BL007','KH007', 'PH007', N'Phim hơi dài, nhưng kịch bản rất ấn tượng.', '2023-04-07'),
	('BL008','KH008', 'PH008', N'Một bộ phim đáng xem, có nhiều thông điệp hay.', '2023-04-08'),
	('BL009','KH009', 'PH009', N'Phim quá buồn, nhưng diễn viên làm tốt công việc của mình.', '2023-04-09'),
	('BL010','KH010', 'PH010', N'Phim tuyệt vời, rất xứng đáng với sự mong đợi!', '2023-04-10');

-- Insert into danhgia
set dateformat ymd
INSERT INTO danhgia (iddanhgia,idUser, idPhim, diemdanhgia, ngaydanhgia) VALUES
	('DG001','KH001', 'PH001', 8, '2023-01-01'),
	('DG002','KH002', 'PH002', 7, '2023-02-01'),
	('DG003','KH003', 'PH003', 9, '2023-03-01'),
	('DG004','KH004', 'PH004', 6, '2023-04-01'),
	('DG005','KH005', 'PH005', 8, '2023-05-01'),
	('DG006','KH006', 'PH006', 7, '2023-06-01'),
	('DG007','KH007', 'PH007', 10, '2023-07-01'),
	('DG008','KH008', 'PH008', 9, '2023-08-01'),
	('DG009','KH009', 'PH009', 6, '2023-09-01'),
	('DG010','KH010', 'PH010', 8, '2023-10-01');


--select 10 bộ phim mà user xem gần nhất
SELECT p.*
FROM lichsuxemphim ls
JOIN phim p ON ls.idPhim = p.idPhim
WHERE ls.idUser = 'KH001'
ORDER BY ls.ngayxem DESC
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;

select * from khachhang