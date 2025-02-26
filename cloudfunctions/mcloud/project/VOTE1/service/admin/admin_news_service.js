/**
 * Notes: 资讯后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const AdminHomeService = require('../admin/admin_home_service.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const util = require('../../../../framework/utils/util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');

const NewsModel = require('../../model/news_model.js');

class AdminNewsService extends BaseProjectAdminService {

	/** 推荐首页SETUP */
	async vouchNewsSetup(id, vouch) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**添加资讯 */
	async insertNews({
		title,
		cateId, //分类
		cateName,
		order,
		desc = '',
	}) {


		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除资讯数据 */
	async delNews(id) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**获取资讯信息 */
	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}

	/**
	 * 更新富文本详细的内容及图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent({
		id,
		content // 富文本数组
	}) {
		// 获取数据库里的图片数据
		let news = await NewsModel.getOne(id, 'NEWS_CONTENT');

		// 处理 新旧文件
		content = await cloudUtil.handlerCloudFilesByRichEditor(news.NEWS_CONTENT, content);

		//更新数据库
		let data = {
			NEWS_CONTENT: content
		};
		await NewsModel.edit(id, data);
	}

	/**
	 * 更新资讯图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic({
		id,
		imgList // 图片数组
	}) {
		// 获取数据库里的图片数据
		let news = await NewsModel.getOne(id, 'NEWS_PIC');

		// 处理 新旧文件
		let picList = await cloudUtil.handlerCloudFiles(news.NEWS_PIC, imgList);

		//更新数据库
		let data = {
			NEWS_PIC: picList
		};
		await NewsModel.edit(id, data);
	}


	/**更新资讯数据 */
	async editNews({
		id,
		title,
		cateId, //分类
		cateName,
		order,
		desc = '',
	}) {
		let data = {};
		data.NEWS_TITLE = title;
		data.NEWS_CATE_ID = cateId;
		data.NEWS_CATE_NAME = cateName;
		data.NEWS_ORDER = order;
		data.NEWS_DESC = dataUtil.fmtText(desc, 100);

		await NewsModel.edit(id, data);
	}

	/**取得资讯分页列表 */
	async getAdminNewsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_TITLE,NEWS_DESC,NEWS_CATE_ID,NEWS_CATE_NAME,NEWS_EDIT_TIME,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE2_NAME,NEWS_VOUCH,NEWS_QR';

		let where = {};

		if (util.isDefined(search) && search) {
			where.NEWS_TITLE = ['like', search];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId':
					where.NEWS_CATE_ID = sortVal;
					break;
				case 'status':
					where.NEWS_STATUS = Number(sortVal);
					break;
				case 'vouch':
					where.NEWS_VOUCH = Number(sortVal);
					break;
				case 'sort':
					if (sortVal == 'new') {
						orderBy = {
							'NEWS_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**修改资讯状态 */
	async statusNews(id, status) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**置顶与排序设定 */
	async sortNews(id, sort) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**首页设定 */
	async vouchNews(id, vouch) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}
}

module.exports = AdminNewsService;