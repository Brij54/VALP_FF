package com.rasp.app.decorator;

import com.lowagie.text.pdf.PdfDocument;
import com.lowagie.text.pdf.PdfPage;
import com.rasp.app.helper.BatchHelper;
import com.rasp.app.helper.CertificateHelper;
import com.rasp.app.helper.StudentHelper;
import com.rasp.app.resource.Batch;
import com.rasp.app.resource.Certificate;
import com.rasp.app.resource.Student;
import net.bytebuddy.implementation.bind.annotation.Super;
import org.json.JSONObject;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.db.ResourceMetaData;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;



import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

public class CertificateDecorator extends BaseDecorator {
    public CertificateDecorator() {
        super(new Certificate());
    }

    @Override
    public void preAddDecorator(ServletContext ctx, BaseResource _resource) throws ApplicationException {

        Certificate cert = (Certificate) _resource;

        String logs = cert.getLogs();
        if (logs == null) logs = "";

        // Append uploaded log
        logs += "uploaded_at: " + LocalDate.now().toString() + "\n";

        cert.setLogs(logs);
    }

    @Override
    public void preModifyDecorator(ServletContext ctx, BaseResource _resource) throws ApplicationException {

        Certificate cert = (Certificate) _resource;

        Boolean status = cert.getStatus(); // Approved = true, Rejected = false

        String logs = cert.getLogs();
        if (logs == null) logs = "";

        if (status != null) {

            if (status == true) {
                logs += "approved_by: Admin on " + LocalDate.now().toString() + "\n";
            }

            if (status == false) {
                logs += "rejected_by: Admin on " + LocalDate.now().toString() + "\n";
            }
        }

        cert.setLogs(logs);
    }





    @Override
    public BaseResource[] getQuery(ServletContext ctx,
                                   String queryId,
                                   Map<String, Object> map,
                                   BaseService service) throws ApplicationException {
        ArrayList<BaseResource> list = new ArrayList<>();
        if ("GET_STUDENT_BY_CERTIFICATE".equalsIgnoreCase(queryId)) {
            String studentId = (String) map.get(Certificate.FIELD_STUDENT_ID);
            if(studentId != null){
                BaseResource[] r = StudentHelper.getInstance().getByExpression(
                        new Expression(Student.FIELD_ID, REL_OP.EQ, studentId)
                );
                if(r != null) Collections.addAll(list,r);
            }
            return list.toArray(new BaseResource[0]);
        }

        if ("SAVE_VALP_CERTIFICATE".equalsIgnoreCase(queryId)) {

            String studentId = (String) map.get("student_id");
            String base64 = (String) map.get("base64");

            if (studentId == null || studentId.trim().isEmpty()) {
                throw new ApplicationException(ExceptionSeverity.ERROR,
                        "student_id is required");
            }

            if (base64 == null || base64.trim().isEmpty()) {
                throw new ApplicationException(ExceptionSeverity.ERROR,
                        "PDF base64 is required");
            }

            try {
                // Fetch student just to verify existence
                BaseResource[] stuArr = StudentHelper.getInstance()
                        .getByExpression(new Expression(Student.FIELD_ID, REL_OP.EQ, studentId));

                if (stuArr == null || stuArr.length == 0) {
                    throw new ApplicationException(ExceptionSeverity.ERROR,
                            "Student not found for id " + studentId);
                }

                Student student = (Student) stuArr[0];

                // -------------------------------------------
                // CREATE NEW CERTIFICATE ROW
                // -------------------------------------------
                Certificate cert = new Certificate();
                cert.setId(UUID.randomUUID().toString());
                cert.setStudent_id(student.getId());
                cert.setCourse_name("VALP Certificate");
                cert.setCourse_duration(0L);
                cert.setCourse_mode("NA");
                cert.setPlatform("IIIT Bangalore");
                cert.setCourse_completion_date(new java.util.Date());
                cert.setStatus(true);

                // Store Base64 PDF safely
                cert.setUpload_certificate(base64);

                // Save to database
                CertificateHelper.getInstance().add(cert);

                return new BaseResource[]{ cert };

            } catch (Exception e) {
                e.printStackTrace();
                throw new ApplicationException(ExceptionSeverity.ERROR,
                        "Failed to save certificate: " + e.getMessage());
            }
        }


        // fallback -> default behaviour for all other queries
        return super.getQuery(ctx, queryId, map, service);
    }

}
