//package com.rasp.app.controller;
//
//import com.rasp.app.helper.OtpStore;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    private final JavaMailSender mailSender;
//
//    public AuthController(JavaMailSender mailSender) {
//        this.mailSender = mailSender;
//    }
//
//    // ==============================
//    // KEYCLOAK CONFIG
//    // ==============================
//    @Value("${spring.security.oauth2.client.provider.keycloak.clientId}")
//    private String clientId;
//
//    @Value("${spring.security.oauth2.client.provider.keycloak.clientSecret}")
//    private String clientSecret;
//
//    @Value("${spring.security.oauth2.client.provider.keycloak.redirectUri}")
//    private String redirectUri;
//
//    @Value("${spring.security.oauth2.client.provider.keycloak.token-uri}")
//    private String keycloakTokenUrl;
//
//    @Value("${spring.security.oauth2.client.provider.keycloak.frontendURL}")
//    private String frontendURL;
//
//    @Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}")
//    private String issuerUri;
//
//    @Value("${spring.security.oauth2.client.provider.keycloak.logout-uri}")
//    private String logoutUrl;
//
//    @Value("${authentication-type:implicit}")
//    private String authenticationType;
//
//
//    // ==========================================================
//    // LOGIN  ✔ (From your original working code)
//    // ==========================================================
//    @PostMapping("/login")
//    public void login(@RequestBody Map<String, Object> loginDetails,
//                      HttpServletResponse response) throws Exception {
//
//        String username = (String) loginDetails.get("username");
//        String password = (String) loginDetails.get("password");
//
//        if ("implicit".equalsIgnoreCase(authenticationType)) {
//            handleImplicitFlow(username, password, response);
//        } else {
//            response.sendRedirect(
//                    keycloakTokenUrl +
//                            "?client_id=" + clientId +
//                            "&response_type=code" +
//                            "&scope=openid profile email" +
//                            "&redirect_uri=" + redirectUri
//            );
//        }
//    }
//
//    private void handleImplicitFlow(String username, String password, HttpServletResponse response) {
//        RestTemplate rest = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
//        form.add("grant_type", "password");
//        form.add("client_id", clientId);
//        form.add("client_secret", clientSecret);
//        form.add("username", username);
//        form.add("password", password);
//
//        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);
//
//        ResponseEntity<Map> resp = rest.exchange(keycloakTokenUrl, HttpMethod.POST, entity, Map.class);
//
//        if (!resp.getStatusCode().is2xxSuccessful()) {
//            response.setStatus(HttpStatus.UNAUTHORIZED.value());
//            return;
//        }
//
//        String token = (String) resp.getBody().get("access_token");
//        String refresh = (String) resp.getBody().get("refresh_token");
//
//        setCookie(response, "access_token", token, -1);
//        setCookie(response, "refresh_token", refresh, -1);
//    }
//
//
//    // ==========================================================
//    // FORGOT PASSWORD  ✔
//    // ==========================================================
//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
//        String email = req.get("email");
//
//        try {
//            RestTemplate rest = new RestTemplate();
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("Authorization", "Bearer " + getAdminAccessToken());
//            HttpEntity<?> entity = new HttpEntity<>(headers);
//
//            String searchUrl = issuerUri + "/users?email=" + email;
//            ResponseEntity<List> resp =
//                    rest.exchange(searchUrl, HttpMethod.GET, entity, List.class);
//
//            if (resp.getBody().isEmpty()) {
//                return ResponseEntity.status(404).body("User does not exist");
//            }
//
//            String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
//
//            OtpStore.otpMap.put(email, new OtpStore.OtpDetails(
//                    otp, LocalDateTime.now().plusMinutes(5)
//            ));
//
//            SimpleMailMessage msg = new SimpleMailMessage();
//            msg.setTo(email);
//            msg.setSubject("Password Reset OTP");
//            msg.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");
//            mailSender.send(msg);
//
//            return ResponseEntity.ok("OTP sent successfully");
//
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
//        }
//    }
//
//
//    // ==========================================================
//    // RESET PASSWORD  ✔
//    // ==========================================================
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
//        String email = req.get("email");
//        String otp = req.get("otp");
//        String newPassword = req.get("newPassword");
//
//        OtpStore.OtpDetails details = OtpStore.otpMap.get(email);
//
//        if (details == null || details.expiry.isBefore(LocalDateTime.now()))
//            return ResponseEntity.badRequest().body("OTP expired");
//
//        if (!details.otp.equals(otp))
//            return ResponseEntity.badRequest().body("Invalid OTP");
//
//        try {
//            RestTemplate rest = new RestTemplate();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("Authorization", "Bearer " + getAdminAccessToken());
//            HttpEntity<?> entity = new HttpEntity<>(headers);
//
//            String searchUrl = issuerUri + "/users?email=" + email;
//            ResponseEntity<List> resp =
//                    rest.exchange(searchUrl, HttpMethod.GET, entity, List.class);
//
//            if (resp.getBody().isEmpty())
//                return ResponseEntity.badRequest().body("User not found");
//
//            Map user = (Map) resp.getBody().get(0);
//            String userId = (String) user.get("id");
//
//            Map<String, Object> passwordPayload = new HashMap<>();
//            passwordPayload.put("type", "password");
//            passwordPayload.put("temporary", false);
//            passwordPayload.put("value", newPassword);
//
//            HttpHeaders headers2 = new HttpHeaders();
//            headers2.setContentType(MediaType.APPLICATION_JSON);
//            headers2.set("Authorization", "Bearer " + getAdminAccessToken());
//
//            HttpEntity<?> passReq = new HttpEntity<>(passwordPayload, headers2);
//
//            String resetUrl = issuerUri + "/users/" + userId + "/reset-password";
//            rest.exchange(resetUrl, HttpMethod.PUT, passReq, String.class);
//
//            OtpStore.otpMap.remove(email);
//
//            return ResponseEntity.ok("Password reset successful");
//
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
//        }
//    }
//
//
//    // ==========================================================
//    // KEYCLOAK ADMIN TOKEN  ✔
//    // ==========================================================
//    private String getAdminAccessToken() {
//        RestTemplate rest = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
//        form.add("grant_type", "client_credentials");
//        form.add("client_id", clientId);
//        form.add("client_secret", clientSecret);
//
//        HttpEntity<MultiValueMap<String, String>> entity =
//                new HttpEntity<>(form, headers);
//
//        ResponseEntity<Map> resp = rest.exchange(
//                keycloakTokenUrl,
//                HttpMethod.POST,
//                entity,
//                Map.class
//        );
//
//        return (String) resp.getBody().get("access_token");
//    }
//
//
//    // ==========================================================
//    // COOKIE HELPER  ✔
//    // ==========================================================
//    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
//        Cookie c = new Cookie(name, value);
//        c.setPath("/");
//        c.setSecure(false);
//        c.setHttpOnly(false);
//        c.setMaxAge(maxAge);
//        response.addCookie(c);
//    }
//}


