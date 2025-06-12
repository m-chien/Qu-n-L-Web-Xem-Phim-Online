package org.example.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import org.example.dto.request.IntroSpectRequest;
import org.example.dto.request.IntroSpectResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;


@Service
public class JwtService {
    @NonFinal
    @Value("${jwt.secretKey}")
    private String secretKey;
    private final long expirationMs = 3600000;

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
}
