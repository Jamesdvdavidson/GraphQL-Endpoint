const {complexSearch} = require('../helpers/servicesWhere')

const resolvers = {
	Query: {
		service: async(_source, {id}, {dataSources}) => {
			return await dataSources.ServicesAPI.getService(id)
		},

		services: async(_source, {page, per_page, where}, {dataSources}, info) => {
			const search = ["service_areas", "fundings", "regular_schedules", "eligibilitys", "service_at_locations",
				"cost_options", "reviews", "contacts", "holiday_schedules", "service_taxonomys", "languages"]
			let include = []
			for (let val in search) {
				if (info.fieldNodes[0].loc.source.body.includes(search[val])) {
					include.push(search[val])
				}
			}

			return await complexSearch(dataSources, page, per_page, where, include)
		},

		vocabularies: async(_source, {_args}, {dataSources}) => {
			let data = await dataSources.ServicesAPI.getVocabularies()
			let result = []
			for (let val of data) {
				result.push({"name": val})
			}

			return result
		},

		taxonomies: async(_source, {vocabulary, parent_id, page, per_page}, {dataSources}) => {
			let data = (await dataSources.ServicesAPI.getTaxonomies(vocabulary, parent_id, page, per_page)).content
			let result = []

			data.map((item) => {
				result.push(item)
			})

			return result
		},
		taxonomy: async(_source, {id}, {dataSources}) => {
			return await dataSources.ServicesAPI.getTaxonomy(id)
		}
	}
}

module.exports = resolvers
