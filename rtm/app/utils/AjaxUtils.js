/**此对象为ajax请求类，全局唯一，每次调用前需要初始化相关参数，url默认已经添加,不需要重复设置*/
var ajax = {
    v: {
        timeout: 60000,//请求超时设置
        method: 'GET',//请求方式
        url: '',//请求服务地址
        successCallBack: null,//回调至少包含一个参数
        failureCallBack: null,//回调至少包含一个参数
        params: null//采用json对象的方式组织参数，如 ajax.v.params = {action: 'query',name: '北京'};
    },
    fn: {
        execute: function () {
            if (ajax.v.params == null) {
                ajax.v.params = {};
            }
            //追加时间戳
            ajax.v.params['timeStamp'] = Ext.Date.now();

            Ext.Ajax.setTimeout(ajax.v.timeout);
            Ext.Ajax.async = true;
            Ext.Ajax.cors = true;
            Ext.Ajax.request({
                method: ajax.v.method,
                url: ajax.v.url,
                success: function (response, opts) {
                    ajax.v.successCallBack(response, opts);
                },
                failure: function (response, opts) {
                    ajax.v.failureCallBack(response, opts);
                },
                params: ajax.v.params
                /*params: {
                    requestData: encodeURI(Ext.JSON.encode(ajax.v.params)),
                    timeStamp: Ext.Date.now()
                }*/
            });
        }
    }
}

/**
 * 定义集成打包
 */
Ext.define('rtm.utils.AjaxUtils', {});

//--------------------调用示例------------------------------------------------------
/*ajax.v.method = 'GET';
ajax.v.url = 'http://172.16.60.204:8080/monitor/monitor/getPerSecondFlow';
ajax.v.params = {};
ajax.v.successCallBack = function (response, opts) {
    //查询结果转json对象
    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

};
ajax.v.failureCallBack = function (response, opts) {
};
ajax.fn.execute();*/