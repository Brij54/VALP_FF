package com.rasp.app.decorator;

import com.rasp.app.helper.BatchHelper;
import com.rasp.app.resource.Batch;
import com.rasp.app.resource.Student;
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

public class StudentDecorator extends BaseDecorator {
    public StudentDecorator() {
        super(new Student());
    }
    private static final String ADD_USER_PATH            = "/api/auth/add_user";
    private static final String CREATE_STUDENT_PATH      = "/api/student";
    private static final String USER_ROLE_MAPPING_PATH   = "/api/auth/user_role_mapping";

    @Override
    public BaseResource[] getQuery(ServletContext ctx, String queryId, Map<String, Object> map, BaseService service) throws ApplicationException {
        ArrayList<BaseResource> list = new ArrayList<>();

        return super.getQuery(ctx,queryId,map,service);
    }

}
