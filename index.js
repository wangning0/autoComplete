var $ = function(id) {
    return document.getElementById(id);
}
/**
 * param1   输入框dom id
 * param2   自动显示dom id
 * param3   自动补全数据集
 */

var AutoComplete = function(inputId, autoId, arr )  {
    this.inputDOM = $(inputId);
    this.autoDOM = $(autoId);
    this.index = -1;
    this.arr = arr;
    this.searchText = '';
}

AutoComplete.prototype = {
    // 初始化位置
    init: function() {
        this.autoDOM.style.left = this.inputDOM.offsetLeft + 'px';
        this.autoDOM.style.top = this.inputDOM.offsetTop + this.inputDOM.offsetWidth + 'px';
        this.autoDOM.style.width = this.inputDOM.offsetWidth - 2 + 'px';
    },
    deleteDiv: function() {
        while(this.autoDOM.hasChildNodes()) {
            var firstChild = this.autoDOM.firstChild;
            this.autoDOM.removeChild(firstChild);
        }
        this.autoDOM.className = 'auto_hidden';
    },
    mouseover: function(_this, _div_index) {
        return function() {
            _this.index = _div_index;
            var length = _this.autoDOM.children.length;
            for(var j = 0; j < length; j++) {
                if(j != _div_index) {
                    _this.autoDOM.childNodes[j].className = 'auto_onmouseout';
                } else {
                     _this.autoDOM.childNodes[j].className = 'auto_onmouseover';
                }
            }
        }
    },
    setValue: function(_this) {
        return function() {
            _this.inputDOM.value = this.qText;
            _this.autoDOM.className = 'auto_hidden';
        }
    },
    changeClassname: function(length) {
        for(var i = 0; i < length; i++) {
            if(i != this.index) {
                this.autoDOM.childNodes[i].className = 'auto_onmouseout';
            } else {
                this.autoDOM.childNodes[i].className = 'auto_onmouseover';
                this.inputDOM.value = this.autoDOM.childNodes[i].qText;
            }
        }
    },
    pressKey: function(event) {
        var length = this.autoDOM.children.length;
        // 按下键
        if(event.keyCode == 40) {
            ++this.index;
            if(this.index >= length) {
                this.index = 0;
            }
            this.changeClassname(length);
        // 按上键
        } else if(event.keyCode == 38) {
            this.index--;
            if(this.index <= -1) {
                this.index = length - 1;
            }
             this.changeClassname(length);
        } else if(event.keyCode == 13) {
            this.autoDOM.className = 'auto_hidden';
            this.index = -1;
        } else {
            this.index = -1;
        }
    },
    start: function(event) {
        if((event.keyCode != 13 && event.keyCode != 40 && event.keyCode != 38) || event.type == 'paste') {
            setTimeout((function() {
                //console.log(this.inputDOM.value)
                this.init();
                this.deleteDiv();
                this.searchText = this.inputDOM.value;
                var dataArr = this.arr;
                dataArr.sort();
                if(this.searchText == '') {
                    return;
                }
                try {
                    var reg = new RegExp("(" + this.inputDOM.value + ")");
                } catch (e) {
                    return;
                }
                var div_index = 0;
                for(var i = 0; i < dataArr.length; i++) {
                    if(reg.test(dataArr[i])) {
                        var div = document.createElement('div');
                        div.onmouseover = this.mouseover(this, div_index);
                        div.className = "auto_onmouseout";
                        div.qText = dataArr[i];
                        div.onclick = this.setValue(this);
                        div.innerHTML = dataArr[i];
                        this.autoDOM.appendChild(div);
                        this.autoDOM.className = 'auto_show';
                        div_index++;
                    }
                }
            }).bind(this), 0)
        }
        this.pressKey(event);
        window.onresize = (function() {
            this.init();
        }).bind(this);
    }
}
var arr = ['a0','a12', 'a11', 'a2', 'b0', 'b1', 'b2'];
var autoComplete = new AutoComplete('oInput', 'auto', arr);

document.getElementById('oInput').addEventListener('keyup', function(event) {
    autoComplete.start(event);
})
//onafterpaste
document.getElementById('oInput').addEventListener('paste', function(event) {
    autoComplete.start(event);
})