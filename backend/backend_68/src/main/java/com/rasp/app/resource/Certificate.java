/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import platform.resource.BaseResource;
import platform.util.*;
import org.springframework.stereotype.Component;
import platform.db.*;
import java.util.*;
import com.rasp.app.message.*;
import com.rasp.app.helper.*;
import com.rasp.app.service.*;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 *
 */
@Component
public class Certificate extends BaseResource {
    private String id = null;
    private String g_created_by_id = null;
    private String g_created_by_name = null;
    private String g_modified_by_id = null;
    private String g_modified_by_name = null;
    private Long g_creation_time = null;
    private Long g_modify_time = null;
    private String g_soft_delete = null;
    private String g_status = null;
    private String archived = null;
    private Long archived_time = null;
    private String course_name = null;
    private Long course_duration = null;
    private String course_mode = null;
    private String platform = null;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MMM dd, yyyy")
    private Date course_completion_date = null;
    private String upload_certificate = null;
    private Boolean status = null;
    private String student_id = null;
    private String course_url = null;
    private Map<String, Object> extra_data = null;

    public static String FIELD_ID = "id";
    public static String FIELD_G_CREATED_BY_ID = "g_created_by_id";
    public static String FIELD_G_CREATED_BY_NAME = "g_created_by_name";
    public static String FIELD_G_MODIFIED_BY_ID = "g_modified_by_id";
    public static String FIELD_G_MODIFIED_BY_NAME = "g_modified_by_name";
    public static String FIELD_G_CREATION_TIME = "g_creation_time";
    public static String FIELD_G_MODIFY_TIME = "g_modify_time";
    public static String FIELD_G_SOFT_DELETE = "g_soft_delete";
    public static String FIELD_G_STATUS = "g_status";
    public static String FIELD_ARCHIVED = "archived";
    public static String FIELD_ARCHIVED_TIME = "archived_time";
    public static String FIELD_COURSE_NAME = "course_name";
    public static String FIELD_COURSE_DURATION = "course_duration";
    public static String FIELD_COURSE_MODE = "course_mode";
    public static String FIELD_PLATFORM = "platform";
    public static String FIELD_COURSE_COMPLETION_DATE = "course_completion_date";
    public static String FIELD_UPLOAD_CERTIFICATE = "upload_certificate";
    public static String FIELD_STATUS = "status";
    public static String FIELD_STUDENT_ID = "student_id";
    public static String FIELD_COURSE_URL = "course_url";
    public static String FIELD_EXTRA_DATA = "extra_data";

    private static final long serialVersionUID = 1L;
    public final static ResourceMetaData metaData = new ResourceMetaData("certificate");

