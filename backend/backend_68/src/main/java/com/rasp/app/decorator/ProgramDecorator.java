package com.rasp.app.decorator;

import com.rasp.app.helper.AcademicYearHelper;
import com.rasp.app.resource.AcademicYear;
import com.rasp.app.resource.Program;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.webservice.ServletContext;

public class ProgramDecorator extends BaseDecorator {
    public ProgramDecorator() {
        super(new Program());
    }

    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException{
        Program _justcheck = (Program) _resource;

        AcademicYear academicYear= (AcademicYear) AcademicYearHelper.getInstance().getById(_justcheck.getAcademic_year_id());
        if(academicYear == null) {
            academicYear = (AcademicYear) AcademicYearHelper.getInstance().getByName(_justcheck.getAcademic_year_id());
            ((Program) _resource).setAcademic_year_id(academicYear.getId());
        }
    }
}
