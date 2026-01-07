package com.rasp.app.decorator;

import com.rasp.app.helper.BatchHelper;
import com.rasp.app.helper.StudentHelper;
import com.rasp.app.resource.Batch;
import com.rasp.app.resource.Student;
import com.rasp.app.resource.UserResource;
import com.rasp.app.service.IamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;


import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;


import java.util.*;
//
//public class StudentDecorator extends BaseDecorator {
//    public StudentDecorator() {
//        super(new Student());
//    }
//    private static final String ADD_USER_PATH            = "/api/auth/add_user";
//    private static final String CREATE_STUDENT_PATH      = "/api/student";
//    private static final String USER_ROLE_MAPPING_PATH   = "/api/auth/user_role_mapping";
//
//    @Override
//    public void preAddDecorator(ServletContext ctx, BaseResource _resource) throws ApplicationException {
//
//        Student student = (Student) _resource;
//
//        // -----------------------------------------------------
//        // Resolve Batch (ID or Name)
//        // -----------------------------------------------------
//        Batch batchName = (Batch) BatchHelper.getInstance().getById(student.getBatch());
//        if (batchName == null) {
//            BaseResource[] r = BatchHelper.getInstance().getByExpression(
//                    new Expression(Batch.FIELD_BATCH_NAME, REL_OP.EQ, student.getBatch())
//            );
//            if (r != null && r.length > 0) {
//                student.setBatch(((Batch) r[0]).getId());
//            }
//        }
//
//        String name = student.getName();
//        String email = student.getEmail();
//        String rollNo = student.getRoll_no();
//        String batch = student.getBatch();
//
//        if (name == null || email == null || rollNo == null || batch == null) {
//            throw new ApplicationException(ExceptionSeverity.ERROR,
//                    "Required fields missing: name/email/roll_no/batch");
//        }
//
//        // -----------------------------------------------------
//        // Split Name into first + last
//        // -----------------------------------------------------
//        String[] parts = name.trim().split("\\s+");
//
//        String firstName = parts[0];
//        String lastName = "";
//
//        if (parts.length > 1) {
//            StringBuilder sb = new StringBuilder();
//            for (int i = 1; i < parts.length; i++) sb.append(parts[i]).append(" ");
//            lastName = sb.toString().trim();
//        }
//        System.out.println("FirstName: "+ firstName +" LastName: "+lastName);
//        // -----------------------------------------------------
//        // Username + Password = roll_no
//        // -----------------------------------------------------
//        String userName = (rollNo != null && !rollNo.isEmpty()) ? rollNo : email;
//        String password = rollNo;
//        System.out.println("Username: "+userName + " Password: "+password);
//        RestTemplate restTemplate = new RestTemplate();
//
//        try {
//            // -----------------------------------------------------
//            // 1️⃣ CALL REST ENDPOINT → /api/auth/add_user
//            // -----------------------------------------------------
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            Map<String, Object> userMap = new HashMap<>();
//            userMap.put("resourceName", "Users");
//
//            Map<String, Object> resourceMap = new HashMap<>();
//            resourceMap.put("user_name", rollNo);
//            resourceMap.put("user_email", email);
//
//            Map<String, Object> authMap = new HashMap<>();
//            authMap.put("userName", userName);
//            authMap.put("email", email);
//            authMap.put("firstName", firstName);
//            authMap.put("lastName", lastName);
//            authMap.put("password", password);
//
//            userMap.put("resourceMap", resourceMap);
//            userMap.put("authMap", authMap);
//
//            HttpEntity<Map<String, Object>> userRequest =
//                    new HttpEntity<>(userMap, headers);
//            try {
//                ResponseEntity<String> userResponse =
//                        restTemplate.exchange(
//                                "http://localhost:8082/api/auth/adding_user",
//                                HttpMethod.POST,
//                                userRequest,
//                                String.class
//                        );
//
//                if (!userResponse.getStatusCode().is2xxSuccessful()) {
//                    throw new ApplicationException(ExceptionSeverity.ERROR,
//                            "User creation failed for roll_no: " + rollNo +
//                                    " :: " + userResponse.getBody());
//                }
//            } catch (Exception e) {
//                System.out.println("Exception in Adding User: "+ e);
//            }
//            // -----------------------------------------------------
//            // 2️⃣ CALL REST ENDPOINT → /api/auth/user_role_mapping
//            // -----------------------------------------------------
//            Map<String, Object> roleMap = new HashMap<>();
//            roleMap.put("userName", userName);
//            roleMap.put("role", "student");
//
//            HttpEntity<Map<String, Object>> roleRequest =
//                    new HttpEntity<>(roleMap, headers);
//            try {
//                ResponseEntity<String> roleResponse =
//                        restTemplate.exchange(
//                                "http://localhost:8082/api/auth/user_resource_role_mapping",
//                                HttpMethod.POST,
//                                roleRequest,
//                                String.class
//                        );
//
//                if (!roleResponse.getStatusCode().is2xxSuccessful()) {
//                    throw new ApplicationException(ExceptionSeverity.ERROR,
//                            "Role mapping failed for roll_no: " + rollNo +
//                                    " :: " + roleResponse.getBody());
//                }
//            } catch (Exception e) {
//                System.out.println("Exception in Adding User Role Mapping: "+ e);
//            }
//
//        } catch (Exception e) {
//            throw new ApplicationException(ExceptionSeverity.ERROR,
//                    "Bulk Upload Error for roll_no " + rollNo + ": " + e.getMessage());
//        }
//    }
//
//}

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

