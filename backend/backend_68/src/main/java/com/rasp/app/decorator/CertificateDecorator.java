package com.rasp.app.decorator;

import com.rasp.app.helper.CertificateHelper;
import com.rasp.app.helper.StudentHelper;
import com.rasp.app.resource.Certificate;
import com.rasp.app.resource.Student;
import net.bytebuddy.implementation.bind.annotation.Super;
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
import java.util.Map;

public class CertificateDecorator extends BaseDecorator {
    public CertificateDecorator() {
        super(new Certificate());
    }

    @Override
    public BaseResource[] getQuery(ServletContext ctx,
                                   String queryId,
                                   Map<String, Object> map,
                                   BaseService service) throws ApplicationException {

        if ("GET_STUDENT_BY_CERTIFICATE".equalsIgnoreCase(queryId)) {
            return handleGetStudentByCertificate(map);
        }

        // fallback -> default behaviour for all other queries
        return super.getQuery(ctx, queryId, map, service);
    }

    /**
     * Input : student_id (FK stored in certificate.student_id)
     * Output: matching Student (to get name + roll_no)
     */
    private BaseResource[] handleGetStudentByCertificate(Map<String, Object> map) throws ApplicationException {
        ArrayList<BaseResource> result = new ArrayList<>();

        // IMPORTANT: key name must match query param exactly -> "student_id"
        Object sidObj = map.get("student_id");
        if (sidObj == null) {
            // No student_id passed -> treat as "no student", not an error
            return new BaseResource[0];
        }

        String studentId = sidObj.toString().trim();
        if (studentId.isEmpty()) {
            return new BaseResource[0];
        }

        // For debugging (you can remove later)
        System.out.println("GET_STUDENT_BY_CERTIFICATE :: student_id = " + studentId);

        // 1️⃣ first try with primary key Student.id
        BaseResource[] students = StudentHelper.getInstance().getByExpression(
                new Expression(Student.FIELD_ID, REL_OP.EQ, studentId)
        );

        // 2️⃣ fallback: if nothing found, assume old data where student_id stored roll_no
        if (students == null || students.length == 0) {
            students = StudentHelper.getInstance().getByExpression(
                    new Expression(Student.FIELD_ROLL_NO, REL_OP.EQ, studentId)
            );
        }

        if (students != null) {
            Collections.addAll(result, students);
        }

        return result.toArray(new BaseResource[0]);
    }
}
