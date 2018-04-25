/**此对象为ajax请求类，全局唯一，每次调用前需要初始化相关参数，url默认已经添加,不需要重复设置*/
var ajaxEx = {
    v: {
        timeout: 60000,//请求超时设置
        method: 'GET',//请求方式
        url: '',//请求服务地址
        successCallBack: null,//回调至少包含一个参数
        failureCallBack: null,//回调至少包含一个参数
        params: null//采用json对象的方式组织参数，如 ajaxEx.v.params = {action: 'query',name: '北京'};
    },
    fn: {
        showMask: function (target, msg) {
            var mask = new Ext.LoadMask(target, {
                msg: msg,
                removeMask: true
            });
            mask.show();
            return mask;
        },
        hideMask: function (mask) {
            if (mask) {
                mask.hide();
                mask = null;
            }
        },
        //默认多实例执行（推荐）
        execute: function (params, method, url, successcallback, failurecallback) {
            if (params === null || params === undefined) {
                params = {};
            }
            //追加时间戳
            params['timeStamp'] = Ext.Date.now();

            Ext.Ajax.setTimeout(ajaxEx.v.timeout);
            Ext.Ajax.async = true;
            Ext.Ajax.cors = true;
            Ext.Ajax.request({
                method: method || ajaxEx.v.method,
                url: url || ajaxEx.v.url,
                success: function (response, opts) {
                    if (successcallback)
                        successcallback(response, opts);
                },
                failure: function (response, opts) {
                    if (failurecallback)
                        failurecallback(response, opts);
                },
                params: params
            });
        },
        //单一实例执行(不推荐)
        singleExecute: function () {
            if (ajaxEx.v.params == null) {
                ajaxEx.v.params = {};
            }
            //追加时间戳
            ajaxEx.v.params['timeStamp'] = Ext.Date.now();

            Ext.Ajax.setTimeout(ajaxEx.v.timeout);
            Ext.Ajax.async = true;
            Ext.Ajax.cors = true;
            Ext.Ajax.request({
                method: ajaxEx.v.method,
                url: ajaxEx.v.url,
                success: function (response, opts) {
                    ajaxEx.v.successCallBack(response, opts);
                },
                failure: function (response, opts) {
                    ajaxEx.v.failureCallBack(response, opts);
                },
                params: ajaxEx.v.params
                /*params: {
                    requestData: encodeURI(Ext.JSON.encode(ajaxEx.v.params)),
                    timeStamp: Ext.Date.now()
                }*/
            });
        }
    }
}

/**
 * 定义集成打包
 */
Ext.define('jxxc.utils.AjaxUtil', {});

//-------------------多实例模式调用示例-----------------------------------
//请查看GlobalController.js中关于模块信息获取相关代码。

//--------------------单例模式调用示例------------------------------------------------------
/*ajaxEx.v.method = 'GET';
ajaxEx.v.url = 'API地址';
ajaxEx.v.params = {};
ajaxEx.v.successCallBack = function (response, opts) {
    //查询结果转json对象
    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

};
ajaxEx.v.failureCallBack = function (response, opts) {
};
ajaxEx.fn.execute();*/

