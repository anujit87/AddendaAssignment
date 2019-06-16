export class Tweet{
    id:string;
    user:{
        name:string;
        screen_name:string;
    }
    followers_count:number;
    created_at:Date;
}