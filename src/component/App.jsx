import React from 'react';
import '../style/App.css';
import { Input, Button, Checkbox, Divider} from 'antd';
import 'antd/dist/antd.css';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      InputValue : "",
      flag: false,
      contentValue: '',
      data: localStorage.getItem("LocalData") ? JSON.parse(localStorage.getItem("LocalData")) :  []
    };
    this.add = this.add.bind(this);
    this.all = this.all.bind(this);
    this.finish = this.finish.bind(this);
    this.unfinish = this.unfinish.bind(this);
    this.inputChang = this.inputChang.bind(this);
    this.contentChang = this.contentChang.bind(this);
  }
  
  //添加待办
  add () {
    if (this.state.InputValue) {
      this.state.data.push({
        content: this.state.InputValue, flag:false, upFlag:false
      });
    }
    localStorage.setItem("LocalData", JSON.stringify(this.state.data));
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    })
  }
  //获取输入框内容
  inputChang (e) {
    this.setState({
      InputValue : e.target.value,
    })
  }

  //删除
  del (key) {
    let arr = JSON.parse(localStorage.getItem("LocalData"));
    arr.splice(key,1);
    localStorage.setItem("LocalData", JSON.stringify(arr));
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    })
  }

  //勾选
  onHandleChange (key, e) {
    let arr = JSON.parse(localStorage.getItem("LocalData"));
    arr[key].flag = e.target.checked;
    localStorage.setItem("LocalData", JSON.stringify(arr));
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    });
  };
  all () {
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    });
    let allStyle = document.getElementById("all");
    allStyle.style.backgroundColor = "#fff";
    allStyle.style.color = '#1890ff';
    let finishStyle = document.getElementById("finish");
    finishStyle.style.backgroundColor = "#1890ff";
    finishStyle.style.color = '#fff';
    let unfinishStyle = document.getElementById("unfinish");
    unfinishStyle.style.backgroundColor = "#1890ff";
    unfinishStyle.style.color = '#fff';
  };

  //封装调用
  req(flag) {
    let arr = JSON.parse(localStorage.getItem("LocalData"));
    let newarr = [];
    
    arr.map((item)=>{
      if (item.flag === flag) {
        newarr.push(item);
      } 
    });
    this.setState({
      data: newarr
    });
  }

  //已完成
  finish () {
    this.req(true);
    let allStyle = document.getElementById("all");
    allStyle.style.backgroundColor = "#1890ff";
    allStyle.style.color = '#fff';
    let finishStyle = document.getElementById("finish");
    finishStyle.style.backgroundColor = "#fff";
    finishStyle.style.color = '#1890ff';
    let unfinishStyle = document.getElementById("unfinish");
    unfinishStyle.style.backgroundColor = "#1890ff";
    unfinishStyle.style.color = '#fff';
  };
  //未完成
  unfinish () {
    this.req(false);
    let allStyle = document.getElementById("all");
    allStyle.style.backgroundColor = "#1890ff";
    allStyle.style.color = '#fff';
    let finishStyle = document.getElementById("finish");
    finishStyle.style.backgroundColor = "#1890ff";
    finishStyle.style.color = '#fff';
    let unfinishStyle = document.getElementById("unfinish");
    unfinishStyle.style.backgroundColor = "#fff";
    unfinishStyle.style.color = '#1890ff';
  };

  updat (key) {
    let arr = JSON.parse(localStorage.getItem("LocalData"));
    arr[key].upFlag = true;
    localStorage.setItem("LocalData", JSON.stringify(arr));
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    })
  }
  cancel (key) {
    let arr = JSON.parse(localStorage.getItem("LocalData"));
    arr[key].upFlag = false;
    localStorage.setItem("LocalData", JSON.stringify(arr));
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    })
  }
  contentChang (e) {
    this.setState({
      contentValue : e.target.value,
    });
  }
  confirm (key) {
    let arr = JSON.parse(localStorage.getItem("LocalData"));
    arr[key].content = this.state.contentValue;
    arr[key].upFlag = false;
    localStorage.setItem("LocalData", JSON.stringify(arr));
    this.setState({
      data: JSON.parse(localStorage.getItem("LocalData")) 
    })
  }
  render () {
    return (
      <div className="App">
        <Input 
          placeholder="请输入待办事件"
          value={this.state.InputValue} 
          onChange={ this.inputChang } />
        <Button type="primary" onClick={ this.add } >添加</Button>
        <div className='btn-contain'>
          <Button id='all' type="primary" onClick={ this.all }  >全部</Button>
          <Button id='finish' type="primary" onClick={ this.finish }  >已完成</Button>
          <Button id='unfinish' type="primary" onClick={ this.unfinish}  >未完成</Button>
        </div>
        <ul>
        {
          this.state.data.map((item,key)=>{
            return(
              <li key={ key }>
                <Checkbox checked = {this.state.data ? this.state.data[key].flag : false}  onChange={ e => {this.onHandleChange(key, e)} } />
                <div className='content'>
                  {
                    item.upFlag 
                    ?
                    <Input value={ this.state.contentValue||item.content } onChange={ this.contentChang }  className='updatInput' />
                    :
                    <span>{ item.content }</span>
                  }
                </div>
                  { item.flag 
                  ? 
                    <span className="finish">
                      已完成 
                    </span> 
                  : 
                    <span className="unfinish">
                      未完成 
                    </span> 
                  }
                  { item.upFlag 
                  ?  
                    <Button className="sumit"  type="primary" onClick= { () => { this.confirm(key) } } style={ {color:'#fff', margin: '0 1% 0 1%'}} >确认</Button>
                  : 
                    <span className="del" onClick= { () => { this.del(key) } }  >删除</span>
                  }
                <Divider type="vertical" />
                  { item.upFlag 
                  ? 
                    <Button className="cancel"  style={ { margin: '0 1% 0 1%'}} onClick= { () => { this.cancel(key) } } >取消</Button>
                  : 
                    <span className="updat" onClick= { () => { this.updat(key) } }>修改</span>
                  }
              </li>
            );
          })
        }
        </ul>
      </div>
    );
  }
}

export default App;
