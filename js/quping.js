/**
 * quping.js
 * --------------------------------------------------
 * @author 曲平 <admin@quping.com>
 * @copyright 尊耀汇公司及曲平个人所有
 * @description 尊耀汇前端项目开发库，含常用函数及流行框架扩展。
 * @requires qp <jQuery>
 * @requires qp.bs <Boostrap v3.3>
 * @requires qp.eu <EasyUI v1.5>
 * @version 1.0.0 build 20171218
 */

'use strict';

/** 类初始化
 * --------------------------------------------------
 * @class qp.cfg 配置参数
 * @class qp.bs Boostrap框架扩展
 * @class qp.dom 文档对象模型类
 * @class qp.eu EasyUI框架扩展
 * @class qp.json JSON格式数据类
 */
var qp = { cfg: {}, bs: {}, dom: {}, eu: {}, json: {} };

/** 配置参数
 * --------------------------------------------------
 * @param debug 调试模式
 * @param jsonUrl JSON类中GET默认地址
 */
qp.cfg = {
	debug: true,
	jsonUrl: ''
};

/**
 * 获取请求参数的值
 * @param {string} name 参数名
 * @returns {string}
 */
qp.get = function (name) {
	var _query = window.location.hash ? window.location.hash : window.location.search;
	var _re = new RegExp('[#|\?|&]' + name + '=(.+?)(&|$)');
	var _m = _query.match(_re);
	return _m ? decodeURI(_m[1]) : null;
}

/** Boostrap框架扩展
 * --------------------------------------------------
 * @function showModal 显示模态窗口
 */
qp.bs = {
	/**
	 * 显示模态窗口
	 * @param {string} title 窗口标题
	 * @param {string} body 窗体内容（HTML）
	 * @returns {object}
	 */
	showModal: function (title, body) {
		var _modal = {
			dialog: $('<div class="modal fade" role="dialog"></div>'),
			document: $('<div class="modal-dialog modal-lg" role="document"></div>'),
			content: $('<div class="modal-content"></div>'),
			header: $('<div class="modal-header"></div>'),
			close: $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'),
			title: $('<h4 class="modal-title"></h4>'),
			body: $('<div class="modal-body"></div>'),
			footer: $('<div class="modal-footer"></div>'),
			ok: $('<button type="button" class="btn btn-primary btn-block btn-lg" data-dismiss="modal">确定</button>')
		};
		_modal.document.appendTo(_modal.dialog);
		_modal.content.appendTo(_modal.document);
		_modal.header.appendTo(_modal.content);
		_modal.close.appendTo(_modal.header);
		_modal.title.html(title).appendTo(_modal.header);
		_modal.body.css({ wordWrap: 'break-word' }).html(body).appendTo(_modal.content);
		_modal.footer.appendTo(_modal.content);
		_modal.ok.appendTo(_modal.footer);
		_modal.dialog.on('hidden.bs.modal', function (e) {
			$(this).remove();
		}).modal({
			backdrop: 'static'
		});
		return _modal;
	},
	/**
	 * 格式化显示JSON数据
	 * @param {object} dom DOM元素
	 * @param {object} data JSON数据
	 * @returns {object}
	 */
	showJson: function (dom, data) {
		var _dom = qp.dom.showJson(dom, data);
		if (data.errcode > 0) _dom.addClass('panel panel-danger');
		return _dom;
	}
};

/** 文档对象模型类
 * --------------------------------------------------
 * @function showJson 格式化显示JSON数据
 */
qp.dom = {
	/**
	 * 字体大小自适应
	 * @param {object} dom DOM元素
	 * @param {number} min 字体大小最小值（像素）
	 * @param {number} max 字体大小最大值（像素）
	 * @param {number} min 字体大小中间值（像素）
	 */
	fontAutoSize: function (dom, min, max, mid) {
		$(window).on('resize', function () {
			var _size = window.innerWidth / mid;
			_size = _size < min ? min : _size;
			_size = _size > max ? max : _size;
			dom.css('font-size', _size + 'px');
		}).trigger('resize');
	},
	/**
	 * 格式化显示JSON数据
	 * @param {object} dom DOM元素
	 * @param {object} data JSON数据
	 * @returns {object}
	 */
	showJson: function (dom, data) {
		return $('<pre></pre>')
			.appendTo(dom.empty())
			.html(qp.json.format(data));
	}
};

/** EasyUI框架扩展
 * --------------------------------------------------
 */
qp.eu = {};

/** JSON格式数据类
 * --------------------------------------------------
 * @function get 获取JSON数据
 */
qp.json = {
	/**
	 * 获取JSON数据
	 * @param {object} param
	 * @param {function} callback
	 */
	get: function (param, callback) {
		$.ajax({
			async: true,
			data: param,
			dataType: 'jsonp',
			jsonp: 'cb',
			type: 'get',
			url: qp.cfg.jsonUrl,
			error: function (req, txt) {
				callback({ errcode: req.status, errmsg: req.statusText, statustxt: txt });
			},
			success: function (data) {
				callback(data);
			}
		});
	},
	/** 格式化JSON数据
	 * @param {object} data
	 */
	format: function (data) {
		return typeof (data) === 'object' ? JSON.stringify(data, null, 2) : data;
	}
};