public class StudentDecorator extends BaseDecorator {

    public StudentDecorator() {
        super(new Student());
    }

    private static final String ADD_USER_PATH            = "/api/auth/add_user";
    private static final String CREATE_STUDENT_PATH      = "/api/student";
    private static final String USER_ROLE_MAPPING_PATH   = "/api/auth/user_role_mapping";

    // ✅ QueryIds for UI
    private static final String Q_GET_STUDENTS_BY_BATCH = "GET_STUDENTS_BY_BATCH";
    private static final String Q_SEARCH_STUDENTS_IN_BATCH = "SEARCH_STUDENTS_IN_BATCH";

    // ------------------------------------------------------------------
    // ✅ NEW: Queries for dropdown/student search
    // ------------------------------------------------------------------
    @Override
    public BaseResource[] getQuery(ServletContext ctx,
                                   String queryId,
                                   Map<String, Object> map,
                                   BaseService service) throws ApplicationException {

        ArrayList<BaseResource> list = new ArrayList<>();

        // 1) GET_STUDENTS_BY_BATCH
        // UI: /student?queryId=GET_STUDENTS_BY_BATCH&args=batch_id:<idOrName>
        if (Q_GET_STUDENTS_BY_BATCH.equalsIgnoreCase(queryId)) {
            String batchInput = getString(map, "batch_id");
            if (batchInput == null) batchInput = getString(map, "batch");

            if (batchInput == null || batchInput.trim().isEmpty()) {
                return new BaseResource[0];
            }

            String batchId = resolveBatchId(batchInput);

            BaseResource[] students = StudentHelper.getInstance().getByExpression(
                    new Expression("batch", REL_OP.EQ, batchId) // if you have Student.FIELD_BATCH, replace "batch"
            );

            if (students != null) Collections.addAll(list, students);
            return list.toArray(new BaseResource[0]);
        }

        // 2) SEARCH_STUDENTS_IN_BATCH
        // UI: /student?queryId=SEARCH_STUDENTS_IN_BATCH&args=batch_id:<idOrName>,q:<text>
        if (Q_SEARCH_STUDENTS_IN_BATCH.equalsIgnoreCase(queryId)) {
            String batchInput = getString(map, "batch_id");
            if (batchInput == null) batchInput = getString(map, "batch");

            String q = getString(map, "q");
            if (q == null) q = getString(map, "search");

            if (batchInput == null || batchInput.trim().isEmpty()) {
                return new BaseResource[0];
            }

            String batchId = resolveBatchId(batchInput);

            // First fetch by batch
            BaseResource[] students = StudentHelper.getInstance().getByExpression(
                    new Expression("batch", REL_OP.EQ, batchId) // if you have Student.FIELD_BATCH, replace "batch"
            );

            if (students == null || students.length == 0) return new BaseResource[0];

            // Then filter in-memory by roll_no / name (safe + no DB query complexity)
            String needle = (q == null) ? "" : q.trim().toLowerCase();
            if (needle.isEmpty()) {
                Collections.addAll(list, students);
                return list.toArray(new BaseResource[0]);
            }

            for (BaseResource br : students) {
                Student s = (Student) br;

                String roll = safeLower(s.getRoll_no());
                String name = safeLower(s.getName());

                if (roll.contains(needle) || name.contains(needle)) {
                    list.add(s);
                }
            }

            return list.toArray(new BaseResource[0]);
        }

        return super.getQuery(ctx, queryId, map, service);
    }

    // ------------------------------------------------------------------
    // ✅ Helper: resolve batch input (id OR batch_name) → batchId
    // ------------------------------------------------------------------
    private String resolveBatchId(String batchInput) throws ApplicationException {
        String in = batchInput.trim();

        // If it matches an ID directly, BatchHelper.getById will work
        Batch b = (Batch) BatchHelper.getInstance().getById(in);
        if (b != null) return b.getId();

        // else treat as batch_name
        BaseResource[] r = BatchHelper.getInstance().getByExpression(
                new Expression(Batch.FIELD_BATCH_NAME, REL_OP.EQ, in)
        );

        if (r != null && r.length > 0) {
            return ((Batch) r[0]).getId();
        }

        throw new ApplicationException(ExceptionSeverity.ERROR, "Batch not found: " + batchInput);
    }

