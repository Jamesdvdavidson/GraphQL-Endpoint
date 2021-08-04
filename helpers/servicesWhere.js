const {unionBy, has, find} = require('lodash')


exports.complexSearch = async(dataSources, page, per_page, where, include) => {
	let search = new ComplexSearch(dataSources, page, per_page, where, include)
	await search.init()
	return search.getData()

}

class ComplexSearch {
	constructor(dataSources, page, per_page, where, include) {
		this._dataSources = dataSources;
		this._where = where
		this._include = include !== [] ? include : null
		this._page = page
		this._per_page = per_page

		this._data = []
	}

	async init(where = this._where) {
		if (this.needComplex(where)) {
			if (has(where, "and")) {
				let andWhere = {
					"vocabulary": [],
					"taxonomy_id": [],
					"postcode": [],
					"proximity": []
				}
				for (let item of where.and) {
					if (has(item, "vocabulary") && has(item, "taxonomy_id")) {
						if (item.vocabulary && item.taxonomy_id) {
							andWhere.vocabulary.push(item.vocabulary)
							andWhere.taxonomy_id.push(item.taxonomy_id)
						}
					}
					if (has(item, "postcode")) {
						andWhere.postcode.push(item.postcode)
					}
					if (has(item, "proximity")) {
						andWhere.proximity.push(item.proximity)
					}
				}
				let orWhere = null
				let or = find(where.and, "or") ? find(where.and, "or").or : false
				if (or) {
					orWhere = {
						"vocabulary": [],
						"taxonomy_id": []
					}
					for (let item of or) {
						if (has(item, "vocabulary") && has(item, "taxonomy_id")) {
							if (item.vocabulary && item.taxonomy_id) {
								orWhere.vocabulary.push(item.vocabulary)
								orWhere.taxonomy_id.push(item.taxonomy_id)
							}
						}
					}
				}

				if (orWhere) {
					let data = []
					for (let i = 0; i < orWhere.taxonomy_id.length; i++) {
						let where = {
							per_page: 3000,
							page: 1,
							taxonomy_id: [...andWhere.taxonomy_id, orWhere.taxonomy_id[i]],
							vocabulary: [...andWhere.vocabulary, orWhere.vocabulary[i]],
							include: this._include
						}
						if (andWhere.proximity.length !== 0) {
							where["proximity"] = andWhere.proximity
						}
						if (!!andWhere.postcode.length) {
							where["postcode"] = andWhere.postcode
						}
						let thisData = await this._dataSources.ServicesAPI.getServices(where)
						console.log(thisData.hasOwnProperty("content") ? thisData.content.length : 0)
						data = unionBy(thisData.hasOwnProperty("content") ? thisData.content : [], data, "id")
					}
					if (this._data === []) {
						this._data = data
					} else {
						this._data = unionBy(data, this._data, "id")
					}
				} else if ((andWhere.taxonomy_id.length && andWhere.vocabulary.length) || (andWhere.postcode && andWhere.proximity)) {
					andWhere["per_page"] = 3000
					andWhere["page"] = 1
					await this.runData(andWhere)
				}
			}
			if (has(where, "or")) {
				if (has(where.or[0], "vocabulary")) {
					for (let item of where.or) {
						if (has(item, "vocabulary") && has(item, "taxonomy_id")) {
							if (item.vocabulary && item.taxonomy_id) {
								let data = await this._dataSources.ServicesAPI.getServices(
									{
										taxonomy_id: item.taxonomy_id,
										vocabulary: item.vocabulary,
										page: 1,
										per_page: 3000,
										include: this._include
									})
								if (data.hasOwnProperty("content")) {
									console.log(data.content.length, item.taxonomy_id)
									this._data = unionBy(data.content, this._data, "id")
								}
							}
						}
					}
				}
			}
		} else {
			await this.runData(this._where)
		}
	}

	needComplex = (where = this._where) => (
		has(where, "or") || has(where, "and")
	)


	async runData(where) {
		let data = await this._dataSources.ServicesAPI.getServices(
			{
				...where,
				page: where.page ? where.page : this._page,
				per_page: where.per_page ? where.per_page : this._per_page,
				include: this._include
			})
		if (data.hasOwnProperty("content")) {
			this.combineData(data.content)
		}
	}

	combineData(newData) {
		this._data = unionBy(newData, this._data, "id")
	}

	getData = () => {
		return {
			"page": {
				"totalElements": this._data.length,
				"totalPages": Math.ceil(this._data.length / this._per_page),
				"number": this._page,
				"size": this._per_page,
				"first": this._page === 1,
				"last": Math.ceil(this._data.length / this._per_page) === this._page,
			},
			"services": this._data.slice((this._page * this._per_page) - this._per_page, (this._page * this._per_page))
		}
	}

}
