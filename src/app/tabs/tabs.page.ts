import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  test(){
    console.log("tab2");
  //  let sid = setTimeout(()=>{
  //     document.getElementById("test").click();
  //     clearTimeout(sid);
  //   },300)
  }

}
