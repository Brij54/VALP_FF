class CertificateModel {
  private _id: any;
  private _course_name: any;
  private _course_duration: any;
  private _course_mode: any;
  private _platform: any;
  private _course_completion_date: any;
  private _upload_certificate: any;
  private _status: any;
  private _student_id: any;
  private _course_url: any;

  constructor(data: any) {
    this._id = data["id"];
    this._course_name = data["course_name"];
    this._course_duration = data["course_duration"];
    this._course_mode = data["course_mode"];
    this._platform = data["platform"];
    this._course_completion_date = data["course_completion_date"];
    this._upload_certificate = data["upload_certificate"];
    this._status = data["status"];
    this._student_id = data["student_id"];
    this._course_url = data["course_url"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getcourse_name(): any {
    return this._course_name;
  }

  public setcourse_name(value: any) {
    this._course_name = value;
  }

  public getcourse_duration(): any {
    return this._course_duration;
  }

  public setcourse_duration(value: any) {
    this._course_duration = value;
  }

  public getcourse_mode(): any {
    return this._course_mode;
  }

  public setcourse_mode(value: any) {
    this._course_mode = value;
  }

  public getplatform(): any {
    return this._platform;
  }

  public setplatform(value: any) {
    this._platform = value;
  }

  public getcourse_completion_date(): any {
    return this._course_completion_date;
  }

  public setcourse_completion_date(value: any) {
    this._course_completion_date = value;
  }

  public getupload_certificate(): any {
    return this._upload_certificate;
  }

  public setupload_certificate(value: any) {
    this._upload_certificate = value;
  }

  public getstatus(): any {
    return this._status;
  }

  public setstatus(value: any) {
    this._status = value;
  }

  public getstudent_id(): any {
    return this._student_id;
  }

  public setstudent_id(value: any) {
    this._student_id = value;
  }

  public getcourse_url(): any {
    return this._course_url;
  }

  public setcourse_url(value: any) {
    this._course_url = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "course_name": this._course_name,
      "course_duration": this._course_duration,
      "course_mode": this._course_mode,
      "platform": this._platform,
      "course_completion_date": this._course_completion_date,
      "upload_certificate": this._upload_certificate,
      "status": this._status,
      "student_id": this._student_id,
      "course_url": this._course_url,
    };
  }

  public static fromJson(json: any): CertificateModel {
    return new CertificateModel(json);
  }
}

export default CertificateModel;
