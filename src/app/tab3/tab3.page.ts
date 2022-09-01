import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public list = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"];
  private observerList: any = {};
  private test1:any = {};
  constructor() {

  }

  ionViewWillEnter() {
    console.log("=======ionViewWillEnter=======")
    this.newSectionObserver();
  }

  ionViewWillLeave() {
    console.log("=======ionViewWillLeave=======");
    this.clearIntersectionObserver();
  }

  newSectionObserver(){
     for(let index = 0; index < this.list.length; index++){
             let id = this.list[index];
             let exit = this.observerList[id] || null;
             if(exit !=null){
                continue;
             }
            let item = document.getElementById(id) || null;
            if(item != null ){
              this.observerList[id] = new IntersectionObserver((changes:any)=>{
                let container = changes[0].target;
                let newId = container.getAttribute("id");
                // if(changes[0].intersectionRatio === 1){
                //   console.log("======intersectionRatio0========", newId,changes[0].intersectionRatio);
                // }else if(changes[0].intersectionRatio === 0){
                //   console.log("======intersectionRatio1========", newId,changes[0].intersectionRatio);
                // }
                console.log("======intersectionRatio0========", newId,changes[0].intersectionRatio);

                //console.log("======intersectionRatio1========",typeof(changes[0]));
                //console.log("======intersectionRatio2========",Object.getOwnPropertyNames(changes[0]));
              });

              this.observerList[id].observe(item);
            }
     }
  }

  clearIntersectionObserver(){
    for(let key in this.observerList){
       console.log(key);
       let item = this.observerList[key];
       let element = document.getElementById(key) || null;

      item.unobserve(element);//解除观察器
      item.disconnect();  // 关闭观察器
      this.observerList[key] = null;
    }
  }



}