    static {
        metaData.setCheckBeforeAdd(false);
        metaData.setCheckBeforeUpdate(false);

        metaData.setAllow_duplicate_name(false);
        Field idField = new Field("id", "String");
        idField.setRequired(true);
        metaData.addField(idField);

        Field g_created_by_idField = new Field("g_created_by_id", "String");
        g_created_by_idField.setLength(128);
        metaData.addField(g_created_by_idField);

        Field g_created_by_nameField = new Field("g_created_by_name", "String");
        g_created_by_nameField.setLength(128);
        metaData.addField(g_created_by_nameField);

        Field g_modified_by_idField = new Field("g_modified_by_id", "String");
        g_modified_by_idField.setLength(128);
        metaData.addField(g_modified_by_idField);

        Field g_modified_by_nameField = new Field("g_modified_by_name", "String");
        g_modified_by_nameField.setLength(128);
        metaData.addField(g_modified_by_nameField);

        Field g_creation_timeField = new Field("g_creation_time", "long");
        metaData.addField(g_creation_timeField);

        Field g_modify_timeField = new Field("g_modify_time", "long");
        metaData.addField(g_modify_timeField);

        Field g_soft_deleteField = new Field("g_soft_delete", "String");
        g_soft_deleteField.setDefaultValue("N");
        g_soft_deleteField.setLength(1);
        metaData.addField(g_soft_deleteField);

        Field g_statusField = new Field("g_status", "String");
        g_statusField.setIndexed(true);
        g_statusField.setLength(32);
        metaData.addField(g_statusField);

        Field archivedField = new Field("archived", "String");
        archivedField.setIndexed(true);
        archivedField.setDefaultValue("N");
        archivedField.setLength(1);
        metaData.addField(archivedField);

        Field archived_timeField = new Field("archived_time", "long");
        metaData.addField(archived_timeField);

        Field course_nameField = new Field("course_name", "String");
        course_nameField.setRequired(true);
        metaData.addField(course_nameField);

        Field course_durationField = new Field("course_duration", "Long");
        course_durationField.setRequired(true);
        metaData.addField(course_durationField);

        Field course_modeField = new Field("course_mode", "String");
        course_modeField.setEnum(true);
        course_modeField.setPossible_value("Course_mode");
        course_modeField.setRequired(true);
        metaData.addField(course_modeField);

        Field platformField = new Field("platform", "String");
        platformField.setRequired(true);
        metaData.addField(platformField);

        Field course_completion_dateField = new Field("course_completion_date", "Date");
        course_completion_dateField.setRequired(true);
        metaData.addField(course_completion_dateField);

        Field upload_certificateField = new Field("upload_certificate", "String");
        upload_certificateField.setFile(true);
        upload_certificateField.setRequired(true);
        metaData.addField(upload_certificateField);

        Field statusField = new Field("status", "Boolean");
        metaData.addField(statusField);

        Field student_idField = new Field("student_id", "String");
        student_idField.setRequired(true);
        student_idField.setForeign(new Foreign("Student"));
        metaData.addField(student_idField);

        Field course_urlField = new Field("course_url", "String");
        metaData.addField(course_urlField);

        Field extra_dataField = new Field("extra_data", "Map");
        extra_dataField.setValueType("Object");
        metaData.addField(extra_dataField);

        metaData.setTableName("certificate");
        metaData.setCluster("rasp_db");
    }

    public Certificate() { this.setId(Util.getUniqueId()); }
    public Certificate(String id) { this.setId(id); }

    public Certificate(Certificate obj) {
        this.id = obj.id;
        this.g_created_by_id = obj.g_created_by_id;
        this.g_created_by_name = obj.g_created_by_name;
        this.g_modified_by_id = obj.g_modified_by_id;
        this.g_modified_by_name = obj.g_modified_by_name;
        this.g_creation_time = obj.g_creation_time;
        this.g_modify_time = obj.g_modify_time;
        this.g_soft_delete = obj.g_soft_delete;
        this.g_status = obj.g_status;
        this.archived = obj.archived;
        this.archived_time = obj.archived_time;
        this.course_name = obj.course_name;
        this.course_duration = obj.course_duration;
        this.course_mode = obj.course_mode;
        this.platform = obj.platform;
        this.course_completion_date = obj.course_completion_date;
        this.upload_certificate = obj.upload_certificate;
        this.status = obj.status;
        this.student_id = obj.student_id;
        this.course_url = obj.course_url;
        this.extra_data = obj.extra_data;
    }

    public ResourceMetaData getMetaData() {
        return metaData;
    }

    private void setDefaultValues() {
        if (g_soft_delete == null)
            g_soft_delete = "N";
        if (archived == null)
            archived = "N";
    }

