import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import BigNumber from 'bignumber.js';
import Web3 from "web3";
import { Claims, DIDDocument, JWTParserBuilder, JWT, DID, DIDURL, DIDBackend, DefaultDIDAdapter, JSONObject, VerifiableCredential, VerifiablePresentation, JWTHeader } from '@elastosfoundation/did-js-sdk';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

//Channel Registry proxy contract deployed to: 0xc76E72deE2021cc51b094AfcD1e7010c74037bcB
//Channel Registry logic contract deployed to: 0xbfD859e5f5bFE659417cBb66d04f24294ddd1Ef3
export class Tab1Page {

  private totalNum: number = 7;
  private startIndex: number = 0;
  private endIndex: number = 0;
  private pageSize: number = 8;


  public tokenContent: string = "";
  public stickerABI: string = "";
  public galleriaABI: string = "";
  public diamondABI: string = "";
  public metABI: string = "";
  public channelRegistryABI: string = '';
  public channelTippingPaymentABI: string = '';
  private web3:any;
  public curNetWork: string = "mainNet";
  private testBridge: string = "https://api-testnet.elastos.io/eth";
  private mainBridge: string = "https://api.elastos.io/eth";
  private curBridge: string = "";


    /** MainNet contract */
  public DIAMONd_ADDRESS: string = '0x2C8010Ae4121212F836032973919E8AeC9AEaEE5';
  public STICKER_ADDRESS: string = '0x020c7303664bc88ae92cE3D380BF361E03B78B81';
  public PASAR_ADDRESS: string = '0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0';
  public GALLERIA_ADDRESS: string = '0xE91F413953A82E15B92Ffb93818d8a7b87C3939B';
  public CHANNEL_REGISTRY_ADDRESS: string = '';
  public CHANNEL_TIPPING_PAYMENT_ADDRESS: string = '';
  /** TestNet contract */
  public  DIAMONd_TEST_ADDRESS: string = '';
  public  STICKER_TEST_ADDRESS: string = '0xed1978c53731997f4DAfBA47C9b07957Ef6F3961';
  public  PASAR_TEST_ADDRESS: string = '0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087';
  public  GALLERIA_TEST_ADDRESS: string = '0x8b3c7Fc42d0501e0367d29426421D950f45F5041';
  public  MET_TEST_ADDRESS: string = '0x15319c02e6f6b4FcB90b465c135c63dc84B9afFC'
  public  CHANNEL_REGISTRY_TEST_ADDRESS: string = '0x38D3fE3C53698fa836Ba0c1e1DD8b1d8584127A7';//test
  public  CHANNEL_TIPPING_PAYMENT_TEST_ADDRESS: string = '0x2Aa04F7F470350036812F50a5067Ab835EB1a7dE';//test

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

  public channel = {name:null};

  constructor(public loadingController: LoadingController) {

  }

  ngOnInit() {
    this.stickerABI = require("../../assets/contracts/stickerABI.json");
    this.pasarABI = require("../../assets/contracts/pasarABI.json");
    this.galleriaABI = require("../../assets/contracts/galleriaABI.json");
    this.diamondABI = require("../../assets/contracts/diamond.json");
    this.metABI = require("../../assets/contracts/metABI.json");
    this.channelRegistryABI = require("../../assets/contracts/channelRegistryABI.json");
    this.channelTippingPaymentABI = require("../../assets/contracts/channelTippingPaymentABI.json");
    this.handleContracts(this.curNetWork);
    const currentNet = "MainNet".toLowerCase();
    DIDBackend.initialize(new DefaultDIDAdapter(currentNet))
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
    let balance1 = this.web3.utils.fromWei(balance, 'ether');
    this.tokenContent = JSON.stringify(balance1);
  }