    private String getString(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v == null ? null : String.valueOf(v);
    }

    private String safeLower(String s) {
        return s == null ? "" : s.toLowerCase();
    }

    // ------------------------------------------------------------------
    // ✅ Your existing code (unchanged)
    // ------------------------------------------------------------------
    @Override
    public void preAddDecorator(ServletContext ctx, BaseResource _resource) throws ApplicationException {

        Student student = (Student) _resource;

        // -----------------------------------------------------
        // Resolve Batch (ID or Name)
        // -----------------------------------------------------
        Batch batchName = (Batch) BatchHelper.getInstance().getById(student.getBatch());
        if (batchName == null) {
            BaseResource[] r = BatchHelper.getInstance().getByExpression(
                    new Expression(Batch.FIELD_BATCH_NAME, REL_OP.EQ, student.getBatch())
            );
            if (r != null && r.length > 0) {
                student.setBatch(((Batch) r[0]).getId());
            }
        }

        String name = student.getName();
        String email = student.getEmail();
        String rollNo = student.getRoll_no();
        String batch = student.getBatch();

        if (name == null || email == null || rollNo == null || batch == null) {
            throw new ApplicationException(ExceptionSeverity.ERROR,
                    "Required fields missing: name/email/roll_no/batch");
        }

        // -----------------------------------------------------
        // Split Name into first + last
        // -----------------------------------------------------
        String[] parts = name.trim().split("\\s+");

        String firstName = parts[0];
        String lastName = "";

        if (parts.length > 1) {
            StringBuilder sb = new StringBuilder();
            for (int i = 1; i < parts.length; i++) sb.append(parts[i]).append(" ");
            lastName = sb.toString().trim();
        }
        System.out.println("FirstName: "+ firstName +" LastName: "+lastName);

        // -----------------------------------------------------
        // Username + Password = roll_no
        // -----------------------------------------------------
        String userName = (rollNo != null && !rollNo.isEmpty()) ? rollNo : email;
        String password = rollNo;
        System.out.println("Username: "+userName + " Password: "+password);

        RestTemplate restTemplate = new RestTemplate();

        try {
            // -----------------------------------------------------
            // 1️⃣ CALL REST ENDPOINT → /api/auth/add_user
            // -----------------------------------------------------
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("resourceName", "Users");

            Map<String, Object> resourceMap = new HashMap<>();
            resourceMap.put("user_name", rollNo);
            resourceMap.put("user_email", email);

            Map<String, Object> authMap = new HashMap<>();
            authMap.put("userName", userName);
            authMap.put("email", email);
            authMap.put("firstName", firstName);
            authMap.put("lastName", lastName);
            authMap.put("password", password);

            userMap.put("resourceMap", resourceMap);
            userMap.put("authMap", authMap);

            HttpEntity<Map<String, Object>> userRequest = new HttpEntity<>(userMap, headers);

            try {
                ResponseEntity<String> userResponse =
                        restTemplate.exchange(
                                "http://localhost:8082/api/auth/adding_user",
                                HttpMethod.POST,
                                userRequest,
                                String.class
                        );

                if (!userResponse.getStatusCode().is2xxSuccessful()) {
                    throw new ApplicationException(ExceptionSeverity.ERROR,
                            "User creation failed for roll_no: " + rollNo +
                                    " :: " + userResponse.getBody());
                }
            } catch (Exception e) {
                System.out.println("Exception in Adding User: "+ e);
            }

            // -----------------------------------------------------
            // 2️⃣ CALL REST ENDPOINT → /api/auth/user_role_mapping
            // -----------------------------------------------------
            Map<String, Object> roleMap = new HashMap<>();
            roleMap.put("userName", userName);
            roleMap.put("role", "student");

            HttpEntity<Map<String, Object>> roleRequest = new HttpEntity<>(roleMap, headers);

            try {
                ResponseEntity<String> roleResponse =
                        restTemplate.exchange(
                                "http://localhost:8082/api/auth/user_resource_role_mapping",
                                HttpMethod.POST,
                                roleRequest,
                                String.class
                        );

                if (!roleResponse.getStatusCode().is2xxSuccessful()) {
                    throw new ApplicationException(ExceptionSeverity.ERROR,
                            "Role mapping failed for roll_no: " + rollNo +
                                    " :: " + roleResponse.getBody());
                }
            } catch (Exception e) {
                System.out.println("Exception in Adding User Role Mapping: "+ e);
            }

        } catch (Exception e) {
            throw new ApplicationException(ExceptionSeverity.ERROR,
                    "Bulk Upload Error for roll_no " + rollNo + ": " + e.getMessage());
        }
    }
}