    public Map<String, Object> convertResourceToMap(HashMap<String, Object> map) {
        if (id != null)
            map.put("id", id);
        if (g_created_by_id != null)
            map.put("g_created_by_id", g_created_by_id);
        if (g_created_by_name != null)
            map.put("g_created_by_name", g_created_by_name);
        if (g_modified_by_id != null)
            map.put("g_modified_by_id", g_modified_by_id);
        if (g_modified_by_name != null)
            map.put("g_modified_by_name", g_modified_by_name);
        if (g_creation_time != null)
            map.put("g_creation_time", g_creation_time);
        if (g_modify_time != null)
            map.put("g_modify_time", g_modify_time);
        if (g_soft_delete != null)
            map.put("g_soft_delete", g_soft_delete);
        if (g_status != null)
            map.put("g_status", g_status);
        if (archived != null)
            map.put("archived", archived);
        if (archived_time != null)
            map.put("archived_time", archived_time);
        if (course_name != null)
            map.put("course_name", course_name);
        if (course_duration != null)
            map.put("course_duration", course_duration);
        if (course_mode != null)
            map.put("course_mode", course_mode);
        if (platform != null)
            map.put("platform", platform);
        if (course_completion_date != null)
            map.put("course_completion_date", course_completion_date);
        if (upload_certificate != null)
            map.put("upload_certificate", upload_certificate);
        if (status != null)
            map.put("status", status);
        if (student_id != null)
            map.put("student_id", student_id);
        if (course_url != null)
            map.put("course_url", course_url);
        if (extra_data != null)
            map.put("extra_data", extra_data);
        return map;
    }

    public Map<String, Object> validateAndConvertResourceToMap(HashMap<String, Object> map, boolean add)
            throws ApplicationException {
        if (validateId(add))
            map.put("id", id);
        if (g_created_by_id != null)
            map.put("g_created_by_id", g_created_by_id);
        if (g_created_by_name != null)
            map.put("g_created_by_name", g_created_by_name);
        if (g_modified_by_id != null)
            map.put("g_modified_by_id", g_modified_by_id);
        if (g_modified_by_name != null)
            map.put("g_modified_by_name", g_modified_by_name);
        if (g_creation_time != null)
            map.put("g_creation_time", g_creation_time);
        if (g_modify_time != null)
            map.put("g_modify_time", g_modify_time);
        if (g_soft_delete != null)
            map.put("g_soft_delete", g_soft_delete);
        if (g_status != null)
            map.put("g_status", g_status);
        if (archived != null)
            map.put("archived", archived);
        if (archived_time != null)
            map.put("archived_time", archived_time);
        if (validateCourse_name(add))
            map.put("course_name", course_name);
        if (validateCourse_duration(add))
            map.put("course_duration", course_duration);
        if (validateCourse_mode(add))
            map.put("course_mode", course_mode);
        if (validatePlatform(add))
            map.put("platform", platform);
        if (validateCourse_completion_date(add))
            map.put("course_completion_date", course_completion_date);
        if (validateUpload_certificate(add))
            map.put("upload_certificate", upload_certificate);
        if (status != null)
            map.put("status", status);
        if (validateStudent_id(add))
            map.put("student_id", student_id);
        if (course_url != null)
            map.put("course_url", course_url);
        if (extra_data != null)
            map.put("extra_data", extra_data);
        return map;
    }

    public Map<String, Object> convertResourceToPrimaryMap(HashMap<String, Object> map) {
        return map;
    }

    @SuppressWarnings("unchecked")
    public void convertMapToResource(Map<String, Object> map) {
        id = (String) map.get("id");
        g_created_by_id = (String) map.get("g_created_by_id");
        g_created_by_name = (String) map.get("g_created_by_name");
        g_modified_by_id = (String) map.get("g_modified_by_id");
        g_modified_by_name = (String) map.get("g_modified_by_name");
        g_creation_time = (map.get("g_creation_time") == null ? null
                : ((Number) map.get("g_creation_time")).longValue());
        g_modify_time = (map.get("g_modify_time") == null ? null
                : ((Number) map.get("g_modify_time")).longValue());
        g_soft_delete = (String) map.get("g_soft_delete");
        g_status = (String) map.get("g_status");
        archived = (String) map.get("archived");
        archived_time = (map.get("archived_time") == null ? null
                : ((Number) map.get("archived_time")).longValue());
        course_name = (String) map.get("course_name");
        course_duration = (map.get("course_duration") == null ? null
                : ((Number) map.get("course_duration")).longValue());
        course_mode = (String) map.get("course_mode");
        platform = (String) map.get("platform");
        course_completion_date = (Date) map.get("course_completion_date");
        upload_certificate = (String) map.get("upload_certificate");
        status = (Boolean) map.get("status");
        student_id = (String) map.get("student_id");
        course_url = (String) map.get("course_url");
        extra_data = (Map<String, Object>) map.get("extra_data");
    }