  checkJsonUri(){
    let baseUrl:string = "";
    if(this.curNetWork === "testNet"){
      baseUrl = this.IPFS_TEST_SERVER;
    }else{
      baseUrl = this.IPFS_SERVER;
    }
    baseUrl = baseUrl+"ipfs/"+this.tokenId.replace("feeds:json:","").replace("meteast:json:","");
    console.log("============",)
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

  async getPanelById(){
    if(this.tokenId===""){
      return;
    }
    await this.getWeb3();

    let galleriaAddr = "";
    if(this.curNetWork === "testNet"){
      galleriaAddr = this.GALLERIA_TEST_ADDRESS;
    }else{
      galleriaAddr = this.GALLERIA_ADDRESS;
    }

    const galleriaContract = new this.web3.eth.Contract(this.galleriaABI,galleriaAddr);

    let tokenInfo =  await galleriaContract.methods.getPanelById(this.tokenId).call();

    this.tokenContent = JSON.stringify(tokenInfo);

  }

  async getTokenAddress(){
    await this.getWeb3();

    let galleriaAddr = "";
    if(this.curNetWork === "testNet"){
      galleriaAddr = this.GALLERIA_TEST_ADDRESS;
    }else{
      galleriaAddr = this.GALLERIA_ADDRESS;
    }
    const galleriaContract = new this.web3.eth.Contract(this.galleriaABI,galleriaAddr);
    const info = await galleriaContract.methods.getTokenAddress().call();
    this.tokenContent = info;

  }


  hex2dec(){
    if(this.tokenId===""){
      return;
    }
    let dec = new BigNumber(this.tokenId);
    let decStr = dec.toFormat({prefix:""});
    this.tokenContent = JSON.stringify(decStr);
  }

  hex2dec1(){
    if(this.tokenId===""){
      return;
    }
    let decStr = this.dec2hex();
    this.tokenContent = JSON.stringify(decStr);
  }

  dec2hex(){
    let dec:any = this.tokenId.toString().split('') || [],
    sum = [],
    hex = [],
    i:any,
    s:any
    while(dec.length){
        s = 1 * dec.shift();
        for(i = 0; s || i < sum.length; i++){
            s += (sum[i] || 0) * 10
            sum[i] = s % 16
            s = (s - sum[i]) / 16
        }
    }
    while(sum.length){
        hex.push(sum.pop().toString(16))
    }
    return hex.join('')
  }

 async getDiaBalance(){
    await this.getWeb3();
    let diamondAddr = "";
    if(this.curNetWork === "testNet"){
      diamondAddr = this.DIAMONd_TEST_ADDRESS;
    }else{
      diamondAddr =  this.DIAMONd_ADDRESS;
    }
    const diamondContract = new this.web3.eth.Contract(this.diamondABI,diamondAddr);

    const info = await diamondContract.methods.balanceOf(this.tokenId).call();
    let balance = this.web3.utils.fromWei(info, 'ether');
    this.tokenContent = JSON.stringify(balance);

  }

 async getGFeeParams(){
    await this.getWeb3();
    let galleriaAddr = "";
    if(this.curNetWork === "testNet"){
      galleriaAddr = this.GALLERIA_TEST_ADDRESS;
    }else{
      galleriaAddr = this.GALLERIA_ADDRESS;
    }
    const galleriaContract = new this.web3.eth.Contract(this.galleriaABI,galleriaAddr);
    const info = await galleriaContract.methods.getFeeParams().call();
    this.tokenContent = JSON.stringify(info);
  }

  async getPFeeParams(){
    await this.getWeb3();
    let galleriaAddr = "";
    if(this.curNetWork === "testNet"){
      galleriaAddr = this.PASAR_TEST_ADDRESS;
    }else{
      galleriaAddr = this.PASAR_ADDRESS;
    }
    const galleriaContract = new this.web3.eth.Contract(this.pasarABI,galleriaAddr);
    const info = await galleriaContract.methods.getPlatformFee().call();
    this.tokenContent = JSON.stringify(info);
  }

  async getMetTokenInfo(){
    await this.getWeb3();
    if(this.tokenId===""){
        return;
    }
    let metAddr = "";
    if(this.curNetWork === "testNet"){
       metAddr = this.MET_TEST_ADDRESS;
    }else{
       metAddr = this.STICKER_ADDRESS;
    }

    const metContract = new this.web3.eth.Contract(this.metABI,metAddr);

    let tokenInfo =  await metContract.methods.tokenInfo(this.tokenId).call();
    this.jsonUri = tokenInfo[3];
    this.tokenContent = JSON.stringify(tokenInfo);
  }

  // async channelPlatformAddress() {
  //   await this.getWeb3();
  //   let channelRegistryAddr = "";
  //   if(this.curNetWork === "testNet"){
  //     channelRegistryAddr = this.CHANNEL_REGISTRY_TEST_ADDRESS;
  //   }else{
  //     channelRegistryAddr = this.CHANNEL_REGISTRY_ADDRESS;
  //   }
  //   const channelRegistryContract = new this.web3.eth.Contract(this.channelRegistryABI,channelRegistryAddr);
  //   const info = await channelRegistryContract.methods.platformAddress().call();
  //   this.tokenContent = info;
  // }

  async channelInfo() {
    await this.getWeb3();
    if(this.tokenId===""){
      return;
    }
    let channelRegistryAddr = "";
    if(this.curNetWork === "testNet"){
      channelRegistryAddr = this.CHANNEL_REGISTRY_TEST_ADDRESS;
    }else{
      channelRegistryAddr = this.CHANNEL_REGISTRY_ADDRESS;
    }
    const channelRegistryContract = new this.web3.eth.Contract(this.channelRegistryABI,channelRegistryAddr);
    const info = await channelRegistryContract.methods.channelInfo(this.tokenId).call();
    this.tokenContent = JSON.stringify(info);
  }

  async totalSupply() {
    console.log("====info====0");
    await this.getWeb3();
    // if(this.tokenId===""){
    //   return;
    // }
    let channelRegistryAddr = "";
    if(this.curNetWork === "testNet"){
      channelRegistryAddr = this.CHANNEL_REGISTRY_TEST_ADDRESS;
    }else{
      channelRegistryAddr = this.CHANNEL_REGISTRY_ADDRESS;
    }
    const channelRegistryContract = new this.web3.eth.Contract(this.channelRegistryABI,channelRegistryAddr);
    try {
      let arr = [];
      const info = await channelRegistryContract.methods.totalSupply().call();
      console.log("====info1111====",info);
      for(let index=0;index<info;index++){
        let info = await channelRegistryContract.methods.channelByIndex(index).call();
        let tokenId = info[0];
        let tokenUri = info[1];
        let channelEntry = info[2];
        let receiptAddr = info[3];
        let ownerAddr = info[4];

        let obj = {
          tokenId : tokenId,
          tokenUri: tokenUri,
          channelEntry: channelEntry,
          receiptAddr: receiptAddr,
          ownerAddr: ownerAddr
        }

        arr.push(obj);
      }
      this.tokenContent = arr.length+"-'"+JSON.stringify(arr);
    } catch (error) {
      console.log("====error====",error);
    }

  }

  async channelByIndex() {
    await this.getWeb3();
    if(this.tokenId===""){
      return;
    }
    let channelRegistryAddr = "";
    if(this.curNetWork === "testNet"){
      channelRegistryAddr = this.CHANNEL_REGISTRY_TEST_ADDRESS;
    }else{
      channelRegistryAddr = this.CHANNEL_REGISTRY_ADDRESS;
    }
    const channelRegistryContract = new this.web3.eth.Contract(this.channelRegistryABI,channelRegistryAddr);
    const info = await channelRegistryContract.methods.channelByIndex(this.tokenId).call();
    this.tokenContent = JSON.stringify(info);
  }

  testname(name: string){
    console.log("====testname=====",name);
  }

  verify(didString: string, signature: string): Promise<DIDDocument> {
    return new Promise(async (resolve, reject) => {
      try {
        const userDID = DID.from(didString)
        const userDIDDocument = await userDID.resolve();
        console.log('=======',userDIDDocument);
        let test = userDIDDocument.verify(null,signature,Buffer.from("feeds://v3/did:elastos:imvtYH4rwwagzasT91Yu3GW239rqV6dpx7/51e46415cdb9e0afe0229125644df61160fb64ca8d31f6969dd0939a0bf24bfa"));
        console.log("======test======",test);
        resolve(userDIDDocument);
      } catch (error) {
        reject(error);
      }
    });
  }

  test1(){
    this.verify('did:elastos:ioUyXVxTkZmJYGa5sWUzAfb8khDQc5zKT3','UDHXrYfQFZPb_RQMEG0KBv5MMHd-3XVr4DmDB1eMAMaOzOcO4e90EUelcGTjZXz523fvKtRqbYAgyZzRQW2fog');
    if(this.totalNum <= this.pageSize){
      this.endIndex = this.totalNum - 1;
      this.startIndex = 0;
    }else{
      this.endIndex = this.totalNum - 1;
      this.startIndex = this.totalNum - this.pageSize;
    }
    console.log("========",this.startIndex,this.endIndex);
    for(let index = this.endIndex; index >= this.startIndex;index--){
     console.log("=====index======",index);
    }
  }

  test2() {
    if(this.startIndex === 0){
      return;
    }
    this.endIndex = this.startIndex - 1;
    if(this.startIndex - this.pageSize < 0){
      this.startIndex = 0;
    }else{
      this.startIndex = this.startIndex - this.pageSize;
    }
    console.log("========",this.startIndex,this.endIndex);
    for(let index = this.endIndex; index >= this.startIndex;index--){
     console.log("=====index======",index);
    }
  }

  async getTipPlatformFee() {
    await this.getWeb3();
    let channelTippingPaymentAddr = "";
    if(this.curNetWork === "testNet"){
      channelTippingPaymentAddr = this.CHANNEL_TIPPING_PAYMENT_TEST_ADDRESS;
    }else{
      channelTippingPaymentAddr = this.CHANNEL_TIPPING_PAYMENT_ADDRESS;
    }

    const channelTippingPaymentContract = new this.web3.eth.Contract(this.channelTippingPaymentABI,channelTippingPaymentAddr);
    const info = await channelTippingPaymentContract.methods.getPlatformFee().call();
    console.log(info);
    this.tokenContent = JSON.stringify(info);
  }


  async tippingCount() {

    await this.getWeb3();
    let channelTippingPaymentAddr = "";
    if(this.curNetWork === "testNet"){
      channelTippingPaymentAddr = this.CHANNEL_TIPPING_PAYMENT_TEST_ADDRESS;
    }else{
      channelTippingPaymentAddr = this.CHANNEL_TIPPING_PAYMENT_ADDRESS;
    }

    const channelTippingPaymentContract = new this.web3.eth.Contract(this.channelTippingPaymentABI,channelTippingPaymentAddr);
    const info = await channelTippingPaymentContract.methods.tippingCount().call();
    console.log(info);
    let arr = [];
    for(let index=0;index<info;index++){
      let info = await channelTippingPaymentContract.methods.tippingItem(index).call();
      let channelId = info[0];
      let postId = info[1];
      let paidFrom = info[2];
      let paidTo = info[3];
      let paidToken = info[4];
      let amount = this.web3.utils.fromWei(info[5],'ether');
      let sendUri = info[6];
      let memo = info[7];

      let obj = {
        channelId : channelId,
        postId: postId,
        paidFrom: paidFrom,
        paidTo: paidTo,
        paidToken : paidToken,
        amount: amount,
        sendUri:sendUri,
        memo: memo
      }
      arr.push(obj);
    }
    this.tokenContent = arr.length+"-'"+JSON.stringify(arr);
  }

}
