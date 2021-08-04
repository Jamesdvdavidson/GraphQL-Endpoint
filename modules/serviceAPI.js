const {RESTDataSource} = require('apollo-datasource-rest')

class ServiceAPI extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = 'https://api.porism.com/ServiceDirectoryService/'
	}

	async getService(id) {
		return this.get(`services/${id}`)
	}

	async getServices(_args) {
		let url = new URL(`${this.baseURL}services/`)
		let params = url.searchParams
		if (_args) {
			for (let key in _args) {
				if (_args.hasOwnProperty(key)) {
					params.set(key, _args[key])
				}
			}
		}
		url.search = params.toString()
		console.log(url.toString())
		return await this.get(url.toString())
	}

	async getVocabularies() {
		return this.get("vocabularies/")
	}

	async getTaxonomies(vocabulary_id, parent_id, page=1, per_page=50){
		let url = new URL(`${this.baseURL}taxonomies/`)
		let params = url.searchParams

		params.set("vocabulary", vocabulary_id)
		params.set("parent_id", parent_id)
		params.set("page", page)
		params.set("per_page", per_page)

		url.search = params.toString()

		console.log(url.toString())
		return this.get(url.toString())
	}

	async getTaxonomy(id) {
		return this.get(`taxonomies/${id}`)
	}

}

module.exports = ServiceAPI
