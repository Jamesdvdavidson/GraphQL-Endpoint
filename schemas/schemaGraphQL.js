const {gql} = require('apollo-server-express')


const typeDefs = gql`

    type page {
        totalPages: Int
        totalElements: Int
        number: Int
        size: Int
        first: Boolean
        last: Boolean
    }
    
    type services_page {
        page: page
        services: [service] 
    }
    
    type service {
        id: String!
        name: String!
        description: String
        url: String
        email: String
        status: String
        fees: String
        accreditations: String
        deliverable_type: String
        attending_type: String
        attending_access: String
        assured_date: String
        service_areas: [service_areas]
        fundings: [fundings]
        regular_schedules: [regular_schedules]
        eligibilitys: [eligibilitys]
        service_at_locations: [service_at_locations]
        cost_options: [cost_options]
        reviews: [reviews]
        organization: organization
        contacts: [contacts]
        holiday_schedules: [holiday_schedules]
        service_taxonomys: [service_taxonomy]
        languages: [languages]
    }

    type service_areas {
        uri: String
        service_area: String!
    }

    type fundings {
        id: String!
        source: String

    }

    type regular_schedules {
        id: String!
        dtstart: String
        freq: String
        interval: String
        byday: String
        bymonthday: String
        description: String
        opens_at: String
        closes_at: String
        valid_from: String
        valid_to: String
    }

	type service_taxonomy {
		id: String!
		taxonomy: taxonomy
	}
	
    type service_at_locations {
        id: String!
        regular_schedule: [regular_schedules]
        location: location
    }

    type location {
        id: String!
        name: String
        description: String
        latitude: Float
        longitude: Float
        physical_addresses: [physical_addresses]
    }

    type physical_addresses {
        id: String!
        city: String
        country: String
        address_1: String
        state_province: String
        postal_code: String
    }

    type eligibilitys {
        id: String!
        eligibility: String
        minimum_age: Int
        maximum_age: Int
        taxonomys: [taxonomy]
    }

    type organization {
        id: String!
        name: String!
        description: String!
        email: String
        url: String
        logo: String
        uri: String
    }

    type taxonomy {
        id: String!
        name: String
        vocabulary: String
        parent: taxonomy
    }


    type cost_options {
        id: String!
        option: String
        amount: String
        amount_description: String
        valid_from: String
        valid_to: String
    }

    type reviews {
        id: String!
        title: String
        description: String
        date: String
        score: String
        url: String
        widget: String
        organization: organization!
    }

    type contacts {
        id: String!
        name: String
        title: String
        phones: [phones]
    }

    type phones {
        id: String!
        number: String
    }

    type holiday_schedules {
        id: String!
        closed: String
        opens_at: String
        closes_at: String
        start_date: String
        end_date: String
    }

    type languages {
        id: String!
        language: String
    }
	
	type vocabulary {
		name: String!
	}

    type Query {
        services(page: Int, per_page: Int, where: Object): services_page
        service(id: String!): service
        vocabularies: [vocabulary]
        taxonomies(vocabulary: String!, parent_id: String, page: Int, per_page: Int): [taxonomy]
		taxonomy(id: String!): taxonomy
    }

    scalar Object

`
module.exports = typeDefs
