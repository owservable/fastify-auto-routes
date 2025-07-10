module.exports = {
	default: class NoControllerAction {
		async routes() {
			return {
				method: 'GET',
				url: '/no-controller',
				handler: async (request, reply) => {
					return {message: 'no-controller'};
				}
			};
		}
		// Missing asController method
	}
};
