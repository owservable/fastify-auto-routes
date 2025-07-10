'use strict';

const cleanRelativePath = (rootFolder: string, absoluteFilePath: string, ext: '.ts' | '.js'): string => {
	let relativeFilePath = absoluteFilePath.toLowerCase() + '/';
	relativeFilePath = relativeFilePath.replace(rootFolder.toLowerCase(), '');
	relativeFilePath = relativeFilePath.replace(ext.toLowerCase(), '');
	relativeFilePath = relativeFilePath.replace('root', '');
	relativeFilePath = relativeFilePath.split('\\').join('/');
	relativeFilePath = relativeFilePath.split('//').join('/');
	return relativeFilePath;
};
export default cleanRelativePath;
