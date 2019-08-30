class puke {
  init(){
    let huas=['♠','♥','♣','◆']
    let ps={}
    for(let hua=0;hua<4;hua++){
      for(let num=1;num<=10;num++){
        let id=huas[hua]+num
        ps[id]={
          id:id,
          hua:hua,
          num:num,
          status:0,
        }
      }
    }
    this.ps=ps
  }
  fapai(){
    let ps=[]
    Object.keys(this.ps).forEach(id=>{
      if(this.ps[id].status==0){
        ps.push(this.ps[id])
      }
    })
    let pi=parseInt(Math.random()*ps.length);
    let p=ps[pi]
    this.ps[p.id].status=1
    return p
  }
  hasFapai(pnum){
    let pn=0;
    Object.keys(this.ps).forEach(id=>{
      if(this.ps[id].status==0){
        pn++
      }
    })
    if(pn>=pnum) return true
    return false
  }
}
class duizi{
  history=[]
  selPeopleNum(num){
    let people={}
    for(let i=0;i<num;i++){
      let id='p'+i
      people[id]={
        id:id,
        pk:i==0,
        money:i==0?100:0,//奖金、奖池
        stake:10,//押注
        resFlag:'',//单次pk标识
        resMoney:0,//单次结算
        moneyPow:100,//锅
        moneyMax:1000//靠岸
      }
    }
    this.peopleNum=num
    this.people=people
    this.puke=new puke()
    this.puke.init()
  }
  fapai(){
    if(!this.puke.hasFapai(this.peopleNum*2)){
      this.puke.init()
    }
    Object.keys(this.people).forEach(pid=>{
      this.people[pid]['pi']=[
        this.puke.fapai(),
        this.puke.fapai()
      ]
    })
  }
  _pk(zhuang,xian){
    if(this.people[zhuang].money<=0) return
    this.people[zhuang].hasPochan=false
    let zp=this.people[zhuang]['pi']
    let xp=this.people[xian]['pi']
    let vflag=true//庄胜利
    let vb=1//赔率
    if(zp[0].num==zp[1].num || xp[0].num==xp[1].num){//有对子
      if(zp[0].num==zp[1].num && xp[0].num==xp[1].num){
        if(xp[1].num>zp[1].num){
          vflag=false
          vb=2
        }else{
          vflag=true
          vb=1
        }
      }else if(xp[0].num==xp[1].num){
        vflag=false
        vb=2
      }else{
        vflag=true
        vb=1
      }
    }else{//没有对子
      let zn=(zp[0].num+zp[1].num)%10
      let xn=(xp[0].num+xp[1].num)%10
      if(xn>zn){
        vflag=false
        vb=1
      }else{
        vflag=true
        vb=1
      }
    }
    this.people[zhuang].resFlag=vflag
    this.people[xian].resFlag=!vflag
    if(vflag){
      this.people[zhuang].resMoney+=this.people[xian].stake
      this.people[zhuang].money+=this.people[xian].stake

      this.people[xian].money-=this.people[xian].stake
      //console.log(zhuang+' vs '+xian,zhuang+'胜',this.people[xian].stake)
    }else{
      let money=this.people[xian].stake*vb
      money=money<=this.people[zhuang].money?money:this.people[zhuang].money;
      this.people[xian].resMoney+=money
      this.people[xian].money+=money

      this.people[zhuang].money-=money
      //console.log(zhuang+' vs '+xian,xian+'胜',money)
    }
    if(this.people[zhuang].money<=0){
      this.people[zhuang].hasPochan=true
    }
  }
  pk(){
    let fp=parseInt(Math.random()*this.peopleNum);
    fp=fp>0?fp:1
    let ps=[]
    let hasFp=false
    Object.keys(this.people).forEach(pid=>{
      if(this.people[pid].pk) return;
      if(pid=='p'+fp){
        hasFp=true
      }
      if(hasFp){
        this.people[pid].order=ps.length
        ps.push(this.people[pid])
      }
    })
    Object.keys(this.people).forEach(pid=>{
      if(this.people[pid].pk) return;
      if(pid=='p'+fp){
        hasFp=false
      }
      if(hasFp){
        this.people[pid].order=ps.length
        ps.push(this.people[pid])
      }
    })
    ps.forEach(p=>{
      this._pk('p0',p.id)
    })
  }
  yazhu(){
    this.people['p1'].stakeInfo='杀一半'
    this.people['p1'].stake=parseInt(this.people['p0'].money/2)

    this.people['p2'].stakeInfo='全杀'
    this.people['p2'].stake=this.people['p0'].money

    this.people['p3'].stakeInfo='压10输2轮杀一半'
    this.people['p3'].stake=this.getPeopleStake3()

    this.people['p4'].stakeInfo='压20输3轮杀3/4'
    this.people['p4'].stake=this.getPeopleStake4()
  }
  getPeopleStake3(){
    if(this.history.length<2) return 10
    if(!this.history[0].p3.resFlag && !this.history[1].p3.resFlag){
      return parseInt(this.people['p0'].money/2)
    }
    return 10;
  }
  getPeopleStake4(){
    if(this.history.length<3) return 20
    if(!this.history[0].p3.resFlag
      && !this.history[1].p3.resFlag
      && !this.history[2].p3.resFlag){
      return parseInt(this.people['p0'].money*(3/4))
    }
    return 20;
  }
  kaoan(){
    if(this.people['p0'].money>this.people['p0'].moneyMax){
      this.people['p0'].hasKaoan=true
    }
  }
  record(){
    let ps={}
    this.history.forEach((row,index)=>{
      if(row.p0.hasPochan || row.p0.hasKaoan){
        Object.keys(row).forEach((pid)=>{
          let p=row[pid];
          if(index==0){
            ps[pid]={
              money:(pid=='p0')?p.money-p.moneyPow:p.money
            }
          }else{
            ps[pid].money+=((pid=='p0')?p.money-p.moneyPow:p.money)
          }
        })
      }
    })
    console.log(JSON.stringify(ps))
    return ps;
  }
  play(){
    this.fapai();
    this.yazhu();
    this.pk();
    this.kaoan();
    this.history.unshift(JSON.parse(JSON.stringify(this.people)))
  }
}
export default new duizi()