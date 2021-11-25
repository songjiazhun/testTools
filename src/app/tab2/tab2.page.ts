import { Component, OnInit, NgZone, ViewChild,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import Web3 from "web3";

//declare let window:any;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  private web3:any;
  private stickerABI:any;
  //mainTest
  //private stickerAddr:any = "0x020c7303664bc88ae92cE3D380BF361E03B78B81";
  //private pasarAddr:any = "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0"
  //testNet
  //private stickerAddr:any = "0xf7E4dD3e8a2ee2D14c6706B37D9ED4309726eDFc";
  //private pasarAddr:any = "0x238e52d335a3abeDf9785D0ac9375623db0f0bC9"

  private stickerAddr: any = '0xed1978c53731997f4DAfBA47C9b07957Ef6F3961';
  private static pasarAddr: any = '0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087';

  private creatorPrivateKey:any = "04868f294d8ef6e1079752cd2e1f027a126b44ee27040d949a88f89bddc15f31";
  //private tokenId:any = "0xfeef09f58c64fede695bf447c20d011febd4e98bf184411f8e1eb902d87a8c55";

  public tokenId:any = "";
  current: number = 27;
  max: number = 50;
  public tokenInfo: String = "";
  private testBridge: string = "https://api-testnet.trinity-tech.cn/eth";
  private mainBridge: string = "https://api.elastos.io/eth";
  private curBridge: string = "";
  public curNetWork: string = "mainNet";
  constructor(private router: Router) {}

  ngOnInit() {
    this.stickerABI = require("../../assets/contracts/stickerABI.json");
    this.setBridge("1");

    console.log("====hex2dec====",this.hex2dec('0x3b85f6c1cf3d0cb796'));
    console.log("====hex2dec====",this.hex2dec1('0x3b85f6c1cf3d0cb796'));

  }


  async getWeb3(){

    if (typeof this.web3 !== 'undefined') {
       this.web3 = new Web3(this.web3.currentProvider);
    }else {
      let options = {
        agent: {

        }
    };
       this.web3 = new Web3(new Web3.providers.HttpProvider(this.curBridge,options));
    }
    return this.web3;
  }

async getTotalSupply(){
  await this.getWeb3();
  if(this.tokenId===""){
      return;
  }
  const stickerContract = new this.web3.eth.Contract(this.stickerABI,this.stickerAddr);
  let tokenInfo =  await stickerContract.methods.tokenInfo(this.tokenId).call();
  this.tokenInfo = JSON.stringify(tokenInfo);
}

async getExatTokenIfo(){
  await this.getWeb3();
  if(this.tokenId===""){
      return;
  }
  const stickerContract = new this.web3.eth.Contract(this.stickerABI,this.stickerAddr);
  let tokenInfo =  await stickerContract.methods.tokenExtraInfo(this.tokenId).call();
  this.tokenInfo = JSON.stringify(tokenInfo);
}

async getBalance(){
  await this.getWeb3();
  if(this.tokenId===""){
      return;
  }

  const balance = await new this.web3.eth.getBalance(this.tokenId);
  this.tokenInfo = JSON.stringify(balance);
}

async tokenIdByIndex(stickerContract:any,index:any){
   let tokenId =  await stickerContract.methods.tokenIdByIndex(index).call();
   console.log("=====tokenId===="+tokenId);
   this.getUri(stickerContract,tokenId);
}

async getUri(stickerContract:any,tokenId:any){
  let feedsUri =  await stickerContract.methods.uri(tokenId).call();
  console.log("===feedsUri==="+feedsUri);
}


 setBridge(type: string){
   switch(type){
    case "0"://mainNet
      this.curBridge = this.mainBridge;
    break;
    case "1"://testNet
      this.curBridge = this.testBridge;
      break;
   }
 }

 hex2dec(str:string){
  let dec = new BigNumber(str);
  let decStr = dec.toFormat({prefix:""});
  return decStr;
}

hex2dec1(str:string){
  let dec = new BigNumber(str);
  let decStr = dec.toFixed();
  return decStr;
}

}
