'use strict';

const fixTags: Function = (route: any, relativeFilePath: string): string[] => {
	const schema: any = route.schema || {};
	const tags: string[] = schema.tags || [];
	if (tags.length > 0) return tags.map((tag) => tag.toUpperCase());

	const words = relativeFilePath.match(/\w+/g) || [];
	const firstPath: string = words[0] || '';
	const method: string = route.method || '';
	return [firstPath.toUpperCase(), method.toUpperCase()];
};
export default fixTags;
