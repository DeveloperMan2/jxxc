/**
 * Created by LBM on 2017/8/16.
 * 请求等待界面
 */
var common = {
    v: {
        loadMask: null
    },
    fn: {
        showMask: function (target, msg) {
            common.v.loadMask = new Ext.LoadMask(target, {
                msg: msg,
                removeMask: true
            });
            common.v.loadMask.show();
        },
        hideMask: function () {
            if (common.v.loadMask) {
                common.v.loadMask.hide();
            }
        },
        //系统启动相关,也可以用与模块切换提示
        addInitMask: function (text) {
            Ext.get('loading').show();
            Ext.get('loading-msg').dom.innerHTML = text;
            //Ext.defer(common.fn.removeInitMask, 1000);//在launch方法中执行清除mask逻辑。
        },
        removeInitMask: function () {
            var hideMask = function () {
                //Ext.get('loading').hide();
                Ext.get('loading').remove();
            }
            Ext.defer(hideMask, 200);
        }
    }
};
//common.fn.addInitMask('正在初始化系统,请稍候...');

Ext.define('jxxc.utils.CommonUtils', {});