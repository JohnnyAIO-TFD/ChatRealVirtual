import { AlertType} from './../enums/alert-type.enum';

export class Alert {
    text: String;
    type: AlertType;

    //constructor({text, type} : {text: string, type : AlertType.Success}){
        constructor(text : string, type : AlertType){
        this.text = text;
        this.type = type;

    }
}
