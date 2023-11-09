import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Gif, SearchGIF } from "../interfaces/gifs.interfaces";

@Injectable({providedIn:'root'})
export class GifsService{

  public GifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private _apiKey:string = "x4I5LKyUO7i8MhjX6TljQz8AaO3dhWKv";
  private _serviceUrl= "https://api.giphy.com/v1/gifs"

  constructor(private http: HttpClient){
    this.loadLocalStorage();
  }


  get tagsHistory(){
    return [...this._tagsHistory]
  }

  private saveLocalStorage():void{
    localStorage.setItem('history',JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
    this.searchTag(this._tagsHistory[0] || '');
  }


  private organizeHistory(currentTag:string){
    currentTag = currentTag.toLowerCase();

    if(this._tagsHistory.includes(currentTag)){
      this._tagsHistory = this._tagsHistory.filter(( tag ) => tag.toLowerCase() != currentTag);
    }
    this._tagsHistory.unshift( currentTag );
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }



   searchTag(tag:string):void{
    if(tag.trim().length === 0) return;
    this.organizeHistory(tag);
    const httpParams =
    new HttpParams()
    .set("api_key",this._apiKey)
    .set("q",tag)
    .set("limit",10);
    this.http.get<SearchGIF>(`${this._serviceUrl}/search`,{params:httpParams})
    .subscribe((response:SearchGIF) => {
      this.GifList = response.data;
    })

  }
}
