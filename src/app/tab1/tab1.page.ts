import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import Web3 from "web3";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public tokenContent: string = "";
  public stickerABI: string = "";
  public galleriaABI: string = "";
  private web3:any;
  public curNetWork: string = "mainNet";
  private testBridge: string = "https://api-testnet.trinity-tech.cn/eth";
  private mainBridge: string = "https://api.trinity-tech.cn/eth";
  private curBridge: string = "";

    /** MainNet contract */
  public STICKER_ADDRESS: string = '0x020c7303664bc88ae92cE3D380BF361E03B78B81';
  public PASAR_ADDRESS: string = '0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0';
  public GALLERIA_ADDRESS: string = '';

  /** TestNet contract */
  public  STICKER_TEST_ADDRESS: string = '0xed1978c53731997f4DAfBA47C9b07957Ef6F3961';
  public  PASAR_TEST_ADDRESS: string = '0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087';
  public  GALLERIA_TEST_ADDRESS: string = '0xF63f820F4a0bC6E966D61A4b20d24916713Ebb95';
  /** MainNet IPFS */
  public IPFS_SERVER: string = 'https://ipfs.trinity-feeds.app/';

  /** TestNet IPFS */
  public IPFS_TEST_SERVER: string = 'https://ipfs-test.trinity-feeds.app/';

  public tokenId: string = "";

  public jsonUri: string = "";

  public pasarABI: string = "";

  public saleCount:number = null;

  public notSale:number = null;

  public activeCount: number = null;

  constructor(public loadingController: LoadingController) {

  }

  ngOnInit() {
    this.stickerABI = require("../../assets/contracts/stickerABI.json");
    this.pasarABI = require("../../assets/contracts/pasarABI.json");
    this.galleriaABI = require("../../assets/contracts/galleriaABI.json");
    console.log("this.stickerABI",this.stickerABI)
    this.handleContracts(this.curNetWork);
  }


  handleContracts(type: string){
  switch(type){
   case "mainNet":
    this.setBridge(type);
      break;
   case "testNet":
    this.setBridge(type);
      break;
  }
  }

async setBridge(type: string){
    switch(type){
     case "mainNet"://mainNet
      this.curBridge = this.mainBridge;
      console.log("===this.curBridge===",this.curBridge)
     break;
     case "testNet"://testNet
       this.curBridge = this.testBridge;
       console.log("===this.curBridge===",this.curBridge)
       break;
    }
  }

  async getWeb3(){

    // if (typeof this.web3 !== 'undefined') {
    //    this.web3 = new Web3(this.web3.currentProvider);
    // }else {
      let options = {
        agent: {

        }
    };
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.curBridge,options));
    // }
    return this.web3;
  }

  async getTokeninfo(){
    await this.getWeb3();
    if(this.tokenId===""){
        return;
    }
    let stickerAddr = "";
    if(this.curNetWork === "testNet"){
       stickerAddr = this.STICKER_TEST_ADDRESS;
    }else{
       stickerAddr = this.STICKER_ADDRESS;
    }

    const stickerContract = new this.web3.eth.Contract(this.stickerABI,stickerAddr);

    let tokenInfo =  await stickerContract.methods.tokenInfo(this.tokenId).call();
    this.jsonUri = tokenInfo[3];
    this.tokenContent = JSON.stringify(tokenInfo);
  }

  async getOrderinfo(){
    await this.getWeb3();
    if(this.tokenId===""){
        return;
    }
    let pasarAddr = "";
    if(this.curNetWork === "testNet"){
       pasarAddr = this.PASAR_TEST_ADDRESS;
    }else{
      pasarAddr = this.PASAR_ADDRESS;
    }

    const pasarContract = new this.web3.eth.Contract(this.pasarABI,pasarAddr);

    let tokenInfo =  await pasarContract.methods.getOrderById(this.tokenId).call();
    this.jsonUri = tokenInfo[3];
    this.tokenContent = JSON.stringify(tokenInfo);
  }

  async getBalance(){
    await this.getWeb3();
    if(this.tokenId===""){
        return;
    }

    const balance = await new this.web3.eth.getBalance(this.tokenId);
    this.tokenContent = JSON.stringify(balance);
  }


  checkJsonUri(){
    let baseUrl:string = "";
    if(this.curNetWork === "testNet"){
      baseUrl = this.IPFS_TEST_SERVER;
    }else{
      baseUrl = this.IPFS_SERVER;
    }
    baseUrl = baseUrl+"ipfs/"+this.jsonUri.replace("feeds:json:","");
    window.open(baseUrl, "_blank");
  }

 async getNotSaleCount(){
    await this.getWeb3();
    if(this.tokenId===""){
        return;
    }
    let stickerAddr = "";
    if(this.curNetWork === "testNet"){
       stickerAddr = this.STICKER_TEST_ADDRESS;
    }else{
       stickerAddr = this.STICKER_ADDRESS;
    }

    const stickerContract = new this.web3.eth.Contract(this.stickerABI,stickerAddr);

    let tokenInfo =  await stickerContract.methods.tokenCountOfOwner(this.tokenId).call();
    this.notSale = parseInt(tokenInfo)
    let arr = {};

    for(let index = 0;index<this.notSale;index++){
      let tokenId = await stickerContract.methods.tokenIdOfOwnerByIndex(this.tokenId,index).call();
      let tokenInfo = await await stickerContract.methods.tokenInfo(tokenId).call();
      arr[index] = tokenInfo;
    }

    this.tokenContent = JSON.stringify(arr);
  }

