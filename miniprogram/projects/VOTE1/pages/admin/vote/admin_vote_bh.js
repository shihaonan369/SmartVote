const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../public/project_setting.js');
const setting = require('../../../../../setting/setting.js');
const dataHelper = require('../../../../../helper/data_helper.js');

module.exports = Behavior({
	data: {
		themeModalShow: false,
		theme: projectSetting.VOTE_THEME
	},

	methods: {
		url: function (e) {
			pageHelper.url(e, this);
		},
		switchModel: function (e) {
			pageHelper.switchModel(this, e);
		},
		model: function (e) {
			pageHelper.model(this, e);
		},
		bindThemeTap: function (e) {
			let formTheme = pageHelper.dataset(e, 'idx');
			this.setData({
				formTheme,
				themeModalShow: false
			});
		},
		bindSelectThemeTap: function (e) {
			this.setData({
				themeModalShow: true
			});
		},
		bindCloseThemeCmpt: function (e) {
			this.setData({
				themeModalShow: false
			});
		},
		bindPicTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			wx.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				success: async res => {
					let pic = res.tempFiles[0].tempFilePath;
					let formItem = this.data.formItem;

					if (!setting.IS_DEMO) {
						wx.showLoading({ title: '上传中' });
						formItem[idx].pic = await cloudHelper.transTempPicOne(pic, 'vote/', '', false);
						wx.hideLoading();
					}
					else
						formItem[idx].pic = pic;

					this.setData({
						formItem
					});
				}
			})
		},

		bindItemBlur: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value.trim();
			let formItem = this.data.formItem;
			formItem[idx].label = val;

			/*
			this.setData({
				formItem
			});*/
		},

		bindDelItemTap: function (e) {
			let formItem = this.data.formItem;
			if (formItem.length <= 2) return pageHelper.showModal('至少2个选项');


			let callback = () => {
				let idx = pageHelper.dataset(e, 'idx');
				formItem.splice(idx, 1);
				this.setData({
					formItem
				});
			}

			pageHelper.showConfirm('确定删除该项吗？', callback);
		},

		bindAddItemTap: function (e) {
			let formItem = this.data.formItem;
			if (formItem.length >= 100) return pageHelper.showModal('最多可以添加100个选项');

			formItem.push({ pic: '', label: '', cnt: 0, content: [] });
			this.setData({
				formItem
			});
		},

		bindAddItemTap: async function (event) {
			let liveForm = event.detail.data.forms.find(item => item.mark == "live");
			if (liveForm && liveForm.val) {
				let room = dataHelper.genRandomString(64);

				let liveUrlForm = event.detail.data.forms.find(item => item.mark == "live_url");
				let liveUrlField = event.detail.data.fields.find(item => item.mark == "live_url");
				if (liveUrlForm && liveUrlField) {
					liveUrlField.val = liveUrlForm.val = `http://${setting.LIVE_SERVER_ADDR}:7001/live/${room}.flv`;
				}

				let livePushUrlForm = event.detail.data.forms.find(item => item.mark == "live_push_url");
				let livePushUrlField = event.detail.data.fields.find(item => item.mark == "live_push_url");
				if (livePushUrlForm && livePushUrlField) {
					livePushUrlField.val = livePushUrlForm.val = `rtmp://${setting.LIVE_SERVER_ADDR}:1935/live/`;
				}

				wx.request({
					url: `http://${setting.LIVE_SERVER_ADDR}:8090/control/get?room=${room}`,
					success: (result) => {
						if (result.statusCode != 200) {
							return;
						}

						let data = result.data;
						if (data.status != 200) {
							return;
						}

						let livePushCodeForm = event.detail.data.forms.find(item => item.mark == "live_push_code");
						let livePushCodeField = event.detail.data.fields.find(item => item.mark == "live_push_code");
						if (livePushCodeForm && livePushCodeField) {
							livePushCodeField.val = livePushCodeForm.val = data.data;
						}

						event.detail.setData({
							forms: event.detail.data.forms,
							fields: event.detail.data.fields
						});
					}
				});
				
			}
		},

	}
})