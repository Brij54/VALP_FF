class Academic_yearModelModel {

  private _id: any;

  private _academic_name: any;

  private _start_date: any;

  private _end_date: any;

  private _details: any;


  constructor(data: any) {

    this._id = data["id"];

    this._academic_name = data["academic_name"];

    this._start_date = data["start_date"];

    this._end_date = data["end_date"];

    this._details = data["details"];

  }


  public getId(): any {
    return this._id;
  }

  public setId(value: any) {
    this._id = value;
  }


  public getacademic_name(): any {
    return this._academic_name;
  }

  public setacademic_name(value: any) {
    this._academic_name = value;
  }


  public getStart_date(): any {
    return this._start_date;
  }

  public setStart_date(value: any) {
    this._start_date = value;
  }


  public getEnd_date(): any {
    return this._end_date;
  }

  public setEnd_date(value: any) {
    this._end_date = value;
  }


  public getDetails(): any {
    return this._details;
  }

  public setDetails(value: any) {
    this._details = value;
  }



  public toJson(): any {
    return {

      "id": this._id,

      "academic_name": this._academic_name,

      "start_date": this._start_date,

      "end_date": this._end_date,

      "details": this._details,

    };
  }

  public static fromJson(json: any): Academic_yearModelModel {
    return new Academic_yearModelModel(json);
  }
}

export default Academic_yearModelModel;