async getSaleCount(){
    await this.getWeb3();
    if(this.tokenId===""){
        return;
    }
    let pasarAddr = "";
    if(this.curNetWork === "testNet"){
       pasarAddr = this.PASAR_TEST_ADDRESS;
    }else{
       pasarAddr = this.PASAR_ADDRESS;
    }

    const pasarContract = new this.web3.eth.Contract(this.pasarABI,pasarAddr);

    let tokenInfo =  await pasarContract.methods.getSellerByAddr(this.tokenId).call();
    this.saleCount = parseInt(tokenInfo[3]);
    let arr = {};
    for (let index = 0; index < this.saleCount; index++) {
      try {
        const item = await pasarContract.methods.getSellerOpenByIndex(this.tokenId, index).call();
        arr[index] = item;
      } catch (error) {
        console.error("Get Sale item error", error);
      }
    }
    this.tokenContent = JSON.stringify(arr);
  }

 async getOpenOrderCount(){
    await this.getWeb3();

    let pasarAddr = "";
    if(this.curNetWork === "testNet"){
       pasarAddr = this.PASAR_TEST_ADDRESS;
    }else{
       pasarAddr = this.PASAR_ADDRESS;
    }

    const pasarContract = new this.web3.eth.Contract(this.pasarABI,pasarAddr);

    let tokenInfo =  await pasarContract.methods.getOpenOrderCount().call();

    this.tokenContent = JSON.stringify(tokenInfo);
  }

  async getActivePanelCount(){
    await this.getWeb3();

    let galleriaAddr = "";
    if(this.curNetWork === "testNet"){
      galleriaAddr = this.GALLERIA_TEST_ADDRESS;
    }else{
      galleriaAddr = this.GALLERIA_ADDRESS;
    }

    const galleriaContract = new this.web3.eth.Contract(this.galleriaABI,galleriaAddr);

    let tokenInfo =  await galleriaContract.methods.getActivePanelCount().call();

    this.tokenContent = JSON.stringify(tokenInfo);
  }

  async getAllActivePanel(){
    await this.getWeb3();

    let galleriaAddr = "";
    if(this.curNetWork === "testNet"){
      galleriaAddr = this.GALLERIA_TEST_ADDRESS;
    }else{
      galleriaAddr = this.GALLERIA_ADDRESS;
    }

    const galleriaContract = new this.web3.eth.Contract(this.galleriaABI,galleriaAddr);

    let tokenInfo =  await galleriaContract.methods.getActivePanelCount().call();
    this.activeCount = parseInt(tokenInfo)
    let arr = {};
    for (let index = 0; index < this.activeCount; index++) {
      try {
        const item = await galleriaContract.methods.getActivePanelByIndex(index).call();
        arr[index] = item;
      } catch (error) {
        console.error("Get Sale item error", error);
      }
    }
    this.tokenContent = JSON.stringify(arr);
  }
}
