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

        // fallback -> default behaviour for all other queries
        return super.getQuery(ctx, queryId, map, service);
    }
}
