export class User {
    firstName: String;
    lastName: String;
    photoUrl: String;
    id: String;


    // constructor({firstName, lastName, photoUrl} : {firstName:any, lastName: any, photoUrl: any}){
    constructor(firstName: String, lastName: String, photoUrl: String, id: String){
        this.firstName = firstName;
        this.lastName = lastName;
        this.photoUrl = photoUrl;
        this.id = id;

    }

}
