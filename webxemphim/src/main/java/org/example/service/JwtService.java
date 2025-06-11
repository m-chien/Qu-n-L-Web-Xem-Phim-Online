package org.example.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;


@Service
public class JwtService {
    private final String secretKey = "fvM5429XdKnajoAwXqMnhWNgVXFoAaGqS8gcs1lorUlt3n2EAwhKv5Yf+3ektFC7";
    private final long expirationMs = 3600000;

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
