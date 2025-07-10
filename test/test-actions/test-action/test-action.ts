module.exports = {
	default: class TestAction {
		async routes() {
			return {
				method: 'GET',
				url: '/test',
				handler: async (request, reply) => {
					return {message: 'test'};
				}
			};
		}

		async asController() {
			return true;
		}
	}
};
