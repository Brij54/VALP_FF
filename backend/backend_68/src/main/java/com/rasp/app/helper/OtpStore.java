package com.rasp.app.helper;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class OtpStore {

    public static class OtpDetails {
        public String otp;
        public LocalDateTime expiry;

        public OtpDetails(String otp, LocalDateTime expiry){
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    public static Map<String,OtpDetails> otpMap =  new HashMap<>();
}
