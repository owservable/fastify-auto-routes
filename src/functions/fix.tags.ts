'use strict';

const fixTags: Function = (route: any, relativeFilePath: string): string[] => {
	const schema: any = route.schema ?? {};
	const tags: string[] = schema.tags ?? [];
	if (tags.length > 0) return tags.map((tag: string): string => tag.toUpperCase());

	const words: RegExpMatchArray | [] = relativeFilePath.match(/\w+/g) || [];
	const firstPath: string = words[0] || '';
	return [firstPath.toUpperCase()];
};
export default fixTags;
