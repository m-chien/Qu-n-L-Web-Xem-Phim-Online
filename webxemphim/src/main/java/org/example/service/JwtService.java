package org.example.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.example.exception.UnauthorizedException;
import org.example.model.nguoidung;
import org.example.repository.nguoidungRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;


@Service
@RequiredArgsConstructor
public class JwtService {
    @NonFinal
    @Value("${jwt.secretKey}")
    private String secretKey;
    private final long expirationMs = 3600000;
    private final nguoidungRepository userRepository;

    public IntroSpectResponse introspect(IntroSpectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        JWSVerifier verifier = new MACVerifier(secretKey.getBytes());
        SignedJWT signedJWT =  SignedJWT.parse(token);
        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verfied =  signedJWT.verify(verifier);
        return  IntroSpectResponse.builder()
                .valid(verfied && expityTime.after(new Date()))
                .build();
    }
    public String generateToken(String email)
    {
        Date expiryDate = Date.from(Instant.now().plus(expirationMs, ChronoUnit.MILLIS));

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("ChienCINEMA")
                .issueTime(Date.from(Instant.now()))
                .expirationTime(expiryDate)
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header,payload);
        try {
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }
    public String extractemail(String token) throws JOSEException, ParseException {
        try {
            // Parse the signed JWT
            SignedJWT signedJWT = SignedJWT.parse(token);

            // Get the JWT claims set
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            // Extract the subject (username/email) from the token
            // Thường thì subject chứa username hoặc email của user
            String email = claimsSet.getSubject();

            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Username không tồn tại trong token");
            }

            return email;

        } catch (ParseException e) {
            throw new ParseException("Token không hợp lệ", 0);
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy thông tin user từ token");
        }
    }
    public Boolean check(String token, String iduser) throws ParseException, JOSEException {
        // giải mã đoạn token được gửi về
        IntroSpectRequest introSpectRequest = IntroSpectRequest.builder()
                .token(token)
                .build();

        IntroSpectResponse introSpectResponse = introspect(introSpectRequest);
        //giải mã xong, kiểm tra nếu còn hạn thì làm tiếp không thì sai
        if (!introSpectResponse.isValid()) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        //giải mã token ra để lấy email
        String userEmail = extractemail(token);

        // tìm người dùng từ email đã giải mã
        nguoidung tokenUser = userRepository.findByEmail(userEmail);

        // kiểm tra xem c đúng là người dùng này cập nhật thông tin của mình hay của người khác
        if (!tokenUser.getIdUser().equals(iduser)) {
            throw new RuntimeException("Bạn không có quyền truy cập thông tin của người dùng khác trên ứng dụng của mình");
        }
        return true;
    }
}