    @SuppressWarnings("unchecked")
    public void convertTypeUnsafeMapToResource(Map<String, Object> map) {
        Object idObj = map.get("id");
        if (idObj != null)
            id = idObj.toString();

        Object g_created_by_idObj = map.get("g_created_by_id");
        if (g_created_by_idObj != null)
            g_created_by_id = g_created_by_idObj.toString();

        Object g_created_by_nameObj = map.get("g_created_by_name");
        if (g_created_by_nameObj != null)
            g_created_by_name = g_created_by_nameObj.toString();

        Object g_modified_by_idObj = map.get("g_modified_by_id");
        if (g_modified_by_idObj != null)
            g_modified_by_id = g_modified_by_idObj.toString();

        Object g_modified_by_nameObj = map.get("g_modified_by_name");
        if (g_modified_by_nameObj != null)
            g_modified_by_name = g_modified_by_nameObj.toString();

        Object g_creation_timeObj = map.get("g_creation_time");
        if (g_creation_timeObj != null)
            g_creation_time = new Long(g_creation_timeObj.toString());

        Object g_modify_timeObj = map.get("g_modify_time");
        if (g_modify_timeObj != null)
            g_modify_time = new Long(g_modify_timeObj.toString());

        Object g_soft_deleteObj = map.get("g_soft_delete");
        if (g_soft_deleteObj != null)
            g_soft_delete = g_soft_deleteObj.toString();

        Object g_statusObj = map.get("g_status");
        if (g_statusObj != null)
            g_status = g_statusObj.toString();

        Object archivedObj = map.get("archived");
        if (archivedObj != null)
            archived = archivedObj.toString();

        Object archived_timeObj = map.get("archived_time");
        if (archived_timeObj != null)
            archived_time = new Long(archived_timeObj.toString());

        Object course_nameObj = map.get("course_name");
        if (course_nameObj != null)
            course_name = course_nameObj.toString();

        Object course_durationObj = map.get("course_duration");
        if (course_durationObj != null)
            course_duration = new Long(course_durationObj.toString());

        Object course_modeObj = map.get("course_mode");
        if (course_modeObj != null)
            course_mode = course_modeObj.toString();

        Object platformObj = map.get("platform");
        if (platformObj != null)
            platform = platformObj.toString();

        Object course_completion_dateObj = map.get("course_completion_date");
        if (course_completion_dateObj != null) {
            course_completion_date = asDate(course_completion_dateObj);
        }

        Object upload_certificateObj = map.get("upload_certificate");
        if (upload_certificateObj != null)
            upload_certificate = upload_certificateObj.toString();

        Object statusObj = map.get("status");
        if (statusObj != null)
            status = new Boolean(statusObj.toString());

        Object student_idObj = map.get("student_id");
        if (student_idObj != null)
            student_id = student_idObj.toString();

        Object course_urlObj = map.get("course_url");
        if (course_urlObj != null)
            course_url = course_urlObj.toString();

        extra_data = (Map<String, Object>) map.get("extra_data");
    }

    public void convertPrimaryMapToResource(Map<String, Object> map) {
    }

    public void convertTypeUnsafePrimaryMapToResource(Map<String, Object> map) {
    }

    public String getId() {
        return id;
    }

    public String getIdEx() {
        return id != null ? id : "";
    }

    public void setId(String id) {
        this.id = id;
    }

    public void unSetId() {
        this.id = null;
    }

