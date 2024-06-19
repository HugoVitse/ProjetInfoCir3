export type evenement = {
    activity:{
        image:string;
        title:string;
        description:string;
        adresse:string
    }  ,
    type:string;
    date:string;
    nbinvities:string;
    host:string;
    participants:Array<string>;
    _id:string
};