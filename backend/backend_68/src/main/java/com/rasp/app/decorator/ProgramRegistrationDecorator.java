package com.rasp.app.decorator;

import com.rasp.app.helper.AcademicYearHelper;
import com.rasp.app.helper.ProgramHelper;
import com.rasp.app.helper.ProgramRegistrationHelper;
import com.rasp.app.resource.AcademicYear;
import com.rasp.app.resource.Program;
import com.rasp.app.resource.ProgramRegistration;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

import java.util.*;

public class ProgramRegistrationDecorator extends BaseDecorator {

    // Optional: if you want a custom registration queryId
    public static final String Q_REGISTER = "REGISTER_PROGRAM";

    public ProgramRegistrationDecorator() {
        super(new ProgramRegistration());
    }

    // ✅ This will run for normal POST(add) on /api/program_registration
    @Override
//    public void preAddDecorator(ServletContext ctx, BaseResource _resource) throws ApplicationException {
//        ProgramRegistration reg = (ProgramRegistration) _resource;
//
//        String programId = reg.getProgram_id();
//        String studentId = reg.getStudent_id();
//
//        if (programId == null || programId.trim().isEmpty()) {
//            throw new ApplicationException(ExceptionSeverity.ERROR, "program_id is required");
//        }
//        if (studentId == null || studentId.trim().isEmpty()) {
//            throw new ApplicationException(ExceptionSeverity.ERROR, "student_id is required");
//        }
//
//        programId = programId.trim();
//        studentId = studentId.trim();
//
//        // 1) Ensure program exists
//        Program program = (Program) ProgramHelper.getInstance().getById(programId);
//        if (program == null) {
//            throw new ApplicationException(ExceptionSeverity.ERROR, "Program not found: " + programId);
//        }
//
//        long totalSeats = (program.getSeats() == null) ? 0L : program.getSeats();
//        if (totalSeats <= 0) {
//            throw new ApplicationException(ExceptionSeverity.ERROR, "Program seats not configured for: " + programId);
//        }
//
//        // 2) Fetch registrations for this program (and count active ones)
//        BaseResource[] regsArr = ProgramRegistrationHelper.getInstance()
//                .getByExpression(new Expression(ProgramRegistration.FIELD_PROGRAM_ID, REL_OP.EQ, programId));
//
//        long activeCount = 0L;
//
//        if (regsArr != null) {
//            for (BaseResource br : regsArr) {
//                ProgramRegistration existing = (ProgramRegistration) br;
//
//                // treat archived=Y or soft_deleted=Y as inactive
//                boolean inactive =
//                        "Y".equalsIgnoreCase(existing.getArchived()) ||
//                                "Y".equalsIgnoreCase(existing.getG_soft_delete());
//
//                if (!inactive) activeCount++;
//
//                // 3) Prevent duplicate: same (program_id, student_id)
//                if (!inactive && studentId.equals(existing.getStudent_id())) {
//                    throw new ApplicationException(
//                            ExceptionSeverity.ERROR,
//                            "You are already registered for this program."
//                    );
//                }
//            }
//        }
//
//        // 4) Seat full check
//        if (activeCount >= totalSeats) {
//            throw new ApplicationException(
//                    ExceptionSeverity.ERROR,
//                    "Registration failed: Program is full (Seats: " + totalSeats + ")."
//            );
//        }
//
//        // If we reach here → allowed
//    }

//    public void preAddDecorator(ServletContext ctx, BaseResource _resource)
//            throws ApplicationException {
//
//        ProgramRegistration reg = (ProgramRegistration) _resource;
//
//        String programId = reg.getProgram_id();
//        String studentId = reg.getStudent_id();
//
//        if (programId == null || programId.trim().isEmpty()) {
//            throw new ApplicationException(
//                    ExceptionSeverity.ERROR,
//                    "program_id is required"
//            );
//        }
//
//        if (studentId == null || studentId.trim().isEmpty()) {
//            throw new ApplicationException(
//                    ExceptionSeverity.ERROR,
//                    "student_id is required"
//            );
//        }
//
//        programId = programId.trim();
//        studentId = studentId.trim();
//
////        // ------------------------------------------------
////        // 1) Fetch selected program
////        // ------------------------------------------------
////        Program selectedProgram =
////                (Program) ProgramHelper.getInstance().getById(programId);
////
////        if (selectedProgram == null) {
////            throw new ApplicationException(
////                    ExceptionSeverity.ERROR,
////                    "Program not found: " + programId
////            );
////        }
////
////        String selectedAcademicYearId =
////                selectedProgram.getAcademic_year_id();
////
////        if (selectedAcademicYearId == null) {
////            throw new ApplicationException(
////                    ExceptionSeverity.ERROR,
////                    "Academic year not configured for program: " + programId
////            );
////        }
////
////        // ------------------------------------------------
////        // 2) Fetch all registrations of this student
////        // ------------------------------------------------
////        BaseResource[] studentRegs =
////                ProgramRegistrationHelper.getInstance()
////                        .getByExpression(
////                                new Expression(
////                                        ProgramRegistration.FIELD_STUDENT_ID,
////                                        REL_OP.EQ,
////                                        studentId
////                                )
////                        );
////
////        if (studentRegs != null) {
////            for (BaseResource br : studentRegs) {
////                ProgramRegistration existing =
////                        (ProgramRegistration) br;
////
////                // ignore inactive registrations
////                boolean inactive =
////                        "Y".equalsIgnoreCase(existing.getArchived()) ||
////                                "Y".equalsIgnoreCase(existing.getG_soft_delete());
////
////                if (inactive) continue;
////
////                // ------------------------------------------------
////                // 3) Compare academic year
////                // ------------------------------------------------
////                Program existingProgram =
////                        (Program) ProgramHelper.getInstance()
////                                .getById(existing.getProgram_id());
////
////                if (existingProgram == null) continue;
////
////                String existingAcademicYearId =
////                        existingProgram.getAcademic_year_id();
////
////                if (selectedAcademicYearId.equals(existingAcademicYearId)) {
////                    throw new ApplicationException(
////                            ExceptionSeverity.ERROR,
////                            "You have already enrolled one course in this academic year."
////                    );
////                }
////            }
////        }
//        // ------------------------------------------------
////// 1) Fetch selected program
////// ------------------------------------------------
////        Program selectedProgram =
////                (Program) ProgramHelper.getInstance().getById(programId);
////
////        if (selectedProgram == null) {
////            throw new ApplicationException(
////                    ExceptionSeverity.ERROR,
////                    "Program not found: " + programId
////            );
////        }
////
////        String selectedAcademicYearId = selectedProgram.getAcademic_year_id();
////        String selectedTermName = selectedProgram.getTerm_name();
////
////        if (selectedAcademicYearId == null) {
////            throw new ApplicationException(
////                    ExceptionSeverity.ERROR,
////                    "Academic year not configured for program: " + programId
////            );
////        }
////
////        if (selectedTermName == null) {
////            throw new ApplicationException(
////                    ExceptionSeverity.ERROR,
////                    "Term not configured for program: " + programId
////            );
////        }
////
////// ------------------------------------------------
////// 2) Fetch ALL registrations of this student
////// ------------------------------------------------
////        BaseResource[] studentRegs =
////                ProgramRegistrationHelper.getInstance()
////                        .getByExpression(
////                                new Expression(
////                                        ProgramRegistration.FIELD_STUDENT_ID,
////                                        REL_OP.EQ,
////                                        studentId
////                                )
////                        );
////
////        if (studentRegs != null) {
////
////            for (BaseResource br : studentRegs) {
////
////                ProgramRegistration existing =
////                        (ProgramRegistration) br;
////
////                // ------------------------------------------------
////                // Ignore inactive / deleted registrations
////                // ------------------------------------------------
////                boolean inactive =
////                        "Y".equalsIgnoreCase(existing.getArchived()) ||
////                                "Y".equalsIgnoreCase(existing.getG_soft_delete());
////
////                if (inactive) continue;
////
////                // ------------------------------------------------
////                // Fetch enrolled program
////                // ------------------------------------------------
////                Program existingProgram =
////                        (Program) ProgramHelper.getInstance()
////                                .getById(existing.getProgram_id());
////
////                if (existingProgram == null) continue;
////
////                String existingAcademicYearId =
////                        existingProgram.getAcademic_year_id();
////                String existingTermName =
////                        existingProgram.getTerm_name();
////
////                if (existingAcademicYearId == null || existingTermName == null) {
////                    continue;
////                }
////
////                // ------------------------------------------------
////                // RULE 1: Same Academic Year → NOT allowed
////                // ------------------------------------------------
////                if (selectedAcademicYearId.equals(existingAcademicYearId)) {
////                    throw new ApplicationException(
////                            ExceptionSeverity.ERROR,
////                            "You have already enrolled one course in this academic year."
////                    );
////                }
////
////                // ------------------------------------------------
////                // RULE 2: Invalid term progression
////                // Block only: T2 → T1
////                // ------------------------------------------------
////                if ("T2".equalsIgnoreCase(existingTermName)
////                        && "T1".equalsIgnoreCase(selectedTermName)) {
////
////                    throw new ApplicationException(
////                            ExceptionSeverity.ERROR,
////                            "Invalid academic progression: " +
////                                    "You cannot enroll in Term 1 after completing Term 2."
////                    );
////                }
////            }
////        }
//
//        // ------------------------------------------------
//// 1) Fetch selected program
//// ------------------------------------------------
//        Program selectedProgram =
//                (Program) ProgramHelper.getInstance().getById(programId);
//
//        if (selectedProgram == null) {
//            throw new ApplicationException(
//                    ExceptionSeverity.ERROR,
//                    "Program not found: " + programId
//            );
//        }
//
//        String selectedAcademicYearId = selectedProgram.getAcademic_year_id();
//        String selectedTermName = selectedProgram.getTerm_name();
//
//        if (selectedAcademicYearId == null || selectedTermName == null) {
//            throw new ApplicationException(
//                    ExceptionSeverity.ERROR,
//                    "Academic year or term not configured for program."
//            );
//        }
//
//// 🔑 Fetch academic year VALUE
//        AcademicYear selectedAY =
//                (AcademicYear) AcademicYearHelper.getInstance()
//                        .getById(selectedAcademicYearId);
//
//        int selectedStartYear =
//                getStartYearFromAcademicYear(selectedAY.getAcademic_year());
//
//// ------------------------------------------------
//// 2) Fetch ALL registrations of this student
//// ------------------------------------------------
//        BaseResource[] studentRegs =
//                ProgramRegistrationHelper.getInstance()
//                        .getByExpression(
//                                new Expression(
//                                        ProgramRegistration.FIELD_STUDENT_ID,
//                                        REL_OP.EQ,
//                                        studentId
//                                )
//                        );
//
//        if (studentRegs != null) {
//
//            for (BaseResource br : studentRegs) {
//
//                ProgramRegistration existing =
//                        (ProgramRegistration) br;
//
//                boolean inactive =
//                        "Y".equalsIgnoreCase(existing.getArchived()) ||
//                                "Y".equalsIgnoreCase(existing.getG_soft_delete());
//
//                if (inactive) continue;
//
//                Program existingProgram =
//                        (Program) ProgramHelper.getInstance()
//                                .getById(existing.getProgram_id());
//
//                if (existingProgram == null) continue;
//
//                String existingAcademicYearId =
//                        existingProgram.getAcademic_year_id();
//                String existingTermName =
//                        existingProgram.getTerm_name();
//
//                if (existingAcademicYearId == null || existingTermName == null) {
//                    continue;
//                }
//
//                AcademicYear existingAY =
//                        (AcademicYear) AcademicYearHelper.getInstance()
//                                .getById(existingAcademicYearId);
//
//                int existingStartYear =
//                        getStartYearFromAcademicYear(existingAY.getAcademic_year());
//
//                int yearGap = selectedStartYear - existingStartYear;
//
//                // =================================================
//                // RULE 1: SAME ACADEMIC YEAR → NOT ALLOWED
//                // =================================================
//                if (yearGap == 0) {
//                    throw new ApplicationException(
//                            ExceptionSeverity.ERROR,
//                            "You have already enrolled one course in this academic year."
//                    );
//                }
//
//                // =================================================
//                // RULE 2: NEXT ACADEMIC YEAR → CHECK TERM
//                // =================================================
//                if (yearGap == 1) {
//
//                    if ("T2".equalsIgnoreCase(existingTermName)
//                            && "T1".equalsIgnoreCase(selectedTermName)) {
//
//                        throw new ApplicationException(
//                                ExceptionSeverity.ERROR,
//                                "Invalid academic progression: " +
//                                        "You cannot enroll in Term 1 immediately after Term 2."
//                        );
//                    }
//                }
//
//                // =================================================
//                // RULE 3: yearGap > 1 → ALWAYS ALLOWED
//                // =================================================
//            }
//        }
//
//
//        // ------------------------------------------------
//        // 4) (Optional) Seat check (can keep your old logic)
//        // ------------------------------------------------
//        Long totalSeats = selectedProgram.getSeats();
//        if (totalSeats != null && totalSeats > 0) {
//
//            BaseResource[] programRegs =
//                    ProgramRegistrationHelper.getInstance()
//                            .getByExpression(
//                                    new Expression(
//                                            ProgramRegistration.FIELD_PROGRAM_ID,
//                                            REL_OP.EQ,
//                                            programId
//                                    )
//                            );
//
//            long activeCount = 0;
//            if (programRegs != null) {
//                for (BaseResource br : programRegs) {
//                    ProgramRegistration pr = (ProgramRegistration) br;
//
//                    boolean inactive =
//                            "Y".equalsIgnoreCase(pr.getArchived()) ||
//                                    "Y".equalsIgnoreCase(pr.getG_soft_delete());
//
//                    if (!inactive) activeCount++;
//                }
//            }
//
//            if (activeCount >= totalSeats) {
//                throw new ApplicationException(
//                        ExceptionSeverity.ERROR,
//                        "Registration failed: Program is full (Seats: " + totalSeats + ")"
//                );
//            }
//        }
//
//        // ✔ Allowed if reached here
//    }
    public void preAddDecorator(ServletContext ctx, BaseResource _resource)
            throws ApplicationException {

        ProgramRegistration reg = (ProgramRegistration) _resource;

        String programId = reg.getProgram_id();
        String studentId = reg.getStudent_id();

        // ------------------------------------------------
        // 0) Basic validation
        // ------------------------------------------------
        if (programId == null || programId.trim().isEmpty()) {
            throw new ApplicationException(
                    ExceptionSeverity.ERROR,
                    "program_id is required"
            );
        }

        if (studentId == null || studentId.trim().isEmpty()) {
            throw new ApplicationException(
                    ExceptionSeverity.ERROR,
                    "student_id is required"
            );
        }

        programId = programId.trim();
        studentId = studentId.trim();

        // ------------------------------------------------
        // 1) Fetch selected program
        // ------------------------------------------------
        Program selectedProgram =
                (Program) ProgramHelper.getInstance().getById(programId);

        if (selectedProgram == null) {
            throw new ApplicationException(
                    ExceptionSeverity.ERROR,
                    "Program not found: " + programId
            );
        }

        Date today = new Date();

        // ------------------------------------------------
        // 2) Registration window check (START / END DATE)
        // ------------------------------------------------
        Date startDate = selectedProgram.getStart_date();
        Date endDate = selectedProgram.getEnd_date();

        if (startDate != null && today.before(startDate)) {
            throw new ApplicationException(
                    ExceptionSeverity.ERROR,
                    "Registration has not started for this course."
            );
        }

        if (endDate != null && today.after(endDate)) {
            throw new ApplicationException(
                    ExceptionSeverity.ERROR,
                    "Registration period has ended for this course."
            );
        }

        // ------------------------------------------------
        // 3) Fetch ALL registrations of this student
        // ------------------------------------------------
        BaseResource[] studentRegs =
                ProgramRegistrationHelper.getInstance()
                        .getByExpression(
                                new Expression(
                                        ProgramRegistration.FIELD_STUDENT_ID,
                                        REL_OP.EQ,
                                        studentId
                                )
                        );

        Long latestCreationTime = null;

        if (studentRegs != null) {
            for (BaseResource br : studentRegs) {

                ProgramRegistration existing =
                        (ProgramRegistration) br;

                boolean inactive =
                        "Y".equalsIgnoreCase(existing.getArchived()) ||
                                "Y".equalsIgnoreCase(existing.getG_soft_delete());

                if (inactive) continue;

                // ------------------------------------------------
                // 3A) SAME COURSE RE-ENROLLMENT CHECK
                // ------------------------------------------------
                if (programId.equals(existing.getProgram_id())) {
                    throw new ApplicationException(
                            ExceptionSeverity.ERROR,
                            "You are already enrolled in this course."
                    );
                }

                // ------------------------------------------------
                // Track latest enrollment for cooldown
                // ------------------------------------------------
                Long creationTime = existing.getG_creation_time();
                if (creationTime == null) continue;

                if (latestCreationTime == null ||
                        creationTime > latestCreationTime) {
                    latestCreationTime = creationTime;
                }
            }
        }

        // ------------------------------------------------
        // 4) Enforce 10-month cooldown (GLOBAL)
        // ------------------------------------------------
        if (latestCreationTime != null) {

            Calendar lockEnd = Calendar.getInstance();
            lockEnd.setTimeInMillis(latestCreationTime);
            lockEnd.add(Calendar.MONTH, 10);

            if (today.before(lockEnd.getTime())) {

                long diffMillis =
                        lockEnd.getTimeInMillis() - today.getTime();
                long remainingDays =
                        diffMillis / (1000 * 60 * 60 * 24);

                throw new ApplicationException(
                        ExceptionSeverity.ERROR,
                        "You are already enrolled in a course. "
                                + "You can register again after "
                                + remainingDays + " days."
                );
            }
        }

        // ------------------------------------------------
        // 5) Seat availability check
        // ------------------------------------------------
        Long totalSeats = selectedProgram.getSeats();
        if (totalSeats != null && totalSeats > 0) {

            BaseResource[] programRegs =
                    ProgramRegistrationHelper.getInstance()
                            .getByExpression(
                                    new Expression(
                                            ProgramRegistration.FIELD_PROGRAM_ID,
                                            REL_OP.EQ,
                                            programId
                                    )
                            );

            long activeCount = 0;
            if (programRegs != null) {
                for (BaseResource br : programRegs) {
                    ProgramRegistration pr =
                            (ProgramRegistration) br;

                    boolean inactive =
                            "Y".equalsIgnoreCase(pr.getArchived()) ||
                                    "Y".equalsIgnoreCase(pr.getG_soft_delete());

                    if (!inactive) activeCount++;
                }
            }

            if (activeCount >= totalSeats) {
                throw new ApplicationException(
                        ExceptionSeverity.ERROR,
                        "Registration failed: Program is full (Seats: "
                                + totalSeats + ")"
                );
            }
        }

        // ✔ Allowed if reached here
    }





    // ✅ OPTIONAL: If you want a queryId-based “register” endpoint like certificate example
    @Override
    public BaseResource[] getQuery(ServletContext ctx,
                                   String queryId,
                                   Map<String, Object> map,
                                   BaseService service) throws ApplicationException {

        if (Q_REGISTER.equalsIgnoreCase(queryId)) {
            String programId = (String) map.get("program_id");
            String studentId = (String) map.get("student_id");

            ProgramRegistration reg = new ProgramRegistration();
            reg.setProgram_id(programId);
            reg.setStudent_id(studentId);

            // run same validations as normal add
            preAddDecorator(ctx, reg);

            // save
            ProgramRegistrationHelper.getInstance().add(reg);

            return new BaseResource[]{ reg };
        }

        return super.getQuery(ctx, queryId, map, service);
    }
}