// Updated AuthController.java
package com.rasp.app.controller;

import com.rasp.app.helper.OtpStore;
import com.rasp.app.service.EmailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.DefaultRestClient;
import org.springframework.web.client.RestTemplate;
import platform.helper.BaseHelper;
import platform.resource.BaseResource;
import platform.util.ApplicationException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    String accessToken=null;

    @Value("${spring.security.oauth2.client.provider.keycloak.clientId}")
    private  String clientId;
    @Value("${spring.security.oauth2.client.provider.keycloak.clientSecret}")
    private  String clientSecret; // Replace with your actual secret

    @Value("${spring.security.oauth2.client.provider.keycloak.redirectUri}")
    private  String redirectUri ;

    @Value("${spring.security.oauth2.client.provider.keycloak.token-uri}")
    private  String keycloakTokenUrl;

    //private final String keycloakUrl = "http://localhost:8080/realms/new";
    @Value("${spring.security.oauth2.client.provider.keycloak.frontendURL}")
    private  String frontendURL;

    @Value("${authentication-type:auth-code}")
    private String authenticationType;

    @Value("${spring.security.oauth2.client.provider.keycloak.keycloakUrl}")
    private String keyCloakUrl;

    @Value("${spring.security.oauth2.client.provider.keycloak.authorization-uri}")
    private String authorizationUri;

    @Value("${spring.security.oauth2.client.provider.keycloakissuer-uri")
    private String issuerUri;
    @Value("${spring.security.oauth2.client.provider.keycloak.logout-uri}")
    private String logout;

    @Autowired
    private EmailService emailService;


    @PostMapping("/login")
    public void login(@RequestBody Map<String ,Object> loginDetails,
                      HttpServletResponse response) throws IOException {
        String username= (String) loginDetails.get("username");
        String  password= (String) loginDetails.get("password");
        if ("implicit".equalsIgnoreCase(authenticationType) && username != null && password != null) {
            handleImplicitFlow(username, password, response);
        } else {
            String authUrl = keycloakTokenUrl
                    + "?client_id=" + clientId
                    + "&response_type=code"
                    + "&scope=openid profile email"
                    + "&redirect_uri=" + redirectUri;
            response.sendRedirect(authUrl);
        }
    }

    private void handleImplicitFlow(String username, String password, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "password");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("username", username);
        requestBody.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(keycloakTokenUrl, HttpMethod.POST, request, Map.class);

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        Map<String, String> body = tokenResponse.getBody();
        accessToken = body.get("access_token");
        String refreshToken = body.get("refresh_token");
        setCookie(response, "access_token", accessToken, -1);
        setCookie(response, "refresh_token", refreshToken, -1);
    }

    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam("code") String authCode, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&redirect_uri=" + redirectUri
                + "&code=" + authCode;

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(keycloakTokenUrl, HttpMethod.POST, request, Map.class);

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to authenticate");
        }

        Map<String, String> body = tokenResponse.getBody();
        String accessToken = body.get("access_token");
        String refreshToken = body.get("refresh_token");

        setCookie(response, "access_token", accessToken, 60); // 1 minute
        setCookie(response, "refresh_token", refreshToken, 86400); // 24 hours expiry

        String redirectUrl = frontendURL;

        HttpHeaders redirectHeaders = new HttpHeaders();
        redirectHeaders.setLocation(URI.create(redirectUrl));

