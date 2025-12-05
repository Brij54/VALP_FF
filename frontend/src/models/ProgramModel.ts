class ProgramModel {
  private _id: any;
  private _name: any;
  private _seats: any;
  private _instructor_name: any;
  private _syllabus: any;

  constructor(data: any) {
    this._id = data["id"];
    this._name = data["name"];
    this._seats = data["seats"];
    this._instructor_name = data["instructor_name"];
    this._syllabus = data["syllabus"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getname(): any {
    return this._name;
  }

  public setname(value: any) {
    this._name = value;
  }

  public getseats(): any {
    return this._seats;
  }

  public setseats(value: any) {
    this._seats = value;
  }

  public getinstructor_name(): any {
    return this._instructor_name;
  }

  public setinstructor_name(value: any) {
    this._instructor_name = value;
  }

  public getsyllabus(): any {
    return this._syllabus;
  }

  public setsyllabus(value: any) {
    this._syllabus = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "name": this._name,
      "seats": this._seats,
      "instructor_name": this._instructor_name,
      "syllabus": this._syllabus,
    };
  }

  public static fromJson(json: any): ProgramModel {
    return new ProgramModel(json);
  }
}

export default ProgramModel;
