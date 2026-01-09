package com.rasp.app.decorator;

import com.rasp.app.helper.BatchHelper;
import com.rasp.app.resource.Batch;
import org.springframework.http.*;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.*;

public class BatchDecorator extends BaseDecorator {

    public BatchDecorator() {
        super(new Batch());
    }
    @Override
    public BaseResource[] getQuery(ServletContext ctx,
                                   String queryId,
                                   Map<String, Object> map,
                                   BaseService service) throws ApplicationException {

        ArrayList<BaseResource> list = new ArrayList<>();

        // ✅ Dropdown query
        if ("GET_BATCHES_DROPDOWN".equalsIgnoreCase(queryId)) {

            // If you have a helper method like getAll(), use it.
            // Otherwise, use getByExpression with a "match all" approach.
            // Common approach in your codebase is: queryId=GET_ALL already exists.
            BaseResource[] batches = BatchHelper.getInstance().getAll(); // <--- use if available

            if (batches != null) Collections.addAll(list, batches);
            return list.toArray(new BaseResource[0]);
        }

        return super.getQuery(ctx, queryId, map, service);
    }
}