    public boolean validateId(boolean add) throws ApplicationException {
        if (add && id == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[id]");
        return id != null;
    }

    public String getG_created_by_id() {
        return g_created_by_id;
    }

    public String getG_created_by_idEx() {
        return g_created_by_id != null ? g_created_by_id : "";
    }

    public void setG_created_by_id(String g_created_by_id) {
        this.g_created_by_id = g_created_by_id;
    }

    public void unSetG_created_by_id() {
        this.g_created_by_id = null;
    }

    public String getG_created_by_name() {
        return g_created_by_name;
    }

    public String getG_created_by_nameEx() {
        return g_created_by_name != null ? g_created_by_name : "";
    }

    public void setG_created_by_name(String g_created_by_name) {
        this.g_created_by_name = g_created_by_name;
    }

    public void unSetG_created_by_name() {
        this.g_created_by_name = null;
    }

    public String getG_modified_by_id() {
        return g_modified_by_id;
    }

    public String getG_modified_by_idEx() {
        return g_modified_by_id != null ? g_modified_by_id : "";
    }

    public void setG_modified_by_id(String g_modified_by_id) {
        this.g_modified_by_id = g_modified_by_id;
    }

    public void unSetG_modified_by_id() {
        this.g_modified_by_id = null;
    }

    public String getG_modified_by_name() {
        return g_modified_by_name;
    }

    public String getG_modified_by_nameEx() {
        return g_modified_by_name != null ? g_modified_by_name : "";
    }

    public void setG_modified_by_name(String g_modified_by_name) {
        this.g_modified_by_name = g_modified_by_name;
    }

    public void unSetG_modified_by_name() {
        this.g_modified_by_name = null;
    }

    public Long getG_creation_time() {
        return g_creation_time;
    }

    public long getG_creation_timeEx() {
        return g_creation_time != null ? g_creation_time : 0L;
    }

    public void setG_creation_time(long g_creation_time) {
        this.g_creation_time = g_creation_time;
    }

    @JsonIgnore
    public void setG_creation_time(Long g_creation_time) {
        this.g_creation_time = g_creation_time;
    }

    public void unSetG_creation_time() {
        this.g_creation_time = null;
    }

    public Long getG_modify_time() {
        return g_modify_time;
    }

    public long getG_modify_timeEx() {
        return g_modify_time != null ? g_modify_time : 0L;
    }

    public void setG_modify_time(long g_modify_time) {
        this.g_modify_time = g_modify_time;
    }

    @JsonIgnore
    public void setG_modify_time(Long g_modify_time) {
        this.g_modify_time = g_modify_time;
    }

    public void unSetG_modify_time() {
        this.g_modify_time = null;
    }

    public String getG_soft_delete() {
        return g_soft_delete != null ? g_soft_delete : "N";
    }

    public void setG_soft_delete(String g_soft_delete) {
        this.g_soft_delete = g_soft_delete;
    }

    public void unSetG_soft_delete() {
        this.g_soft_delete = "N";
    }

    public String getG_status() {
        return g_status;
    }

    public String getG_statusEx() {
        return g_status != null ? g_status : "";
    }

    public void setG_status(String g_status) {
        this.g_status = g_status;
    }

    public void unSetG_status() {
        this.g_status = null;
    }

    public String getArchived() {
        return archived != null ? archived : "N";
    }

    public void setArchived(String archived) {
        this.archived = archived;
    }

    public void unSetArchived() {
        this.archived = "N";
    }

    public Long getArchived_time() {
        return archived_time;
    }

    public long getArchived_timeEx() {
        return archived_time != null ? archived_time : 0L;
    }

    public void setArchived_time(long archived_time) {
        this.archived_time = archived_time;
    }

    @JsonIgnore
    public void setArchived_time(Long archived_time) {
        this.archived_time = archived_time;
    }

    public void unSetArchived_time() {
        this.archived_time = null;
    }

    public String getCourse_name() {
        return course_name;
    }

    public String getCourse_nameEx() {
        return course_name != null ? course_name : "";
    }

    public void setCourse_name(String course_name) {
        this.course_name = course_name;
    }

    public void unSetCourse_name() {
        this.course_name = null;
    }

    public boolean validateCourse_name(boolean add) throws ApplicationException {
        if (add && course_name == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_name]");
        return course_name != null;
    }

    public Long getCourse_duration() {
        return course_duration;
    }

    public void setCourse_duration(Long course_duration) {
        this.course_duration = course_duration;
    }

    public void unSetCourse_duration() {
        this.course_duration = null;
    }

    public boolean validateCourse_duration(boolean add) throws ApplicationException {
        if (add && course_duration == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_duration]");
        return course_duration != null;
    }

    public String getCourse_mode() {
        return course_mode;
    }

    public String getCourse_modeEx() {
        return course_mode != null ? course_mode : "";
    }

    public void setCourse_mode(String course_mode) {
        this.course_mode = course_mode;
    }

    public void unSetCourse_mode() {
        this.course_mode = null;
    }

    public boolean validateCourse_mode(boolean add) throws ApplicationException {
        if (add && course_mode == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_mode]");
        return course_mode != null;
    }

    public String getPlatform() {
        return platform;
    }

    public String getPlatformEx() {
        return platform != null ? platform : "";
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public void unSetPlatform() {
        this.platform = null;
    }

    public boolean validatePlatform(boolean add) throws ApplicationException {
        if (add && platform == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[platform]");
        return platform != null;
    }

    public Date getCourse_completion_date() {
        return course_completion_date;
    }


    public void setCourse_completion_date(Date course_completion_date) {
        this.course_completion_date = course_completion_date;
    }

    public void unSetCourse_completion_date() {
        this.course_completion_date = null;
    }

    public boolean validateCourse_completion_date(boolean add) throws ApplicationException {
        if (add && course_completion_date == null)
            throw new ApplicationException(ExceptionSeverity.ERROR,
                    "Requierd validation Failed[course_completion_date]");
        return course_completion_date != null;
    }

    public String getUpload_certificate() {
        return upload_certificate;
    }

    public String getUpload_certificateEx() {
        return upload_certificate != null ? upload_certificate : "";
    }

    public void setUpload_certificate(String upload_certificate) {
        this.upload_certificate = upload_certificate;
    }

    public void unSetUpload_certificate() {
        this.upload_certificate = null;
    }

    public boolean validateUpload_certificate(boolean add) throws ApplicationException {
        if (add && upload_certificate == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[upload_certificate]");
        return upload_certificate != null;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public void unSetStatus() {
        this.status = null;
    }

    public String getStudent_id() {
        return student_id;
    }

    public String getStudent_idEx() {
        return student_id != null ? student_id : "";
    }

    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }

    public void unSetStudent_id() {
        this.student_id = null;
    }

    public boolean validateStudent_id(boolean add) throws ApplicationException {
        if (add && student_id == null)
            throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[student_id]");
        return student_id != null;
    }

    public String getCourse_url() {
        return course_url;
    }

    public String getCourse_urlEx() {
        return course_url != null ? course_url : "";
    }

    public void setCourse_url(String course_url) {
        this.course_url = course_url;
    }

    public void unSetCourse_url() {
        this.course_url = null;
    }

    public Map<String, Object> getExtra_data() {
        return extra_data;
    }

    public Object getExtra_data(String key) {
        return extra_data == null ? null : extra_data.get(key);
    }

    public void setExtra_data(Map<String, Object> extra_data) {
        this.extra_data = extra_data;
    }

    public void setExtra_data(String key, Object value) {
        if (extra_data == null)
            extra_data = new HashMap<String, Object>();
        extra_data.put(key, value);
    }

    public void unSetExtra_data() {
        this.extra_data = null;
    }

    public String getCluster() {
        return "rasp_db";
    }

    public String getClusterType() {
        return "REPLICATED";
    }

    public Class<?> getResultClass() {
        return CertificateResult.class;
    };

    public Class<?> getMessageClass() {
        return CertificateMessage.class;
    };

    public Class<?> getHelperClass() {
        return CertificateHelper.class;
    };

    public Class<?> getServiceClass() {
        return CertificateService.class;
    };

    private static Long asLong(Object v) {
        if (v == null)
            return null;
        if (v instanceof Number)
            return ((Number) v).longValue();
        if (v instanceof String) {
            String s = ((String) v).trim();
            if (s.isEmpty())
                return null;
            try {
                return Long.parseLong(s);
            } catch (NumberFormatException ignore) {
            }
            try {
                return (long) Double.parseDouble(s);
            } catch (NumberFormatException ignore) {
            }
        }
        return null;
    }

    private static Boolean asBoolean(Object v) {
        if (v == null)
            return null;
        if (v instanceof Boolean)
            return (Boolean) v;
        if (v instanceof Number)
            return ((Number) v).intValue() != 0;
        if (v instanceof String)
            return Boolean.parseBoolean(((String) v).trim());
        return null;
    }

    /**
     * Normalize different input types to a java.sql.Date that has only the date
     * part. IMPORTANT: Never call java.sql.Date.toInstant() because it throws
     * UnsupportedOperationException.
     */
    private static Date asDate(Object v) {
        if (v == null)
            return null;

        java.time.ZoneId zone = java.time.ZoneId.systemDefault();

        // Already a java.sql.Date → it's already date-only
        if (v instanceof java.sql.Date) {
            return (java.sql.Date) v;
        }

        // Any other java.util.Date → truncate to LocalDate using epoch millis
        if (v instanceof java.util.Date) {
            long millis = ((java.util.Date) v).getTime();
            java.time.LocalDate ld = java.time.Instant.ofEpochMilli(millis).atZone(zone).toLocalDate();
            return java.sql.Date.valueOf(ld);
        }

        // Numeric epoch millis
        if (v instanceof Number) {
            long millis = ((Number) v).longValue();
            java.time.LocalDate ld = java.time.Instant.ofEpochMilli(millis).atZone(zone).toLocalDate();
            return java.sql.Date.valueOf(ld);
        }

        // String formats
        if (v instanceof String) {
            String s = ((String) v).trim().replace('\u202F', ' ').replace('\u00A0', ' ');
            if (s.isEmpty())
                return null;

            // Pure epoch millis as string
            if (s.matches("\\d+")) {
                try {
                    long millis = Long.parseLong(s);
                    java.time.LocalDate ld = java.time.Instant.ofEpochMilli(millis).atZone(zone).toLocalDate();
                    return java.sql.Date.valueOf(ld);
                } catch (NumberFormatException ignore) {
                }
            }

            java.util.Locale locale = java.util.Locale.US;

            // 1) "Nov 15, 2025, 12:00:00 AM"
            try {
                java.time.format.DateTimeFormatter fDateTime = java.time.format.DateTimeFormatter
                        .ofPattern("MMM d, uuuu, h:mm:ss a", locale);
                java.time.LocalDateTime ldt = java.time.LocalDateTime.parse(s, fDateTime);
                return java.sql.Date.valueOf(ldt.toLocalDate());
            } catch (Exception ignore) {
            }

            // 2) "Nov 15, 2025"
            try {
                java.time.format.DateTimeFormatter fDate = java.time.format.DateTimeFormatter
                        .ofPattern("MMM d, uuuu", locale);
                java.time.LocalDate ld = java.time.LocalDate.parse(s, fDate);
                return java.sql.Date.valueOf(ld);
            } catch (Exception ignore) {
            }

            // 3) "2025-11-15" (ISO_LOCAL_DATE)
            try {
                java.time.LocalDate ld = java.time.LocalDate.parse(s, java.time.format.DateTimeFormatter.ISO_LOCAL_DATE);
                return java.sql.Date.valueOf(ld);
            } catch (Exception ignore) {
            }

            // 4) ISO instant string, e.g. "2025-11-15T00:00:00Z"
            try {
                java.time.LocalDate ld = java.time.Instant.parse(s).atZone(zone).toLocalDate();
                return java.sql.Date.valueOf(ld);
            } catch (Exception ignore) {
            }
        }

        // Fallback if nothing matched
        return null;
    }
}