//        setCookie(response, "access_token", newAccessToken, 900);
//        setCookie(response, "refresh_token", newRefreshToken, 86400);
//
        return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);
//        return ResponseEntity.ok("Login successful");
    }






    /**
     * Handles user logout by revoking the refresh token with Keycloak and clearing session cookies.
     * This endpoint requires a valid refresh token in the request cookies.
     *
     * @param refreshToken The refresh token from the 'refresh_token' cookie, used to invalidate the session
     * @param response The HTTP response object used to clear cookies
     * @return ResponseEntity with status and message indicating the result of the logout operation
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @CookieValue(value = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {

        // Check if refresh token is present in the request
        if (refreshToken == null || refreshToken.isEmpty()) {
            System.out.println("No refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
        }

        // Prepare the request body for Keycloak logout endpoint
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);

        // Set up HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Create HTTP entity with headers and body
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            // Send logout request to Keycloak to invalidate the refresh token
            restTemplate.postForEntity(
                    logout,//move url to constants
                    request,
                    String.class
            );
            System.out.println("Logout successful in Keycloak");
        } catch (Exception e) {
            // Log the error and return an error response if logout fails
            System.err.println("Logout failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed");
        }

        // Clear the access_token and refresh_token cookies by setting maxAge to 0
        setCookie(response, "access_token", "", 0);
        setCookie(response, "refresh_token", "", 0);

        return ResponseEntity.ok("Logged out");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        try {
            // CHECK USER EXISTS
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + getAdminAccessToken());
            HttpEntity<?> entity = new HttpEntity<>(headers);


            String searchUrl = keyCloakUrl + "/users?email=" + email;

            ResponseEntity<List> resp =
                    rest.exchange(searchUrl, HttpMethod.GET, entity, List.class);

            if (resp.getBody().isEmpty()) {
                return ResponseEntity.status(404).body("User does not exist");
            }

            // GENERATE OTP
            String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

            OtpStore.otpMap.put(email, new OtpStore.OtpDetails(
                    otp, LocalDateTime.now().plusMinutes(5)
            ));

            // PRINT OTP IN CONSOLE
//            System.out.println("====================================");
//            System.out.println("📩 OTP for " + email + " = " + otp);
//            System.out.println("====================================");
            emailService.sendOtpMail(email, otp);

            return ResponseEntity.ok("OTP generated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


    // ==========================================================
    // RESET PASSWORD
    // ==========================================================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");
        String newPassword = req.get("newPassword");

        // VERIFY OTP
        OtpStore.OtpDetails details = OtpStore.otpMap.get(email);
        System.out.println("details : "+ details);
        if (details == null || details.expiry.isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body("OTP expired");

        if (!details.otp.equals(otp))
            return ResponseEntity.badRequest().body("Invalid OTP");

        try {
            RestTemplate rest = new RestTemplate();

            // FIND USER
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + getAdminAccessToken());
            HttpEntity<?> entity = new HttpEntity<>(headers);

            String searchUrl = keyCloakUrl + "/users?email=" + email;
            ResponseEntity<List> resp =
                    rest.exchange(searchUrl, HttpMethod.GET, entity, List.class);

            if (resp.getBody().isEmpty())
                return ResponseEntity.badRequest().body("User not found");

            Map user = (Map) resp.getBody().get(0);
            String userId = (String) user.get("id");

            // SET NEW PASSWORD IN KEYCLOAK
            Map<String, Object> passwordPayload = new HashMap<>();
            passwordPayload.put("type", "password");
            passwordPayload.put("temporary", false);
            passwordPayload.put("value", newPassword);

            HttpHeaders headers2 = new HttpHeaders();
            headers2.setContentType(MediaType.APPLICATION_JSON);
            headers2.set("Authorization", "Bearer " + getAdminAccessToken());

            HttpEntity<?> passReq = new HttpEntity<>(passwordPayload, headers2);

            String resetUrl = keyCloakUrl + "/users/" + userId + "/reset-password";
            rest.exchange(resetUrl, HttpMethod.PUT, passReq, String.class);

            // REMOVE OTP
            OtpStore.otpMap.remove(email);

            return ResponseEntity.ok("Password reset successful");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }


    // ==========================================================
    // KEYCLOAK ADMIN TOKEN
    // ==========================================================
    private String getAdminAccessToken() {
        RestTemplate rest = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(form, headers);

        ResponseEntity<Map> resp = rest.exchange(
                keycloakTokenUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        return (String) resp.getBody().get("access_token");
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(false); // prevents JavaScript access
        cookie.setSecure(false);  // set true in HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

}
