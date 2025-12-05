class Program_registrationModel {
  private _id: any;
  private _program_id: any;
  private _student_id: any;

  constructor(data: any) {
    this._id = data["id"];
    this._program_id = data["program_id"];
    this._student_id = data["student_id"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getprogram_id(): any {
    return this._program_id;
  }

  public setprogram_id(value: any) {
    this._program_id = value;
  }

  public getstudent_id(): any {
    return this._student_id;
  }

  public setstudent_id(value: any) {
    this._student_id = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "program_id": this._program_id,
      "student_id": this._student_id,
    };
  }

  public static fromJson(json: any): Program_registrationModel {
    return new Program_registrationModel(json);
  }
}

export default Program_registrationModel;
